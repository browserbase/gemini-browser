import {
  // GoogleGenAI,
  Content,
  Part,
  GenerateContentResponse,
  FunctionCall,
} from "@google/genai";
import { LogLine } from "../../types/log";
import {
  AgentAction,
  AgentResult,
  AgentType,
  AgentExecutionOptions,
} from "@/types/agent";
import { AgentClient } from "./AgentClient";
import { AgentScreenshotProviderError } from "@/types/stagehandErrors";
import { buildGoogleCUASystemPrompt } from "@/lib/prompt";
import { compressGoogleConversationImages } from "./utils/imageCompression";
import { mapKeyToPlaywright } from "./utils/cuaKeyMapping";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Client for Google's Computer Use Assistant API
 * This implementation uses the Google Generative AI SDK for Computer Use
 */
export class GoogleCUAClient extends AgentClient {
  private apiKey: string;
  private currentViewport = { width: 1288, height: 711 };
  private currentUrl?: string;
  private screenshotProvider?: () => Promise<string>;
  private actionHandler?: (action: AgentAction) => Promise<void>;
  private history: Content[] = [];
  private environment: "ENVIRONMENT_BROWSER" | "ENVIRONMENT_DESKTOP" =
    "ENVIRONMENT_BROWSER";

  constructor(
    type: AgentType,
    modelName: string,
    userProvidedInstructions?: string,
    clientOptions?: Record<string, unknown>,
  ) {
    super(type, modelName, userProvidedInstructions);

    // Process client options
    this.apiKey =
      (clientOptions?.apiKey as string) || process.env.GEMINI_API_KEY || "";

    // Get environment if specified
    if (
      clientOptions?.environment &&
      typeof clientOptions.environment === "string"
    ) {
      this.environment = clientOptions.environment as typeof this.environment;
    }

    // Store client options for reference
    this.clientOptions = {
      apiKey: this.apiKey,
    };
  }

  public setViewport(width: number, height: number): void {
    this.currentViewport = { width, height };
  }

  setCurrentUrl(url: string): void {
    this.currentUrl = url;
  }

  setScreenshotProvider(provider: () => Promise<string>): void {
    this.screenshotProvider = provider;
  }

  setActionHandler(handler: (action: AgentAction) => Promise<void>): void {
    this.actionHandler = handler;
  }

  /**
   * Execute a task with the Google CUA
   * This is the main entry point for the agent
   * @implements AgentClient.execute
   */
  async execute(executionOptions: AgentExecutionOptions): Promise<AgentResult> {
    const { options, logger } = executionOptions;
    const { instruction } = options;
    const maxSteps = options.maxSteps || 10;

    let currentStep = 0;
    let completed = false;
    const actions: AgentAction[] = [];
    const messageList: string[] = [];
    let finalMessage = "";
    this.history = []; // Clear history for new execution

    // Start with the initial instruction
    await this.initializeHistory(instruction);

    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalInferenceTime = 0;

    try {
      // Execute steps until completion or max steps reached
      while (!completed && currentStep < maxSteps) {
        logger({
          category: "agent",
          message: `Executing step ${currentStep + 1}/${maxSteps}`,
          level: 2,
        });

        const result = await this.executeStep(logger);
        totalInputTokens += result.usage.input_tokens;
        totalOutputTokens += result.usage.output_tokens;
        totalInferenceTime += result.usage.inference_time_ms;

        // Add actions to the list
        actions.push(...result.actions);

        // Update completion status
        completed = result.completed;

        // Record any message for this step
        if (result.message) {
          messageList.push(result.message);
          finalMessage = result.message;
        }

        // Increment step counter
        currentStep++;
      }

      // Return the final result
      return {
        success: completed,
        actions,
        message: finalMessage,
        completed,
        usage: {
          input_tokens: totalInputTokens,
          output_tokens: totalOutputTokens,
          inference_time_ms: totalInferenceTime,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger({
        category: "agent",
        message: `Error executing agent task: ${errorMessage}`,
        level: 0,
      });

      return {
        success: false,
        actions,
        message: `Failed to execute task: ${errorMessage}`,
        completed: false,
        usage: {
          input_tokens: totalInputTokens,
          output_tokens: totalOutputTokens,
          inference_time_ms: totalInferenceTime,
        },
      };
    }
  }

  /**
   * Initialize conversation history with the initial instruction
   */
  private async initializeHistory(instruction: string): Promise<void> {
    const parts: Part[] = [{ text: instruction }];

    // Note: The Python implementation doesn't include the initial screenshot
    // Following the same pattern here

    this.history = [
      {
        role: "user",
        parts,
      },
    ];
  }

  /**
   * Execute a single step of the agent
   */
  async executeStep(logger: (message: LogLine) => void): Promise<{
    actions: AgentAction[];
    message: string;
    completed: boolean;
    usage: {
      input_tokens: number;
      output_tokens: number;
      inference_time_ms: number;
    };
  }> {
    try {
      const startTime = Date.now();

      // Compress images in conversation history before sending to the model
      const compressedResult = compressGoogleConversationImages(
        this.history,
        2,
      );
      const compressedHistory = compressedResult.items;

      // Get response from the model
      // Note: The computer_use tool configuration is passed as a regular object
      // The Google API will recognize this format
      // Build the request body directly to match the API format
      const requestBody: any = {
        contents: compressedHistory,
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
        tools: [
          {
            computerUse: {
              environment: this.environment,
            },
          },
        ],
      };

      // Add system instruction if provided
      if (this.userProvidedInstructions) {
        requestBody.systemInstruction = {
          parts: [{ text: this.userProvidedInstructions }],
        };
      } else {
        requestBody.systemInstruction = {
          parts: [{ text: buildGoogleCUASystemPrompt() }],
        };
      }

      // Make direct API call with exponential backoff retry
      const apiUrl = `https://generativelanguage.googleapis.com/v1alpha/models/${this.modelName}:generateContent?key=${this.apiKey}`;

      // Add required headers similar to the Python SDK
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": "google-genai-sdk/1.27.0",
        "x-goog-api-client": "google-genai-sdk/1.27.0",
      };

      // Retry logic with exponential backoff
      const maxRetries = 3;
      let lastError: Error | null = null;
      let response: GenerateContentResponse | null = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // Add exponential backoff delay for retries
          if (attempt > 0) {
            const delay = Math.pow(2, attempt) * 1000; // 2^attempt seconds
            logger({
              category: "agent",
              message: `Retrying API call (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms delay`,
              level: 2,
            });
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          const fetchResponse = await fetch(apiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
          });

          if (!fetchResponse.ok) {
            const errorText = await fetchResponse.text();
            throw new Error(
              `API request failed: ${fetchResponse.status} ${fetchResponse.statusText}. ${errorText}`,
            );
          }

          const apiResponse =
            (await fetchResponse.json()) as GenerateContentResponse;

          // Check if we have valid response content
          if (
            !apiResponse.candidates ||
            !apiResponse.candidates[0] ||
            !apiResponse.candidates[0].content ||
            !apiResponse.candidates[0].content.parts ||
            apiResponse.candidates[0].content.parts.length === 0
          ) {
            throw new Error("Response missing expected content structure");
          }

          // Success - we have a valid response
          response = apiResponse;
          break;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          logger({
            category: "agent",
            message: `API call failed (attempt ${attempt + 1}/${maxRetries}): ${lastError.message}`,
            level: 2,
          });

          // If this was the last attempt, throw the error
          if (attempt === maxRetries - 1) {
            throw lastError;
          }
        }
      }

      if (!response) {
        throw (
          lastError || new Error("Failed to get response after all retries")
        );
      }

      const endTime = Date.now();
      const elapsedMs = endTime - startTime;

      // Process the response
      const result = await this.processResponse(response, logger);

      // Add model response to history
      if (response.candidates && response.candidates[0]) {
        this.history.push(response.candidates[0].content);
      }

      // Execute actions and collect function responses
      const functionResponses: Part[] = [];

      if (result.actions.length > 0) {
        let hasError = false;

        // Execute all actions
        for (let i = 0; i < result.actions.length; i++) {
          const action = result.actions[i];

          logger({
            category: "agent",
            message: `Executing action ${i + 1}/${result.actions.length}: ${action.type}`,
            level: 2,
          });

          // Special handling for open_web_browser - don't execute it
          if (
            action.type === "function" &&
            action.name === "open_web_browser"
          ) {
            logger({
              category: "agent",
              message: "Skipping open_web_browser action",
              level: 2,
            });
          } else if (this.actionHandler) {
            try {
              await this.actionHandler(action);

              // Add a delay between actions to ensure they complete properly
              // Longer delay for typing actions to ensure fields are ready
              if (i < result.actions.length - 1) {
                const nextAction = result.actions[i + 1];
                const isTypingAction =
                  action.type === "type" || nextAction.type === "type";
                const delay = isTypingAction ? 500 : 200;
                await new Promise((resolve) => setTimeout(resolve, delay));
              }
            } catch (actionError) {
              logger({
                category: "agent",
                message: `Error executing action ${action.type}: ${actionError}`,
                level: 0,
              });
              hasError = true;
              // Continue processing other actions even if one fails
            }
          }
        }

        // Create function responses - one for each function call
        // We need exactly one response per function call, regardless of how many actions were generated
        if (result.functionCalls.length > 0 || hasError) {
          try {
            logger({
              category: "agent",
              message: `Taking screenshot after executing ${result.actions.length} actions${hasError ? " (with errors)" : ""}`,
              level: 2,
            });

            const screenshot = await this.captureScreenshot();
            const base64Data = screenshot.replace(
              /^data:image\/png;base64,/,
              "",
            );

            // Create one function response for each function call
            for (const functionCall of result.functionCalls) {
              const functionResponsePart: any = {
                functionResponse: {
                  name: functionCall.name,
                  response: {
                    url: this.currentUrl || "",
                    // Acknowledge safety decision for evals
                    ...(functionCall.args?.safety_decision
                      ? {
                          safety_acknowledgement: "true",
                        }
                      : {}),
                  },
                  data: [
                    {
                      inlineData: {
                        mimeType: "image/png",
                        data: base64Data,
                      },
                    },
                  ],
                },
              };
              functionResponses.push(functionResponsePart);
            }
          } catch (error) {
            logger({
              category: "agent",
              message: `Error capturing screenshot: ${error}`,
              level: 0,
            });
          }
        }

        // Add all function responses to history in a single user message
        if (functionResponses.length > 0) {
          logger({
            category: "agent",
            message: `Adding ${functionResponses.length} function responses to history`,
            level: 2,
          });
          this.history.push({
            role: "user",
            parts: functionResponses,
          });
        }
      }

      return {
        actions: result.actions,
        message: result.message,
        completed: result.completed,
        usage: {
          input_tokens: 0, // Google API doesn't provide token counts in the same way
          output_tokens: 0,
          inference_time_ms: elapsedMs,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger({
        category: "agent",
        message: `Error executing step: ${errorMessage}`,
        level: 0,
      });

      throw error;
    }
  }

  /**
   * Process the response from Google's API
   */
  private async processResponse(
    response: GenerateContentResponse,
    logger: (message: LogLine) => void,
  ): Promise<{
    actions: AgentAction[];
    message: string;
    completed: boolean;
    functionCalls: FunctionCall[];
  }> {
    const actions: AgentAction[] = [];
    let message = "";
    const functionCalls: FunctionCall[] = [];

    if (!response.candidates || response.candidates.length === 0) {
      return {
        actions: [],
        message: "No candidates in response",
        completed: true,
        functionCalls: [],
      };
    }

    const candidate = response.candidates[0];

    // Log the raw response for debugging
    logger({
      category: "agent",
      message: `Raw response from Google: ${JSON.stringify(candidate.content, null, 2)}`,
      level: 2,
    });

    // Process all parts - Google can send multiple function calls
    for (const part of candidate.content.parts) {
      if (part.text) {
        message += part.text + "\n";
        logger({
          category: "agent",
          message: `Reasoning: ${part.text}`,
          level: 1,
        });
      }
      if (part.functionCall) {
        functionCalls.push(part.functionCall);
        logger({
          category: "agent",
          message: `Found function call: ${part.functionCall.name} with args: ${JSON.stringify(part.functionCall.args)}`,
          level: 2,
        });

        // Convert function call to action(s)
        const action = this.convertFunctionCallToAction(part.functionCall);
        if (action) {
          // Special handling for type_text_at - we need to click first
          if (
            part.functionCall.name === "type_text_at" &&
            action.type === "type"
          ) {
            logger({
              category: "agent",
              message: `Adding action: ${JSON.stringify(action)}`,
              level: 2,
            });
            // First add a click action at the same coordinates
            actions.push({
              type: "click",
              x: action.x,
              y: action.y,
              button: "left",
            });

            // If clear_before_typing is true (default), add a select all
            if (action.clearBeforeTyping) {
              // Select all text in the field
              actions.push({
                type: "keypress",
                keys: ["ControlOrMeta+A"],
              });
              actions.push({
                type: "keypress",
                keys: ["Backspace"],
              });
            }

            // Then add the type action
            actions.push(action);
            if (action.pressEnter) {
              actions.push({
                type: "keypress",
                keys: ["Enter"],
              });
            }
          } else {
            actions.push(action);
          }
        } else {
          logger({
            category: "agent",
            message: `Warning: Could not convert function call ${part.functionCall.name} to action`,
            level: 1,
          });
        }
      }
    }

    // Log summary of what we found
    logger({
      category: "agent",
      message: `Found ${functionCalls.length} function calls, converted to ${actions.length} actions`,
      level: 2,
    });

    // Check if task is completed
    const completed =
      functionCalls.length === 0 ||
      (candidate.finishReason && candidate.finishReason !== "STOP");

    return {
      actions,
      message: message.trim(),
      completed,
      functionCalls,
    };
  }

  /**
   * Convert Google function call to Stagehand action
   */
  private convertFunctionCallToAction(
    functionCall: FunctionCall,
  ): AgentAction | null {
    const { name, args } = functionCall;

    if (!name || !args) {
      return null;
    }

    switch (name) {
      case "open_web_browser":
        return {
          type: "function",
          name: "open_web_browser",
          arguments: null,
        };

      case "click_at": {
        const { x, y } = this.normalizeCoordinates(
          args.x as number,
          args.y as number,
        );
        return {
          type: "click",
          x,
          y,
          button: args.button || "left",
        };
      }

      case "type_text_at": {
        const { x, y } = this.normalizeCoordinates(
          args.x as number,
          args.y as number,
        );
        // Google's type_text_at includes press_enter and clear_before_typing parameters
        const pressEnter = (args.press_enter as boolean) ?? false;
        const clearBeforeTyping =
          (args.clear_before_typing as boolean) ?? false;

        // For type_text_at, we need to click first then type
        // This matches the behavior expected by Google's CUA
        // We'll handle this in the executeStep method by converting to two actions
        return {
          type: "type",
          text: args.text as string,
          x,
          y,
          pressEnter,
          clearBeforeTyping,
        };
      }

      case "key_combination": {
        const keys = (args.keys as string)
          .split("+")
          .map((key: string) => key.trim())
          .map((key: string) => mapKeyToPlaywright(key));
        return {
          type: "keypress",
          keys,
        };
      }

      case "scroll_document": {
        const direction = (args.direction as string).toLowerCase();
        return {
          type: "keypress",
          keys: [direction === "up" ? "PageUp" : "PageDown"],
        };
      }

      case "scroll_at": {
        const { x, y } = this.normalizeCoordinates(
          args.x as number,
          args.y as number,
        );
        const direction = ((args.direction as string) || "down").toLowerCase();
        const magnitude =
          typeof args.magnitude === "number" ? (args.magnitude as number) : 800;

        let scroll_x = 0;
        let scroll_y = 0;
        if (direction === "up") {
          scroll_y = -magnitude;
        } else if (direction === "down") {
          scroll_y = magnitude;
        } else if (direction === "left") {
          scroll_x = -magnitude;
        } else if (direction === "right") {
          scroll_x = magnitude;
        } else {
          // Default to down if unknown direction
          scroll_y = magnitude;
        }

        return {
          type: "scroll",
          x,
          y,
          scroll_x,
          scroll_y,
        };
      }

      case "navigate":
        return {
          type: "function",
          name: "goto",
          arguments: { url: args.url as string },
        };

      case "go_back":
        return {
          type: "function",
          name: "back",
          arguments: null,
        };

      case "go_forward":
        return {
          type: "function",
          name: "forward",
          arguments: null,
        };

      case "wait_5_seconds":
        return {
          type: "wait",
          milliseconds: 5000, // Google CUA waits for 5 seconds
        };

      case "hover_at": {
        const { x, y } = this.normalizeCoordinates(
          args.x as number,
          args.y as number,
        );
        return {
          type: "move",
          x,
          y,
        };
      }

      case "search":
        return {
          type: "function",
          name: "goto",
          arguments: { url: "https://www.google.com" },
        };

      case "drag_and_drop": {
        const startPoint = this.normalizeCoordinates(
          args.x as number,
          args.y as number,
        );
        const endPoint = this.normalizeCoordinates(
          args.destination_x as number,
          args.destination_y as number,
        );
        return {
          type: "drag",
          path: [
            { x: startPoint.x, y: startPoint.y },
            { x: endPoint.x, y: endPoint.y },
          ],
        };
      }

      default:
        console.warn(`Unsupported Google CUA function: ${name}`);
        return null;
    }
  }

  /**
   * Normalize coordinates from Google's 0-1000 range to actual viewport dimensions
   */
  private normalizeCoordinates(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.floor((x / 1000) * this.currentViewport.width),
      y: Math.floor((y / 1000) * this.currentViewport.height),
    };
  }

  async captureScreenshot(options?: {
    base64Image?: string;
    currentUrl?: string;
  }): Promise<string> {
    // Use provided options if available
    if (options?.base64Image) {
      return `data:image/png;base64,${options.base64Image}`;
    }

    // Use the screenshot provider if available
    if (this.screenshotProvider) {
      try {
        const base64Image = await this.screenshotProvider();
        return `data:image/png;base64,${base64Image}`;
      } catch (error) {
        console.error("Error capturing screenshot:", error);
        throw error;
      }
    }

    throw new AgentScreenshotProviderError(
      "`screenshotProvider` has not been set. " +
        "Please call `setScreenshotProvider()` with a valid function that returns a base64-encoded image",
    );
  }
}
