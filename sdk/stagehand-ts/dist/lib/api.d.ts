import { z } from "zod/v3";
import { StagehandAPIConstructorParams, StartSessionParams, StartSessionResult } from "../types/api";
import { GotoOptions } from "../types/playwright";
import { ActOptions, ActResult, AgentConfig, ExtractOptions, ExtractResult, ObserveOptions, ObserveResult } from "../types/stagehand";
import { AgentExecuteOptions, AgentResult } from ".";
export declare class StagehandAPI {
    private apiKey;
    private projectId;
    private sessionId?;
    private modelApiKey;
    private logger;
    private fetchWithCookies;
    constructor({ apiKey, projectId, logger }: StagehandAPIConstructorParams);
    init({ modelName, modelApiKey, domSettleTimeoutMs, verbose, debugDom, systemPrompt, selfHeal, waitForCaptchaSolves, actionTimeoutMs, browserbaseSessionCreateParams, browserbaseSessionID, }: StartSessionParams): Promise<StartSessionResult>;
    act(options: ActOptions | ObserveResult): Promise<ActResult>;
    extract<T extends z.AnyZodObject>(options: ExtractOptions<T>): Promise<ExtractResult<T>>;
    observe(options?: ObserveOptions): Promise<ObserveResult[]>;
    goto(url: string, options?: GotoOptions): Promise<void>;
    agentExecute(agentConfig: AgentConfig, executeOptions: AgentExecuteOptions): Promise<AgentResult>;
    end(): Promise<Response>;
    private execute;
    private request;
}
