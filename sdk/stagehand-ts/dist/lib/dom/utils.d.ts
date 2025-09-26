/**
 * Tests if the element actually responds to .scrollTo(...)
 * and that scrollTop changes as expected.
 */
export declare function canElementScroll(elem: HTMLElement): boolean;
export declare function getNodeFromXpath(xpath: string): Node;
export declare function waitForElementScrollEnd(element: HTMLElement, idleMs?: number): Promise<void>;
