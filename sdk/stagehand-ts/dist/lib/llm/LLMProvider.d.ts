import { LogLine } from "../../types/log";
import { AvailableModel, ClientOptions, ModelProvider } from "../../types/model";
import { LLMClient } from "./LLMClient";
export declare function getAISDKLanguageModel(subProvider: string, subModelName: string, apiKey?: string): import("ai/dist").LanguageModelV1;
export declare class LLMProvider {
    private logger;
    private enableCaching;
    private cache;
    constructor(logger: (message: LogLine) => void, enableCaching: boolean);
    cleanRequestCache(requestId: string): void;
    getClient(modelName: AvailableModel, clientOptions?: ClientOptions): LLMClient;
    static getModelProvider(modelName: AvailableModel): ModelProvider;
}
