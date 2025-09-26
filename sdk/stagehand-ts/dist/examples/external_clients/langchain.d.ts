import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { CreateChatCompletionOptions, LLMClient } from "@browserbasehq/stagehand";
import { ChatCompletion } from "openai/resources";
export declare class LangchainClient extends LLMClient {
    type: "langchainClient";
    private model;
    constructor(model: BaseChatModel);
    createChatCompletion<T = ChatCompletion>({ options, }: CreateChatCompletionOptions): Promise<T>;
}
