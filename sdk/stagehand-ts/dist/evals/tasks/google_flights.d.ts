import { EvalFunction } from "@/types/evals";
/**
 * This eval attempts to click on an element that should not pass the playwright actionability check
 * which happens by default if you call locator.click (more information here:
 * https://playwright.dev/docs/actionability)
 *
 * If this eval passes, it means that we have correctly set {force: true} in performPlaywrightMethod,
 * and the click was successful even though the target element (found by the xpath) did not
 * pass the actionability check.
 */
export declare const google_flights: EvalFunction;
