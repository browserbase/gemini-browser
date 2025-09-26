import { LanguageModel } from "ai";
import { CreateChatCompletionOptions, LLMClient } from "@browserbasehq/stagehand";
import { ChatCompletion } from "openai/resources";
export declare class AISdkClient extends LLMClient {
    type: "aisdk";
    private model;
    constructor({ model }: {
        model: LanguageModel;
    });
    createChatCompletion<T = ChatCompletion>({ options, }: CreateChatCompletionOptions): Promise<T>;
}
