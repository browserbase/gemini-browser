/**
 * Welcome to the Stagehand custom OpenAI client!
 *
 * This is a client for models that are compatible with the OpenAI API, like Ollama, Gemini, etc.
 * You can just pass in an OpenAI instance to the client and it will work.
 */
import { CreateChatCompletionOptions, LLMClient } from "@browserbasehq/stagehand";
import OpenAI from "openai";
import type { ChatCompletion } from "openai/resources/chat/completions";
export declare class CustomOpenAIClient extends LLMClient {
    type: "openai";
    private client;
    constructor({ modelName, client }: {
        modelName: string;
        client: OpenAI;
    });
    createChatCompletion<T = ChatCompletion>({ options, retries, logger, }: CreateChatCompletionOptions): Promise<T>;
}
