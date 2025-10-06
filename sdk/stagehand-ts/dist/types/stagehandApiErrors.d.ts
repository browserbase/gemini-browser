export declare class StagehandAPIError extends Error {
    constructor(message: string);
}
export declare class StagehandAPIUnauthorizedError extends StagehandAPIError {
    constructor(message?: string);
}
export declare class StagehandHttpError extends StagehandAPIError {
    constructor(message: string);
}
export declare class StagehandServerError extends StagehandAPIError {
    constructor(message: string);
}
export declare class StagehandResponseBodyError extends StagehandAPIError {
    constructor();
}
export declare class StagehandResponseParseError extends StagehandAPIError {
    constructor(message: string);
}
