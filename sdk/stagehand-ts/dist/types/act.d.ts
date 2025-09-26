import { LLMClient } from "../lib/llm/LLMClient";
import { Locator } from "playwright";
import { Logger } from "@/types/log";
import { StagehandPage } from "@/lib/StagehandPage";
export interface ActCommandParams {
    action: string;
    steps?: string;
    domElements: string;
    llmClient: LLMClient;
    retries?: number;
    logger: (message: {
        category?: string;
        message: string;
    }) => void;
    requestId: string;
    variables?: Record<string, string>;
    userProvidedInstructions?: string;
}
export interface ActCommandResult {
    method: string;
    element: number;
    args: unknown[];
    completed: boolean;
    step: string;
    why?: string;
}
export declare enum SupportedPlaywrightAction {
    CLICK = "click",
    FILL = "fill",
    TYPE = "type",
    PRESS = "press",
    SCROLL = "scrollTo",
    NEXT_CHUNK = "nextChunk",
    PREV_CHUNK = "prevChunk",
    SELECT_OPTION_FROM_DROPDOWN = "selectOptionFromDropdown"
}
/**
 * A context object to hold all parameters that might be needed by
 * any of the methods in the `methodHandlerMap`
 */
export interface MethodHandlerContext {
    method: string;
    locator: Locator;
    xpath: string;
    args: unknown[];
    logger: Logger;
    stagehandPage: StagehandPage;
    initialUrl: string;
    domSettleTimeoutMs?: number;
}
