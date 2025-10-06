import { LogLine } from "../../types/log";
import { AvailableModel, ClientOptions } from "../../types/model";
import { LLMCache } from "../cache/LLMCache";
import { CreateChatCompletionOptions, LLMClient, LLMResponse } from "./LLMClient";
export declare class GoogleClient extends LLMClient {
    type: "google";
    private client;
    private cache;
    private enableCaching;
    clientOptions: ClientOptions;
    hasVision: boolean;
    private logger;
    constructor({ logger, // Added logger based on other clients
    enableCaching, cache, modelName, clientOptions, }: {
        logger: (message: LogLine) => void;
        enableCaching?: boolean;
        cache?: LLMCache;
        modelName: AvailableModel;
        clientOptions?: ClientOptions;
    });
    private formatMessages;
    private formatTools;
    createChatCompletion<T = LLMResponse>({ options, logger, retries, }: CreateChatCompletionOptions): Promise<T>;
}
