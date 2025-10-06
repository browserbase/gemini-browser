import { Page } from "@playwright/test";
export interface ScreenshotCollectorOptions {
    interval?: number;
    maxScreenshots?: number;
    captureOnNavigation?: boolean;
}
export declare class ScreenshotCollector {
    private screenshots;
    private page;
    private interval;
    private maxScreenshots;
    private captureOnNavigation;
    private intervalId?;
    private navigationListeners;
    private isCapturing;
    private lastScreenshot?;
    private ssimThreshold;
    private mseThreshold;
    constructor(page: Page, options?: ScreenshotCollectorOptions);
    start(): void;
    stop(): Buffer[];
    private captureScreenshot;
    getScreenshots(): Buffer[];
    getScreenshotCount(): number;
    clear(): void;
    /**
     * Manually add a screenshot to the collection
     * @param screenshot The screenshot buffer to add
     * @param source Optional source identifier for logging
     */
    addScreenshot(screenshot: Buffer): Promise<void>;
    private calculateMSE;
    private calculateSSIM;
}
