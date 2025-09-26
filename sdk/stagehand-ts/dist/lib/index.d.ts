import { EnhancedContext } from "../types/context";
import { LogLine } from "../types/log";
import { Page } from "../types/page";
import { ConstructorParams, InitResult, AgentConfig, StagehandMetrics, StagehandFunctionName, HistoryEntry, ActOptions, ExtractOptions, ObserveOptions } from "../types/stagehand";
import { StagehandPage } from "./StagehandPage";
import { StagehandAPI } from "./api";
import { LLMClient } from "./llm/LLMClient";
import { LLMProvider } from "./llm/LLMProvider";
import { AgentExecuteOptions, AgentResult } from "../types/agent";
import { z } from "zod/v3";
import { GotoOptions } from "@/types/playwright";
export declare class Stagehand {
    private stagehandPage;
    private stagehandContext;
    browserbaseSessionID?: string;
    readonly domSettleTimeoutMs: number;
    readonly debugDom: boolean;
    readonly headless: boolean;
    verbose: 0 | 1 | 2;
    llmProvider: LLMProvider;
    enableCaching: boolean;
    protected apiKey: string | undefined;
    private projectId;
    private externalLogger?;
    private browserbaseSessionCreateParams?;
    variables: {
        [key: string]: unknown;
    };
    private contextPath?;
    llmClient: LLMClient;
    readonly userProvidedInstructions?: string;
    private usingAPI;
    private modelName;
    apiClient: StagehandAPI | undefined;
    readonly waitForCaptchaSolves: boolean;
    private localBrowserLaunchOptions?;
    readonly selfHeal: boolean;
    private cleanupCalled;
    readonly actTimeoutMs: number;
    readonly logInferenceToFile?: boolean;
    private stagehandLogger;
    private disablePino;
    private modelClientOptions;
    private _env;
    private _browser;
    private _isClosed;
    private _history;
    readonly experimental: boolean;
    private _livePageProxy?;
    private createLivePageProxy;
    get history(): ReadonlyArray<HistoryEntry>;
    protected setActivePage(page: StagehandPage): void;
    get page(): Page;
    stagehandMetrics: StagehandMetrics;
    get metrics(): StagehandMetrics;
    get isClosed(): boolean;
    updateMetrics(functionName: StagehandFunctionName, promptTokens: number, completionTokens: number, inferenceTimeMs: number): void;
    private updateTotalMetrics;
    constructor({ env, apiKey, projectId, verbose, llmProvider, llmClient, logger, browserbaseSessionCreateParams, domSettleTimeoutMs, enableCaching, browserbaseSessionID, modelName, modelClientOptions, systemPrompt, useAPI, localBrowserLaunchOptions, waitForCaptchaSolves, logInferenceToFile, selfHeal, disablePino, experimental, }?: ConstructorParams);
    private registerSignalHandlers;
    get logger(): (logLine: LogLine) => void;
    get env(): "LOCAL" | "BROWSERBASE";
    get downloadsPath(): string;
    get context(): EnhancedContext;
    init(): Promise<InitResult>;
    log(logObj: LogLine): void;
    close(): Promise<void>;
    addToHistory(method: HistoryEntry["method"], parameters: ActOptions | ExtractOptions<z.AnyZodObject> | ObserveOptions | {
        url: string;
        options: GotoOptions;
    } | string, result?: unknown): void;
    /**
     * Create an agent instance that can be executed with different instructions
     * @returns An agent instance with execute() and setViewport() methods
     */
    agent(options?: AgentConfig): {
        execute: (instructionOrOptions: string | AgentExecuteOptions) => Promise<AgentResult>;
        setScreenshotCollector?: (collector: unknown) => void;
    };
}
export * from "../types/browser";
export * from "../types/log";
export * from "../types/model";
export * from "../types/page";
export * from "../types/playwright";
export * from "../types/stagehand";
export * from "../types/operator";
export * from "../types/agent";
export * from "./llm/LLMClient";
export * from "../types/stagehandErrors";
export * from "../types/stagehandApiErrors";
