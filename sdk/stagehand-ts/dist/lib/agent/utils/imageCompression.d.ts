import { AnthropicMessage, AnthropicToolResult, ResponseInputItem as OpenAIResponseInputItem } from "@/types/agent";
import type { Content as GoogleContent } from "@google/genai";
export type AnthropicResponseInputItem = AnthropicMessage | AnthropicToolResult;
export type SupportedInputItem = AnthropicResponseInputItem | OpenAIResponseInputItem | GoogleContent;
/**
 * Finds all items in the conversation history that contain images (Anthropic format)
 * @param items - Array of conversation items to check
 * @returns Array of indices where images were found
 */
export declare function findAnthropicItemsWithImages(items: AnthropicResponseInputItem[]): number[];
/**
 * Finds all items in the conversation history that contain images (OpenAI format)
 * @param items - Array of conversation items to check
 * @returns Array of indices where images were found
 */
export declare function findOpenAIItemsWithImages(items: OpenAIResponseInputItem[]): number[];
/**
 * Finds all items in the conversation history that contain images (Google format)
 * @param items - Array of conversation items to check
 * @returns Array of indices where images were found
 */
export declare function findGoogleItemsWithImages(items: GoogleContent[]): number[];
/**
 * Compresses Anthropic conversation history by removing images from older items
 * while keeping the most recent images intact
 * @param items - Array of conversation items to process
 * @param keepMostRecentCount - Number of most recent image-containing items to preserve (default: 2)
 * @returns Object with processed items
 */
export declare function compressAnthropicConversationImages(items: AnthropicResponseInputItem[], keepMostRecentCount?: number): {
    items: AnthropicResponseInputItem[];
};
/**
 * Compresses OpenAI conversation history by removing images from older items
 * while keeping the most recent images intact
 * @param items - Array of conversation items to process
 * @param keepMostRecentCount - Number of most recent image-containing items to preserve (default: 2)
 * @returns Object with processed items
 */
export declare function compressOpenAIConversationImages(items: OpenAIResponseInputItem[], keepMostRecentCount?: number): {
    items: OpenAIResponseInputItem[];
};
/**
 * Compresses Google conversation history by removing images from older items
 * while keeping the most recent images intact
 * @param items - Array of conversation items to process
 * @param keepMostRecentCount - Number of most recent image-containing items to preserve (default: 2)
 * @returns Object with processed items
 */
export declare function compressGoogleConversationImages(items: GoogleContent[], keepMostRecentCount?: number): {
    items: GoogleContent[];
};
