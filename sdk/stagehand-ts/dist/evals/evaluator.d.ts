/**
 * This class is responsible for evaluating the result of an agentic task.
 * The first version includes a VLM evaluator specifically prompted to evaluate the state of a task
 * usually represented as a screenshot.
 * The evaluator will reply with YES or NO given the state of the provided task.
 */
import { AvailableModel, ClientOptions, Stagehand } from "@browserbasehq/stagehand";
import { EvaluateOptions, BatchAskOptions, EvaluationResult } from "@/types/evaluator";
export declare class Evaluator {
    private stagehand;
    private modelName;
    private modelClientOptions;
    private silentLogger;
    constructor(stagehand: Stagehand, modelName?: AvailableModel, modelClientOptions?: ClientOptions);
    ask(options: EvaluateOptions): Promise<EvaluationResult>;
    /**
     * Evaluates multiple questions with optional answers and/or screenshot.
     * Similar to ask() but processes multiple questions in a single call.
     * Returns an array of evaluation results.
     *
     * @param options - The options for batch evaluation
     * @returns A promise that resolves to an array of EvaluationResults
     */
    batchAsk(options: BatchAskOptions): Promise<EvaluationResult[]>;
    /**
     * Private method to evaluate with multiple screenshots
     */
    private _evaluateWithMultipleScreenshots;
}
