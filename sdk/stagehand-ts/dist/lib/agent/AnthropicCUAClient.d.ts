import { LogLine } from "@/types/log";
import { AgentAction, AgentResult, AgentType, AgentExecutionOptions, ToolUseItem, AnthropicMessage, AnthropicContentBlock, AnthropicToolResult } from "@/types/agent";
import { AgentClient } from "./AgentClient";
export type ResponseInputItem = AnthropicMessage | AnthropicToolResult;
/**
 * Client for Anthropic's Computer Use API
 * This implementation uses the official Anthropic Messages API for Computer Use
 */
export declare class AnthropicCUAClient extends AgentClient {
    private apiKey;
    private baseURL?;
    private client;
    lastMessageId?: string;
    private currentViewport;
    private currentUrl?;
    private screenshotProvider?;
    private actionHandler?;
    private thinkingBudget;
    private experimental;
    constructor(type: AgentType, modelName: string, userProvidedInstructions?: string, clientOptions?: Record<string, unknown>, experimental?: boolean);
    setViewport(width: number, height: number): void;
    setCurrentUrl(url: string): void;
    setScreenshotProvider(provider: () => Promise<string>): void;
    setActionHandler(handler: (action: AgentAction) => Promise<void>): void;
    /**
     * Execute a task with the Anthropic CUA
     * This is the main entry point for the agent
     * @implements AgentClient.execute
     */
    execute(executionOptions: AgentExecutionOptions): Promise<AgentResult>;
    executeStep(inputItems: ResponseInputItem[], logger: (message: LogLine) => void): Promise<{
        actions: AgentAction[];
        message: string;
        completed: boolean;
        nextInputItems: ResponseInputItem[];
        usage: {
            input_tokens: number;
            output_tokens: number;
            inference_time_ms: number;
        };
    }>;
    private createInitialInputItems;
    getAction(inputItems: ResponseInputItem[]): Promise<{
        content: AnthropicContentBlock[];
        id: string;
        usage: Record<string, number>;
    }>;
    takeAction(toolUseItems: ToolUseItem[], logger: (message: LogLine) => void): Promise<ResponseInputItem[]>;
    private convertToolUseToAction;
    captureScreenshot(options?: {
        base64Image?: string;
        currentUrl?: string;
    }): Promise<string>;
}
