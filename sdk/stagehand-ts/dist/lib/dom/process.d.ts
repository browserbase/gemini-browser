/**
 * Finds and returns a list of scrollable elements on the page,
 * ordered from the element with the largest scrollHeight to the smallest.
 *
 * @param topN Optional maximum number of scrollable elements to return.
 *             If not provided, all found scrollable elements are returned.
 * @returns An array of HTMLElements sorted by descending scrollHeight.
 */
export declare function getScrollableElements(topN?: number): HTMLElement[];
/**
 * Calls getScrollableElements, then for each element calls generateXPaths,
 * and returns the first XPath for each.
 *
 * @param topN (optional) integer limit on how many scrollable elements to process
 * @returns string[] list of XPaths (1 for each scrollable element)
 */
export declare function getScrollableElementXpaths(topN?: number): Promise<string[]>;
