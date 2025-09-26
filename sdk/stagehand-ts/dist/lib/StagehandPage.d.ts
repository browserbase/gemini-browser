import type { CDPSession, Page as PlaywrightPage, Frame } from "playwright";
import { z } from "zod/v3";
import { Page, defaultExtractSchema } from "../types/page";
import { ExtractOptions, ExtractResult, ObserveOptions, ObserveResult } from "../types/stagehand";
import { StagehandAPI } from "./api";
import { ActOptions, ActResult, Stagehand } from "./index";
import { LLMClient } from "./llm/LLMClient";
import { StagehandContext } from "./StagehandContext";
import { EncodedId, EnhancedContext } from "../types/context";
/** ensure we register the custom selector only once per process */
export declare class StagehandPage {
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
    constructor(page: PlaywrightPage, stagehand: Stagehand, context: StagehandContext, llmClient: LLMClient, userProvidedInstructions?: string, api?: StagehandAPI, waitForCaptchaSolves?: boolean);
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
    getCDPClient(target?: PlaywrightPage | Frame): Promise<CDPSession>;
    /**
     * Send a CDP command to the chosen DevTools target.
     *
     * @param method  Any valid CDP method, e.g. `"DOM.getDocument"`.
     * @param params  Command parameters (optional).
     * @param target  A `Page` or OOPIF `Frame`. Defaults to the main page.
     *
     * @typeParam T  Expected result shape (defaults to `unknown`).
     */
    sendCDP<T = unknown>(method: string, params?: Record<string, unknown>, target?: PlaywrightPage | Frame): Promise<T>;
    /** Enable a CDP domain (e.g. `"Network"` or `"DOM"`) on the chosen target. */
    enableCDP(domain: string, target?: PlaywrightPage | Frame): Promise<void>;
    /** Disable a CDP domain on the chosen target. */
    disableCDP(domain: string, target?: PlaywrightPage | Frame): Promise<void>;
}
