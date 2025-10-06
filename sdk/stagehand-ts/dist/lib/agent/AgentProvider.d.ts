import { LogLine } from "@/types/log";
import { AgentClient } from "./AgentClient";
import { AgentType } from "@/types/agent";
export declare const modelToAgentProviderMap: Record<string, AgentType>;
/**
 * Provider for agent clients
 * This class is responsible for creating the appropriate agent client
 * based on the provider type
 */
export declare class AgentProvider {
    private logger;
    /**
     * Create a new agent provider
     */
    constructor(logger: (message: LogLine) => void);
    getClient(modelName: string, clientOptions?: Record<string, unknown>, userProvidedInstructions?: string, experimental?: boolean): AgentClient;
    static getAgentProvider(modelName: string): AgentType;
}
