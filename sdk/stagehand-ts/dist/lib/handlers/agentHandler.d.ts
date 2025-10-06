import { StagehandPage } from "../StagehandPage";
import { StagehandAgent } from "../agent/StagehandAgent";
import { AgentClient } from "../agent/AgentClient";
import { LogLine } from "../../types/log";
import { AgentExecuteOptions, AgentResult, AgentHandlerOptions } from "@/types/agent";
import { Stagehand } from "../index";
export declare class StagehandAgentHandler {
    private stagehand;
    private stagehandPage;
    private agent;
    private provider;
    private logger;
    private agentClient;
    private options;
    private screenshotCollector?;
    constructor(stagehand: Stagehand, stagehandPage: StagehandPage, logger: (message: LogLine) => void, options: AgentHandlerOptions);
    private setupAgentClient;
    /**
     * Execute a task with the agent
     */
    execute(optionsOrInstruction: AgentExecuteOptions | string): Promise<AgentResult>;
    /**
     * Execute a single action on the page
     */
    private executeAction;
    private updateClientViewport;
    private updateClientUrl;
    getAgent(): StagehandAgent;
    getClient(): AgentClient;
    captureAndSendScreenshot(): Promise<unknown>;
    /**
     * Inject a cursor element into the page for visual feedback
     */
    private injectCursor;
    /**
     * Update the cursor position on the page
     */
    private updateCursorPosition;
    /**
     * Animate a click at the given position
     */
    private animateClick;
    private get page();
    /**
     * Set the screenshot collector for this agent handler
     */
    setScreenshotCollector(collector: any): void;
    /**
     * Get the screenshot collector
     */
    getScreenshotCollector(): any;
}
