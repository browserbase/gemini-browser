import { LogLine } from "@/types/log";
import { AgentExecuteOptions, AgentResult } from "@/types/agent";
import { AgentClient } from "./AgentClient";
/**
 * Main interface for agent operations in Stagehand
 * This class provides methods for executing tasks with an agent
 */
export declare class StagehandAgent {
    private client;
    private logger;
    constructor(client: AgentClient, logger: (message: LogLine) => void);
    execute(optionsOrInstruction: AgentExecuteOptions | string): Promise<AgentResult>;
    getModelName(): string;
    getAgentType(): string;
}
