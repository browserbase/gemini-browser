import { AgentExecuteOptions, AgentResult } from "@/types/agent";
import { LogLine } from "@/types/log";
import { LLMClient } from "../llm/LLMClient";
import { StagehandPage } from "../StagehandPage";
export declare class StagehandOperatorHandler {
    private stagehandPage;
    private logger;
    private llmClient;
    private messages;
    constructor(stagehandPage: StagehandPage, logger: (message: LogLine) => void, llmClient: LLMClient);
    execute(instructionOrOptions: string | AgentExecuteOptions): Promise<AgentResult>;
    private getNextStep;
    private getSummary;
    private executeAction;
}
