/**
 * Appends a new entry to the act_summary.json file, then writes the file back out.
 */
export declare function appendSummary<T>(inferenceType: string, entry: T): void;
/**
 * Writes `data` as JSON into a file in `directory`, using a prefix plus timestamp.
 * Returns both the file name and the timestamp used, so you can log them.
 */
export declare function writeTimestampedTxtFile(directory: string, prefix: string, data: unknown): {
    fileName: string;
    timestamp: string;
};
