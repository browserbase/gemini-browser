/**
 * This file is responsible for:
 * - Loading and parsing the `evals.config.json` file, which defines tasks (evaluations) and their associated categories.
 * - Building a lookup structure (`tasksByName`) to map each task name to its categories.
 * - Filtering tasks based on command-line arguments (e.g., `filterByEvalName`) and ensuring that requested tasks exist.
 * - Determining which models to use for evaluations, depending on the category and environment variables.
 * - Validating that the chosen models are supported.
 *
 * The exported objects (`tasksByName`, `MODELS`, `config`) are used by the main evaluation script and other modules
 * to know which tasks and models are available, and to configure the evaluations accordingly.
 */
import { AvailableModel } from "@browserbasehq/stagehand";
/**
 * The `tasksConfig` defines all tasks from the config file. Each task has a name and categories.
 * We create a mapping `tasksByName` from task name to its categories for quick lookup.
 */
type TaskConfig = {
    name: string;
    categories: string[];
};
declare const tasksConfig: TaskConfig[];
declare const tasksByName: Record<string, {
    categories: string[];
}>;
/**
 * getModelList:
 * Returns a list of models to be used for the given category.
 * If category is "experimental", it merges DEFAULT_EVAL_MODELS and EXPERIMENTAL_EVAL_MODELS.
 * Otherwise, returns DEFAULT_EVAL_MODELS filtered by provider if specified.
 */
declare const getModelList: (category?: string) => string[];
declare const MODELS: AvailableModel[];
export { tasksByName, MODELS, tasksConfig, getModelList };
