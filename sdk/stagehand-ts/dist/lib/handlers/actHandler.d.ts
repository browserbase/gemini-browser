import { LogLine } from "../../types/log";
import { LLMClient } from "../llm/LLMClient";
import { StagehandPage } from "../StagehandPage";
import { ActResult, ObserveResult, ActOptions } from "@/types/stagehand";
import { StagehandObserveHandler } from "@/lib/handlers/observeHandler";
/**
 * NOTE: Vision support has been removed from this version of Stagehand.
 * If useVision or verifierUseVision is set to true, a warning is logged and
 * the flow continues as if vision = false.
 */
export declare class StagehandActHandler {
    private readonly stagehandPage;
    private readonly logger;
    private readonly selfHeal;
    private readonly experimental;
    constructor({ logger, stagehandPage, selfHeal, experimental, }: {
        logger: (logLine: LogLine) => void;
        stagehandPage: StagehandPage;
        selfHeal: boolean;
        experimental: boolean;
    });
    /**
     * Perform an immediate Playwright action based on an ObserveResult object
     * that was returned from `page.observe(...)`.
     */
    actFromObserveResult(observe: ObserveResult, domSettleTimeoutMs?: number): Promise<ActResult>;
    /**
     * Perform an act based on an instruction.
     * This method will observe the page and then perform the act on the first element returned.
     */
    observeAct(actionOrOptions: ActOptions, observeHandler: StagehandObserveHandler, llmClient: LLMClient, requestId: string): Promise<ActResult>;
    private _performPlaywrightMethod;
}
