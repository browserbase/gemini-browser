import { ZodError } from "zod/v3";
export declare class StagehandError extends Error {
    constructor(message: string);
}
export declare class StagehandDefaultError extends StagehandError {
    constructor(error?: unknown);
}
export declare class StagehandEnvironmentError extends StagehandError {
    constructor(currentEnvironment: string, requiredEnvironment: string, feature: string);
}
export declare class MissingEnvironmentVariableError extends StagehandError {
    constructor(missingEnvironmentVariable: string, feature: string);
}
export declare class UnsupportedModelError extends StagehandError {
    constructor(supportedModels: string[], feature?: string);
}
export declare class UnsupportedModelProviderError extends StagehandError {
    constructor(supportedProviders: string[], feature?: string);
}
export declare class UnsupportedAISDKModelProviderError extends StagehandError {
    constructor(provider: string, supportedProviders: string[]);
}
export declare class InvalidAISDKModelFormatError extends StagehandError {
    constructor(modelName: string);
}
export declare class StagehandNotInitializedError extends StagehandError {
    constructor(prop: string);
}
export declare class BrowserbaseSessionNotFoundError extends StagehandError {
    constructor();
}
export declare class CaptchaTimeoutError extends StagehandError {
    constructor();
}
export declare class MissingLLMConfigurationError extends StagehandError {
    constructor();
}
export declare class HandlerNotInitializedError extends StagehandError {
    constructor(handlerType: string);
}
export declare class StagehandInvalidArgumentError extends StagehandError {
    constructor(message: string);
}
export declare class StagehandElementNotFoundError extends StagehandError {
    constructor(xpaths: string[]);
}
export declare class AgentScreenshotProviderError extends StagehandError {
    constructor(message: string);
}
export declare class StagehandMissingArgumentError extends StagehandError {
    constructor(message: string);
}
export declare class CreateChatCompletionResponseError extends StagehandError {
    constructor(message: string);
}
export declare class StagehandEvalError extends StagehandError {
    constructor(message: string);
}
export declare class StagehandDomProcessError extends StagehandError {
    constructor(message: string);
}
export declare class StagehandClickError extends StagehandError {
    constructor(message: string, selector: string);
}
export declare class LLMResponseError extends StagehandError {
    constructor(primitive: string, message: string);
}
export declare class StagehandIframeError extends StagehandError {
    constructor(frameUrl: string, message: string);
}
export declare class ContentFrameNotFoundError extends StagehandError {
    constructor(selector: string);
}
export declare class XPathResolutionError extends StagehandError {
    constructor(xpath: string);
}
export declare class ExperimentalApiConflictError extends StagehandError {
    constructor();
}
export declare class ExperimentalNotConfiguredError extends StagehandError {
    constructor(featureName: string);
}
export declare class ZodSchemaValidationError extends Error {
    readonly received: unknown;
    readonly issues: ReturnType<ZodError["format"]>;
    constructor(received: unknown, issues: ReturnType<ZodError["format"]>);
}
export declare class StagehandInitError extends StagehandError {
    constructor(message: string);
}
export declare class StagehandShadowRootMissingError extends StagehandError {
    constructor(detail?: string);
}
export declare class StagehandShadowSegmentEmptyError extends StagehandError {
    constructor();
}
export declare class StagehandShadowSegmentNotFoundError extends StagehandError {
    constructor(segment: string, hint?: string);
}
