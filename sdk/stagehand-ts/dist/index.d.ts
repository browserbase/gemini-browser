import { Cookie, Page as Page$1, Browser as Browser$1, BrowserContext as BrowserContext$1, Frame, CDPSession } from 'playwright';
import { z, ZodType, ZodError } from 'zod/v3';
import Browserbase from '@browserbasehq/sdk';
import { ClientOptions as ClientOptions$2 } from '@anthropic-ai/sdk';
import { ClientOptions as ClientOptions$1 } from 'openai';
import { generateObject, generateText, streamText, streamObject, experimental_generateImage, embed, embedMany, experimental_transcribe, experimental_generateSpeech } from 'ai';

type LogLevel = 0 | 1 | 2;
/**
 * Mapping between numeric log levels and their names
 *
 * 0 - error/warn - Critical issues or important warnings
 * 1 - info - Standard information messages
 * 2 - debug - Detailed information for debugging
 */
declare const LOG_LEVEL_NAMES: Record<LogLevel, string>;
type LogLine = {
    id?: string;
    category?: string;
    message: string;
    level?: LogLevel;
    timestamp?: string;
    auxiliary?: {
        [key: string]: {
            value: string;
            type: "object" | "string" | "html" | "integer" | "float" | "boolean";
        };
    };
};
type Logger = (logLine: LogLine) => void;

declare const AvailableModelSchema: z.ZodEnum<["gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano", "o4-mini", "o3", "o3-mini", "o1", "o1-mini", "gpt-4o", "gpt-4o-mini", "gpt-4o-2024-08-06", "gpt-4.5-preview", "o1-preview", "claude-3-5-sonnet-latest", "claude-3-5-sonnet-20241022", "claude-3-5-sonnet-20240620", "claude-3-7-sonnet-latest", "claude-3-7-sonnet-20250219", "cerebras-llama-3.3-70b", "cerebras-llama-3.1-8b", "groq-llama-3.3-70b-versatile", "groq-llama-3.3-70b-specdec", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.5-flash-8b", "gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash-preview-04-17", "gemini-2.5-pro-preview-03-25"]>;
type AvailableModel = z.infer<typeof AvailableModelSchema> | string;
type ModelProvider = "openai" | "anthropic" | "cerebras" | "groq" | "google" | "aisdk";
type ClientOptions = ClientOptions$1 | ClientOptions$2;
interface AnthropicJsonSchemaObject {
    definitions?: {
        MySchema?: {
            properties?: Record<string, unknown>;
            required?: string[];
        };
    };
    properties?: Record<string, unknown>;
    required?: string[];
}

interface LLMTool {
    type: "function";
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}

interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: ChatMessageContent;
}
type ChatMessageContent = string | (ChatMessageImageContent | ChatMessageTextContent)[];
interface ChatMessageImageContent {
    type: string;
    image_url?: {
        url: string;
    };
    text?: string;
    source?: {
        type: string;
        media_type: string;
        data: string;
    };
}
interface ChatMessageTextContent {
    type: string;
    text: string;
}
declare const AnnotatedScreenshotText = "This is a screenshot of the current page state with the elements annotated on it. Each element id is annotated with a number to the top left of it. Duplicate annotations at the same location are under each other vertically.";
interface ChatCompletionOptions {
    messages: ChatMessage[];
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    image?: {
        buffer: Buffer;
        description?: string;
    };
    response_model?: {
        name: string;
        schema: ZodType;
    };
    tools?: LLMTool[];
    tool_choice?: "auto" | "none" | "required";
    maxTokens?: number;
    requestId?: string;
}
type LLMResponse = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string | null;
            tool_calls: {
                id: string;
                type: string;
                function: {
                    name: string;
                    arguments: string;
                };
            }[];
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
};
interface CreateChatCompletionOptions {
    options: ChatCompletionOptions;
    logger: (message: LogLine) => void;
    retries?: number;
}
declare abstract class LLMClient {
    type: "openai" | "anthropic" | "cerebras" | "groq" | (string & {});
    modelName: AvailableModel | (string & {});
    hasVision: boolean;
    clientOptions: ClientOptions;
    userProvidedInstructions?: string;
    constructor(modelName: AvailableModel, userProvidedInstructions?: string);
    abstract createChatCompletion<T = LLMResponse & {
        usage?: LLMResponse["usage"];
    }>(options: CreateChatCompletionOptions): Promise<T>;
    generateObject: typeof generateObject;
    generateText: typeof generateText;
    streamText: typeof streamText;
    streamObject: typeof streamObject;
    generateImage: typeof experimental_generateImage;
    embed: typeof embed;
    embedMany: typeof embedMany;
    transcribe: typeof experimental_transcribe;
    generateSpeech: typeof experimental_generateSpeech;
}

declare class LLMProvider {
    private logger;
    private enableCaching;
    private cache;
    constructor(logger: (message: LogLine) => void, enableCaching: boolean);
    cleanRequestCache(requestId: string): void;
    getClient(modelName: AvailableModel, clientOptions?: ClientOptions): LLMClient;
    static getModelProvider(modelName: AvailableModel): ModelProvider;
}

interface AgentAction$1 {
    type: string;
    [key: string]: unknown;
}
interface AgentResult$1 {
    success: boolean;
    message: string;
    actions: AgentAction$1[];
    completed: boolean;
    metadata?: Record<string, unknown>;
    usage?: {
        input_tokens: number;
        output_tokens: number;
        inference_time_ms: number;
    };
}
interface AgentOptions$1 {
    maxSteps?: number;
    autoScreenshot?: boolean;
    waitBetweenActions?: number;
    context?: string;
}
interface AgentExecuteOptions$1 extends AgentOptions$1 {
    instruction: string;
}
type AgentProviderType = "openai" | "anthropic" | "google";
interface AgentClientOptions {
    apiKey: string;
    organization?: string;
    baseURL?: string;
    defaultMaxSteps?: number;
    [key: string]: unknown;
}
type AgentType = "openai" | "anthropic" | "google";
interface AgentExecutionOptions {
    options: AgentExecuteOptions$1;
    logger: (message: LogLine) => void;
    retries?: number;
}
interface AgentHandlerOptions {
    modelName: string;
    clientOptions?: Record<string, unknown>;
    userProvidedInstructions?: string;
    agentType: AgentType;
    experimental?: boolean;
}
interface ActionExecutionResult {
    success: boolean;
    error?: string;
    data?: unknown;
}
interface ToolUseItem extends ResponseItem {
    type: "tool_use";
    id: string;
    name: string;
    input: Record<string, unknown>;
}
interface AnthropicMessage {
    role: string;
    content: string | Array<AnthropicContentBlock>;
}
interface AnthropicContentBlock {
    type: string;
    [key: string]: unknown;
}
interface AnthropicTextBlock extends AnthropicContentBlock {
    type: "text";
    text: string;
}
interface AnthropicToolResult {
    type: "tool_result";
    tool_use_id: string;
    content: string | Array<AnthropicContentBlock>;
}
interface ResponseItem {
    type: string;
    id: string;
    [key: string]: unknown;
}
interface ComputerCallItem extends ResponseItem {
    type: "computer_call";
    call_id: string;
    action: {
        type: string;
        [key: string]: unknown;
    };
    pending_safety_checks?: Array<{
        id: string;
        code: string;
        message: string;
    }>;
}
interface FunctionCallItem extends ResponseItem {
    type: "function_call";
    call_id: string;
    name: string;
    arguments: string;
}
type ResponseInputItem = {
    role: string;
    content: string;
} | {
    type: "computer_call_output";
    call_id: string;
    output: {
        type: "input_image";
        image_url: string;
        current_url?: string;
        error?: string;
        [key: string]: unknown;
    } | string;
    acknowledged_safety_checks?: Array<{
        id: string;
        code: string;
        message: string;
    }>;
} | {
    type: "function_call_output";
    call_id: string;
    output: string;
};
interface AgentInstance {
    execute: (instructionOrOptions: string | AgentExecuteOptions$1) => Promise<AgentResult$1>;
}

interface ConstructorParams {
    /**
     * The environment to use for Stagehand
     */
    env: "LOCAL" | "BROWSERBASE";
    /**
     * Your Browserbase API key
     */
    apiKey?: string;
    /**
     * Your Browserbase project ID
     */
    projectId?: string;
    /**
     * The verbosity of the Stagehand logger
     * 0 - No logs
     * 1 - Only errors
     * 2 - All logs
     */
    verbose?: 0 | 1 | 2;
    /**
     * The LLM provider to use for Stagehand
     * See
     */
    llmProvider?: LLMProvider;
    /**
     * The logger to use for Stagehand
     */
    logger?: (message: LogLine) => void | Promise<void>;
    /**
     * The timeout to use for the DOM to settle
     * @default 10000
     */
    domSettleTimeoutMs?: number;
    /**
     * The parameters to use for creating a Browserbase session
     * See https://docs.browserbase.com/reference/api/create-a-session
     */
    browserbaseSessionCreateParams?: Browserbase.Sessions.SessionCreateParams;
    /**
     * Enable caching of LLM responses
     * @default true
     */
    enableCaching?: boolean;
    /**
     * The ID of a Browserbase session to resume
     */
    browserbaseSessionID?: string;
    /**
     * The model to use for Stagehand
     */
    modelName?: AvailableModel;
    /**
     * The LLM client to use for Stagehand
     */
    llmClient?: LLMClient;
    /**
     * The parameters to use for the LLM client
     * Useful for parameterizing LLM API Keys
     */
    modelClientOptions?: ClientOptions;
    /**
     * Customize the Stagehand system prompt
     */
    systemPrompt?: string;
    /**
     * Offload Stagehand method calls to the Stagehand API.
     * Must have a valid API key to use
     */
    useAPI?: boolean;
    /**
     * Wait for captchas to be solved after navigation when using Browserbase environment.
     *
     * @default false
     */
    waitForCaptchaSolves?: boolean;
    /**
     * The parameters to use for launching a local browser
     */
    localBrowserLaunchOptions?: LocalBrowserLaunchOptions;
    /**
     * Log the inference to a file
     */
    logInferenceToFile?: boolean;
    selfHeal?: boolean;
    /**
     * Disable Pino (helpful for Next.js or test environments)
     */
    disablePino?: boolean;
    /**
     * Experimental Flag: Enables the latest experimental features
     */
    experimental?: boolean;
}
interface InitResult {
    debugUrl: string;
    sessionUrl: string;
    sessionId: string;
}
interface ActOptions {
    action: string;
    modelName?: AvailableModel;
    modelClientOptions?: ClientOptions;
    variables?: Record<string, string>;
    domSettleTimeoutMs?: number;
    timeoutMs?: number;
    iframes?: boolean;
    frameId?: string;
}
interface ActResult {
    success: boolean;
    message: string;
    action: string;
}
interface ExtractOptions<T extends z.AnyZodObject> {
    instruction?: string;
    schema?: T;
    modelName?: AvailableModel;
    modelClientOptions?: ClientOptions;
    domSettleTimeoutMs?: number;
    /**
     * @deprecated The `useTextExtract` parameter has no effect in this version of Stagehand and will be removed in later versions.
     */
    useTextExtract?: boolean;
    selector?: string;
    iframes?: boolean;
    frameId?: string;
}
type ExtractResult<T extends z.AnyZodObject> = z.infer<T>;
interface ObserveOptions {
    instruction?: string;
    modelName?: AvailableModel;
    modelClientOptions?: ClientOptions;
    domSettleTimeoutMs?: number;
    returnAction?: boolean;
    /**
     * @deprecated The `onlyVisible` parameter has no effect in this version of Stagehand and will be removed in later versions.
     */
    onlyVisible?: boolean;
    drawOverlay?: boolean;
    iframes?: boolean;
    frameId?: string;
}
interface ObserveResult {
    selector: string;
    description: string;
    backendNodeId?: number;
    method?: string;
    arguments?: string[];
}
interface LocalBrowserLaunchOptions {
    args?: string[];
    chromiumSandbox?: boolean;
    devtools?: boolean;
    env?: Record<string, string | number | boolean>;
    executablePath?: string;
    handleSIGHUP?: boolean;
    handleSIGINT?: boolean;
    handleSIGTERM?: boolean;
    headless?: boolean;
    ignoreDefaultArgs?: boolean | Array<string>;
    proxy?: {
        server: string;
        bypass?: string;
        username?: string;
        password?: string;
    };
    tracesDir?: string;
    userDataDir?: string;
    preserveUserDataDir?: boolean;
    acceptDownloads?: boolean;
    downloadsPath?: string;
    extraHTTPHeaders?: Record<string, string>;
    geolocation?: {
        latitude: number;
        longitude: number;
        accuracy?: number;
    };
    hasTouch?: boolean;
    ignoreHTTPSErrors?: boolean;
    locale?: string;
    permissions?: Array<string>;
    recordHar?: {
        omitContent?: boolean;
        content?: "omit" | "embed" | "attach";
        path: string;
        mode?: "full" | "minimal";
        urlFilter?: string | RegExp;
    };
    recordVideo?: {
        dir: string;
        size?: {
            width: number;
            height: number;
        };
    };
    viewport?: {
        width: number;
        height: number;
    };
    deviceScaleFactor?: number;
    timezoneId?: string;
    bypassCSP?: boolean;
    cookies?: Cookie[];
    cdpUrl?: string;
}
interface StagehandMetrics {
    actPromptTokens: number;
    actCompletionTokens: number;
    actInferenceTimeMs: number;
    extractPromptTokens: number;
    extractCompletionTokens: number;
    extractInferenceTimeMs: number;
    observePromptTokens: number;
    observeCompletionTokens: number;
    observeInferenceTimeMs: number;
    agentPromptTokens: number;
    agentCompletionTokens: number;
    agentInferenceTimeMs: number;
    totalPromptTokens: number;
    totalCompletionTokens: number;
    totalInferenceTimeMs: number;
}
/**
 * Options for executing a task with an agent
 */
interface AgentExecuteParams {
    /**
     * The instruction to execute with the agent
     */
    instruction: string;
    /**
     * Maximum number of steps the agent can take to complete the task
     * @default 10
     */
    maxSteps?: number;
    /**
     * Take a screenshot automatically before each agent step
     * @default true
     */
    autoScreenshot?: boolean;
    /**
     * Wait time in milliseconds between agent actions
     * @default 0
     */
    waitBetweenActions?: number;
    /**
     * Additional context to provide to the agent
     */
    context?: string;
}
/**
 * Configuration for agent functionality
 */
interface AgentConfig {
    /**
     * The provider to use for agent functionality
     */
    provider?: AgentProviderType;
    /**
     * The model to use for agent functionality
     */
    model?: string;
    /**
     * Custom instructions to provide to the agent
     */
    instructions?: string;
    /**
     * Additional options to pass to the agent client
     */
    options?: Record<string, unknown>;
}
declare enum StagehandFunctionName {
    ACT = "ACT",
    EXTRACT = "EXTRACT",
    OBSERVE = "OBSERVE",
    AGENT = "AGENT"
}
interface HistoryEntry {
    method: "act" | "extract" | "observe" | "navigate";
    parameters: unknown;
    result: unknown;
    timestamp: string;
}
/**
 * Represents a path through a Zod schema from the root object down to a
 * particular field. The `segments` array describes the chain of keys/indices.
 *
 * - **String** segments indicate object property names.
 * - **Number** segments indicate array indices.
 *
 * For example, `["users", 0, "homepage"]` might describe reaching
 * the `homepage` field in `schema.users[0].homepage`.
 */
interface ZodPathSegments {
    /**
     * The ordered list of keys/indices leading from the schema root
     * to the targeted field.
     */
    segments: Array<string | number>;
}

declare const defaultExtractSchema: z.ZodObject<{
    extraction: z.ZodString;
}, "strip", z.ZodTypeAny, {
    extraction?: string;
}, {
    extraction?: string;
}>;
declare const pageTextSchema: z.ZodObject<{
    page_text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    page_text?: string;
}, {
    page_text?: string;
}>;
interface Page extends Omit<Page$1, "on"> {
    act(action: string): Promise<ActResult>;
    act(options: ActOptions): Promise<ActResult>;
    act(observation: ObserveResult): Promise<ActResult>;
    extract(instruction: string): Promise<ExtractResult<typeof defaultExtractSchema>>;
    extract<T extends z.AnyZodObject>(options: ExtractOptions<T>): Promise<ExtractResult<T>>;
    extract(): Promise<ExtractResult<typeof pageTextSchema>>;
    observe(): Promise<ObserveResult[]>;
    observe(instruction: string): Promise<ObserveResult[]>;
    observe(options?: ObserveOptions): Promise<ObserveResult[]>;
    on: {
        (event: "popup", listener: (page: Page) => unknown): Page;
    } & Page$1["on"];
}
type BrowserContext = BrowserContext$1;
type Browser = Browser$1;

interface EnhancedContext extends Omit<BrowserContext$1, "newPage" | "pages"> {
    newPage(): Promise<Page>;
    pages(): Page[];
}
type EncodedId = `${number}-${number}`;

interface StagehandAPIConstructorParams {
    apiKey: string;
    projectId: string;
    logger: (message: LogLine) => void;
}
interface StartSessionParams {
    modelName: string;
    modelApiKey: string;
    domSettleTimeoutMs: number;
    verbose: number;
    debugDom: boolean;
    systemPrompt?: string;
    browserbaseSessionCreateParams?: Browserbase.Sessions.SessionCreateParams;
    selfHeal?: boolean;
    waitForCaptchaSolves?: boolean;
    actionTimeoutMs?: number;
    browserbaseSessionID?: string;
}
interface StartSessionResult {
    sessionId: string;
    available?: boolean;
}

declare class PlaywrightCommandException extends Error {
    constructor(message: string);
}
declare class PlaywrightCommandMethodNotSupportedException extends Error {
    constructor(message: string);
}
interface GotoOptions {
    timeout?: number;
    waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
    referer?: string;
    frameId?: string;
}

interface AgentAction {
  type: string;
  [key: string]: unknown;
}
interface AgentResult {
  success: boolean;
  message: string;
  actions: AgentAction[];
  completed: boolean;
  metadata?: Record<string, unknown>;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    inference_time_ms: number;
  };
}
interface AgentOptions {
  maxSteps?: number;
  autoScreenshot?: boolean;
  waitBetweenActions?: number;
  context?: string;
}
interface AgentExecuteOptions extends AgentOptions {
  instruction: string;
}

declare class StagehandAPI {
    private apiKey;
    private projectId;
    private sessionId?;
    private modelApiKey;
    private logger;
    private fetchWithCookies;
    constructor({ apiKey, projectId, logger }: StagehandAPIConstructorParams);
    init({ modelName, modelApiKey, domSettleTimeoutMs, verbose, debugDom, systemPrompt, selfHeal, waitForCaptchaSolves, actionTimeoutMs, browserbaseSessionCreateParams, browserbaseSessionID, }: StartSessionParams): Promise<StartSessionResult>;
    act(options: ActOptions | ObserveResult): Promise<ActResult>;
    extract<T extends z.AnyZodObject>(options: ExtractOptions<T>): Promise<ExtractResult<T>>;
    observe(options?: ObserveOptions): Promise<ObserveResult[]>;
    goto(url: string, options?: GotoOptions): Promise<void>;
    agentExecute(agentConfig: AgentConfig, executeOptions: AgentExecuteOptions): Promise<AgentResult>;
    end(): Promise<Response>;
    private execute;
    private request;
}

declare class StagehandContext {
    private readonly stagehand;
    private readonly intContext;
    private pageMap;
    private activeStagehandPage;
    private readonly frameIdMap;
    private constructor();
    private createStagehandPage;
    static init(context: BrowserContext$1, stagehand: Stagehand): Promise<StagehandContext>;
    get frameIdLookup(): ReadonlyMap<string, StagehandPage>;
    registerFrameId(frameId: string, page: StagehandPage): void;
    unregisterFrameId(frameId: string): void;
    getStagehandPageByFrameId(frameId: string): StagehandPage | undefined;
    get context(): EnhancedContext;
    getStagehandPage(page: Page$1): Promise<StagehandPage>;
    getStagehandPages(): Promise<StagehandPage[]>;
    setActivePage(page: StagehandPage): void;
    getActivePage(): StagehandPage | null;
    private handleNewPlaywrightPage;
    private attachFrameNavigatedListener;
}

/** ensure we register the custom selector only once per process */
declare class StagehandPage {
    stagehand: Stagehand;
    private rawPage;
    private intPage;
    private intContext;
    private actHandler;
    private extractHandler;
    private observeHandler;
    private llmClient;
    private cdpClient;
    private api;
    private userProvidedInstructions?;
    private waitForCaptchaSolves;
    private initialized;
    private isClosed;
    private readonly cdpClients;
    private fidOrdinals;
    private rootFrameId;
    get frameId(): string;
    updateRootFrameId(newId: string): void;
    constructor(page: Page$1, stagehand: Stagehand, context: StagehandContext, llmClient: LLMClient, userProvidedInstructions?: string, api?: StagehandAPI, waitForCaptchaSolves?: boolean);
    ordinalForFrameId(fid: string | undefined): number;
    encodeWithFrameId(fid: string | undefined, backendId: number): EncodedId;
    resetFrameOrdinals(): void;
    private ensureStagehandScript;
    /** Register the custom selector engine that pierces open/closed shadow roots. */
    /**
     * Waits for a captcha to be solved when using Browserbase environment.
     *
     * @param timeoutMs - Optional timeout in milliseconds. If provided, the promise will reject if the captcha solving hasn't started within the given time.
     * @throws StagehandEnvironmentError if called in a LOCAL environment
     * @throws CaptchaTimeoutError if the timeout is reached before captcha solving starts
     * @returns Promise that resolves when the captcha is solved
     */
    waitForCaptchaSolve(timeoutMs?: number): Promise<void>;
    init(): Promise<StagehandPage>;
    get page(): Page;
    get context(): EnhancedContext;
    /**
     * `_waitForSettledDom` waits until the DOM is settled, and therefore is
     * ready for actions to be taken.
     *
     * **Definition of "settled"**
     *   • No in-flight network requests (except WebSocket / Server-Sent-Events).
     *   • That idle state lasts for at least **500 ms** (the "quiet-window").
     *
     * **How it works**
     *   1.  Subscribes to CDP Network and Page events for the main target and all
     *       out-of-process iframes (via `Target.setAutoAttach { flatten:true }`).
     *   2.  Every time `Network.requestWillBeSent` fires, the request ID is added
     *       to an **`inflight`** `Set`.
     *   3.  When the request finishes—`loadingFinished`, `loadingFailed`,
     *       `requestServedFromCache`, or a *data:* response—the request ID is
     *       removed.
     *   4.  *Document* requests are also mapped **frameId → requestId**; when
     *       `Page.frameStoppedLoading` fires the corresponding Document request is
     *       removed immediately (covers iframes whose network events never close).
     *   5.  A **stalled-request sweep timer** runs every 500 ms.  If a *Document*
     *       request has been open for ≥ 2 s it is forcibly removed; this prevents
     *       ad/analytics iframes from blocking the wait forever.
     *   6.  When `inflight` becomes empty the helper starts a 500 ms timer.
     *       If no new request appears before the timer fires, the promise
     *       resolves → **DOM is considered settled**.
     *   7.  A global guard (`timeoutMs` or `stagehand.domSettleTimeoutMs`,
     *       default ≈ 30 s) ensures we always resolve; if it fires we log how many
     *       requests were still outstanding.
     *
     * @param timeoutMs – Optional hard cap (ms).  Defaults to
     *                    `this.stagehand.domSettleTimeoutMs`.
     */
    _waitForSettledDom(timeoutMs?: number): Promise<void>;
    act(actionOrOptions: string | ActOptions | ObserveResult): Promise<ActResult>;
    extract<T extends z.AnyZodObject = typeof defaultExtractSchema>(instructionOrOptions?: string | ExtractOptions<T>): Promise<ExtractResult<T>>;
    observe(instructionOrOptions?: string | ObserveOptions): Promise<ObserveResult[]>;
    /**
     * Get or create a CDP session for the given target.
     * @param target  The Page or (OOPIF) Frame you want to talk to.
     */
    getCDPClient(target?: Page$1 | Frame): Promise<CDPSession>;
    /**
     * Send a CDP command to the chosen DevTools target.
     *
     * @param method  Any valid CDP method, e.g. `"DOM.getDocument"`.
     * @param params  Command parameters (optional).
     * @param target  A `Page` or OOPIF `Frame`. Defaults to the main page.
     *
     * @typeParam T  Expected result shape (defaults to `unknown`).
     */
    sendCDP<T = unknown>(method: string, params?: Record<string, unknown>, target?: Page$1 | Frame): Promise<T>;
    /** Enable a CDP domain (e.g. `"Network"` or `"DOM"`) on the chosen target. */
    enableCDP(domain: string, target?: Page$1 | Frame): Promise<void>;
    /** Disable a CDP domain on the chosen target. */
    disableCDP(domain: string, target?: Page$1 | Frame): Promise<void>;
}

interface BrowserResult {
    env: "LOCAL" | "BROWSERBASE";
    browser?: Browser;
    context: BrowserContext;
    debugUrl?: string;
    sessionUrl?: string;
    contextPath?: string;
    sessionId?: string;
}

declare const operatorResponseSchema: z.ZodObject<{
    reasoning: z.ZodString;
    method: z.ZodEnum<["act", "extract", "goto", "close", "wait", "navback", "refresh"]>;
    parameters: z.ZodNullable<z.ZodString>;
    taskComplete: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    method?: "close" | "goto" | "act" | "extract" | "wait" | "navback" | "refresh";
    reasoning?: string;
    parameters?: string;
    taskComplete?: boolean;
}, {
    method?: "close" | "goto" | "act" | "extract" | "wait" | "navback" | "refresh";
    reasoning?: string;
    parameters?: string;
    taskComplete?: boolean;
}>;
type OperatorResponse = z.infer<typeof operatorResponseSchema>;
declare const operatorSummarySchema: z.ZodObject<{
    answer: z.ZodString;
}, "strip", z.ZodTypeAny, {
    answer?: string;
}, {
    answer?: string;
}>;
type OperatorSummary = z.infer<typeof operatorSummarySchema>;

declare class StagehandError extends Error {
    constructor(message: string);
}
declare class StagehandDefaultError extends StagehandError {
    constructor(error?: unknown);
}
declare class StagehandEnvironmentError extends StagehandError {
    constructor(currentEnvironment: string, requiredEnvironment: string, feature: string);
}
declare class MissingEnvironmentVariableError extends StagehandError {
    constructor(missingEnvironmentVariable: string, feature: string);
}
declare class UnsupportedModelError extends StagehandError {
    constructor(supportedModels: string[], feature?: string);
}
declare class UnsupportedModelProviderError extends StagehandError {
    constructor(supportedProviders: string[], feature?: string);
}
declare class UnsupportedAISDKModelProviderError extends StagehandError {
    constructor(provider: string, supportedProviders: string[]);
}
declare class InvalidAISDKModelFormatError extends StagehandError {
    constructor(modelName: string);
}
declare class StagehandNotInitializedError extends StagehandError {
    constructor(prop: string);
}
declare class BrowserbaseSessionNotFoundError extends StagehandError {
    constructor();
}
declare class CaptchaTimeoutError extends StagehandError {
    constructor();
}
declare class MissingLLMConfigurationError extends StagehandError {
    constructor();
}
declare class HandlerNotInitializedError extends StagehandError {
    constructor(handlerType: string);
}
declare class StagehandInvalidArgumentError extends StagehandError {
    constructor(message: string);
}
declare class StagehandElementNotFoundError extends StagehandError {
    constructor(xpaths: string[]);
}
declare class AgentScreenshotProviderError extends StagehandError {
    constructor(message: string);
}
declare class StagehandMissingArgumentError extends StagehandError {
    constructor(message: string);
}
declare class CreateChatCompletionResponseError extends StagehandError {
    constructor(message: string);
}
declare class StagehandEvalError extends StagehandError {
    constructor(message: string);
}
declare class StagehandDomProcessError extends StagehandError {
    constructor(message: string);
}
declare class StagehandClickError extends StagehandError {
    constructor(message: string, selector: string);
}
declare class LLMResponseError extends StagehandError {
    constructor(primitive: string, message: string);
}
declare class StagehandIframeError extends StagehandError {
    constructor(frameUrl: string, message: string);
}
declare class ContentFrameNotFoundError extends StagehandError {
    constructor(selector: string);
}
declare class XPathResolutionError extends StagehandError {
    constructor(xpath: string);
}
declare class ExperimentalApiConflictError extends StagehandError {
    constructor();
}
declare class ExperimentalNotConfiguredError extends StagehandError {
    constructor(featureName: string);
}
declare class ZodSchemaValidationError extends Error {
    readonly received: unknown;
    readonly issues: ReturnType<ZodError["format"]>;
    constructor(received: unknown, issues: ReturnType<ZodError["format"]>);
}
declare class StagehandInitError extends StagehandError {
    constructor(message: string);
}
declare class StagehandShadowRootMissingError extends StagehandError {
    constructor(detail?: string);
}
declare class StagehandShadowSegmentEmptyError extends StagehandError {
    constructor();
}
declare class StagehandShadowSegmentNotFoundError extends StagehandError {
    constructor(segment: string, hint?: string);
}

declare class StagehandAPIError extends Error {
    constructor(message: string);
}
declare class StagehandAPIUnauthorizedError extends StagehandAPIError {
    constructor(message?: string);
}
declare class StagehandHttpError extends StagehandAPIError {
    constructor(message: string);
}
declare class StagehandServerError extends StagehandAPIError {
    constructor(message: string);
}
declare class StagehandResponseBodyError extends StagehandAPIError {
    constructor();
}
declare class StagehandResponseParseError extends StagehandAPIError {
    constructor(message: string);
}

declare class Stagehand {
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
        execute: (instructionOrOptions: string | AgentExecuteOptions$1) => Promise<AgentResult$1>;
        setScreenshotCollector?: (collector: unknown) => void;
    };
}

export { type ActOptions, type ActResult, type ActionExecutionResult, type AgentAction$1 as AgentAction, type AgentClientOptions, type AgentConfig, type AgentExecuteOptions$1 as AgentExecuteOptions, type AgentExecuteParams, type AgentExecutionOptions, type AgentHandlerOptions, type AgentInstance, type AgentOptions$1 as AgentOptions, type AgentProviderType, type AgentResult$1 as AgentResult, AgentScreenshotProviderError, type AgentType, AnnotatedScreenshotText, type AnthropicContentBlock, type AnthropicJsonSchemaObject, type AnthropicMessage, type AnthropicTextBlock, type AnthropicToolResult, type AvailableModel, AvailableModelSchema, type Browser, type BrowserContext, type BrowserResult, BrowserbaseSessionNotFoundError, CaptchaTimeoutError, type ChatCompletionOptions, type ChatMessage, type ChatMessageContent, type ChatMessageImageContent, type ChatMessageTextContent, type ClientOptions, type ComputerCallItem, type ConstructorParams, ContentFrameNotFoundError, type CreateChatCompletionOptions, CreateChatCompletionResponseError, ExperimentalApiConflictError, ExperimentalNotConfiguredError, type ExtractOptions, type ExtractResult, type FunctionCallItem, type GotoOptions, HandlerNotInitializedError, type HistoryEntry, type InitResult, InvalidAISDKModelFormatError, LLMClient, type LLMResponse, LLMResponseError, LOG_LEVEL_NAMES, type LocalBrowserLaunchOptions, type LogLevel, type LogLine, type Logger, MissingEnvironmentVariableError, MissingLLMConfigurationError, type ModelProvider, type ObserveOptions, type ObserveResult, type OperatorResponse, type OperatorSummary, type Page, PlaywrightCommandException, PlaywrightCommandMethodNotSupportedException, type ResponseInputItem, type ResponseItem, Stagehand, StagehandAPIError, StagehandAPIUnauthorizedError, StagehandClickError, StagehandDefaultError, StagehandDomProcessError, StagehandElementNotFoundError, StagehandEnvironmentError, StagehandError, StagehandEvalError, StagehandFunctionName, StagehandHttpError, StagehandIframeError, StagehandInitError, StagehandInvalidArgumentError, type StagehandMetrics, StagehandMissingArgumentError, StagehandNotInitializedError, StagehandResponseBodyError, StagehandResponseParseError, StagehandServerError, StagehandShadowRootMissingError, StagehandShadowSegmentEmptyError, StagehandShadowSegmentNotFoundError, type ToolUseItem, UnsupportedAISDKModelProviderError, UnsupportedModelError, UnsupportedModelProviderError, XPathResolutionError, type ZodPathSegments, ZodSchemaValidationError, defaultExtractSchema, operatorResponseSchema, operatorSummarySchema, pageTextSchema };
