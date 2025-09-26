import { Page, Locator, FrameLocator } from "playwright";
import { MethodHandlerContext } from "@/types/act";
export declare function deepLocatorWithShadow(root: Page | FrameLocator, xpath: string): Promise<Locator>;
export declare function deepLocator(root: Page | FrameLocator, xpath: string): Locator;
/**
 * A mapping of playwright methods that may be chosen by the LLM to their
 * implementation.
 */
export declare const methodHandlerMap: Record<string, (ctx: MethodHandlerContext) => Promise<void>>;
export declare function scrollToNextChunk(ctx: MethodHandlerContext): Promise<void>;
export declare function scrollToPreviousChunk(ctx: MethodHandlerContext): Promise<void>;
export declare function scrollElementIntoView(ctx: MethodHandlerContext): Promise<void>;
export declare function scrollElementToPercentage(ctx: MethodHandlerContext): Promise<void>;
export declare function fillOrType(ctx: MethodHandlerContext): Promise<void>;
export declare function pressKey(ctx: MethodHandlerContext): Promise<void>;
export declare function selectOption(ctx: MethodHandlerContext): Promise<void>;
export declare function clickElement(ctx: MethodHandlerContext): Promise<void>;
/**
 * Fallback method: if method is not in our map but *is* a valid Playwright locator method.
 */
export declare function fallbackLocatorMethod(ctx: MethodHandlerContext): Promise<void>;
