import { ChatMessage } from "./llm/LLMClient";
export declare function buildUserInstructionsString(userProvidedInstructions?: string): string;
export declare function buildExtractSystemPrompt(isUsingPrintExtractedDataTool?: boolean, userProvidedInstructions?: string): ChatMessage;
export declare function buildExtractUserPrompt(instruction: string, domElements: string, isUsingPrintExtractedDataTool?: boolean): ChatMessage;
export declare function buildMetadataSystemPrompt(): ChatMessage;
export declare function buildMetadataPrompt(instruction: string, extractionResponse: object, chunksSeen: number, chunksTotal: number): ChatMessage;
export declare function buildObserveSystemPrompt(userProvidedInstructions?: string): ChatMessage;
export declare function buildObserveUserMessage(instruction: string, domElements: string): ChatMessage;
/**
 * Builds the instruction for the observeAct method to find the most relevant element for an action
 */
export declare function buildActObservePrompt(action: string, supportedActions: string[], variables?: Record<string, string>): string;
export declare function buildOperatorSystemPrompt(goal: string): ChatMessage;
export declare function buildGoogleCUASystemPrompt(): ChatMessage;
