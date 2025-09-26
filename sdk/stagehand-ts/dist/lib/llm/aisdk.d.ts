import { LanguageModel } from "ai";
import { CreateChatCompletionOptions, LLMClient } from "./LLMClient";
import { LogLine } from "../../types/log";
import { ChatCompletion } from "openai/resources";
import { LLMCache } from "../cache/LLMCache";
export declare class AISdkClient extends LLMClient {
    type: "aisdk";
    private model;
    private logger?;
    private cache;
    private enableCaching;
    constructor({ model, logger, enableCaching, cache, }: {
        model: LanguageModel;
        logger?: (message: LogLine) => void;
        enableCaching?: boolean;
        cache?: LLMCache;
    });
    createChatCompletion<T = ChatCompletion>({ options, }: CreateChatCompletionOptions): Promise<T>;
}
