import { AgentAction, AgentResult, AgentType, AgentExecutionOptions } from "@/types/agent";
/**
 * Abstract base class for agent clients
 * This provides a common interface for all agent implementations
 */
export declare abstract class AgentClient {
    type: AgentType;
    modelName: string;
    clientOptions: Record<string, unknown>;
    userProvidedInstructions?: string;
    constructor(type: AgentType, modelName: string, userProvidedInstructions?: string);
    abstract execute(options: AgentExecutionOptions): Promise<AgentResult>;
    abstract captureScreenshot(options?: Record<string, unknown>): Promise<unknown>;
    abstract setViewport(width: number, height: number, deviceScaleFactor?: number): void;
    abstract setCurrentUrl(url: string): void;
    abstract setScreenshotProvider(provider: () => Promise<string>): void;
    abstract setActionHandler(handler: (action: AgentAction) => Promise<void>): void;
}
