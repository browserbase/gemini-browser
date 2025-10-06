declare const parsedArgs: {
    evalName?: string;
    env?: string;
    api?: string;
    trials?: number;
    concurrency?: number;
    provider?: string;
    dataset?: string;
    max_k?: number;
    leftover: string[];
};
declare const DEFAULT_EVAL_CATEGORIES: string[];
declare let filterByCategory: string | null;
declare let filterByEvalName: string | null;
export { filterByCategory, filterByEvalName, DEFAULT_EVAL_CATEGORIES, parsedArgs, };
