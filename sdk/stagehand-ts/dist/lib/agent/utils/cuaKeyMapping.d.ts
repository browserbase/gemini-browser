/**
 * Universal key mapping utility for converting various key representations
 * to Playwright-compatible key names. Used by all CUA clients and handlers.
 */
/**
 * Maps a key name from various formats to Playwright-compatible format
 * @param key The key name in any supported format
 * @returns The Playwright-compatible key name
 */
export declare function mapKeyToPlaywright(key: string): string;
