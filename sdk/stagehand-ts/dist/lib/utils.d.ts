import { z } from "zod/v3";
import { ObserveResult, Page } from ".";
import { LogLine } from "../types/log";
import { ZodPathSegments } from "../types/stagehand";
import { Schema } from "@google/genai";
import { ModelProvider } from "../types/model";
export declare function validateZodSchema(schema: z.ZodTypeAny, data: unknown): boolean;
export declare function drawObserveOverlay(page: Page, results: ObserveResult[]): Promise<void>;
export declare function clearOverlays(page: Page): Promise<void>;
/**
 * Detects if the code is running in the Bun runtime environment.
 * @returns {boolean} True if running in Bun, false otherwise.
 */
export declare function isRunningInBun(): boolean;
export declare function toGeminiSchema(zodSchema: z.ZodTypeAny): Schema;
export declare function getZodType(schema: z.ZodTypeAny): string;
/**
 * Recursively traverses a given Zod schema, scanning for any fields of type `z.string().url()`.
 * For each such field, it replaces the `z.string().url()` with `z.number()`.
 *
 * This function is used internally by higher-level utilities (e.g., transforming entire object schemas)
 * and handles nested objects, arrays, unions, intersections, optionals.
 *
 * @param schema - The Zod schema to transform.
 * @param currentPath - An array of string/number keys representing the current schema path (used internally for recursion).
 * @returns A two-element tuple:
 *   1. The updated Zod schema, with any `.url()` fields replaced by `z.number()`.
 *   2. An array of {@link ZodPathSegments} objects representing each replaced field, including the path segments.
 */
export declare function transformSchema(schema: z.ZodTypeAny, currentPath: Array<string | number>): [z.ZodTypeAny, ZodPathSegments[]];
/**
 * Once we get the final extracted object that has numeric IDs in place of URLs,
 * use `injectUrls` to walk the object and replace numeric IDs
 * with the real URL strings from idToUrlMapping. The `path` may include `*`
 * for array indices (indicating "all items in the array").
 */
export declare function injectUrls(obj: unknown, path: Array<string | number>, idToUrlMapping: Record<string, string>): void;
/**
 * Mapping from LLM provider names to their corresponding environment variable names for API keys.
 */
export declare const providerEnvVarMap: Partial<Record<ModelProvider | string, string>>;
/**
 * Loads an API key for a provider, checking environment variables.
 * @param provider The name of the provider (e.g., 'openai', 'anthropic')
 * @param logger Optional logger for info/error messages
 * @returns The API key if found, undefined otherwise
 */
export declare function loadApiKeyFromEnv(provider: string | undefined, logger: (logLine: LogLine) => void): string | undefined;
export declare function trimTrailingTextNode(path: string | undefined): string | undefined;
