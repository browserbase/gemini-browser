import { z } from "zod/v3";
export declare const operatorResponseSchema: z.ZodObject<{
    reasoning: z.ZodString;
    method: z.ZodEnum<["act", "extract", "goto", "close", "wait", "navback", "refresh"]>;
    parameters: z.ZodNullable<z.ZodString>;
    taskComplete: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    reasoning?: string;
    method?: "act" | "extract" | "close" | "goto" | "wait" | "navback" | "refresh";
    parameters?: string;
    taskComplete?: boolean;
}, {
    reasoning?: string;
    method?: "act" | "extract" | "close" | "goto" | "wait" | "navback" | "refresh";
    parameters?: string;
    taskComplete?: boolean;
}>;
export type OperatorResponse = z.infer<typeof operatorResponseSchema>;
export declare const operatorSummarySchema: z.ZodObject<{
    answer: z.ZodString;
}, "strip", z.ZodTypeAny, {
    answer?: string;
}, {
    answer?: string;
}>;
export type OperatorSummary = z.infer<typeof operatorSummarySchema>;
