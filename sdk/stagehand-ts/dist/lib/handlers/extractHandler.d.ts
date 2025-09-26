import { z } from "zod/v3";
import { ZodPathSegments } from "../../types/stagehand";
import { LLMClient } from "../llm/LLMClient";
import { StagehandPage } from "../StagehandPage";
import { Stagehand } from "../index";
export declare class StagehandExtractHandler {
    private readonly stagehand;
    private readonly stagehandPage;
    private readonly logger;
    private readonly userProvidedInstructions?;
    private readonly experimental;
    constructor({ stagehand, logger, stagehandPage, userProvidedInstructions, experimental, }: {
        stagehand: Stagehand;
        logger: (message: {
            category?: string;
            message: string;
            level?: number;
            auxiliary?: {
                [key: string]: {
                    value: string;
                    type: string;
                };
            };
        }) => void;
        stagehandPage: StagehandPage;
        userProvidedInstructions?: string;
        experimental: boolean;
    });
    extract<T extends z.AnyZodObject>({ instruction, schema, content, llmClient, requestId, domSettleTimeoutMs, useTextExtract, selector, iframes, }?: {
        instruction?: string;
        schema?: T;
        content?: z.infer<T>;
        chunksSeen?: Array<number>;
        llmClient?: LLMClient;
        requestId?: string;
        domSettleTimeoutMs?: number;
        useTextExtract?: boolean;
        selector?: string;
        iframes?: boolean;
    }): Promise<z.infer<T>>;
    private extractPageText;
    private domExtract;
}
/**
 * Scans the provided Zod schema for any `z.string().url()` fields and
 * replaces them with `z.number()`.
 *
 * @param schema - The Zod object schema to transform.
 * @returns A tuple containing:
 *   1. The transformed schema (or the original schema if no changes were needed).
 *   2. An array of {@link ZodPathSegments} objects representing all the replaced URL fields,
 *      with each path segment showing where in the schema the replacement occurred.
 */
export declare function transformUrlStringsToNumericIds<T extends z.ZodObject<z.ZodRawShape>>(schema: T): [T, ZodPathSegments[]];
