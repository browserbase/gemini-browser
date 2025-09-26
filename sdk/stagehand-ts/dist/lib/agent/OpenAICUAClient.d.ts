import { LogLine } from "../../types/log";
import { AgentAction, AgentResult, AgentType, AgentExecutionOptions, ResponseInputItem, ResponseItem } from "@/types/agent";
import { AgentClient } from "./AgentClient";
/**
 * Client for OpenAI's Computer Use Assistant API
 * This implementation uses the official OpenAI Responses API for Computer Use
 */
export declare class OpenAICUAClient extends AgentClient {
    private apiKey;
    private organization?;
    private baseURL;
    private client;
    lastResponseId?: string;
    private currentViewport;
    private currentUrl?;
    private screenshotProvider?;
    private actionHandler?;
    private reasoningItems;
    private environment;
    constructor(type: AgentType, modelName: string, userProvidedInstructions?: string, clientOptions?: Record<string, unknown>);
    setViewport(width: number, height: number): void;
    setCurrentUrl(url: string): void;
    setScreenshotProvider(provider: () => Promise<string>): void;
    setActionHandler(handler: (action: AgentAction) => Promise<void>): void;
    /**
     * Execute a task with the OpenAI CUA
     * This is the main entry point for the agent
     * @implements AgentClient.execute
     */
    execute(executionOptions: AgentExecutionOptions): Promise<AgentResult>;
    /**
     * Execute a single step of the agent
     * This coordinates the flow: Request → Get Action → Execute Action
     */
    executeStep(inputItems: ResponseInputItem[], previousResponseId: string | undefined, logger: (message: LogLine) => void): Promise<{
        actions: AgentAction[];
        message: string;
        completed: boolean;
        nextInputItems: ResponseInputItem[];
        responseId: string;
        usage: {
            input_tokens: number;
            output_tokens: number;
            inference_time_ms: number;
        };
    }>;
    private isComputerCallItem;
    private isFunctionCallItem;
    private createInitialInputItems;
    getAction(inputItems: ResponseInputItem[], previousResponseId?: string): Promise<{
        output: ResponseItem[];
        responseId: string;
        usage: Record<string, number>;
    }>;
    takeAction(output: ResponseItem[], logger: (message: LogLine) => void): Promise<ResponseInputItem[]>;
    private convertComputerCallToAction;
    private convertFunctionCallToAction;
    captureScreenshot(options?: {
        base64Image?: string;
        currentUrl?: string;
    }): Promise<string>;
}
