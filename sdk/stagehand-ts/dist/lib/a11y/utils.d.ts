import { AccessibilityNode, TreeResult, BackendIdMaps, CombinedA11yResult, EncodedId } from "../../types/context";
import { StagehandPage } from "../StagehandPage";
import { LogLine } from "../../types/log";
import { Frame } from "playwright";
/**
 * Clean a string by removing private-use unicode characters, normalizing whitespace,
 * and trimming the result.
 *
 * @param input - The text to clean, potentially containing PUA and NBSP characters.
 * @returns A cleaned string with PUA characters removed, NBSP variants collapsed,
 *          consecutive spaces merged, and leading/trailing whitespace trimmed.
 */
export declare function cleanText(input: string): string;
/**
 * Generate a human-readable, indented outline of an accessibility node tree.
 *
 * @param node - The accessibility node to format, optionally with an encodedId.
 * @param level - The current depth level for indentation (used internally).
 * @returns A string representation of the node and its descendants, with one node per line.
 */
export declare function formatSimplifiedTree(node: AccessibilityNode & {
    encodedId?: EncodedId;
}, level?: number): string;
/**
 * Build mappings from CDP backendNodeIds to HTML tag names and relative XPaths.
 *
 * @param experimental - Whether to use experimental behaviour.
 * @param sp - The StagehandPage wrapper for Playwright and CDP calls.
 * @param targetFrame - Optional Playwright.Frame whose DOM subtree to map; defaults to main frame.
 * @returns A Promise resolving to BackendIdMaps containing tagNameMap and xpathMap.
 */
export declare function buildBackendIdMaps(experimental: boolean, sp: StagehandPage, targetFrame?: Frame): Promise<BackendIdMaps>;
/**
 * Convert a flat array of AccessibilityNodes into a cleaned, hierarchical tree.
 * Nodes are pruned, structural wrappers removed, and each kept node is stamped
 * with its EncodedId for later lookup or subtree injection.
 *
 * @param nodes - Raw flat list of AX nodes retrieved via CDP.
 * @param tagNameMap - Mapping of EncodedId to HTML tag names for structural decisions.
 * @param logger - Optional function for logging diagnostic messages.
 * @param xpathMap - Optional mapping of EncodedId to relative XPath for element lookup.
 * @returns A Promise resolving to a TreeResult with cleaned tree, simplified text outline,
 *          iframe list, URL map, and inherited xpathMap.
 */
export declare function buildHierarchicalTree(nodes: AccessibilityNode[], tagNameMap: Record<EncodedId, string>, logger?: (l: LogLine) => void, xpathMap?: Record<EncodedId, string>): Promise<TreeResult>;
/**
 * Resolve the CDP frame identifier for a Playwright Frame, handling same-process and OOPIF.
 *
 * @param sp - The StagehandPage instance for issuing CDP commands.
 * @param frame - The target Playwright.Frame; undefined or main frame yields undefined.
 * @returns A Promise resolving to the CDP frameId string, or undefined for main document.
 */
export declare function getCDPFrameId(sp: StagehandPage, frame?: Frame): Promise<string | undefined>;
/**
 * Retrieve and build a cleaned accessibility tree for a document or specific iframe.
 * Prunes, formats, and optionally filters by XPath, including scrollable role decoration.
 *
 * @param stagehandPage - The StagehandPage instance for Playwright and CDP interaction.
 * @param logger - Logging function for diagnostics and performance metrics.
 * @param selector - Optional XPath to filter the AX tree to a specific subtree.
 * @param targetFrame - Optional Playwright.Frame to scope the AX tree retrieval.
 * @returns A Promise resolving to a TreeResult with the hierarchical AX tree and related metadata.
 */
export declare function getAccessibilityTree(experimental: boolean, stagehandPage: StagehandPage, logger: (log: LogLine) => void, selector?: string, targetFrame?: Frame): Promise<TreeResult>;
/**
 * Get the backendNodeId of the iframe element that contains a given Playwright.Frame.
 *
 * @param sp - The StagehandPage instance for issuing CDP commands.
 * @param frame - The Playwright.Frame whose host iframe element to locate.
 * @returns A Promise resolving to the backendNodeId of the iframe element, or null if not applicable.
 */
export declare function getFrameRootBackendNodeId(sp: StagehandPage, frame: Frame | undefined): Promise<number | null>;
/**
 * Compute the absolute XPath for the iframe element hosting a given Playwright.Frame.
 *
 * @param frame - The Playwright.Frame whose iframe element to locate.
 * @returns A Promise resolving to the XPath of the iframe element, or "/" if no frame provided.
 */
export declare function getFrameRootXpathWithShadow(frame: Frame | undefined): Promise<string>;
export declare function getFrameRootXpath(frame: Frame | undefined): Promise<string>;
/**
 * Inject simplified subtree outlines into the main frame outline for nested iframes.
 * Walks the main tree text, looks for EncodedId labels, and inserts matching subtrees.
 *
 * @param tree - The indented AX outline of the main frame.
 * @param idToTree - Map of EncodedId to subtree outlines for nested frames.
 * @returns A single combined text outline with iframe subtrees injected.
 */
export declare function injectSubtrees(tree: string, idToTree: Map<EncodedId, string>): string;
/**
 * Retrieve and merge accessibility trees for the main document and nested iframes.
 * Walks through frame chains if a root XPath is provided, then stitches subtree outlines.
 *
 * @param stagehandPage - The StagehandPage instance for Playwright and CDP interaction.
 * @param logger - Logging function for diagnostics and performance.
 * @param rootXPath - Optional absolute XPath to focus the crawl on a subtree across frames.
 * @returns A Promise resolving to CombinedA11yResult with combined tree text, xpath map, and URL map.
 */
export declare function getAccessibilityTreeWithFrames(experimental: boolean, stagehandPage: StagehandPage, logger: (l: LogLine) => void, rootXPath?: string): Promise<CombinedA11yResult>;
/**
 * `findScrollableElementIds` is a function that identifies elements in
 * the browser that are deemed "scrollable". At a high level, it does the
 * following:
 * - Calls the browser-side `window.getScrollableElementXpaths()` function,
 *   which returns a list of XPaths for scrollable containers.
 * - Iterates over the returned list of XPaths, locating each element in the DOM
 *   using `stagehandPage.sendCDP(...)`
 *     - During each iteration, we call `Runtime.evaluate` to run `document.evaluate(...)`
 *       with each XPath, obtaining a `RemoteObject` reference if it exists.
 *     - Then, for each valid object reference, we call `DOM.describeNode` to retrieve
 *       the element’s `backendNodeId`.
 * - Collects all resulting `backendNodeId`s in a Set and returns them.
 *
 * @param stagehandPage - A StagehandPage instance with built-in CDP helpers.
 * @returns A Promise that resolves to a Set of unique `backendNodeId`s corresponding
 *          to scrollable elements in the DOM.
 */
export declare function findScrollableElementIds(stagehandPage: StagehandPage, targetFrame?: Frame): Promise<Set<number>>;
/**
 * Resolve an XPath to a Chrome-DevTools-Protocol (CDP) remote-object ID.
 *
 * @param page     A StagehandPage (or Playwright.Page with .sendCDP)
 * @param xpath    An absolute or relative XPath
 * @returns        The remote objectId for the matched node, or null
 */
export declare function resolveObjectIdForXPath(page: StagehandPage, xpath: string, targetFrame?: Frame): Promise<string | null>;
/**
 * Resolve a chain of iframe frames from an absolute XPath, returning the frame sequence and inner XPath.
 *
 * This helper walks an XPath expression containing iframe steps (e.g., '/html/body/iframe[2]/...'),
 * descending into each matching iframe element to build a frame chain, and returns the leftover
 * XPath segment to evaluate within the context of the last iframe.
 *
 * @param sp - The StagehandPage instance for evaluating XPath and locating frames.
 * @param absPath - An absolute XPath expression starting with '/', potentially including iframe steps.
 * @returns An object containing:
 *   frames: Array of Frame objects representing each iframe in the chain.
 *   rest: The remaining XPath string to evaluate inside the final iframe.
 * @throws Error if an iframe cannot be found or the final XPath cannot be resolved.
 */
export declare function resolveFrameChain(sp: StagehandPage, absPath: string): Promise<{
    frames: Frame[];
    rest: string;
}>;
