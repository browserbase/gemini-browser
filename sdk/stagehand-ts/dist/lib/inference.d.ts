import { z } from "zod/v3";
import { LogLine } from "../types/log";
import { LLMClient } from "./llm/LLMClient";
/** Simple usage shape if your LLM returns usage tokens. */
interface LLMUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}
/**
 * For calls that use a schema: the LLMClient may return { data: T; usage?: LLMUsage }
 */
export interface LLMParsedResponse<T> {
    data: T;
    usage?: LLMUsage;
}
export declare function extract({ instruction, domElements, schema, llmClient, chunksSeen, chunksTotal, requestId, logger, userProvidedInstructions, logInferenceToFile, }: {
    instruction: string;
    domElements: string;
    schema: z.ZodObject<z.ZodRawShape>;
    llmClient: LLMClient;
    chunksSeen: number;
    chunksTotal: number;
    requestId: string;
    userProvidedInstructions?: string;
    logger: (message: LogLine) => void;
    logInferenceToFile?: boolean;
}): Promise<{
    metadata: {
        completed: boolean;
        progress: string;
    };
    prompt_tokens: number;
    completion_tokens: number;
    inference_time_ms: number;
}>;
export declare function observe({ instruction, domElements, llmClient, requestId, userProvidedInstructions, logger, returnAction, logInferenceToFile, fromAct, }: {
    instruction: string;
    domElements: string;
    llmClient: LLMClient;
    requestId: string;
    userProvidedInstructions?: string;
    logger: (message: LogLine) => void;
    returnAction?: boolean;
    logInferenceToFile?: boolean;
    fromAct?: boolean;
}): Promise<{
    elements: ({
        elementId: string;
        description: string;
    } | {
        method: string;
        arguments: string[];
        elementId: string;
        description: string;
    })[];
    prompt_tokens: number;
    completion_tokens: number;
    inference_time_ms: number;
}>;
export {};
