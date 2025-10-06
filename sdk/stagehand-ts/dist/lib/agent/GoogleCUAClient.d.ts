import { LogLine } from "../../types/log";
import { AgentAction, AgentResult, AgentType, AgentExecutionOptions } from "@/types/agent";
import { AgentClient } from "./AgentClient";
/**
 * Client for Google's Computer Use Assistant API
 * This implementation uses the Google Generative AI SDK for Computer Use
 */
export declare class GoogleCUAClient extends AgentClient {
    private apiKey;
    private client;
    private currentViewport;
    private currentUrl?;
    private screenshotProvider?;
    private actionHandler?;
    private history;
    private environment;
    private generateContentConfig;
    constructor(type: AgentType, modelName: string, userProvidedInstructions?: string, clientOptions?: Record<string, unknown>);
    setViewport(width: number, height: number): void;
    setCurrentUrl(url: string): void;
    setScreenshotProvider(provider: () => Promise<string>): void;
    setActionHandler(handler: (action: AgentAction) => Promise<void>): void;
    /**
     * Execute a task with the Google CUA
     * This is the main entry point for the agent
     * @implements AgentClient.execute
     */
    execute(executionOptions: AgentExecutionOptions): Promise<AgentResult>;
    /**
     * Initialize conversation history with the initial instruction
     */
    private initializeHistory;
    /**
     * Execute a single step of the agent
     */
    executeStep(logger: (message: LogLine) => void): Promise<{
        actions: AgentAction[];
        message: string;
        completed: boolean;
        usage: {
            input_tokens: number;
            output_tokens: number;
            inference_time_ms: number;
        };
    }>;
    /**
     * Process the response from Google's API
     */
    private processResponse;
    /**
     * Convert Google function call to Stagehand action
     */
    private convertFunctionCallToAction;
    /**
     * Normalize coordinates from Google's 0-1000 range to actual viewport dimensions
     */
    private normalizeCoordinates;
    captureScreenshot(options?: {
        base64Image?: string;
        currentUrl?: string;
    }): Promise<string>;
}
