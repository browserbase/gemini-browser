var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __reflectGet = Reflect.get;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name14 in all)
    __defProp(target, name14, { get: all[name14], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __superGet = (cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve2, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/.pnpm/secure-json-parse@2.7.0/node_modules/secure-json-parse/index.js
var require_secure_json_parse = __commonJS({
  "node_modules/.pnpm/secure-json-parse@2.7.0/node_modules/secure-json-parse/index.js"(exports2, module2) {
    "use strict";
    var hasBuffer = typeof Buffer !== "undefined";
    var suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
    var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
    function _parse(text, reviver, options) {
      if (options == null) {
        if (reviver !== null && typeof reviver === "object") {
          options = reviver;
          reviver = void 0;
        }
      }
      if (hasBuffer && Buffer.isBuffer(text)) {
        text = text.toString();
      }
      if (text && text.charCodeAt(0) === 65279) {
        text = text.slice(1);
      }
      const obj = JSON.parse(text, reviver);
      if (obj === null || typeof obj !== "object") {
        return obj;
      }
      const protoAction = options && options.protoAction || "error";
      const constructorAction = options && options.constructorAction || "error";
      if (protoAction === "ignore" && constructorAction === "ignore") {
        return obj;
      }
      if (protoAction !== "ignore" && constructorAction !== "ignore") {
        if (suspectProtoRx.test(text) === false && suspectConstructorRx.test(text) === false) {
          return obj;
        }
      } else if (protoAction !== "ignore" && constructorAction === "ignore") {
        if (suspectProtoRx.test(text) === false) {
          return obj;
        }
      } else {
        if (suspectConstructorRx.test(text) === false) {
          return obj;
        }
      }
      return filter(obj, { protoAction, constructorAction, safe: options && options.safe });
    }
    function filter(obj, { protoAction = "error", constructorAction = "error", safe } = {}) {
      let next = [obj];
      while (next.length) {
        const nodes = next;
        next = [];
        for (const node of nodes) {
          if (protoAction !== "ignore" && Object.prototype.hasOwnProperty.call(node, "__proto__")) {
            if (safe === true) {
              return null;
            } else if (protoAction === "error") {
              throw new SyntaxError("Object contains forbidden prototype property");
            }
            delete node.__proto__;
          }
          if (constructorAction !== "ignore" && Object.prototype.hasOwnProperty.call(node, "constructor") && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
            if (safe === true) {
              return null;
            } else if (constructorAction === "error") {
              throw new SyntaxError("Object contains forbidden prototype property");
            }
            delete node.constructor;
          }
          for (const key in node) {
            const value = node[key];
            if (value && typeof value === "object") {
              next.push(value);
            }
          }
        }
      }
      return obj;
    }
    function parse2(text, reviver, options) {
      const stackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 0;
      try {
        return _parse(text, reviver, options);
      } finally {
        Error.stackTraceLimit = stackTraceLimit;
      }
    }
    function safeParse(text, reviver) {
      const stackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 0;
      try {
        return _parse(text, reviver, { safe: true });
      } catch (_e) {
        return null;
      } finally {
        Error.stackTraceLimit = stackTraceLimit;
      }
    }
    module2.exports = parse2;
    module2.exports.default = parse2;
    module2.exports.parse = parse2;
    module2.exports.safeParse = safeParse;
    module2.exports.scan = filter;
  }
});

// node_modules/.pnpm/partial-json@0.1.7/node_modules/partial-json/dist/options.js
var require_options = __commonJS({
  "node_modules/.pnpm/partial-json@0.1.7/node_modules/partial-json/dist/options.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Allow = exports2.ALL = exports2.COLLECTION = exports2.ATOM = exports2.SPECIAL = exports2.INF = exports2._INFINITY = exports2.INFINITY = exports2.NAN = exports2.BOOL = exports2.NULL = exports2.OBJ = exports2.ARR = exports2.NUM = exports2.STR = void 0;
    exports2.STR = 1;
    exports2.NUM = 2;
    exports2.ARR = 4;
    exports2.OBJ = 8;
    exports2.NULL = 16;
    exports2.BOOL = 32;
    exports2.NAN = 64;
    exports2.INFINITY = 128;
    exports2._INFINITY = 256;
    exports2.INF = exports2.INFINITY | exports2._INFINITY;
    exports2.SPECIAL = exports2.NULL | exports2.BOOL | exports2.INF | exports2.NAN;
    exports2.ATOM = exports2.STR | exports2.NUM | exports2.SPECIAL;
    exports2.COLLECTION = exports2.ARR | exports2.OBJ;
    exports2.ALL = exports2.ATOM | exports2.COLLECTION;
    exports2.Allow = { STR: exports2.STR, NUM: exports2.NUM, ARR: exports2.ARR, OBJ: exports2.OBJ, NULL: exports2.NULL, BOOL: exports2.BOOL, NAN: exports2.NAN, INFINITY: exports2.INFINITY, _INFINITY: exports2._INFINITY, INF: exports2.INF, SPECIAL: exports2.SPECIAL, ATOM: exports2.ATOM, COLLECTION: exports2.COLLECTION, ALL: exports2.ALL };
    exports2.default = exports2.Allow;
  }
});

// node_modules/.pnpm/partial-json@0.1.7/node_modules/partial-json/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/partial-json@0.1.7/node_modules/partial-json/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Allow = exports2.MalformedJSON = exports2.PartialJSON = exports2.parseJSON = exports2.parse = void 0;
    var options_1 = require_options();
    Object.defineProperty(exports2, "Allow", { enumerable: true, get: function() {
      return options_1.Allow;
    } });
    __exportStar(require_options(), exports2);
    var PartialJSON = class extends Error {
    };
    exports2.PartialJSON = PartialJSON;
    var MalformedJSON = class extends Error {
    };
    exports2.MalformedJSON = MalformedJSON;
    function parseJSON2(jsonString, allowPartial = options_1.Allow.ALL) {
      if (typeof jsonString !== "string") {
        throw new TypeError(`expecting str, got ${typeof jsonString}`);
      }
      if (!jsonString.trim()) {
        throw new Error(`${jsonString} is empty`);
      }
      return _parseJSON(jsonString.trim(), allowPartial);
    }
    exports2.parseJSON = parseJSON2;
    var _parseJSON = (jsonString, allow) => {
      const length = jsonString.length;
      let index = 0;
      const markPartialJSON = (msg) => {
        throw new PartialJSON(`${msg} at position ${index}`);
      };
      const throwMalformedError = (msg) => {
        throw new MalformedJSON(`${msg} at position ${index}`);
      };
      const parseAny = () => {
        skipBlank();
        if (index >= length)
          markPartialJSON("Unexpected end of input");
        if (jsonString[index] === '"')
          return parseStr();
        if (jsonString[index] === "{")
          return parseObj();
        if (jsonString[index] === "[")
          return parseArr();
        if (jsonString.substring(index, index + 4) === "null" || options_1.Allow.NULL & allow && length - index < 4 && "null".startsWith(jsonString.substring(index))) {
          index += 4;
          return null;
        }
        if (jsonString.substring(index, index + 4) === "true" || options_1.Allow.BOOL & allow && length - index < 4 && "true".startsWith(jsonString.substring(index))) {
          index += 4;
          return true;
        }
        if (jsonString.substring(index, index + 5) === "false" || options_1.Allow.BOOL & allow && length - index < 5 && "false".startsWith(jsonString.substring(index))) {
          index += 5;
          return false;
        }
        if (jsonString.substring(index, index + 8) === "Infinity" || options_1.Allow.INFINITY & allow && length - index < 8 && "Infinity".startsWith(jsonString.substring(index))) {
          index += 8;
          return Infinity;
        }
        if (jsonString.substring(index, index + 9) === "-Infinity" || options_1.Allow._INFINITY & allow && 1 < length - index && length - index < 9 && "-Infinity".startsWith(jsonString.substring(index))) {
          index += 9;
          return -Infinity;
        }
        if (jsonString.substring(index, index + 3) === "NaN" || options_1.Allow.NAN & allow && length - index < 3 && "NaN".startsWith(jsonString.substring(index))) {
          index += 3;
          return NaN;
        }
        return parseNum();
      };
      const parseStr = () => {
        const start = index;
        let escape = false;
        index++;
        while (index < length && (jsonString[index] !== '"' || escape && jsonString[index - 1] === "\\")) {
          escape = jsonString[index] === "\\" ? !escape : false;
          index++;
        }
        if (jsonString.charAt(index) == '"') {
          try {
            return JSON.parse(jsonString.substring(start, ++index - Number(escape)));
          } catch (e) {
            throwMalformedError(String(e));
          }
        } else if (options_1.Allow.STR & allow) {
          try {
            return JSON.parse(jsonString.substring(start, index - Number(escape)) + '"');
          } catch (e) {
            return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("\\")) + '"');
          }
        }
        markPartialJSON("Unterminated string literal");
      };
      const parseObj = () => {
        index++;
        skipBlank();
        const obj = {};
        try {
          while (jsonString[index] !== "}") {
            skipBlank();
            if (index >= length && options_1.Allow.OBJ & allow)
              return obj;
            const key = parseStr();
            skipBlank();
            index++;
            try {
              const value = parseAny();
              obj[key] = value;
            } catch (e) {
              if (options_1.Allow.OBJ & allow)
                return obj;
              else
                throw e;
            }
            skipBlank();
            if (jsonString[index] === ",")
              index++;
          }
        } catch (e) {
          if (options_1.Allow.OBJ & allow)
            return obj;
          else
            markPartialJSON("Expected '}' at end of object");
        }
        index++;
        return obj;
      };
      const parseArr = () => {
        index++;
        const arr = [];
        try {
          while (jsonString[index] !== "]") {
            arr.push(parseAny());
            skipBlank();
            if (jsonString[index] === ",") {
              index++;
            }
          }
        } catch (e) {
          if (options_1.Allow.ARR & allow) {
            return arr;
          }
          markPartialJSON("Expected ']' at end of array");
        }
        index++;
        return arr;
      };
      const parseNum = () => {
        if (index === 0) {
          if (jsonString === "-")
            throwMalformedError("Not sure what '-' is");
          try {
            return JSON.parse(jsonString);
          } catch (e) {
            if (options_1.Allow.NUM & allow)
              try {
                return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf("e")));
              } catch (e2) {
              }
            throwMalformedError(String(e));
          }
        }
        const start = index;
        if (jsonString[index] === "-")
          index++;
        while (jsonString[index] && ",]}".indexOf(jsonString[index]) === -1)
          index++;
        if (index == length && !(options_1.Allow.NUM & allow))
          markPartialJSON("Unterminated number literal");
        try {
          return JSON.parse(jsonString.substring(start, index));
        } catch (e) {
          if (jsonString.substring(start, index) === "-")
            markPartialJSON("Not sure what '-' is");
          try {
            return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("e")));
          } catch (e2) {
            throwMalformedError(String(e2));
          }
        }
      };
      const skipBlank = () => {
        while (index < length && " \n\r	".includes(jsonString[index])) {
          index++;
        }
      };
      return parseAny();
    };
    var parse2 = parseJSON2;
    exports2.parse = parse2;
  }
});

// lib/index.ts
var index_exports = {};
__export(index_exports, {
  AgentScreenshotProviderError: () => AgentScreenshotProviderError,
  AnnotatedScreenshotText: () => AnnotatedScreenshotText,
  AvailableModelSchema: () => AvailableModelSchema,
  BrowserbaseSessionNotFoundError: () => BrowserbaseSessionNotFoundError,
  CaptchaTimeoutError: () => CaptchaTimeoutError,
  ContentFrameNotFoundError: () => ContentFrameNotFoundError,
  CreateChatCompletionResponseError: () => CreateChatCompletionResponseError,
  ExperimentalApiConflictError: () => ExperimentalApiConflictError,
  ExperimentalNotConfiguredError: () => ExperimentalNotConfiguredError,
  HandlerNotInitializedError: () => HandlerNotInitializedError,
  InvalidAISDKModelFormatError: () => InvalidAISDKModelFormatError,
  LLMClient: () => LLMClient,
  LLMResponseError: () => LLMResponseError,
  LOG_LEVEL_NAMES: () => LOG_LEVEL_NAMES,
  MissingEnvironmentVariableError: () => MissingEnvironmentVariableError,
  MissingLLMConfigurationError: () => MissingLLMConfigurationError,
  PlaywrightCommandException: () => PlaywrightCommandException,
  PlaywrightCommandMethodNotSupportedException: () => PlaywrightCommandMethodNotSupportedException,
  Stagehand: () => Stagehand3,
  StagehandAPIError: () => StagehandAPIError,
  StagehandAPIUnauthorizedError: () => StagehandAPIUnauthorizedError,
  StagehandClickError: () => StagehandClickError,
  StagehandDefaultError: () => StagehandDefaultError,
  StagehandDomProcessError: () => StagehandDomProcessError,
  StagehandElementNotFoundError: () => StagehandElementNotFoundError,
  StagehandEnvironmentError: () => StagehandEnvironmentError,
  StagehandError: () => StagehandError,
  StagehandEvalError: () => StagehandEvalError,
  StagehandFunctionName: () => StagehandFunctionName,
  StagehandHttpError: () => StagehandHttpError,
  StagehandIframeError: () => StagehandIframeError,
  StagehandInitError: () => StagehandInitError,
  StagehandInvalidArgumentError: () => StagehandInvalidArgumentError,
  StagehandMissingArgumentError: () => StagehandMissingArgumentError,
  StagehandNotInitializedError: () => StagehandNotInitializedError,
  StagehandResponseBodyError: () => StagehandResponseBodyError,
  StagehandResponseParseError: () => StagehandResponseParseError,
  StagehandServerError: () => StagehandServerError,
  StagehandShadowRootMissingError: () => StagehandShadowRootMissingError,
  StagehandShadowSegmentEmptyError: () => StagehandShadowSegmentEmptyError,
  StagehandShadowSegmentNotFoundError: () => StagehandShadowSegmentNotFoundError,
  UnsupportedAISDKModelProviderError: () => UnsupportedAISDKModelProviderError,
  UnsupportedModelError: () => UnsupportedModelError,
  UnsupportedModelProviderError: () => UnsupportedModelProviderError,
  XPathResolutionError: () => XPathResolutionError,
  ZodSchemaValidationError: () => ZodSchemaValidationError,
  defaultExtractSchema: () => defaultExtractSchema,
  operatorResponseSchema: () => operatorResponseSchema,
  operatorSummarySchema: () => operatorSummarySchema,
  pageTextSchema: () => pageTextSchema
});
module.exports = __toCommonJS(index_exports);
var import_sdk3 = require("@browserbasehq/sdk");
var import_playwright3 = require("playwright");
var import_dotenv = __toESM(require("dotenv"));
var import_fs2 = __toESM(require("fs"));
var import_os = __toESM(require("os"));
var import_path2 = __toESM(require("path"));

// types/stagehand.ts
var StagehandFunctionName = /* @__PURE__ */ ((StagehandFunctionName2) => {
  StagehandFunctionName2["ACT"] = "ACT";
  StagehandFunctionName2["EXTRACT"] = "EXTRACT";
  StagehandFunctionName2["OBSERVE"] = "OBSERVE";
  StagehandFunctionName2["AGENT"] = "AGENT";
  return StagehandFunctionName2;
})(StagehandFunctionName || {});

// types/page.ts
var import_v3 = require("zod/v3");
var defaultExtractSchema = import_v3.z.object({
  extraction: import_v3.z.string()
});
var pageTextSchema = import_v3.z.object({
  page_text: import_v3.z.string()
});

// types/playwright.ts
var PlaywrightCommandException = class extends Error {
  constructor(message) {
    super(message);
    this.name = "PlaywrightCommandException";
  }
};
var PlaywrightCommandMethodNotSupportedException = class extends Error {
  constructor(message) {
    super(message);
    this.name = "PlaywrightCommandMethodNotSupportedException";
  }
};

// types/act.ts
var SupportedPlaywrightAction = /* @__PURE__ */ ((SupportedPlaywrightAction2) => {
  SupportedPlaywrightAction2["CLICK"] = "click";
  SupportedPlaywrightAction2["FILL"] = "fill";
  SupportedPlaywrightAction2["TYPE"] = "type";
  SupportedPlaywrightAction2["PRESS"] = "press";
  SupportedPlaywrightAction2["SCROLL"] = "scrollTo";
  SupportedPlaywrightAction2["NEXT_CHUNK"] = "nextChunk";
  SupportedPlaywrightAction2["PREV_CHUNK"] = "prevChunk";
  SupportedPlaywrightAction2["SELECT_OPTION_FROM_DROPDOWN"] = "selectOptionFromDropdown";
  return SupportedPlaywrightAction2;
})(SupportedPlaywrightAction || {});

// lib/prompt.ts
function buildUserInstructionsString(userProvidedInstructions) {
  if (!userProvidedInstructions) {
    return "";
  }
  return `

# Custom Instructions Provided by the User
    
Please keep the user's instructions in mind when performing actions. If the user's instructions are not relevant to the current task, ignore them.

User Instructions:
${userProvidedInstructions}`;
}
function buildExtractSystemPrompt(isUsingPrintExtractedDataTool = false, userProvidedInstructions) {
  const baseContent = `You are extracting content on behalf of a user.
  If a user asks you to extract a 'list' of information, or 'all' information, 
  YOU MUST EXTRACT ALL OF THE INFORMATION THAT THE USER REQUESTS.
   
  You will be given:
1. An instruction
2. `;
  const contentDetail = `A list of DOM elements to extract from.`;
  const instructions = `
Print the exact text from the DOM elements with all symbols, characters, and endlines as is.
Print null or an empty string if no new information is found.
  `.trim();
  const toolInstructions = isUsingPrintExtractedDataTool ? `
ONLY print the content using the print_extracted_data tool provided.
ONLY print the content using the print_extracted_data tool provided.
  `.trim() : "";
  const additionalInstructions = "If a user is attempting to extract links or URLs, you MUST respond with ONLY the IDs of the link elements. \nDo not attempt to extract links directly from the text unless absolutely necessary. ";
  const userInstructions = buildUserInstructionsString(
    userProvidedInstructions
  );
  const content = `${baseContent}${contentDetail}

${instructions}
${toolInstructions}${additionalInstructions ? `

${additionalInstructions}` : ""}${userInstructions ? `

${userInstructions}` : ""}`.replace(/\s+/g, " ");
  return {
    role: "system",
    content
  };
}
function buildExtractUserPrompt(instruction, domElements, isUsingPrintExtractedDataTool = false) {
  let content = `Instruction: ${instruction}
DOM: ${domElements}`;
  if (isUsingPrintExtractedDataTool) {
    content += `
ONLY print the content using the print_extracted_data tool provided.
ONLY print the content using the print_extracted_data tool provided.`;
  }
  return {
    role: "user",
    content
  };
}
var metadataSystemPrompt = `You are an AI assistant tasked with evaluating the progress and completion status of an extraction task.
Analyze the extraction response and determine if the task is completed or if more information is needed.
Strictly abide by the following criteria:
1. Once the instruction has been satisfied by the current extraction response, ALWAYS set completion status to true and stop processing, regardless of remaining chunks.
2. Only set completion status to false if BOTH of these conditions are true:
   - The instruction has not been satisfied yet
   - There are still chunks left to process (chunksTotal > chunksSeen)`;
function buildMetadataSystemPrompt() {
  return {
    role: "system",
    content: metadataSystemPrompt
  };
}
function buildMetadataPrompt(instruction, extractionResponse, chunksSeen, chunksTotal) {
  return {
    role: "user",
    content: `Instruction: ${instruction}
Extracted content: ${JSON.stringify(extractionResponse, null, 2)}
chunksSeen: ${chunksSeen}
chunksTotal: ${chunksTotal}`
  };
}
function buildObserveSystemPrompt(userProvidedInstructions) {
  const observeSystemPrompt = `
You are helping the user automate the browser by finding elements based on what the user wants to observe in the page.

You will be given:
1. a instruction of elements to observe
2. a hierarchical accessibility tree showing the semantic structure of the page. The tree is a hybrid of the DOM and the accessibility tree.

Return an array of elements that match the instruction if they exist, otherwise return an empty array.`;
  const content = observeSystemPrompt.replace(/\s+/g, " ");
  return {
    role: "system",
    content: [content, buildUserInstructionsString(userProvidedInstructions)].filter(Boolean).join("\n\n")
  };
}
function buildObserveUserMessage(instruction, domElements) {
  return {
    role: "user",
    content: `instruction: ${instruction}
Accessibility Tree: 
${domElements}`
  };
}
function buildActObservePrompt(action, supportedActions, variables) {
  let instruction = `Find the most relevant element to perform an action on given the following action: ${action}. 
  Provide an action for this element such as ${supportedActions.join(", ")}, or any other playwright locator method. Remember that to users, buttons and links look the same in most cases.
  If the action is completely unrelated to a potential action to be taken on the page, return an empty array. 
  ONLY return one action. If multiple actions are relevant, return the most relevant one. 
  If the user is asking to scroll to a position on the page, e.g., 'halfway' or 0.75, etc, you must return the argument formatted as the correct percentage, e.g., '50%' or '75%', etc.
  If the user is asking to scroll to the next chunk/previous chunk, choose the nextChunk/prevChunk method. No arguments are required here.
  If the action implies a key press, e.g., 'press enter', 'press a', 'press space', etc., always choose the press method with the appropriate key as argument \u2014 e.g. 'a', 'Enter', 'Space'. Do not choose a click action on an on-screen keyboard. Capitalize the first character like 'Enter', 'Tab', 'Escape' only for special keys.
  If the action implies choosing an option from a dropdown, AND the corresponding element is a 'select' element, choose the selectOptionFromDropdown method. The argument should be the text of the option to select.
  If the action implies choosing an option from a dropdown, and the corresponding element is NOT a 'select' element, choose the click method.`;
  if (variables && Object.keys(variables).length > 0) {
    const variableNames = Object.keys(variables).map((key) => `%${key}%`).join(", ");
    const variablesPrompt = `The following variables are available to use in the action: ${variableNames}. Fill the argument variables with the variable name.`;
    instruction += ` ${variablesPrompt}`;
  }
  return instruction;
}
function buildOperatorSystemPrompt(goal) {
  return {
    role: "system",
    content: `You are a general-purpose agent whose job is to accomplish the user's goal across multiple model calls by running actions on the page.

You will be given a goal and a list of steps that have been taken so far. Your job is to determine if either the user's goal has been completed or if there are still steps that need to be taken.

# Your current goal
${goal}

# Important guidelines
1. Break down complex actions into individual atomic steps
2. For \`act\` commands, use only one action at a time, such as:
   - Single click on a specific element
   - Type into a single input field
   - Select a single option
3. Avoid combining multiple actions in one instruction
4. If multiple actions are needed, they should be separate steps`
  };
}
function buildGoogleCUASystemPrompt() {
  return {
    role: "system",
    content: `You are a general-purpose browser agent whose job is to accomplish the user's goal.
Today's date is ${(/* @__PURE__ */ new Date()).toLocaleDateString()}.
You have access to a search tool; however, in most cases you should operate within the page/url the user has provided. ONLY use the search tool if you're stuck or the task is impossible to complete within the current page.
You will be given a goal and a list of steps that have been taken so far. Avoid requesting the user for input as much as possible. Good luck!
`
  };
}

// lib/version.ts
var STAGEHAND_VERSION = "2.4.2";

// types/stagehandErrors.ts
var StagehandError = class extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
};
var StagehandDefaultError = class extends StagehandError {
  constructor(error) {
    if (error instanceof Error || error instanceof StagehandError) {
      super(
        `
Hey! We're sorry you ran into an error. 
Stagehand version: ${STAGEHAND_VERSION} 
If you need help, please open a Github issue or reach out to us on Slack: https://stagehand.dev/slack

Full error:
${error.message}`
      );
    }
  }
};
var StagehandEnvironmentError = class extends StagehandError {
  constructor(currentEnvironment, requiredEnvironment, feature) {
    super(
      `You seem to be setting the current environment to ${currentEnvironment}.Ensure the environment is set to ${requiredEnvironment} if you want to use ${feature}.`
    );
  }
};
var MissingEnvironmentVariableError = class extends StagehandError {
  constructor(missingEnvironmentVariable, feature) {
    super(
      `${missingEnvironmentVariable} is required to use ${feature}.Please set ${missingEnvironmentVariable} in your environment.`
    );
  }
};
var UnsupportedModelError = class extends StagehandError {
  constructor(supportedModels, feature) {
    super(
      feature ? `${feature} requires one of the following models: ${supportedModels}` : `please use one of the supported models: ${supportedModels}`
    );
  }
};
var UnsupportedModelProviderError = class extends StagehandError {
  constructor(supportedProviders, feature) {
    super(
      feature ? `${feature} requires one of the following model providers: ${supportedProviders}` : `please use one of the supported model providers: ${supportedProviders}`
    );
  }
};
var UnsupportedAISDKModelProviderError = class extends StagehandError {
  constructor(provider, supportedProviders) {
    super(
      `${provider} is not currently supported for aiSDK. please use one of the supported model providers: ${supportedProviders}`
    );
  }
};
var InvalidAISDKModelFormatError = class extends StagehandError {
  constructor(modelName) {
    super(
      `${modelName} does not follow correct format for specifying aiSDK models. Please define your modelName as 'provider/model-name'. For example: \`modelName: 'openai/gpt-4o-mini'\``
    );
  }
};
var StagehandNotInitializedError = class extends StagehandError {
  constructor(prop) {
    super(
      `You seem to be calling \`${prop}\` on a page in an uninitialized \`Stagehand\` object. Ensure you are running \`await stagehand.init()\` on the Stagehand object before referencing the \`page\` object.`
    );
  }
};
var BrowserbaseSessionNotFoundError = class extends StagehandError {
  constructor() {
    super("No Browserbase session ID found");
  }
};
var CaptchaTimeoutError = class extends StagehandError {
  constructor() {
    super("Captcha timeout");
  }
};
var MissingLLMConfigurationError = class extends StagehandError {
  constructor() {
    super(
      "No LLM API key or LLM Client configured. An LLM API key or a custom LLM Client is required to use act, extract, or observe."
    );
  }
};
var HandlerNotInitializedError = class extends StagehandError {
  constructor(handlerType) {
    super(`${handlerType} handler not initialized`);
  }
};
var StagehandInvalidArgumentError = class extends StagehandError {
  constructor(message) {
    super(`InvalidArgumentError: ${message}`);
  }
};
var StagehandElementNotFoundError = class extends StagehandError {
  constructor(xpaths) {
    super(`Could not find an element for the given xPath(s): ${xpaths}`);
  }
};
var AgentScreenshotProviderError = class extends StagehandError {
  constructor(message) {
    super(`ScreenshotProviderError: ${message}`);
  }
};
var StagehandMissingArgumentError = class extends StagehandError {
  constructor(message) {
    super(`MissingArgumentError: ${message}`);
  }
};
var CreateChatCompletionResponseError = class extends StagehandError {
  constructor(message) {
    super(`CreateChatCompletionResponseError: ${message}`);
  }
};
var StagehandEvalError = class extends StagehandError {
  constructor(message) {
    super(`StagehandEvalError: ${message}`);
  }
};
var StagehandDomProcessError = class extends StagehandError {
  constructor(message) {
    super(`Error Processing Dom: ${message}`);
  }
};
var StagehandClickError = class extends StagehandError {
  constructor(message, selector) {
    super(
      `Error Clicking Element with selector: ${selector} Reason: ${message}`
    );
  }
};
var LLMResponseError = class extends StagehandError {
  constructor(primitive, message) {
    super(`${primitive} LLM response error: ${message}`);
  }
};
var StagehandIframeError = class extends StagehandError {
  constructor(frameUrl, message) {
    super(
      `Unable to resolve frameId for iframe with URL: ${frameUrl} Full error: ${message}`
    );
  }
};
var ContentFrameNotFoundError = class extends StagehandError {
  constructor(selector) {
    super(`Unable to obtain a content frame for selector: ${selector}`);
  }
};
var XPathResolutionError = class extends StagehandError {
  constructor(xpath) {
    super(`XPath "${xpath}" does not resolve in the current page or frames`);
  }
};
var ExperimentalApiConflictError = class extends StagehandError {
  constructor() {
    super(
      "`experimental` mode cannot be used together with the Stagehand API. To use experimental features, set experimental: true, and useApi: false in the stagehand constructor. To use the Stagehand API, set experimental: false and useApi: true in the stagehand constructor. "
    );
  }
};
var ExperimentalNotConfiguredError = class extends StagehandError {
  constructor(featureName) {
    super(`Feature "${featureName}" is an experimental feature, and cannot be configured when useAPI: true. 
    Please set experimental: true and useAPI: false in the stagehand constructor to use this feature. 
    If you wish to use the Stagehand API, please ensure ${featureName} is not defined in your function call, 
    and set experimental: false, useAPI: true in the Stagehand constructor. `);
  }
};
var ZodSchemaValidationError = class extends Error {
  constructor(received, issues) {
    super(`Zod schema validation failed

\u2014 Received \u2014
${JSON.stringify(received, null, 2)}

\u2014 Issues \u2014
${JSON.stringify(issues, null, 2)}`);
    this.received = received;
    this.issues = issues;
    this.name = "ZodSchemaValidationError";
  }
};
var StagehandInitError = class extends StagehandError {
  constructor(message) {
    super(message);
  }
};
var StagehandShadowRootMissingError = class extends StagehandError {
  constructor(detail) {
    super(
      `No shadow root present on the resolved host` + (detail ? `: ${detail}` : "")
    );
  }
};
var StagehandShadowSegmentEmptyError = class extends StagehandError {
  constructor() {
    super(`Empty selector segment after shadow-DOM hop ("//")`);
  }
};
var StagehandShadowSegmentNotFoundError = class extends StagehandError {
  constructor(segment, hint) {
    super(
      `Shadow segment '${segment}' matched no element inside shadow root` + (hint ? ` ${hint}` : "")
    );
  }
};

// lib/handlers/handlerUtils/actHandlerUtils.ts
var IFRAME_STEP_RE = /^iframe(\[[^\]]+])?$/i;
function stepToCss(step) {
  const m = step.match(/^([a-zA-Z*][\w-]*)(?:\[(\d+)])?$/);
  if (!m) return step;
  const [, tag, idxRaw] = m;
  const idx = idxRaw ? Number(idxRaw) : null;
  if (tag === "*") return idx ? `*:nth-child(${idx})` : `*`;
  return idx ? `${tag}:nth-of-type(${idx})` : tag;
}
var buildDirect = (steps) => steps.map(stepToCss).join(" > ");
var buildDesc = (steps) => steps.map(stepToCss).join(" ");
function resolveShadowSegment(hostLoc, shadowSteps, attr = "data-__stagehand-id", timeout = 1500) {
  return __async(this, null, function* () {
    const direct = buildDirect(shadowSteps);
    const desc = buildDesc(shadowSteps);
    const { id, noRoot } = yield hostLoc.evaluate(
      (host, { direct: direct2, desc: desc2, attr: attr2, timeout: timeout2 }) => {
        var _a15, _b;
        const backdoor = window.__stagehand__;
        const root = (_b = host.shadowRoot) != null ? _b : (_a15 = backdoor == null ? void 0 : backdoor.getClosedRoot) == null ? void 0 : _a15.call(backdoor, host);
        if (!root) return { id: null, noRoot: true };
        const tryFind = () => {
          var _a16;
          return (_a16 = root.querySelector(direct2)) != null ? _a16 : root.querySelector(desc2);
        };
        return new Promise((resolve2) => {
          const mark = (el) => {
            let v = el.getAttribute(attr2);
            if (!v) {
              v = "sh_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
              el.setAttribute(attr2, v);
            }
            return { id: v, noRoot: false };
          };
          const first = tryFind();
          if (first) return resolve2(mark(first));
          const start = Date.now();
          const tick = () => {
            const el = tryFind();
            if (el) return resolve2(mark(el));
            if (Date.now() - start >= timeout2)
              return resolve2({ id: null, noRoot: false });
            setTimeout(tick, 50);
          };
          tick();
        });
      },
      { direct, desc, attr, timeout }
    );
    if (noRoot) {
      throw new StagehandShadowRootMissingError(
        `segment='${shadowSteps.join("/")}'`
      );
    }
    if (!id) {
      throw new StagehandShadowSegmentNotFoundError(shadowSteps.join("/"));
    }
    return hostLoc.locator(`stagehand=${id}`);
  });
}
function deepLocatorWithShadow(root, xpath) {
  return __async(this, null, function* () {
    if (!xpath.startsWith("/")) xpath = "/" + xpath;
    const tokens = xpath.split("/");
    let ctx = root;
    let buffer = [];
    let elementScoped = false;
    const xp = () => elementScoped ? "xpath=./" : "xpath=/";
    const flushIntoFrame = () => {
      if (!buffer.length) return;
      ctx = ctx.frameLocator(
        xp() + buffer.join("/")
      );
      buffer = [];
      elementScoped = false;
    };
    const flushIntoLocator = () => {
      if (!buffer.length) return;
      ctx = ctx.locator(
        xp() + buffer.join("/")
      );
      buffer = [];
      elementScoped = true;
    };
    for (let i = 1; i < tokens.length; i++) {
      const step = tokens[i];
      if (step === "") {
        flushIntoLocator();
        const seg = [];
        let j = i + 1;
        for (; j < tokens.length; j++) {
          const t = tokens[j];
          if (t === "" || IFRAME_STEP_RE.test(t)) break;
          seg.push(t);
        }
        if (!seg.length) throw new StagehandShadowSegmentEmptyError();
        ctx = yield resolveShadowSegment(ctx, seg);
        elementScoped = true;
        i = j - 1;
        continue;
      }
      buffer.push(step);
      if (IFRAME_STEP_RE.test(step)) flushIntoFrame();
    }
    if (buffer.length === 0) {
      if (elementScoped) return ctx;
      return ctx.locator("xpath=/");
    }
    return ctx.locator(
      xp() + buffer.join("/")
    );
  });
}
function deepLocator(root, xpath) {
  if (!xpath.startsWith("/")) xpath = "/" + xpath;
  const steps = xpath.split("/").filter(Boolean);
  let ctx = root;
  let buffer = [];
  const flushIntoFrame = () => {
    if (buffer.length === 0) return;
    const selector = "xpath=/" + buffer.join("/");
    ctx = ctx.frameLocator(selector);
    buffer = [];
  };
  for (const step of steps) {
    buffer.push(step);
    if (IFRAME_STEP_RE.test(step)) {
      flushIntoFrame();
    }
  }
  const finalSelector = "xpath=/" + buffer.join("/");
  return ctx.locator(finalSelector);
}
var methodHandlerMap = {
  scrollIntoView: scrollElementIntoView,
  scrollTo: scrollElementToPercentage,
  scroll: scrollElementToPercentage,
  "mouse.wheel": scrollElementToPercentage,
  fill: fillOrType,
  type: fillOrType,
  press: pressKey,
  click: clickElement,
  nextChunk: scrollToNextChunk,
  prevChunk: scrollToPreviousChunk,
  selectOptionFromDropdown: selectOption
};
function scrollToNextChunk(ctx) {
  return __async(this, null, function* () {
    const { locator, logger, xpath } = ctx;
    logger({
      category: "action",
      message: "scrolling to next chunk",
      level: 2,
      auxiliary: {
        xpath: { value: xpath, type: "string" }
      }
    });
    try {
      yield locator.evaluate(
        (element) => {
          var _a15, _b, _c;
          const waitForScrollEnd = (el) => new Promise((resolve2) => {
            var _a16;
            let last = (_a16 = el.scrollTop) != null ? _a16 : 0;
            const check = () => {
              var _a17;
              const cur = (_a17 = el.scrollTop) != null ? _a17 : 0;
              if (cur === last) return resolve2();
              last = cur;
              requestAnimationFrame(check);
            };
            requestAnimationFrame(check);
          });
          const tagName = element.tagName.toLowerCase();
          if (tagName === "html" || tagName === "body") {
            const height2 = (_b = (_a15 = window.visualViewport) == null ? void 0 : _a15.height) != null ? _b : window.innerHeight;
            window.scrollBy({ top: height2, left: 0, behavior: "smooth" });
            const scrollingRoot = (_c = document.scrollingElement) != null ? _c : document.documentElement;
            return waitForScrollEnd(scrollingRoot);
          }
          const height = element.getBoundingClientRect().height;
          element.scrollBy({
            top: height,
            left: 0,
            behavior: "smooth"
          });
          return waitForScrollEnd(element);
        },
        void 0,
        { timeout: 1e4 }
      );
    } catch (e) {
      logger({
        category: "action",
        message: "error scrolling to next chunk",
        level: 1,
        auxiliary: {
          error: { value: e.message, type: "string" },
          trace: { value: e.stack, type: "string" },
          xpath: { value: xpath, type: "string" }
        }
      });
      throw new PlaywrightCommandException(e.message);
    }
  });
}
function scrollToPreviousChunk(ctx) {
  return __async(this, null, function* () {
    const { locator, logger, xpath } = ctx;
    logger({
      category: "action",
      message: "scrolling to previous chunk",
      level: 2,
      auxiliary: {
        xpath: { value: xpath, type: "string" }
      }
    });
    try {
      yield locator.evaluate(
        (element) => {
          var _a15, _b, _c;
          const waitForScrollEnd = (el) => new Promise((resolve2) => {
            var _a16;
            let last = (_a16 = el.scrollTop) != null ? _a16 : 0;
            const check = () => {
              var _a17;
              const cur = (_a17 = el.scrollTop) != null ? _a17 : 0;
              if (cur === last) return resolve2();
              last = cur;
              requestAnimationFrame(check);
            };
            requestAnimationFrame(check);
          });
          const tagName = element.tagName.toLowerCase();
          if (tagName === "html" || tagName === "body") {
            const height2 = (_b = (_a15 = window.visualViewport) == null ? void 0 : _a15.height) != null ? _b : window.innerHeight;
            window.scrollBy({ top: -height2, left: 0, behavior: "smooth" });
            const rootScrollingEl = (_c = document.scrollingElement) != null ? _c : document.documentElement;
            return waitForScrollEnd(rootScrollingEl);
          }
          const height = element.getBoundingClientRect().height;
          element.scrollBy({
            top: -height,
            left: 0,
            behavior: "smooth"
          });
          return waitForScrollEnd(element);
        },
        void 0,
        { timeout: 1e4 }
      );
    } catch (e) {
      logger({
        category: "action",
        message: "error scrolling to previous chunk",
        level: 1,
        auxiliary: {
          error: { value: e.message, type: "string" },
          trace: { value: e.stack, type: "string" },
          xpath: { value: xpath, type: "string" }
        }
      });
      throw new PlaywrightCommandException(e.message);
    }
  });
}
function scrollElementIntoView(ctx) {
  return __async(this, null, function* () {
    const { locator, xpath, logger } = ctx;
    logger({
      category: "action",
      message: "scrolling element into view",
      level: 2,
      auxiliary: {
        xpath: { value: xpath, type: "string" }
      }
    });
    try {
      yield locator.evaluate((element) => {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } catch (e) {
      logger({
        category: "action",
        message: "error scrolling element into view",
        level: 1,
        auxiliary: {
          error: { value: e.message, type: "string" },
          trace: { value: e.stack, type: "string" },
          xpath: { value: xpath, type: "string" }
        }
      });
      throw new PlaywrightCommandException(e.message);
    }
  });
}
function scrollElementToPercentage(ctx) {
  return __async(this, null, function* () {
    const { args, xpath, logger, locator } = ctx;
    logger({
      category: "action",
      message: "scrolling element vertically to specified percentage",
      level: 2,
      auxiliary: {
        xpath: { value: xpath, type: "string" },
        coordinate: { value: JSON.stringify(args), type: "string" }
      }
    });
    try {
      const [yArg = "0%"] = args;
      yield locator.evaluate(
        (element, { yArg: yArg2 }) => {
          function parsePercent(val) {
            const cleaned = val.trim().replace("%", "");
            const num = parseFloat(cleaned);
            return Number.isNaN(num) ? 0 : Math.max(0, Math.min(num, 100));
          }
          const yPct = parsePercent(yArg2);
          if (element.tagName.toLowerCase() === "html") {
            const scrollHeight = document.body.scrollHeight;
            const viewportHeight = window.innerHeight;
            const scrollTop = (scrollHeight - viewportHeight) * (yPct / 100);
            window.scrollTo({
              top: scrollTop,
              left: window.scrollX,
              behavior: "smooth"
            });
          } else {
            const scrollHeight = element.scrollHeight;
            const clientHeight = element.clientHeight;
            const scrollTop = (scrollHeight - clientHeight) * (yPct / 100);
            element.scrollTo({
              top: scrollTop,
              left: element.scrollLeft,
              behavior: "smooth"
            });
          }
        },
        { yArg },
        { timeout: 1e4 }
      );
    } catch (e) {
      logger({
        category: "action",
        message: "error scrolling element vertically to percentage",
        level: 1,
        auxiliary: {
          error: { value: e.message, type: "string" },
          trace: { value: e.stack, type: "string" },
          xpath: { value: xpath, type: "string" },
          args: { value: JSON.stringify(args), type: "object" }
        }
      });
      throw new PlaywrightCommandException(e.message);
    }
  });
}
function fillOrType(ctx) {
  return __async(this, null, function* () {
    var _a15;
    const { locator, xpath, args, logger } = ctx;
    try {
      yield locator.fill("", { force: true });
      const text = ((_a15 = args[0]) == null ? void 0 : _a15.toString()) || "";
      yield locator.fill(text, { force: true });
    } catch (e) {
      logger({
        category: "action",
        message: "error filling element",
        level: 1,
        auxiliary: {
          error: { value: e.message, type: "string" },
          trace: { value: e.stack, type: "string" },
          xpath: { value: xpath, type: "string" }
        }
      });
      throw new PlaywrightCommandException(e.message);
    }
  });
}
function pressKey(ctx) {
  return __async(this, null, function* () {
    var _a15, _b, _c, _d;
    const {
      locator,
      xpath,
      args,
      logger,
      stagehandPage,
      initialUrl,
      domSettleTimeoutMs
    } = ctx;
    try {
      const key = (_b = (_a15 = args[0]) == null ? void 0 : _a15.toString()) != null ? _b : "";
      yield locator.page().keyboard.press(key);
      yield handlePossiblePageNavigation(
        "press",
        xpath,
        initialUrl,
        stagehandPage,
        logger,
        domSettleTimeoutMs
      );
    } catch (e) {
      logger({
        category: "action",
        message: "error pressing key",
        level: 1,
        auxiliary: {
          error: { value: e.message, type: "string" },
          trace: { value: e.stack, type: "string" },
          key: { value: (_d = (_c = args[0]) == null ? void 0 : _c.toString()) != null ? _d : "unknown", type: "string" }
        }
      });
      throw new PlaywrightCommandException(e.message);
    }
  });
}
function selectOption(ctx) {
  return __async(this, null, function* () {
    var _a15;
    const { locator, xpath, args, logger } = ctx;
    try {
      const text = ((_a15 = args[0]) == null ? void 0 : _a15.toString()) || "";
      yield locator.selectOption(text, { timeout: 5e3 });
    } catch (e) {
      logger({
        category: "action",
        message: "error selecting option",
        level: 0,
        auxiliary: {
          error: { value: e.message, type: "string" },
          trace: { value: e.stack, type: "string" },
          xpath: { value: xpath, type: "string" }
        }
      });
      throw new PlaywrightCommandException(e.message);
    }
  });
}
function clickElement(ctx) {
  return __async(this, null, function* () {
    const {
      locator,
      xpath,
      args,
      logger,
      stagehandPage,
      initialUrl,
      domSettleTimeoutMs
    } = ctx;
    logger({
      category: "action",
      message: "page URL before click",
      level: 2,
      auxiliary: {
        url: {
          value: stagehandPage.page.url(),
          type: "string"
        }
      }
    });
    try {
      yield locator.click({ timeout: 3500 });
    } catch (e) {
      logger({
        category: "action",
        message: "Playwright click failed, falling back to JS click",
        level: 1,
        auxiliary: {
          error: { value: e.message, type: "string" },
          trace: { value: e.stack, type: "string" },
          xpath: { value: xpath, type: "string" },
          method: { value: "click", type: "string" },
          args: { value: JSON.stringify(args), type: "object" }
        }
      });
      try {
        yield locator.evaluate((el) => el.click(), void 0, {
          timeout: 3500
        });
      } catch (e2) {
        logger({
          category: "action",
          message: "error performing click (JS fallback)",
          level: 0,
          auxiliary: {
            error: { value: e2.message, type: "string" },
            trace: { value: e2.stack, type: "string" },
            xpath: { value: xpath, type: "string" },
            method: { value: "click", type: "string" },
            args: { value: JSON.stringify(args), type: "object" }
          }
        });
        throw new StagehandClickError(xpath, e2.message);
      }
    }
    yield handlePossiblePageNavigation(
      "click",
      xpath,
      initialUrl,
      stagehandPage,
      logger,
      domSettleTimeoutMs
    );
  });
}
function fallbackLocatorMethod(ctx) {
  return __async(this, null, function* () {
    const { locator, xpath, method, args, logger } = ctx;
    logger({
      category: "action",
      message: "page URL before action",
      level: 2,
      auxiliary: {
        url: { value: locator.page().url(), type: "string" }
      }
    });
    try {
      yield locator[method](...args.map((arg) => (arg == null ? void 0 : arg.toString()) || ""));
    } catch (e) {
      logger({
        category: "action",
        message: "error performing method",
        level: 1,
        auxiliary: {
          error: { value: e.message, type: "string" },
          trace: { value: e.stack, type: "string" },
          xpath: { value: xpath, type: "string" },
          method: { value: method, type: "string" },
          args: { value: JSON.stringify(args), type: "object" }
        }
      });
      throw new PlaywrightCommandException(e.message);
    }
  });
}
function handlePossiblePageNavigation(actionDescription, xpath, initialUrl, stagehandPage, logger, domSettleTimeoutMs) {
  return __async(this, null, function* () {
    logger({
      category: "action",
      message: `${actionDescription}, checking for page navigation`,
      level: 1,
      auxiliary: {
        xpath: { value: xpath, type: "string" }
      }
    });
    const newOpenedTab = yield Promise.race([
      new Promise((resolve2) => {
        stagehandPage.context.once("page", (page) => resolve2(page));
        setTimeout(() => resolve2(null), 1500);
      })
    ]);
    logger({
      category: "action",
      message: `${actionDescription} complete`,
      level: 1,
      auxiliary: {
        newOpenedTab: {
          value: newOpenedTab ? "opened a new tab" : "no new tabs opened",
          type: "string"
        }
      }
    });
    if (newOpenedTab && newOpenedTab.url() !== "about:blank") {
      logger({
        category: "action",
        message: "new page detected (new tab) with URL",
        level: 1,
        auxiliary: {
          url: { value: newOpenedTab.url(), type: "string" }
        }
      });
      yield stagehandPage.page.waitForLoadState("domcontentloaded");
    }
    try {
      yield stagehandPage._waitForSettledDom(domSettleTimeoutMs);
    } catch (e) {
      logger({
        category: "action",
        message: "wait for settled DOM timeout hit",
        level: 1,
        auxiliary: {
          trace: { value: e.stack, type: "string" },
          message: { value: e.message, type: "string" }
        }
      });
    }
    logger({
      category: "action",
      message: "finished waiting for (possible) page navigation",
      level: 1
    });
    if (stagehandPage.page.url() !== initialUrl) {
      logger({
        category: "action",
        message: "new page detected with URL",
        level: 1,
        auxiliary: {
          url: { value: stagehandPage.page.url(), type: "string" }
        }
      });
    }
  });
}

// lib/handlers/actHandler.ts
var StagehandActHandler = class {
  constructor({
    logger,
    stagehandPage,
    selfHeal,
    experimental
  }) {
    this.logger = logger;
    this.stagehandPage = stagehandPage;
    this.selfHeal = selfHeal;
    this.experimental = experimental;
  }
  /**
   * Perform an immediate Playwright action based on an ObserveResult object
   * that was returned from `page.observe(...)`.
   */
  actFromObserveResult(observe2, domSettleTimeoutMs) {
    return __async(this, null, function* () {
      var _a15;
      this.logger({
        category: "action",
        message: "Performing act from an ObserveResult",
        level: 1,
        auxiliary: {
          observeResult: {
            value: JSON.stringify(observe2),
            type: "object"
          }
        }
      });
      const method = observe2.method;
      if (method === "not-supported") {
        this.logger({
          category: "action",
          message: "Cannot execute ObserveResult with unsupported method",
          level: 1,
          auxiliary: {
            error: {
              value: "NotSupportedError: The method requested in this ObserveResult is not supported by Stagehand.",
              type: "string"
            },
            trace: {
              value: `Cannot execute act from ObserveResult with unsupported method: ${method}`,
              type: "string"
            }
          }
        });
        return {
          success: false,
          message: `Unable to perform action: The method '${method}' is not supported in ObserveResult. Please use a supported Playwright locator method.`,
          action: observe2.description || `ObserveResult action (${method})`
        };
      }
      const args = (_a15 = observe2.arguments) != null ? _a15 : [];
      const selector = observe2.selector.replace("xpath=", "");
      try {
        yield this._performPlaywrightMethod(
          method,
          args,
          selector,
          domSettleTimeoutMs
        );
        return {
          success: true,
          message: `Action [${method}] performed successfully on selector: ${selector}`,
          action: observe2.description || `ObserveResult action (${method})`
        };
      } catch (err) {
        if (!this.selfHeal || err instanceof PlaywrightCommandMethodNotSupportedException) {
          this.logger({
            category: "action",
            message: "Error performing act from an ObserveResult",
            level: 1,
            auxiliary: {
              error: { value: err.message, type: "string" },
              trace: { value: err.stack, type: "string" }
            }
          });
          return {
            success: false,
            message: `Failed to perform act: ${err.message}`,
            action: observe2.description || `ObserveResult action (${method})`
          };
        }
        this.logger({
          category: "action",
          message: "Error performing act from an ObserveResult. Reprocessing the page and trying again",
          level: 1,
          auxiliary: {
            error: { value: err.message, type: "string" },
            trace: { value: err.stack, type: "string" },
            observeResult: { value: JSON.stringify(observe2), type: "object" }
          }
        });
        try {
          const actCommand = observe2.description.toLowerCase().startsWith(method.toLowerCase()) ? observe2.description : method ? `${method} ${observe2.description}` : observe2.description;
          const instruction = buildActObservePrompt(
            actCommand,
            Object.values(SupportedPlaywrightAction),
            {}
          );
          const observeResults = yield this.stagehandPage.observe({
            instruction
          });
          if (observeResults.length === 0) {
            return {
              success: false,
              message: `Failed to self heal act: No observe results found for action`,
              action: actCommand
            };
          }
          const element = observeResults[0];
          yield this._performPlaywrightMethod(
            // override previously provided method and arguments
            observe2.method,
            observe2.arguments,
            // only update selector
            element.selector,
            domSettleTimeoutMs
          );
          return {
            success: true,
            message: `Action [${element.method}] performed successfully on selector: ${element.selector}`,
            action: observe2.description || `ObserveResult action (${method})`
          };
        } catch (err2) {
          this.logger({
            category: "action",
            message: "Error performing act from an ObserveResult on fallback",
            level: 1,
            auxiliary: {
              error: { value: err2.message, type: "string" },
              trace: { value: err2.stack, type: "string" }
            }
          });
          return {
            success: false,
            message: `Failed to perform act: ${err2.message}`,
            action: observe2.description || `ObserveResult action (${method})`
          };
        }
      }
    });
  }
  /**
   * Perform an act based on an instruction.
   * This method will observe the page and then perform the act on the first element returned.
   */
  observeAct(actionOrOptions, observeHandler, llmClient, requestId) {
    return __async(this, null, function* () {
      let action;
      const observeOptions = {};
      if (typeof actionOrOptions === "object" && actionOrOptions !== null) {
        if (!("action" in actionOrOptions)) {
          throw new StagehandInvalidArgumentError(
            "Invalid argument. Action options must have an `action` field."
          );
        }
        if (typeof actionOrOptions.action !== "string" || actionOrOptions.action.length === 0) {
          throw new StagehandInvalidArgumentError(
            "Invalid argument. No action provided."
          );
        }
        action = actionOrOptions.action;
        if (actionOrOptions.modelName)
          observeOptions.modelName = actionOrOptions.modelName;
        if (actionOrOptions.modelClientOptions)
          observeOptions.modelClientOptions = actionOrOptions.modelClientOptions;
      } else {
        throw new StagehandInvalidArgumentError(
          "Invalid argument. Valid arguments are: a string, an ActOptions object with an `action` field not empty, or an ObserveResult with a `selector` and `method` field."
        );
      }
      const doObserveAndAct = () => __async(this, null, function* () {
        const instruction = buildActObservePrompt(
          action,
          Object.values(SupportedPlaywrightAction),
          actionOrOptions.variables
        );
        const observeResults = yield observeHandler.observe({
          instruction,
          llmClient,
          requestId,
          drawOverlay: false,
          returnAction: true,
          fromAct: true,
          iframes: actionOrOptions == null ? void 0 : actionOrOptions.iframes
        });
        if (observeResults.length === 0) {
          return {
            success: false,
            message: `Failed to perform act: No observe results found for action`,
            action
          };
        }
        const element = observeResults[0];
        if (actionOrOptions.variables) {
          Object.keys(actionOrOptions.variables).forEach((key) => {
            element.arguments = element.arguments.map(
              (arg) => arg.replace(`%${key}%`, actionOrOptions.variables[key])
            );
          });
        }
        return this.actFromObserveResult(
          element,
          actionOrOptions.domSettleTimeoutMs
        );
      });
      if (!actionOrOptions.timeoutMs) {
        return doObserveAndAct();
      }
      const { timeoutMs } = actionOrOptions;
      return yield Promise.race([
        doObserveAndAct(),
        new Promise((resolve2) => {
          setTimeout(() => {
            resolve2({
              success: false,
              message: `Action timed out after ${timeoutMs}ms`,
              action
            });
          }, timeoutMs);
        })
      ]);
    });
  }
  _performPlaywrightMethod(method, args, rawXPath, domSettleTimeoutMs) {
    return __async(this, null, function* () {
      const xpath = rawXPath.replace(/^xpath=/i, "").trim();
      let locator;
      if (this.experimental) {
        locator = yield deepLocatorWithShadow(this.stagehandPage.page, xpath);
      } else {
        locator = deepLocator(this.stagehandPage.page, xpath);
      }
      const initialUrl = this.stagehandPage.page.url();
      this.logger({
        category: "action",
        message: "performing playwright method",
        level: 2,
        auxiliary: {
          xpath: { value: xpath, type: "string" },
          method: { value: method, type: "string" }
        }
      });
      const context = {
        method,
        locator,
        xpath,
        args,
        logger: this.logger,
        stagehandPage: this.stagehandPage,
        initialUrl,
        domSettleTimeoutMs
      };
      try {
        const methodFn = methodHandlerMap[method];
        if (methodFn) {
          yield methodFn(context);
        } else if (typeof locator[method] === "function") {
          yield fallbackLocatorMethod(context);
        } else {
          this.logger({
            category: "action",
            message: "chosen method is invalid",
            level: 1,
            auxiliary: {
              method: { value: method, type: "string" }
            }
          });
          throw new PlaywrightCommandMethodNotSupportedException(
            `Method ${method} not supported`
          );
        }
        yield this.stagehandPage._waitForSettledDom(domSettleTimeoutMs);
      } catch (e) {
        this.logger({
          category: "action",
          message: "error performing method",
          level: 1,
          auxiliary: {
            error: { value: e.message, type: "string" },
            trace: { value: e.stack, type: "string" },
            method: { value: method, type: "string" },
            xpath: { value: xpath, type: "string" },
            args: { value: JSON.stringify(args), type: "object" }
          }
        });
        throw new PlaywrightCommandException(e.message);
      }
    });
  }
};

// lib/handlers/extractHandler.ts
var import_v34 = require("zod/v3");

// lib/inference.ts
var import_v32 = require("zod/v3");

// lib/inferenceLogUtils.ts
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
function ensureInferenceSummaryDir() {
  const inferenceDir = import_path.default.join(process.cwd(), "inference_summary");
  if (!import_fs.default.existsSync(inferenceDir)) {
    import_fs.default.mkdirSync(inferenceDir, { recursive: true });
  }
  return inferenceDir;
}
function appendSummary(inferenceType, entry) {
  const summaryPath = getSummaryJsonPath(inferenceType);
  const arrayKey = `${inferenceType}_summary`;
  const existingData = readSummaryFile(inferenceType);
  existingData[arrayKey].push(entry);
  import_fs.default.writeFileSync(summaryPath, JSON.stringify(existingData, null, 2));
}
function getTimestamp() {
  return (/* @__PURE__ */ new Date()).toISOString().replace(/[^0-9T]/g, "").replace("T", "_");
}
function writeTimestampedTxtFile(directory, prefix, data) {
  const baseDir = ensureInferenceSummaryDir();
  const subDir = import_path.default.join(baseDir, directory);
  if (!import_fs.default.existsSync(subDir)) {
    import_fs.default.mkdirSync(subDir, { recursive: true });
  }
  const timestamp = getTimestamp();
  const fileName = `${timestamp}_${prefix}.txt`;
  const filePath = import_path.default.join(subDir, fileName);
  import_fs.default.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2).replace(/\\n/g, "\n")
  );
  return { fileName, timestamp };
}
function getSummaryJsonPath(inferenceType) {
  const baseDir = ensureInferenceSummaryDir();
  const subDir = import_path.default.join(baseDir, `${inferenceType}_summary`);
  if (!import_fs.default.existsSync(subDir)) {
    import_fs.default.mkdirSync(subDir, { recursive: true });
  }
  return import_path.default.join(subDir, `${inferenceType}_summary.json`);
}
function readSummaryFile(inferenceType) {
  const summaryPath = getSummaryJsonPath(inferenceType);
  const arrayKey = `${inferenceType}_summary`;
  if (!import_fs.default.existsSync(summaryPath)) {
    return { [arrayKey]: [] };
  }
  try {
    const raw = import_fs.default.readFileSync(summaryPath, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed[arrayKey])) {
      return parsed;
    }
  } catch (e) {
  }
  return { [arrayKey]: [] };
}

// lib/inference.ts
function extract(_0) {
  return __async(this, arguments, function* ({
    instruction,
    domElements,
    schema,
    llmClient,
    chunksSeen,
    chunksTotal,
    requestId,
    logger,
    userProvidedInstructions,
    logInferenceToFile = false
  }) {
    var _a15, _b, _c, _d, _e, _f, _g, _h;
    const metadataSchema = import_v32.z.object({
      progress: import_v32.z.string().describe(
        "progress of what has been extracted so far, as concise as possible"
      ),
      completed: import_v32.z.boolean().describe(
        "true if the goal is now accomplished. Use this conservatively, only when sure that the goal has been completed."
      )
    });
    const isUsingAnthropic = llmClient.type === "anthropic";
    const isGPT5 = llmClient.modelName.includes("gpt-5");
    const extractCallMessages = [
      buildExtractSystemPrompt(isUsingAnthropic, userProvidedInstructions),
      buildExtractUserPrompt(instruction, domElements, isUsingAnthropic)
    ];
    let extractCallFile = "";
    let extractCallTimestamp = "";
    if (logInferenceToFile) {
      const { fileName, timestamp } = writeTimestampedTxtFile(
        "extract_summary",
        "extract_call",
        {
          requestId,
          modelCall: "extract",
          messages: extractCallMessages
        }
      );
      extractCallFile = fileName;
      extractCallTimestamp = timestamp;
    }
    const extractStartTime = Date.now();
    const extractionResponse = yield llmClient.createChatCompletion({
      options: {
        messages: extractCallMessages,
        response_model: {
          schema,
          name: "Extraction"
        },
        temperature: isGPT5 ? 1 : 0.1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        requestId
      },
      logger
    });
    const extractEndTime = Date.now();
    const { data: extractedData, usage: extractUsage } = extractionResponse;
    let extractResponseFile = "";
    if (logInferenceToFile) {
      const { fileName } = writeTimestampedTxtFile(
        "extract_summary",
        "extract_response",
        {
          requestId,
          modelResponse: "extract",
          rawResponse: extractedData
        }
      );
      extractResponseFile = fileName;
      appendSummary("extract", {
        extract_inference_type: "extract",
        timestamp: extractCallTimestamp,
        LLM_input_file: extractCallFile,
        LLM_output_file: extractResponseFile,
        prompt_tokens: (_a15 = extractUsage == null ? void 0 : extractUsage.prompt_tokens) != null ? _a15 : 0,
        completion_tokens: (_b = extractUsage == null ? void 0 : extractUsage.completion_tokens) != null ? _b : 0,
        inference_time_ms: extractEndTime - extractStartTime
      });
    }
    const metadataCallMessages = [
      buildMetadataSystemPrompt(),
      buildMetadataPrompt(instruction, extractedData, chunksSeen, chunksTotal)
    ];
    let metadataCallFile = "";
    let metadataCallTimestamp = "";
    if (logInferenceToFile) {
      const { fileName, timestamp } = writeTimestampedTxtFile(
        "extract_summary",
        "metadata_call",
        {
          requestId,
          modelCall: "metadata",
          messages: metadataCallMessages
        }
      );
      metadataCallFile = fileName;
      metadataCallTimestamp = timestamp;
    }
    const metadataStartTime = Date.now();
    const metadataResponse = yield llmClient.createChatCompletion({
      options: {
        messages: metadataCallMessages,
        response_model: {
          name: "Metadata",
          schema: metadataSchema
        },
        temperature: isGPT5 ? 1 : 0.1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        requestId
      },
      logger
    });
    const metadataEndTime = Date.now();
    const {
      data: {
        completed: metadataResponseCompleted,
        progress: metadataResponseProgress
      },
      usage: metadataResponseUsage
    } = metadataResponse;
    let metadataResponseFile = "";
    if (logInferenceToFile) {
      const { fileName } = writeTimestampedTxtFile(
        "extract_summary",
        "metadata_response",
        {
          requestId,
          modelResponse: "metadata",
          completed: metadataResponseCompleted,
          progress: metadataResponseProgress
        }
      );
      metadataResponseFile = fileName;
      appendSummary("extract", {
        extract_inference_type: "metadata",
        timestamp: metadataCallTimestamp,
        LLM_input_file: metadataCallFile,
        LLM_output_file: metadataResponseFile,
        prompt_tokens: (_c = metadataResponseUsage == null ? void 0 : metadataResponseUsage.prompt_tokens) != null ? _c : 0,
        completion_tokens: (_d = metadataResponseUsage == null ? void 0 : metadataResponseUsage.completion_tokens) != null ? _d : 0,
        inference_time_ms: metadataEndTime - metadataStartTime
      });
    }
    const totalPromptTokens = ((_e = extractUsage == null ? void 0 : extractUsage.prompt_tokens) != null ? _e : 0) + ((_f = metadataResponseUsage == null ? void 0 : metadataResponseUsage.prompt_tokens) != null ? _f : 0);
    const totalCompletionTokens = ((_g = extractUsage == null ? void 0 : extractUsage.completion_tokens) != null ? _g : 0) + ((_h = metadataResponseUsage == null ? void 0 : metadataResponseUsage.completion_tokens) != null ? _h : 0);
    const totalInferenceTimeMs = extractEndTime - extractStartTime + (metadataEndTime - metadataStartTime);
    return __spreadProps(__spreadValues({}, extractedData), {
      metadata: {
        completed: metadataResponseCompleted,
        progress: metadataResponseProgress
      },
      prompt_tokens: totalPromptTokens,
      completion_tokens: totalCompletionTokens,
      inference_time_ms: totalInferenceTimeMs
    });
  });
}
function observe(_0) {
  return __async(this, arguments, function* ({
    instruction,
    domElements,
    llmClient,
    requestId,
    userProvidedInstructions,
    logger,
    returnAction = false,
    logInferenceToFile = false,
    fromAct
  }) {
    var _a15, _b, _c, _d;
    const isGPT5 = llmClient.modelName.includes("gpt-5");
    const observeSchema = import_v32.z.object({
      elements: import_v32.z.array(
        import_v32.z.object(__spreadValues({
          elementId: import_v32.z.string().describe(
            "the ID string associated with the element. Never include surrounding square brackets. This field must follow the format of 'number-number'."
          ),
          description: import_v32.z.string().describe(
            "a description of the accessible element and its purpose"
          )
        }, returnAction ? {
          method: import_v32.z.string().describe(
            "the candidate method/action to interact with the element. Select one of the available Playwright interaction methods."
          ),
          arguments: import_v32.z.array(
            import_v32.z.string().describe(
              "the arguments to pass to the method. For example, for a click, the arguments are empty, but for a fill, the arguments are the value to fill in."
            )
          )
        } : {}))
      ).describe("an array of accessible elements that match the instruction")
    });
    const messages = [
      buildObserveSystemPrompt(userProvidedInstructions),
      buildObserveUserMessage(instruction, domElements)
    ];
    const filePrefix = fromAct ? "act" : "observe";
    let callTimestamp = "";
    let callFile = "";
    if (logInferenceToFile) {
      const { fileName, timestamp } = writeTimestampedTxtFile(
        `${filePrefix}_summary`,
        `${filePrefix}_call`,
        {
          requestId,
          modelCall: filePrefix,
          messages
        }
      );
      callFile = fileName;
      callTimestamp = timestamp;
    }
    const start = Date.now();
    const rawResponse = yield llmClient.createChatCompletion({
      options: {
        messages,
        response_model: {
          schema: observeSchema,
          name: "Observation"
        },
        temperature: isGPT5 ? 1 : 0.1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        requestId
      },
      logger
    });
    const end = Date.now();
    const usageTimeMs = end - start;
    const { data: observeData, usage: observeUsage } = rawResponse;
    const promptTokens = (_a15 = observeUsage == null ? void 0 : observeUsage.prompt_tokens) != null ? _a15 : 0;
    const completionTokens = (_b = observeUsage == null ? void 0 : observeUsage.completion_tokens) != null ? _b : 0;
    let responseFile = "";
    if (logInferenceToFile) {
      const { fileName: responseFileName } = writeTimestampedTxtFile(
        `${filePrefix}_summary`,
        `${filePrefix}_response`,
        {
          requestId,
          modelResponse: filePrefix,
          rawResponse: observeData
        }
      );
      responseFile = responseFileName;
      appendSummary(filePrefix, {
        [`${filePrefix}_inference_type`]: filePrefix,
        timestamp: callTimestamp,
        LLM_input_file: callFile,
        LLM_output_file: responseFile,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        inference_time_ms: usageTimeMs
      });
    }
    const parsedElements = (_d = (_c = observeData.elements) == null ? void 0 : _c.map((el) => {
      const base = {
        elementId: el.elementId,
        description: String(el.description)
      };
      if (returnAction) {
        return __spreadProps(__spreadValues({}, base), {
          method: String(el.method),
          arguments: el.arguments
        });
      }
      return base;
    })) != null ? _d : [];
    return {
      elements: parsedElements,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      inference_time_ms: usageTimeMs
    };
  });
}

// lib/utils.ts
var import_v33 = require("zod/v3");
var import_genai = require("@google/genai");

// types/context.ts
var ID_PATTERN = /^\d+-\d+$/;

// lib/utils.ts
function validateZodSchema(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return true;
  }
  throw new ZodSchemaValidationError(data, result.error.format());
}
function drawObserveOverlay(page, results) {
  return __async(this, null, function* () {
    const xpathList = results.map((result) => result.selector);
    const validXpaths = xpathList.filter((xpath) => xpath !== "xpath=");
    yield page.evaluate((selectors) => {
      selectors.forEach((selector) => {
        let element;
        if (selector.startsWith("xpath=")) {
          const xpath = selector.substring(6);
          element = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
        } else {
          element = document.querySelector(selector);
        }
        if (element instanceof HTMLElement) {
          const overlay = document.createElement("div");
          overlay.setAttribute("stagehandObserve", "true");
          const rect = element.getBoundingClientRect();
          overlay.style.position = "absolute";
          overlay.style.left = rect.left + "px";
          overlay.style.top = rect.top + "px";
          overlay.style.width = rect.width + "px";
          overlay.style.height = rect.height + "px";
          overlay.style.backgroundColor = "rgba(255, 255, 0, 0.3)";
          overlay.style.pointerEvents = "none";
          overlay.style.zIndex = "10000";
          document.body.appendChild(overlay);
        }
      });
    }, validXpaths);
  });
}
function clearOverlays(page) {
  return __async(this, null, function* () {
    yield page.evaluate(() => {
      const elements = document.querySelectorAll('[stagehandObserve="true"]');
      elements.forEach((el) => {
        const parent = el.parentNode;
        while (el.firstChild) {
          parent == null ? void 0 : parent.insertBefore(el.firstChild, el);
        }
        parent == null ? void 0 : parent.removeChild(el);
      });
    });
  });
}
function isRunningInBun() {
  return typeof process !== "undefined" && typeof process.versions !== "undefined" && "bun" in process.versions;
}
function decorateGeminiSchema(geminiSchema, zodSchema) {
  if (geminiSchema.nullable === void 0) {
    geminiSchema.nullable = zodSchema.isOptional();
  }
  if (zodSchema.description) {
    geminiSchema.description = zodSchema.description;
  }
  return geminiSchema;
}
function toGeminiSchema(zodSchema) {
  const zodType = getZodType(zodSchema);
  switch (zodType) {
    case "ZodArray": {
      return decorateGeminiSchema(
        {
          type: import_genai.Type.ARRAY,
          items: toGeminiSchema(
            zodSchema.element
          )
        },
        zodSchema
      );
    }
    case "ZodObject": {
      const properties = {};
      const required = [];
      Object.entries(zodSchema.shape).forEach(
        ([key, value]) => {
          properties[key] = toGeminiSchema(value);
          if (getZodType(value) !== "ZodOptional") {
            required.push(key);
          }
        }
      );
      return decorateGeminiSchema(
        {
          type: import_genai.Type.OBJECT,
          properties,
          required: required.length > 0 ? required : void 0
        },
        zodSchema
      );
    }
    case "ZodString":
      return decorateGeminiSchema(
        {
          type: import_genai.Type.STRING
        },
        zodSchema
      );
    case "ZodNumber":
      return decorateGeminiSchema(
        {
          type: import_genai.Type.NUMBER
        },
        zodSchema
      );
    case "ZodBoolean":
      return decorateGeminiSchema(
        {
          type: import_genai.Type.BOOLEAN
        },
        zodSchema
      );
    case "ZodEnum":
      return decorateGeminiSchema(
        {
          type: import_genai.Type.STRING,
          enum: zodSchema._def.values
        },
        zodSchema
      );
    case "ZodDefault":
    case "ZodNullable":
    case "ZodOptional": {
      const innerSchema = toGeminiSchema(zodSchema._def.innerType);
      return decorateGeminiSchema(
        __spreadProps(__spreadValues({}, innerSchema), {
          nullable: true
        }),
        zodSchema
      );
    }
    case "ZodLiteral":
      return decorateGeminiSchema(
        {
          type: import_genai.Type.STRING,
          enum: [zodSchema._def.value]
        },
        zodSchema
      );
    default:
      return decorateGeminiSchema(
        {
          type: import_genai.Type.OBJECT,
          nullable: true
        },
        zodSchema
      );
  }
}
function getZodType(schema) {
  return schema._def.typeName;
}
function transformSchema(schema, currentPath) {
  var _a15, _b;
  if (isKind(schema, import_v33.ZodFirstPartyTypeKind.ZodString)) {
    const hasUrlCheck = (_b = (_a15 = schema._def.checks) == null ? void 0 : _a15.some(
      (check) => check.kind === "url"
    )) != null ? _b : false;
    if (hasUrlCheck) {
      return [makeIdStringSchema(schema), [{ segments: [] }]];
    }
    return [schema, []];
  }
  if (isKind(schema, import_v33.ZodFirstPartyTypeKind.ZodObject)) {
    const shape = schema._def.shape();
    const newShape = {};
    const urlPaths = [];
    let changed = false;
    const shapeKeys = Object.keys(shape);
    for (const key of shapeKeys) {
      const child = shape[key];
      const [transformedChild, childPaths] = transformSchema(child, [
        ...currentPath,
        key
      ]);
      if (transformedChild !== child) {
        changed = true;
      }
      newShape[key] = transformedChild;
      if (childPaths.length > 0) {
        for (const cp of childPaths) {
          urlPaths.push({ segments: [key, ...cp.segments] });
        }
      }
    }
    if (changed) {
      return [import_v33.z.object(newShape), urlPaths];
    }
    return [schema, urlPaths];
  }
  if (isKind(schema, import_v33.ZodFirstPartyTypeKind.ZodArray)) {
    const itemType = schema._def.type;
    const [transformedItem, childPaths] = transformSchema(itemType, [
      ...currentPath,
      "*"
    ]);
    const changed = transformedItem !== itemType;
    const arrayPaths = childPaths.map((cp) => ({
      segments: ["*", ...cp.segments]
    }));
    if (changed) {
      return [import_v33.z.array(transformedItem), arrayPaths];
    }
    return [schema, arrayPaths];
  }
  if (isKind(schema, import_v33.ZodFirstPartyTypeKind.ZodUnion)) {
    const unionOptions = schema._def.options;
    const newOptions = [];
    let changed = false;
    let allPaths = [];
    unionOptions.forEach((option, idx) => {
      const [newOption, childPaths] = transformSchema(option, [
        ...currentPath,
        `union_${idx}`
      ]);
      if (newOption !== option) {
        changed = true;
      }
      newOptions.push(newOption);
      allPaths = [...allPaths, ...childPaths];
    });
    if (changed) {
      return [
        import_v33.z.union(newOptions),
        allPaths
      ];
    }
    return [schema, allPaths];
  }
  if (isKind(schema, import_v33.ZodFirstPartyTypeKind.ZodIntersection)) {
    const leftType = schema._def.left;
    const rightType = schema._def.right;
    const [left, leftPaths] = transformSchema(leftType, [
      ...currentPath,
      "intersection_left"
    ]);
    const [right, rightPaths] = transformSchema(rightType, [
      ...currentPath,
      "intersection_right"
    ]);
    const changed = left !== leftType || right !== rightType;
    const allPaths = [...leftPaths, ...rightPaths];
    if (changed) {
      return [import_v33.z.intersection(left, right), allPaths];
    }
    return [schema, allPaths];
  }
  if (isKind(schema, import_v33.ZodFirstPartyTypeKind.ZodOptional)) {
    const innerType = schema._def.innerType;
    const [inner, innerPaths] = transformSchema(innerType, currentPath);
    if (inner !== innerType) {
      return [import_v33.z.optional(inner), innerPaths];
    }
    return [schema, innerPaths];
  }
  if (isKind(schema, import_v33.ZodFirstPartyTypeKind.ZodNullable)) {
    const innerType = schema._def.innerType;
    const [inner, innerPaths] = transformSchema(innerType, currentPath);
    if (inner !== innerType) {
      return [import_v33.z.nullable(inner), innerPaths];
    }
    return [schema, innerPaths];
  }
  if (isKind(schema, import_v33.ZodFirstPartyTypeKind.ZodEffects)) {
    const baseSchema = schema._def.schema;
    const [newBaseSchema, basePaths] = transformSchema(baseSchema, currentPath);
    if (newBaseSchema !== baseSchema) {
      return [import_v33.z.effect(newBaseSchema, schema._def.effect), basePaths];
    }
    return [schema, basePaths];
  }
  return [schema, []];
}
function injectUrls(obj, path4, idToUrlMapping) {
  var _a15;
  if (path4.length === 0) return;
  const [key, ...rest] = path4;
  if (key === "*") {
    if (Array.isArray(obj)) {
      for (const item of obj) injectUrls(item, rest, idToUrlMapping);
    }
    return;
  }
  if (obj && typeof obj === "object") {
    const record = obj;
    if (path4.length === 1) {
      const fieldValue = record[key];
      const id = typeof fieldValue === "number" ? String(fieldValue) : typeof fieldValue === "string" && ID_PATTERN.test(fieldValue) ? fieldValue : void 0;
      if (id !== void 0) {
        record[key] = (_a15 = idToUrlMapping[id]) != null ? _a15 : "";
      }
    } else {
      injectUrls(record[key], rest, idToUrlMapping);
    }
  }
}
function isKind(s, kind) {
  return s._def.typeName === kind;
}
function makeIdStringSchema(orig) {
  var _a15, _b, _c;
  const userDesc = (
    // Zod ≥3.23 exposes .description directly; fall back to _def for older minor versions
    (_c = (_b = orig.description) != null ? _b : (_a15 = orig._def) == null ? void 0 : _a15.description) != null ? _c : ""
  );
  const base = `This field must be the element-ID in the form 'frameId-backendId' (e.g. "0-432").`;
  const composed = userDesc.trim().length > 0 ? `${base} that follows this user-defined description: ${userDesc}` : base;
  return import_v33.z.string().regex(ID_PATTERN).describe(composed);
}
var providerEnvVarMap = {
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  google: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
  cerebras: "CEREBRAS_API_KEY",
  togetherai: "TOGETHER_AI_API_KEY",
  mistral: "MISTRAL_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  perplexity: "PERPLEXITY_API_KEY",
  azure: "AZURE_API_KEY",
  xai: "XAI_API_KEY",
  google_legacy: "GOOGLE_API_KEY"
};
function loadApiKeyFromEnv(provider, logger) {
  if (!provider) {
    return void 0;
  }
  const envVarName = providerEnvVarMap[provider];
  if (!envVarName) {
    logger({
      category: "init",
      message: `No known environment variable for provider '${provider}'`,
      level: 0
    });
    return void 0;
  }
  const apiKeyFromEnv = process.env[envVarName];
  if (typeof apiKeyFromEnv === "string" && apiKeyFromEnv.length > 0) {
    return apiKeyFromEnv;
  }
  logger({
    category: "init",
    message: `API key for ${provider} not found in environment variable ${envVarName}`,
    level: 0
  });
  return void 0;
}
function trimTrailingTextNode(path4) {
  return path4 == null ? void 0 : path4.replace(/\/text\(\)(\[\d+\])?$/iu, "");
}

// lib/a11y/utils.ts
var IFRAME_STEP_RE2 = /iframe\[\d+]$/i;
var PUA_START = 57344;
var PUA_END = 63743;
var NBSP_CHARS = /* @__PURE__ */ new Set([160, 8239, 8199, 65279]);
var WORLD_NAME = "stagehand-world";
function cleanText(input) {
  let out = "";
  let prevWasSpace = false;
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code >= PUA_START && code <= PUA_END) {
      continue;
    }
    if (NBSP_CHARS.has(code)) {
      if (!prevWasSpace) {
        out += " ";
        prevWasSpace = true;
      }
      continue;
    }
    out += input[i];
    prevWasSpace = input[i] === " ";
  }
  return out.trim();
}
function formatSimplifiedTree(node, level = 0) {
  var _a15, _b, _c;
  const indent = "  ".repeat(level);
  const idLabel = (_a15 = node.encodedId) != null ? _a15 : node.nodeId;
  const namePart = node.name ? `: ${cleanText(node.name)}` : "";
  const currentLine = `${indent}[${idLabel}] ${node.role}${namePart}
`;
  const childrenLines = (_c = (_b = node.children) == null ? void 0 : _b.map((c) => formatSimplifiedTree(c, level + 1)).join("")) != null ? _c : "";
  return currentLine + childrenLines;
}
var lowerCache = /* @__PURE__ */ new Map();
var lc = (raw) => {
  let v = lowerCache.get(raw);
  if (!v) {
    v = raw.toLowerCase();
    lowerCache.set(raw, v);
  }
  return v;
};
function buildBackendIdMaps(experimental, sp, targetFrame) {
  return __async(this, null, function* () {
    var _a15, _b, _c, _d, _e;
    let session;
    if (!targetFrame || targetFrame === sp.page.mainFrame()) {
      session = yield sp.getCDPClient();
    } else {
      try {
        session = yield sp.context.newCDPSession(targetFrame);
      } catch (e) {
        session = yield sp.getCDPClient();
      }
    }
    yield sp.enableCDP(
      "DOM",
      session === (yield sp.getCDPClient()) ? void 0 : targetFrame
    );
    try {
      const { root } = yield session.send("DOM.getDocument", {
        depth: -1,
        pierce: true
      });
      let startNode = root;
      let rootFid = targetFrame && (yield getCDPFrameId(sp, targetFrame));
      if (targetFrame && targetFrame !== sp.page.mainFrame() && session === (yield sp.getCDPClient())) {
        const frameId = rootFid;
        const { backendNodeId } = yield sp.sendCDP(
          "DOM.getFrameOwner",
          { frameId }
        );
        let iframeNode;
        const locate = (n) => {
          var _a16, _b2, _c2, _d2;
          if (experimental) {
            if (n.backendNodeId === backendNodeId) {
              iframeNode = n;
              return true;
            }
            if ((_a16 = n.shadowRoots) == null ? void 0 : _a16.some(locate)) return true;
            if ((_b2 = n.children) == null ? void 0 : _b2.some(locate)) return true;
            if (n.contentDocument && locate(n.contentDocument)) return true;
            return false;
          } else {
            if (n.backendNodeId === backendNodeId) return iframeNode = n, true;
            return ((_d2 = (_c2 = n.children) == null ? void 0 : _c2.some(locate)) != null ? _d2 : false) || (n.contentDocument ? locate(n.contentDocument) : false);
          }
        };
        if (!locate(root) || !(iframeNode == null ? void 0 : iframeNode.contentDocument)) {
          throw new Error("iframe element or its contentDocument not found");
        }
        startNode = iframeNode.contentDocument;
        rootFid = (_a15 = iframeNode.contentDocument.frameId) != null ? _a15 : frameId;
      }
      const tagNameMap = {};
      const xpathMap = {};
      const stack = [{ node: startNode, path: "", fid: rootFid }];
      const seen = /* @__PURE__ */ new Set();
      const joinStep = (base, step) => base.endsWith("//") ? `${base}${step}` : `${base}/${step}`;
      while (stack.length) {
        const { node, path: path4, fid } = stack.pop();
        if (!node.backendNodeId) continue;
        const enc = sp.encodeWithFrameId(fid, node.backendNodeId);
        if (seen.has(enc)) continue;
        seen.add(enc);
        tagNameMap[enc] = lc(String(node.nodeName));
        xpathMap[enc] = path4;
        if (lc(node.nodeName) === "iframe" && node.contentDocument) {
          const childFid = (_b = node.contentDocument.frameId) != null ? _b : fid;
          stack.push({ node: node.contentDocument, path: "", fid: childFid });
        }
        if (((_c = node.shadowRoots) == null ? void 0 : _c.length) && experimental) {
          for (const shadowRoot of node.shadowRoots) {
            stack.push({
              node: shadowRoot,
              path: `${path4}//`,
              fid
            });
          }
        }
        const kids = (_d = node.children) != null ? _d : [];
        if (kids.length) {
          const segs = [];
          const ctr = {};
          for (const child of kids) {
            const tag = lc(String(child.nodeName));
            const key = `${child.nodeType}:${tag}`;
            const idx = ctr[key] = ((_e = ctr[key]) != null ? _e : 0) + 1;
            if (child.nodeType === 3) {
              segs.push(`text()[${idx}]`);
            } else if (child.nodeType === 8) {
              segs.push(`comment()[${idx}]`);
            } else {
              segs.push(
                tag.includes(":") ? `*[name()='${tag}'][${idx}]` : `${tag}[${idx}]`
              );
            }
          }
          for (let i = kids.length - 1; i >= 0; i--) {
            stack.push({
              node: kids[i],
              path: joinStep(path4, segs[i]),
              fid
            });
          }
        }
      }
      return { tagNameMap, xpathMap };
    } finally {
      yield sp.disableCDP(
        "DOM",
        session === (yield sp.getCDPClient()) ? void 0 : targetFrame
      );
    }
  });
}
function cleanStructuralNodes(node, tagNameMap, logger) {
  return __async(this, null, function* () {
    var _a15;
    if (+node.nodeId < 0) return null;
    if (!((_a15 = node.children) == null ? void 0 : _a15.length)) {
      return node.role === "generic" || node.role === "none" ? null : node;
    }
    const cleanedChildren = (yield Promise.all(
      node.children.map((c) => cleanStructuralNodes(c, tagNameMap, logger))
    )).filter(Boolean);
    if (node.role === "generic" || node.role === "none") {
      if (cleanedChildren.length === 1) {
        return cleanedChildren[0];
      } else if (cleanedChildren.length === 0) {
        return null;
      }
      if (cleanedChildren.length === 0) return null;
    }
    if ((node.role === "generic" || node.role === "none") && node.encodedId !== void 0) {
      const tagName = tagNameMap[node.encodedId];
      if (tagName) node.role = tagName;
    }
    if (node.role === "combobox" && node.encodedId !== void 0 && tagNameMap[node.encodedId] === "select") {
      node.role = "select";
    }
    const pruned = removeRedundantStaticTextChildren(node, cleanedChildren);
    if (!pruned.length && (node.role === "generic" || node.role === "none")) {
      return null;
    }
    return __spreadProps(__spreadValues({}, node), { children: pruned });
  });
}
function buildHierarchicalTree(nodes, tagNameMap, logger, xpathMap) {
  return __async(this, null, function* () {
    var _a15, _b, _c, _d, _e;
    const idToUrl = {};
    const nodeMap = /* @__PURE__ */ new Map();
    const iframeList = [];
    const isInteractive = (n) => n.role !== "none" && n.role !== "generic" && n.role !== "InlineTextBox";
    const backendToIds = /* @__PURE__ */ new Map();
    for (const enc of Object.keys(tagNameMap)) {
      const [, backend] = enc.split("-");
      const list = (_a15 = backendToIds.get(+backend)) != null ? _a15 : [];
      list.push(enc);
      backendToIds.set(+backend, list);
    }
    for (const node of nodes) {
      if (+node.nodeId < 0) continue;
      const url = extractUrlFromAXNode(node);
      const keep = ((_b = node.name) == null ? void 0 : _b.trim()) || ((_c = node.childIds) == null ? void 0 : _c.length) || isInteractive(node);
      if (!keep) continue;
      let encodedId;
      if (node.backendDOMNodeId !== void 0) {
        const matches = (_d = backendToIds.get(node.backendDOMNodeId)) != null ? _d : [];
        if (matches.length === 1) encodedId = matches[0];
      }
      if (url && encodedId) idToUrl[encodedId] = url;
      nodeMap.set(node.nodeId, __spreadValues(__spreadValues(__spreadValues(__spreadValues({
        encodedId,
        role: node.role,
        nodeId: node.nodeId
      }, node.name && { name: node.name }), node.description && { description: node.description }), node.value && { value: node.value }), node.backendDOMNodeId !== void 0 && {
        backendDOMNodeId: node.backendDOMNodeId
      }));
    }
    for (const node of nodes) {
      if (node.role === "Iframe")
        iframeList.push({ role: node.role, nodeId: node.nodeId });
      if (!node.parentId) continue;
      const parent = nodeMap.get(node.parentId);
      const current = nodeMap.get(node.nodeId);
      if (parent && current) ((_e = parent.children) != null ? _e : parent.children = []).push(current);
    }
    const roots = nodes.filter((n) => !n.parentId && nodeMap.has(n.nodeId)).map((n) => nodeMap.get(n.nodeId));
    const cleanedRoots = (yield Promise.all(
      roots.map((n) => cleanStructuralNodes(n, tagNameMap, logger))
    )).filter(Boolean);
    const simplified = cleanedRoots.map(formatSimplifiedTree).join("\n");
    return {
      tree: cleanedRoots,
      simplified,
      iframes: iframeList,
      idToUrl,
      xpathMap
    };
  });
}
function getCDPFrameId(sp, frame) {
  return __async(this, null, function* () {
    if (!frame || frame === sp.page.mainFrame()) return void 0;
    const rootResp = yield sp.sendCDP("Page.getFrameTree");
    const { frameTree: root } = rootResp;
    const targetUrl = frame.url();
    let depth = 0;
    for (let p = frame.parentFrame(); p; p = p.parentFrame()) depth++;
    const withFragment = (f) => {
      var _a15;
      return f.url + ((_a15 = f.urlFragment) != null ? _a15 : "");
    };
    const findByUrlDepth = (node, lvl = 0) => {
      var _a15;
      if (lvl === depth && withFragment(node.frame) === targetUrl)
        return node.frame.id;
      for (const child of (_a15 = node.childFrames) != null ? _a15 : []) {
        const id = findByUrlDepth(child, lvl + 1);
        if (id) return id;
      }
      return void 0;
    };
    const sameProcId = findByUrlDepth(root);
    if (sameProcId) return sameProcId;
    try {
      const sess = yield sp.context.newCDPSession(frame);
      const ownResp = yield sess.send("Page.getFrameTree");
      const { frameTree } = ownResp;
      return frameTree.frame.id;
    } catch (err) {
      throw new StagehandIframeError(targetUrl, String(err));
    }
  });
}
function getAccessibilityTree(experimental, stagehandPage, logger, selector, targetFrame) {
  return __async(this, null, function* () {
    const { tagNameMap, xpathMap } = yield buildBackendIdMaps(
      experimental,
      stagehandPage,
      targetFrame
    );
    yield stagehandPage.enableCDP("Accessibility", targetFrame);
    try {
      let params = {};
      let sessionFrame = targetFrame;
      if (targetFrame && targetFrame !== stagehandPage.page.mainFrame()) {
        let isOopif = true;
        try {
          yield stagehandPage.context.newCDPSession(targetFrame);
        } catch (e) {
          isOopif = false;
        }
        if (!isOopif) {
          const frameId = yield getCDPFrameId(stagehandPage, targetFrame);
          logger({
            message: `same-proc iframe: frameId=${frameId}. Using existing CDP session.`,
            level: 1
          });
          if (frameId) params = { frameId };
          sessionFrame = void 0;
        } else {
          logger({ message: `OOPIF iframe: starting new CDP session`, level: 1 });
          params = {};
          sessionFrame = targetFrame;
        }
      }
      const { nodes: fullNodes } = yield stagehandPage.sendCDP("Accessibility.getFullAXTree", params, sessionFrame);
      const scrollableIds = yield findScrollableElementIds(
        stagehandPage,
        targetFrame
      );
      let nodes = fullNodes;
      if (selector) {
        nodes = yield filterAXTreeByXPath(
          stagehandPage,
          fullNodes,
          selector,
          targetFrame
        );
      }
      const start = Date.now();
      const tree = yield buildHierarchicalTree(
        decorateRoles(nodes, scrollableIds),
        tagNameMap,
        logger,
        xpathMap
      );
      logger({
        category: "observation",
        message: `got accessibility tree in ${Date.now() - start} ms`,
        level: 1
      });
      return tree;
    } finally {
      yield stagehandPage.disableCDP("Accessibility", targetFrame);
    }
  });
}
function filterAXTreeByXPath(page, full, xpath, targetFrame) {
  return __async(this, null, function* () {
    var _a15;
    const objectId = yield resolveObjectIdForXPath(page, xpath, targetFrame);
    const { node } = yield page.sendCDP(
      "DOM.describeNode",
      { objectId },
      targetFrame
    );
    if (!(node == null ? void 0 : node.backendNodeId)) {
      throw new StagehandDomProcessError(
        `Unable to resolve backendNodeId for "${xpath}"`
      );
    }
    const target = full.find((n) => n.backendDOMNodeId === node.backendNodeId);
    const keep = /* @__PURE__ */ new Set([target.nodeId]);
    const queue = [target];
    while (queue.length) {
      const cur = queue.shift();
      for (const id of (_a15 = cur.childIds) != null ? _a15 : []) {
        if (keep.has(id)) continue;
        keep.add(id);
        const child = full.find((n) => n.nodeId === id);
        if (child) queue.push(child);
      }
    }
    return full.filter((n) => keep.has(n.nodeId)).map(
      (n) => n.nodeId === target.nodeId ? __spreadProps(__spreadValues({}, n), { parentId: void 0 }) : n
    );
  });
}
function decorateRoles(nodes, scrollables) {
  return nodes.map((n) => {
    var _a15, _b, _c, _d, _e;
    let role = (_b = (_a15 = n.role) == null ? void 0 : _a15.value) != null ? _b : "";
    if (scrollables.has(n.backendDOMNodeId)) {
      role = role && role !== "generic" && role !== "none" ? `scrollable, ${role}` : "scrollable";
    }
    return {
      role,
      name: (_c = n.name) == null ? void 0 : _c.value,
      description: (_d = n.description) == null ? void 0 : _d.value,
      value: (_e = n.value) == null ? void 0 : _e.value,
      nodeId: n.nodeId,
      backendDOMNodeId: n.backendDOMNodeId,
      parentId: n.parentId,
      childIds: n.childIds,
      properties: n.properties
    };
  });
}
function getFrameRootBackendNodeId(sp, frame) {
  return __async(this, null, function* () {
    if (!frame || frame === sp.page.mainFrame()) {
      return null;
    }
    try {
      const cdp = yield sp.page.context().newCDPSession(sp.page);
      const fid = yield getCDPFrameId(sp, frame);
      if (!fid) {
        return null;
      }
      const { backendNodeId } = yield cdp.send("DOM.getFrameOwner", {
        frameId: fid
      });
      return backendNodeId != null ? backendNodeId : null;
    } catch (error) {
      sp.stagehand.logger({
        category: "a11y",
        message: `Error getting frame root backend node id: ${String(error)}`,
        level: 0
      });
      return null;
    }
  });
}
function getFrameRootXpathWithShadow(frame) {
  return __async(this, null, function* () {
    if (!frame) {
      return "/";
    }
    const handle = yield frame.frameElement();
    return handle.evaluate((node) => {
      function stepFor(el2) {
        const tag = el2.tagName.toLowerCase();
        let i = 1;
        for (let sib = el2.previousElementSibling; sib; sib = sib.previousElementSibling) {
          if (sib.tagName.toLowerCase() === tag) i++;
        }
        return `${tag}[${i}]`;
      }
      const segs = [];
      let el = node;
      while (el) {
        segs.unshift(stepFor(el));
        if (el.parentElement) {
          el = el.parentElement;
          continue;
        }
        const root = el.getRootNode();
        if (root.host) {
          segs.unshift("");
          el = root.host;
          continue;
        }
        break;
      }
      return "/" + segs.join("/");
    });
  });
}
function getFrameRootXpath(frame) {
  return __async(this, null, function* () {
    if (!frame) {
      return "/";
    }
    const handle = yield frame.frameElement();
    return handle.evaluate((node) => {
      const pos = (el) => {
        let i = 1;
        for (let sib = el.previousElementSibling; sib; sib = sib.previousElementSibling)
          if (sib.tagName === el.tagName) i += 1;
        return i;
      };
      const segs = [];
      for (let el = node; el; el = el.parentElement)
        segs.unshift(`${el.tagName.toLowerCase()}[${pos(el)}]`);
      return `/${segs.join("/")}`;
    });
  });
}
function injectSubtrees(tree, idToTree) {
  var _a15, _b;
  const uniqueByBackend = (backendId) => {
    let found;
    let hit = 0;
    for (const enc of idToTree.keys()) {
      const [, b] = enc.split("-");
      if (+b === backendId) {
        if (++hit > 1) return;
        found = enc;
      }
    }
    return hit === 1 ? found : void 0;
  };
  const stack = [{ lines: tree.split("\n"), idx: 0, indent: "" }];
  const out = [];
  const visited = /* @__PURE__ */ new Set();
  while (stack.length) {
    const top = stack[stack.length - 1];
    if (top.idx >= top.lines.length) {
      stack.pop();
      continue;
    }
    const raw = top.lines[top.idx++];
    const line = top.indent + raw;
    out.push(line);
    const m = /^\s*\[([^\]]+)]/.exec(raw);
    if (!m) continue;
    const label = m[1];
    let enc;
    let child;
    if (idToTree.has(label)) {
      enc = label;
      child = idToTree.get(enc);
    } else {
      let backendId;
      const dashMatch = ID_PATTERN.exec(label);
      if (dashMatch) {
        backendId = +dashMatch[0].split("-")[1];
      } else if (/^\d+$/.test(label)) {
        backendId = +label;
      }
      if (backendId !== void 0) {
        const alt = uniqueByBackend(backendId);
        if (alt) {
          enc = alt;
          child = idToTree.get(alt);
        }
      }
    }
    if (!enc || !child || visited.has(enc)) continue;
    visited.add(enc);
    stack.push({
      lines: child.split("\n"),
      idx: 0,
      indent: ((_b = (_a15 = line.match(/^\s*/)) == null ? void 0 : _a15[0]) != null ? _b : "") + "  "
    });
  }
  return out.join("\n");
}
function getAccessibilityTreeWithFrames(experimental, stagehandPage, logger, rootXPath) {
  return __async(this, null, function* () {
    var _a15, _b;
    const main = stagehandPage.page.mainFrame();
    let targetFrames;
    let innerXPath;
    if (rootXPath == null ? void 0 : rootXPath.trim()) {
      const { frames, rest } = yield resolveFrameChain(
        stagehandPage,
        rootXPath.trim()
      );
      targetFrames = frames.length ? frames : void 0;
      innerXPath = rest;
    }
    const mainOnlyFilter = !!innerXPath && !targetFrames;
    const snapshots = [];
    const frameStack = [main];
    while (frameStack.length) {
      const frame = frameStack.pop();
      frame.childFrames().forEach((c) => frameStack.push(c));
      if (targetFrames && !targetFrames.includes(frame)) continue;
      if (!targetFrames && frame !== main && innerXPath) continue;
      const selector = targetFrames ? frame === targetFrames.at(-1) ? innerXPath : void 0 : frame === main ? innerXPath : void 0;
      try {
        const res = yield getAccessibilityTree(
          experimental,
          stagehandPage,
          logger,
          selector,
          frame
        );
        const backendId = frame === main ? null : yield getFrameRootBackendNodeId(stagehandPage, frame);
        let frameXpath;
        if (experimental) {
          frameXpath = frame === main ? "/" : yield getFrameRootXpathWithShadow(frame);
        } else {
          frameXpath = frame === main ? "/" : yield getFrameRootXpath(frame);
        }
        const frameId = yield getCDPFrameId(stagehandPage, frame);
        snapshots.push({
          frame,
          tree: res.simplified.trimEnd(),
          xpathMap: res.xpathMap,
          urlMap: res.idToUrl,
          frameXpath,
          backendNodeId: backendId,
          parentFrame: frame.parentFrame(),
          frameId
        });
        if (mainOnlyFilter) break;
      } catch (err) {
        logger({
          category: "observation",
          message: `\u26A0\uFE0F failed to get AX tree for ${frame === main ? "main frame" : `iframe (${frame.url()})`}`,
          level: 1,
          auxiliary: { error: { value: String(err), type: "string" } }
        });
      }
    }
    const combinedXpathMap = {};
    const combinedUrlMap = {};
    const seg = /* @__PURE__ */ new Map();
    for (const s of snapshots) seg.set(s.frame, s.frameXpath);
    function fullPrefix(f) {
      var _a16;
      if (!f || f === main) return "";
      const parent = f.parentFrame();
      const above = fullPrefix(parent);
      const hop = (_a16 = seg.get(f)) != null ? _a16 : "";
      return hop === "/" ? above : above ? `${above.replace(/\/$/, "")}/${hop.replace(/^\//, "")}` : hop;
    }
    for (const snap of snapshots) {
      const prefix = snap.frameXpath === "/" ? "" : `${fullPrefix(snap.parentFrame)}${snap.frameXpath}`;
      for (const [enc, local] of Object.entries(snap.xpathMap)) {
        combinedXpathMap[enc] = local === "" ? prefix || "/" : prefix ? `${prefix.replace(/\/$/, "")}/${local.replace(/^\//, "")}` : local;
      }
      Object.assign(combinedUrlMap, snap.urlMap);
    }
    const idToTree = /* @__PURE__ */ new Map();
    for (const { backendNodeId, frameId, tree } of snapshots)
      if (backendNodeId !== null && frameId !== void 0)
        idToTree.set(
          stagehandPage.encodeWithFrameId(frameId, backendNodeId),
          tree
        );
    const rootSnap = snapshots.find((s) => s.frameXpath === "/");
    const combinedTree = rootSnap ? injectSubtrees(rootSnap.tree, idToTree) : (_b = (_a15 = snapshots[0]) == null ? void 0 : _a15.tree) != null ? _b : "";
    return { combinedTree, combinedXpathMap, combinedUrlMap };
  });
}
function findScrollableElementIds(stagehandPage, targetFrame) {
  return __async(this, null, function* () {
    const xpaths = targetFrame ? yield targetFrame.evaluate(() => window.getScrollableElementXpaths()) : yield stagehandPage.page.evaluate(
      () => window.getScrollableElementXpaths()
    );
    const backendIds = /* @__PURE__ */ new Set();
    for (const xpath of xpaths) {
      if (!xpath) continue;
      const objectId = yield resolveObjectIdForXPath(
        stagehandPage,
        xpath,
        targetFrame
      );
      if (objectId) {
        const { node } = yield stagehandPage.sendCDP("DOM.describeNode", { objectId }, targetFrame);
        if (node == null ? void 0 : node.backendNodeId) backendIds.add(node.backendNodeId);
      }
    }
    return backendIds;
  });
}
function resolveObjectIdForXPath(page, xpath, targetFrame) {
  return __async(this, null, function* () {
    const contextId = yield getFrameExecutionContextId(page, targetFrame);
    const { result } = yield page.sendCDP(
      "Runtime.evaluate",
      __spreadValues({
        expression: `
        (() => {
          const res = document.evaluate(
            ${JSON.stringify(xpath)},
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          return res.singleNodeValue;
        })();
      `,
        returnByValue: false
      }, contextId !== void 0 ? { contextId } : {}),
      targetFrame
    );
    if (!(result == null ? void 0 : result.objectId)) throw new StagehandElementNotFoundError([xpath]);
    return result.objectId;
  });
}
function getFrameExecutionContextId(stagehandPage, frame) {
  return __async(this, null, function* () {
    if (!frame || frame === stagehandPage.page.mainFrame()) {
      return void 0;
    }
    const frameId = yield getCDPFrameId(stagehandPage, frame);
    const { executionContextId } = yield stagehandPage.sendCDP(
      "Page.createIsolatedWorld",
      {
        frameId,
        worldName: WORLD_NAME,
        grantUniversalAccess: true
      },
      frame
    );
    return executionContextId;
  });
}
function normaliseSpaces(s) {
  let out = "";
  let inWs = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    const isWs = ch === 32 || ch === 9 || ch === 10 || ch === 13;
    if (isWs) {
      if (!inWs) {
        out += " ";
        inWs = true;
      }
    } else {
      out += s[i];
      inWs = false;
    }
  }
  return out;
}
function removeRedundantStaticTextChildren(parent, children) {
  if (!parent.name) return children;
  const parentNorm = normaliseSpaces(parent.name).trim();
  let combinedText = "";
  for (const child of children) {
    if (child.role === "StaticText" && child.name) {
      combinedText += normaliseSpaces(child.name).trim();
    }
  }
  if (combinedText === parentNorm) {
    return children.filter((c) => c.role !== "StaticText");
  }
  return children;
}
function extractUrlFromAXNode(axNode) {
  if (!axNode.properties) return void 0;
  const urlProp = axNode.properties.find((prop) => prop.name === "url");
  if (urlProp && urlProp.value && typeof urlProp.value.value === "string") {
    return urlProp.value.value.trim();
  }
  return void 0;
}
function resolveFrameChain(sp, absPath) {
  return __async(this, null, function* () {
    let path4 = absPath.startsWith("/") ? absPath : "/" + absPath;
    let ctxFrame = void 0;
    const chain = [];
    while (true) {
      try {
        yield resolveObjectIdForXPath(sp, path4, ctxFrame);
        return { frames: chain, rest: path4 };
      } catch (e) {
      }
      const steps = path4.split("/").filter(Boolean);
      const buf = [];
      for (let i = 0; i < steps.length; i++) {
        buf.push(steps[i]);
        if (IFRAME_STEP_RE2.test(steps[i])) {
          const selector = "xpath=/" + buf.join("/");
          const handle = (ctxFrame != null ? ctxFrame : sp.page.mainFrame()).locator(selector);
          const frame = yield handle.elementHandle().then((h) => h == null ? void 0 : h.contentFrame());
          if (!frame) throw new ContentFrameNotFoundError(selector);
          chain.push(frame);
          ctxFrame = frame;
          path4 = "/" + steps.slice(i + 1).join("/");
          break;
        }
        if (i === steps.length - 1) {
          throw new XPathResolutionError(absPath);
        }
      }
    }
  });
}

// lib/handlers/extractHandler.ts
var StagehandExtractHandler = class {
  constructor({
    stagehand,
    logger,
    stagehandPage,
    userProvidedInstructions,
    experimental
  }) {
    this.stagehand = stagehand;
    this.logger = logger;
    this.stagehandPage = stagehandPage;
    this.userProvidedInstructions = userProvidedInstructions;
    this.experimental = experimental;
  }
  extract() {
    return __async(this, arguments, function* ({
      instruction,
      schema,
      content = {},
      llmClient,
      requestId,
      domSettleTimeoutMs,
      useTextExtract,
      selector,
      iframes
    } = {}) {
      const noArgsCalled = !instruction && !schema && !llmClient && !selector;
      if (noArgsCalled) {
        this.logger({
          category: "extraction",
          message: "Extracting the entire page text.",
          level: 1
        });
        return this.extractPageText();
      }
      if (useTextExtract !== void 0) {
        this.logger({
          category: "extraction",
          message: "Warning: the `useTextExtract` parameter has no effect in this version of Stagehand and will be removed in future versions.",
          level: 1
        });
      }
      return this.domExtract({
        instruction,
        schema,
        content,
        llmClient,
        requestId,
        domSettleTimeoutMs,
        selector,
        iframes
      });
    });
  }
  extractPageText(domSettleTimeoutMs) {
    return __async(this, null, function* () {
      yield this.stagehandPage._waitForSettledDom(domSettleTimeoutMs);
      const tree = yield getAccessibilityTree(
        this.experimental,
        this.stagehandPage,
        this.logger
      );
      this.logger({
        category: "extraction",
        message: "Getting accessibility tree data",
        level: 1
      });
      const outputString = tree.simplified;
      const result = { page_text: outputString };
      return pageTextSchema.parse(result);
    });
  }
  domExtract(_0) {
    return __async(this, arguments, function* ({
      instruction,
      schema,
      llmClient,
      requestId,
      domSettleTimeoutMs,
      selector,
      iframes
    }) {
      var _a15;
      this.logger({
        category: "extraction",
        message: "starting extraction using a11y tree",
        level: 1,
        auxiliary: {
          instruction: {
            value: instruction,
            type: "string"
          }
        }
      });
      yield this.stagehandPage._waitForSettledDom(domSettleTimeoutMs);
      const targetXpath = (_a15 = selector == null ? void 0 : selector.replace(/^xpath=/, "")) != null ? _a15 : "";
      const {
        combinedTree: outputString,
        combinedUrlMap: idToUrlMapping,
        discoveredIframes
      } = yield iframes ? getAccessibilityTreeWithFrames(
        this.experimental,
        this.stagehandPage,
        this.logger,
        targetXpath
      ).then(({ combinedTree, combinedUrlMap }) => ({
        combinedTree,
        combinedUrlMap,
        combinedXpathMap: {},
        discoveredIframes: []
      })) : getAccessibilityTree(
        this.experimental,
        this.stagehandPage,
        this.logger,
        targetXpath
      ).then(({ simplified, idToUrl, iframes: frameNodes }) => ({
        combinedTree: simplified,
        combinedUrlMap: idToUrl,
        combinedXpathMap: {},
        discoveredIframes: frameNodes
      }));
      this.logger({
        category: "extraction",
        message: "Got accessibility tree data",
        level: 1
      });
      if (discoveredIframes !== void 0 && discoveredIframes.length > 0) {
        this.logger({
          category: "extraction",
          message: `Warning: found ${discoveredIframes.length} iframe(s) on the page. If you wish to interact with iframe content, please make sure you are setting iframes: true`,
          level: 1
        });
      }
      const [transformedSchema, urlFieldPaths] = transformUrlStringsToNumericIds(schema);
      const extractionResponse = yield extract({
        instruction,
        domElements: outputString,
        schema: transformedSchema,
        chunksSeen: 1,
        chunksTotal: 1,
        llmClient,
        requestId,
        userProvidedInstructions: this.userProvidedInstructions,
        logger: this.logger,
        logInferenceToFile: this.stagehand.logInferenceToFile
      });
      const _b = extractionResponse, {
        metadata: { completed },
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        inference_time_ms: inferenceTimeMs
      } = _b, output = __objRest(_b, [
        "metadata",
        "prompt_tokens",
        "completion_tokens",
        "inference_time_ms"
      ]);
      this.stagehand.updateMetrics(
        "EXTRACT" /* EXTRACT */,
        promptTokens,
        completionTokens,
        inferenceTimeMs
      );
      this.logger({
        category: "extraction",
        message: "received extraction response",
        auxiliary: {
          extraction_response: {
            value: JSON.stringify(extractionResponse),
            type: "object"
          }
        }
      });
      if (completed) {
        this.logger({
          category: "extraction",
          message: "extraction completed successfully",
          level: 1,
          auxiliary: {
            extraction_response: {
              value: JSON.stringify(extractionResponse),
              type: "object"
            }
          }
        });
      } else {
        this.logger({
          category: "extraction",
          message: "extraction incomplete after processing all data",
          level: 1,
          auxiliary: {
            extraction_response: {
              value: JSON.stringify(extractionResponse),
              type: "object"
            }
          }
        });
      }
      for (const { segments } of urlFieldPaths) {
        injectUrls(output, segments, idToUrlMapping);
      }
      return output;
    });
  }
};
function transformUrlStringsToNumericIds(schema) {
  const shape = schema._def.shape();
  const newShape = {};
  const urlPaths = [];
  let changed = false;
  for (const [key, value] of Object.entries(shape)) {
    const [childTransformed, childPaths] = transformSchema(value, [key]);
    newShape[key] = childTransformed;
    if (childTransformed !== value) {
      changed = true;
    }
    if (childPaths.length > 0) {
      childPaths.forEach((cp) => {
        urlPaths.push({ segments: [key, ...cp.segments] });
      });
    }
  }
  const finalSchema = changed ? import_v34.z.object(newShape) : schema;
  return [finalSchema, urlPaths];
}

// lib/handlers/observeHandler.ts
var StagehandObserveHandler = class {
  constructor({
    stagehand,
    logger,
    stagehandPage,
    userProvidedInstructions,
    experimental
  }) {
    this.stagehand = stagehand;
    this.logger = logger;
    this.stagehandPage = stagehandPage;
    this.userProvidedInstructions = userProvidedInstructions;
    this.experimental = experimental;
  }
  observe(_0) {
    return __async(this, arguments, function* ({
      instruction,
      llmClient,
      requestId,
      returnAction,
      onlyVisible,
      drawOverlay,
      fromAct,
      iframes
    }) {
      if (!instruction) {
        instruction = `Find elements that can be used for any future actions in the page. These may be navigation links, related pages, section/subsection links, buttons, or other interactive elements. Be comprehensive: if there are multiple elements that may be relevant for future actions, return all of them.`;
      }
      this.logger({
        category: "observation",
        message: "starting observation",
        level: 1,
        auxiliary: {
          instruction: {
            value: instruction,
            type: "string"
          }
        }
      });
      if (onlyVisible !== void 0) {
        this.logger({
          category: "observation",
          message: "Warning: the `onlyVisible` parameter has no effect in this version of Stagehand and will be removed in future versions.",
          level: 1
        });
      }
      yield this.stagehandPage._waitForSettledDom();
      this.logger({
        category: "observation",
        message: "Getting accessibility tree data",
        level: 1
      });
      const { combinedTree, combinedXpathMap, discoveredIframes } = yield iframes ? getAccessibilityTreeWithFrames(
        this.experimental,
        this.stagehandPage,
        this.logger
      ).then(({ combinedTree: combinedTree2, combinedXpathMap: combinedXpathMap2 }) => ({
        combinedTree: combinedTree2,
        combinedXpathMap: combinedXpathMap2,
        discoveredIframes: []
      })) : getAccessibilityTree(
        this.experimental,
        this.stagehandPage,
        this.logger
      ).then(({ simplified, xpathMap, idToUrl, iframes: frameNodes }) => ({
        combinedTree: simplified,
        combinedXpathMap: xpathMap,
        combinedUrlMap: idToUrl,
        discoveredIframes: frameNodes
      }));
      const observationResponse = yield observe({
        instruction,
        domElements: combinedTree,
        llmClient,
        requestId,
        userProvidedInstructions: this.userProvidedInstructions,
        logger: this.logger,
        returnAction,
        logInferenceToFile: this.stagehand.logInferenceToFile,
        fromAct
      });
      const {
        prompt_tokens = 0,
        completion_tokens = 0,
        inference_time_ms = 0
      } = observationResponse;
      this.stagehand.updateMetrics(
        fromAct ? "ACT" /* ACT */ : "OBSERVE" /* OBSERVE */,
        prompt_tokens,
        completion_tokens,
        inference_time_ms
      );
      if (discoveredIframes.length > 0) {
        this.logger({
          category: "observation",
          message: `Warning: found ${discoveredIframes.length} iframe(s) on the page. If you wish to interact with iframe content, please make sure you are setting iframes: true`,
          level: 1
        });
        discoveredIframes.forEach((iframe) => {
          observationResponse.elements.push({
            elementId: this.stagehandPage.encodeWithFrameId(
              void 0,
              Number(iframe.nodeId)
            ),
            description: "an iframe",
            method: "not-supported",
            arguments: []
          });
        });
      }
      const elementsWithSelectors = (yield Promise.all(
        observationResponse.elements.map((element) => __async(this, null, function* () {
          const _a15 = element, { elementId } = _a15, rest = __objRest(_a15, ["elementId"]);
          this.logger({
            category: "observation",
            message: "Getting xpath for element",
            level: 1,
            auxiliary: {
              elementId: {
                value: elementId.toString(),
                type: "string"
              }
            }
          });
          if (elementId.includes("-")) {
            const lookUpIndex = elementId;
            const xpath = combinedXpathMap[lookUpIndex];
            const trimmedXpath = trimTrailingTextNode(xpath);
            if (!trimmedXpath || trimmedXpath === "") {
              this.logger({
                category: "observation",
                message: `Empty xpath returned for element`,
                auxiliary: {
                  observeResult: {
                    value: JSON.stringify(element),
                    type: "object"
                  }
                },
                level: 1
              });
              return void 0;
            }
            return __spreadProps(__spreadValues({}, rest), {
              selector: `xpath=${trimmedXpath}`
              // Provisioning or future use if we want to use direct CDP
              // backendNodeId: elementId,
            });
          } else {
            this.logger({
              category: "observation",
              message: `Element is inside a shadow DOM: ${elementId}`,
              level: 0
            });
            return {
              description: "an element inside a shadow DOM",
              method: "not-supported",
              arguments: [],
              selector: "not-supported"
            };
          }
        }))
      )).filter((e) => e !== void 0);
      this.logger({
        category: "observation",
        message: "found elements",
        level: 1,
        auxiliary: {
          elements: {
            value: JSON.stringify(elementsWithSelectors),
            type: "object"
          }
        }
      });
      if (drawOverlay) {
        yield drawObserveOverlay(this.stagehandPage.page, elementsWithSelectors);
      }
      return elementsWithSelectors;
    });
  }
};

// types/stagehandApiErrors.ts
var StagehandAPIError = class extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
};
var StagehandAPIUnauthorizedError = class extends StagehandAPIError {
  constructor(message) {
    super(message || "Unauthorized request");
  }
};
var StagehandHttpError = class extends StagehandAPIError {
  constructor(message) {
    super(message);
  }
};
var StagehandServerError = class extends StagehandAPIError {
  constructor(message) {
    super(message);
  }
};
var StagehandResponseBodyError = class extends StagehandAPIError {
  constructor() {
    super("Response body is null");
  }
};
var StagehandResponseParseError = class extends StagehandAPIError {
  constructor(message) {
    super(message);
  }
};

// lib/dom/build/scriptContent.ts
var scriptContent = '(() => {\n  // lib/dom/elementCheckUtils.ts\n  function isElementNode(node) {\n    return node.nodeType === Node.ELEMENT_NODE;\n  }\n  function isTextNode(node) {\n    return node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim());\n  }\n\n  // lib/dom/xpathUtils.ts\n  function getParentElement(node) {\n    return isElementNode(node) ? node.parentElement : node.parentNode;\n  }\n  function getCombinations(attributes, size) {\n    const results = [];\n    function helper(start, combo) {\n      if (combo.length === size) {\n        results.push([...combo]);\n        return;\n      }\n      for (let i = start; i < attributes.length; i++) {\n        combo.push(attributes[i]);\n        helper(i + 1, combo);\n        combo.pop();\n      }\n    }\n    helper(0, []);\n    return results;\n  }\n  function isXPathFirstResultElement(xpath, target) {\n    try {\n      const result = document.evaluate(\n        xpath,\n        document.documentElement,\n        null,\n        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,\n        null\n      );\n      return result.snapshotItem(0) === target;\n    } catch (error) {\n      console.warn(`Invalid XPath expression: ${xpath}`, error);\n      return false;\n    }\n  }\n  function escapeXPathString(value) {\n    if (value.includes("\'")) {\n      if (value.includes(\'"\')) {\n        return "concat(" + value.split(/(\'+)/).map((part) => {\n          if (part === "\'") {\n            return `"\'"`;\n          } else if (part.startsWith("\'") && part.endsWith("\'")) {\n            return `"${part}"`;\n          } else {\n            return `\'${part}\'`;\n          }\n        }).join(",") + ")";\n      } else {\n        return `"${value}"`;\n      }\n    } else {\n      return `\'${value}\'`;\n    }\n  }\n  async function generateXPathsForElement(element) {\n    if (!element) return [];\n    const [complexXPath, standardXPath, idBasedXPath] = await Promise.all([\n      generateComplexXPath(element),\n      generateStandardXPath(element),\n      generatedIdBasedXPath(element)\n    ]);\n    return [standardXPath, ...idBasedXPath ? [idBasedXPath] : [], complexXPath];\n  }\n  async function generateComplexXPath(element) {\n    const parts = [];\n    let currentElement = element;\n    while (currentElement && (isTextNode(currentElement) || isElementNode(currentElement))) {\n      if (isElementNode(currentElement)) {\n        const el = currentElement;\n        let selector = el.tagName.toLowerCase();\n        const attributePriority = [\n          "data-qa",\n          "data-component",\n          "data-role",\n          "role",\n          "aria-role",\n          "type",\n          "name",\n          "aria-label",\n          "placeholder",\n          "title",\n          "alt"\n        ];\n        const attributes = attributePriority.map((attr) => {\n          let value = el.getAttribute(attr);\n          if (attr === "href-full" && value) {\n            value = el.getAttribute("href");\n          }\n          return value ? { attr: attr === "href-full" ? "href" : attr, value } : null;\n        }).filter((attr) => attr !== null);\n        let uniqueSelector = "";\n        for (let i = 1; i <= attributes.length; i++) {\n          const combinations = getCombinations(attributes, i);\n          for (const combo of combinations) {\n            const conditions = combo.map((a) => `@${a.attr}=${escapeXPathString(a.value)}`).join(" and ");\n            const xpath2 = `//${selector}[${conditions}]`;\n            if (isXPathFirstResultElement(xpath2, el)) {\n              uniqueSelector = xpath2;\n              break;\n            }\n          }\n          if (uniqueSelector) break;\n        }\n        if (uniqueSelector) {\n          parts.unshift(uniqueSelector.replace("//", ""));\n          break;\n        } else {\n          const parent = getParentElement(el);\n          if (parent) {\n            const siblings = Array.from(parent.children).filter(\n              (sibling) => sibling.tagName === el.tagName\n            );\n            const index = siblings.indexOf(el) + 1;\n            selector += siblings.length > 1 ? `[${index}]` : "";\n          }\n          parts.unshift(selector);\n        }\n      }\n      currentElement = getParentElement(currentElement);\n    }\n    const xpath = "//" + parts.join("/");\n    return xpath;\n  }\n  async function generateStandardXPath(element) {\n    const parts = [];\n    while (element && (isTextNode(element) || isElementNode(element))) {\n      let index = 0;\n      let hasSameTypeSiblings = false;\n      const siblings = element.parentElement ? Array.from(element.parentElement.childNodes) : [];\n      for (let i = 0; i < siblings.length; i++) {\n        const sibling = siblings[i];\n        if (sibling.nodeType === element.nodeType && sibling.nodeName === element.nodeName) {\n          index = index + 1;\n          hasSameTypeSiblings = true;\n          if (sibling.isSameNode(element)) {\n            break;\n          }\n        }\n      }\n      if (element.nodeName !== "#text") {\n        const tagName = element.nodeName.toLowerCase();\n        const pathIndex = hasSameTypeSiblings ? `[${index}]` : "";\n        parts.unshift(`${tagName}${pathIndex}`);\n      }\n      element = element.parentElement;\n    }\n    return parts.length ? `/${parts.join("/")}` : "";\n  }\n  async function generatedIdBasedXPath(element) {\n    if (isElementNode(element) && element.id) {\n      return `//*[@id=\'${element.id}\']`;\n    }\n    return null;\n  }\n\n  // types/stagehandErrors.ts\n  var StagehandError = class extends Error {\n    constructor(message) {\n      super(message);\n      this.name = this.constructor.name;\n    }\n  };\n  var StagehandDomProcessError = class extends StagehandError {\n    constructor(message) {\n      super(`Error Processing Dom: ${message}`);\n    }\n  };\n\n  // lib/dom/utils.ts\n  function canElementScroll(elem) {\n    if (typeof elem.scrollTo !== "function") {\n      console.warn("canElementScroll: .scrollTo is not a function.");\n      return false;\n    }\n    try {\n      const originalTop = elem.scrollTop;\n      elem.scrollTo({\n        top: originalTop + 100,\n        left: 0,\n        behavior: "instant"\n      });\n      if (elem.scrollTop === originalTop) {\n        throw new StagehandDomProcessError("scrollTop did not change");\n      }\n      elem.scrollTo({\n        top: originalTop,\n        left: 0,\n        behavior: "instant"\n      });\n      return true;\n    } catch (error) {\n      console.warn("canElementScroll error:", error.message || error);\n      return false;\n    }\n  }\n  function getNodeFromXpath(xpath) {\n    return document.evaluate(\n      xpath,\n      document.documentElement,\n      null,\n      XPathResult.FIRST_ORDERED_NODE_TYPE,\n      null\n    ).singleNodeValue;\n  }\n  function waitForElementScrollEnd(element, idleMs = 100) {\n    return new Promise((resolve) => {\n      let scrollEndTimer;\n      const handleScroll = () => {\n        clearTimeout(scrollEndTimer);\n        scrollEndTimer = window.setTimeout(() => {\n          element.removeEventListener("scroll", handleScroll);\n          resolve();\n        }, idleMs);\n      };\n      element.addEventListener("scroll", handleScroll, { passive: true });\n      handleScroll();\n    });\n  }\n\n  // lib/dom/process.ts\n  function getScrollableElements(topN) {\n    const docEl = document.documentElement;\n    const scrollableElements = [docEl];\n    const allElements = document.querySelectorAll("*");\n    for (const elem of allElements) {\n      const style = window.getComputedStyle(elem);\n      const overflowY = style.overflowY;\n      const isPotentiallyScrollable = overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";\n      if (isPotentiallyScrollable) {\n        const candidateScrollDiff = elem.scrollHeight - elem.clientHeight;\n        if (candidateScrollDiff > 0 && canElementScroll(elem)) {\n          scrollableElements.push(elem);\n        }\n      }\n    }\n    scrollableElements.sort((a, b) => b.scrollHeight - a.scrollHeight);\n    if (topN !== void 0) {\n      return scrollableElements.slice(0, topN);\n    }\n    return scrollableElements;\n  }\n  async function getScrollableElementXpaths(topN) {\n    const scrollableElems = getScrollableElements(topN);\n    const xpaths = [];\n    for (const elem of scrollableElems) {\n      const allXPaths = await generateXPathsForElement(elem);\n      const firstXPath = allXPaths?.[0] || "";\n      xpaths.push(firstXPath);\n    }\n    return xpaths;\n  }\n  (() => {\n    const closedRoots = /* @__PURE__ */ new WeakMap();\n    const nativeAttachShadow = Element.prototype.attachShadow;\n    Element.prototype.attachShadow = function(init) {\n      const root = nativeAttachShadow.call(this, init);\n      if (init.mode === "closed") closedRoots.set(this, root);\n      return root;\n    };\n    const backdoor = {\n      getClosedRoot: (host) => closedRoots.get(host),\n      queryClosed: (host, selector) => {\n        const root = closedRoots.get(host);\n        return root ? Array.from(root.querySelectorAll(selector)) : [];\n      },\n      xpathClosed: (host, xp) => {\n        const root = closedRoots.get(host);\n        if (!root) return [];\n        const it = document.evaluate(\n          xp,\n          root,\n          null,\n          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,\n          null\n        );\n        const out = [];\n        for (let i = 0; i < it.snapshotLength; ++i) {\n          const n = it.snapshotItem(i);\n          if (n) out.push(n);\n        }\n        return out;\n      }\n    };\n    if (!("__stagehand__" in window)) {\n      Object.defineProperty(window, "__stagehand__", {\n        value: backdoor,\n        enumerable: false,\n        writable: false,\n        configurable: false\n      });\n    }\n  })();\n  window.getScrollableElementXpaths = getScrollableElementXpaths;\n  window.getNodeFromXpath = getNodeFromXpath;\n  window.waitForElementScrollEnd = waitForElementScrollEnd;\n})();\n';

// lib/StagehandPage.ts
function getCurrentRootFrameId(session) {
  return __async(this, null, function* () {
    const { frameTree } = yield session.send(
      "Page.getFrameTree"
    );
    return frameTree.frame.id;
  });
}
var StagehandPage = class _StagehandPage {
  constructor(page, stagehand, context, llmClient, userProvidedInstructions, api, waitForCaptchaSolves) {
    this.cdpClient = null;
    this.initialized = false;
    this.isClosed = false;
    this.cdpClients = /* @__PURE__ */ new WeakMap();
    this.fidOrdinals = /* @__PURE__ */ new Map([
      [void 0, 0]
    ]);
    if (stagehand.experimental && api) {
      throw new ExperimentalApiConflictError();
    }
    this.rawPage = page;
    this.intPage = new Proxy(page, {
      get: (target, prop) => {
        if (!this.initialized && (prop === "act" || prop === "extract" || prop === "observe" || prop === "on")) {
          return () => {
            throw new StagehandNotInitializedError(String(prop));
          };
        }
        const value = target[prop];
        if (typeof value === "function" && prop !== "on") {
          return (...args) => value.apply(target, args);
        }
        return value;
      }
    });
    this.stagehand = stagehand;
    this.intContext = context;
    this.llmClient = llmClient;
    this.api = api;
    this.userProvidedInstructions = userProvidedInstructions;
    this.waitForCaptchaSolves = waitForCaptchaSolves != null ? waitForCaptchaSolves : false;
    if (this.llmClient) {
      this.actHandler = new StagehandActHandler({
        logger: this.stagehand.logger,
        stagehandPage: this,
        selfHeal: this.stagehand.selfHeal,
        experimental: this.stagehand.experimental
      });
      this.extractHandler = new StagehandExtractHandler({
        stagehand: this.stagehand,
        logger: this.stagehand.logger,
        stagehandPage: this,
        userProvidedInstructions,
        experimental: this.stagehand.experimental
      });
      this.observeHandler = new StagehandObserveHandler({
        stagehand: this.stagehand,
        logger: this.stagehand.logger,
        stagehandPage: this,
        userProvidedInstructions,
        experimental: this.stagehand.experimental
      });
    }
  }
  get frameId() {
    return this.rootFrameId;
  }
  updateRootFrameId(newId) {
    this.rootFrameId = newId;
  }
  ordinalForFrameId(fid) {
    if (fid === void 0) return 0;
    const cached = this.fidOrdinals.get(fid);
    if (cached !== void 0) return cached;
    const next = this.fidOrdinals.size;
    this.fidOrdinals.set(fid, next);
    return next;
  }
  encodeWithFrameId(fid, backendId) {
    return `${this.ordinalForFrameId(fid)}-${backendId}`;
  }
  resetFrameOrdinals() {
    this.fidOrdinals = /* @__PURE__ */ new Map([[void 0, 0]]);
  }
  ensureStagehandScript() {
    return __async(this, null, function* () {
      try {
        const injected = yield this.rawPage.evaluate(
          () => !!window.__stagehandInjected
        );
        if (injected) return;
        const guardedScript = `if (!window.__stagehandInjected) { window.__stagehandInjected = true; ${scriptContent} }`;
        yield this.rawPage.addInitScript({ content: guardedScript });
        yield this.rawPage.evaluate(guardedScript);
      } catch (err) {
        if (!this.stagehand.isClosed) {
          this.stagehand.log({
            category: "dom",
            message: "Failed to inject Stagehand helper script",
            level: 1,
            auxiliary: {
              error: { value: err.message, type: "string" },
              trace: { value: err.stack, type: "string" }
            }
          });
          throw err;
        }
      }
    });
  }
  /** Register the custom selector engine that pierces open/closed shadow roots. */
  // private async ensureStagehandSelectorEngine(): Promise<void> {
  //   if (stagehandSelectorRegistered) return;
  //   stagehandSelectorRegistered = true;
  //   await selectors.register("stagehand", () => {
  //     type Backdoor = {
  //       getClosedRoot?: (host: Element) => ShadowRoot | undefined;
  //     };
  //     function parseSelector(input: string): { name: string; value: string } {
  //       // Accept either:  "abc123"  → uses DEFAULT_ATTR
  //       // or explicitly:  "data-__stagehand-id=abc123"
  //       const raw = input.trim();
  //       const eq = raw.indexOf("=");
  //       if (eq === -1) {
  //         return {
  //           name: "data-__stagehand-id",
  //           value: raw.replace(/^["']|["']$/g, ""),
  //         };
  //       }
  //       const name = raw.slice(0, eq).trim();
  //       const value = raw
  //         .slice(eq + 1)
  //         .trim()
  //         .replace(/^["']|["']$/g, "");
  //       return { name, value };
  //     }
  //     function pushChildren(node: Node, stack: Node[]): void {
  //       if (node.nodeType === Node.DOCUMENT_NODE) {
  //         const de = (node as Document).documentElement;
  //         if (de) stack.push(de);
  //         return;
  //       }
  //       if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
  //         const frag = node as DocumentFragment;
  //         const hc = frag.children as HTMLCollection | undefined;
  //         if (hc && hc.length) {
  //           for (let i = hc.length - 1; i >= 0; i--)
  //             stack.push(hc[i] as Element);
  //         } else {
  //           const cn = frag.childNodes;
  //           for (let i = cn.length - 1; i >= 0; i--) stack.push(cn[i]);
  //         }
  //         return;
  //       }
  //       if (node.nodeType === Node.ELEMENT_NODE) {
  //         const el = node as Element;
  //         for (let i = el.children.length - 1; i >= 0; i--)
  //           stack.push(el.children[i]);
  //       }
  //     }
  //     function* traverseAllTrees(
  //       start: Node,
  //     ): Generator<Element, void, unknown> {
  //       const backdoor = window.__stagehand__ as Backdoor | undefined;
  //       const stack: Node[] = [];
  //       if (start.nodeType === Node.DOCUMENT_NODE) {
  //         const de = (start as Document).documentElement;
  //         if (de) stack.push(de);
  //       } else {
  //         stack.push(start);
  //       }
  //       while (stack.length) {
  //         const node = stack.pop()!;
  //         if (node.nodeType === Node.ELEMENT_NODE) {
  //           const el = node as Element;
  //           yield el;
  //           // open shadow
  //           const open = el.shadowRoot as ShadowRoot | null;
  //           if (open) stack.push(open);
  //           // closed shadow via backdoor
  //           const closed = backdoor?.getClosedRoot?.(el);
  //           if (closed) stack.push(closed);
  //         }
  //         pushChildren(node, stack);
  //       }
  //     }
  //     return {
  //       query(root: Node, selector: string): Element | null {
  //         const { name, value } = parseSelector(selector);
  //         for (const el of traverseAllTrees(root)) {
  //           if (el.getAttribute(name) === value) return el;
  //         }
  //         return null;
  //       },
  //       queryAll(root: Node, selector: string): Element[] {
  //         const { name, value } = parseSelector(selector);
  //         const out: Element[] = [];
  //         for (const el of traverseAllTrees(root)) {
  //           if (el.getAttribute(name) === value) out.push(el);
  //         }
  //         return out;
  //       },
  //     };
  //   });
  // }
  /**
   * Waits for a captcha to be solved when using Browserbase environment.
   *
   * @param timeoutMs - Optional timeout in milliseconds. If provided, the promise will reject if the captcha solving hasn't started within the given time.
   * @throws StagehandEnvironmentError if called in a LOCAL environment
   * @throws CaptchaTimeoutError if the timeout is reached before captcha solving starts
   * @returns Promise that resolves when the captcha is solved
   */
  waitForCaptchaSolve(timeoutMs) {
    return __async(this, null, function* () {
      if (this.stagehand.env === "LOCAL") {
        throw new StagehandEnvironmentError(
          this.stagehand.env,
          "BROWSERBASE",
          "waitForCaptcha method"
        );
      }
      this.stagehand.log({
        category: "captcha",
        message: "Waiting for captcha",
        level: 1
      });
      return new Promise((resolve2, reject) => {
        let started = false;
        let timeoutId;
        if (timeoutMs) {
          timeoutId = setTimeout(() => {
            if (!started) {
              reject(new CaptchaTimeoutError());
            }
          }, timeoutMs);
        }
        this.intPage.on("console", (msg) => {
          if (msg.text() === "browserbase-solving-finished") {
            this.stagehand.log({
              category: "captcha",
              message: "Captcha solving finished",
              level: 1
            });
            if (timeoutId) clearTimeout(timeoutId);
            resolve2();
          } else if (msg.text() === "browserbase-solving-started") {
            started = true;
            this.stagehand.log({
              category: "captcha",
              message: "Captcha solving started",
              level: 1
            });
          }
        });
      });
    });
  }
  init() {
    return __async(this, null, function* () {
      try {
        const page = this.rawPage;
        const stagehand = this.stagehand;
        const handler = {
          get: (target, prop) => {
            const value = target[prop];
            if (prop === "evaluate" || prop === "evaluateHandle" || prop === "$eval" || prop === "$$eval") {
              return (...args) => __async(this, null, function* () {
                yield this.ensureStagehandScript();
                return value.apply(
                  target,
                  args
                );
              });
            }
            if (prop === "act" || prop === "extract" || prop === "observe") {
              if (!this.llmClient) {
                return () => {
                  throw new MissingLLMConfigurationError();
                };
              }
              const method = this[prop];
              return (options) => method.call(this, options);
            }
            if (prop === "screenshot" && this.stagehand.env === "BROWSERBASE") {
              return (..._0) => __async(this, [..._0], function* (options = {}) {
                const cdpOptions = {
                  format: options.type === "jpeg" ? "jpeg" : "png",
                  quality: options.quality,
                  clip: options.clip,
                  omitBackground: options.omitBackground,
                  fromSurface: true
                };
                if (options.fullPage) {
                  cdpOptions.captureBeyondViewport = true;
                }
                const data = yield this.sendCDP(
                  "Page.captureScreenshot",
                  cdpOptions
                );
                const buffer = Buffer.from(data.data, "base64");
                return buffer;
              });
            }
            if (prop === "goto") {
              const rawGoto = Object.getPrototypeOf(target).goto.bind(target);
              return (url, options) => __async(this, null, function* () {
                try {
                  const result = this.api ? yield this.api.goto(url, __spreadProps(__spreadValues({}, options), {
                    frameId: this.rootFrameId
                  })) : yield rawGoto(url, options);
                  this.stagehand.addToHistory(
                    "navigate",
                    { url, options },
                    result
                  );
                  if (this.waitForCaptchaSolves) {
                    try {
                      yield this.waitForCaptchaSolve(1e3);
                    } catch (e) {
                    }
                  }
                  if (this.stagehand.debugDom) {
                    this.stagehand.log({
                      category: "deprecation",
                      message: "Warning: debugDom is not supported in this version of Stagehand",
                      level: 1
                    });
                  }
                  yield target.waitForLoadState("domcontentloaded");
                  yield this._waitForSettledDom();
                  return result;
                } catch (error) {
                  this.stagehand.log({
                    category: "navigation",
                    message: `Failed to navigate to ${url}`,
                    level: 0,
                    auxiliary: {
                      error: {
                        value: error.message,
                        type: "string"
                      },
                      url: {
                        value: url,
                        type: "string"
                      }
                    }
                  });
                  throw error;
                }
              });
            }
            if (prop === "on") {
              return (event, listener) => {
                if (event === "popup") {
                  return this.context.on("page", (page2) => __async(this, null, function* () {
                    const newContext = yield StagehandContext.init(
                      page2.context(),
                      stagehand
                    );
                    const newStagehandPage = new _StagehandPage(
                      page2,
                      stagehand,
                      newContext,
                      this.llmClient
                    );
                    yield newStagehandPage.init();
                    listener(newStagehandPage.page);
                  }));
                }
                this.intContext.setActivePage(this);
                return target.on(event, listener);
              };
            }
            if (typeof value === "function") {
              return (...args) => value.apply(target, args);
            }
            return value;
          }
        };
        const session = yield this.getCDPClient(this.rawPage);
        yield session.send("Page.enable");
        const rootId = yield getCurrentRootFrameId(session);
        this.updateRootFrameId(rootId);
        this.intContext.registerFrameId(rootId, this);
        this.intPage = new Proxy(page, handler);
        this.initialized = true;
        return this;
      } catch (err) {
        this.stagehand.log({
          category: "init",
          message: `Error initializing stagehand page: ${err}`,
          level: 0
        });
        throw err;
      }
    });
  }
  get page() {
    return this.intPage;
  }
  get context() {
    return this.intContext.context;
  }
  /**
   * `_waitForSettledDom` waits until the DOM is settled, and therefore is
   * ready for actions to be taken.
   *
   * **Definition of "settled"**
   *   • No in-flight network requests (except WebSocket / Server-Sent-Events).
   *   • That idle state lasts for at least **500 ms** (the "quiet-window").
   *
   * **How it works**
   *   1.  Subscribes to CDP Network and Page events for the main target and all
   *       out-of-process iframes (via `Target.setAutoAttach { flatten:true }`).
   *   2.  Every time `Network.requestWillBeSent` fires, the request ID is added
   *       to an **`inflight`** `Set`.
   *   3.  When the request finishes—`loadingFinished`, `loadingFailed`,
   *       `requestServedFromCache`, or a *data:* response—the request ID is
   *       removed.
   *   4.  *Document* requests are also mapped **frameId → requestId**; when
   *       `Page.frameStoppedLoading` fires the corresponding Document request is
   *       removed immediately (covers iframes whose network events never close).
   *   5.  A **stalled-request sweep timer** runs every 500 ms.  If a *Document*
   *       request has been open for ≥ 2 s it is forcibly removed; this prevents
   *       ad/analytics iframes from blocking the wait forever.
   *   6.  When `inflight` becomes empty the helper starts a 500 ms timer.
   *       If no new request appears before the timer fires, the promise
   *       resolves → **DOM is considered settled**.
   *   7.  A global guard (`timeoutMs` or `stagehand.domSettleTimeoutMs`,
   *       default ≈ 30 s) ensures we always resolve; if it fires we log how many
   *       requests were still outstanding.
   *
   * @param timeoutMs – Optional hard cap (ms).  Defaults to
   *                    `this.stagehand.domSettleTimeoutMs`.
   */
  _waitForSettledDom(timeoutMs) {
    return __async(this, null, function* () {
      const timeout = timeoutMs != null ? timeoutMs : this.stagehand.domSettleTimeoutMs;
      const client = yield this.getCDPClient();
      const hasDoc = !!(yield this.page.title().catch(() => false));
      if (!hasDoc) yield this.page.waitForLoadState("domcontentloaded");
      yield client.send("Network.enable");
      yield client.send("Page.enable");
      yield client.send("Target.setAutoAttach", {
        autoAttach: true,
        waitForDebuggerOnStart: false,
        flatten: true,
        filter: [
          { type: "worker", exclude: true },
          { type: "shared_worker", exclude: true }
        ]
      });
      return new Promise((resolve2) => {
        const inflight = /* @__PURE__ */ new Set();
        const meta = /* @__PURE__ */ new Map();
        const docByFrame = /* @__PURE__ */ new Map();
        let quietTimer = null;
        let stalledRequestSweepTimer = null;
        const clearQuiet = () => {
          if (quietTimer) {
            clearTimeout(quietTimer);
            quietTimer = null;
          }
        };
        const maybeQuiet = () => {
          if (inflight.size === 0 && !quietTimer)
            quietTimer = setTimeout(() => resolveDone(), 500);
        };
        const finishReq = (id) => {
          if (!inflight.delete(id)) return;
          meta.delete(id);
          for (const [fid, rid] of docByFrame)
            if (rid === id) docByFrame.delete(fid);
          clearQuiet();
          maybeQuiet();
        };
        const onRequest = (p) => {
          if (p.type === "WebSocket" || p.type === "EventSource") return;
          inflight.add(p.requestId);
          meta.set(p.requestId, { url: p.request.url, start: Date.now() });
          if (p.type === "Document" && p.frameId)
            docByFrame.set(p.frameId, p.requestId);
          clearQuiet();
        };
        const onFinish = (p) => finishReq(p.requestId);
        const onCached = (p) => finishReq(p.requestId);
        const onDataUrl = (p) => p.response.url.startsWith("data:") && finishReq(p.requestId);
        const onFrameStop = (f) => {
          const id = docByFrame.get(f.frameId);
          if (id) finishReq(id);
        };
        client.on("Network.requestWillBeSent", onRequest);
        client.on("Network.loadingFinished", onFinish);
        client.on("Network.loadingFailed", onFinish);
        client.on("Network.requestServedFromCache", onCached);
        client.on("Network.responseReceived", onDataUrl);
        client.on("Page.frameStoppedLoading", onFrameStop);
        stalledRequestSweepTimer = setInterval(() => {
          const now = Date.now();
          for (const [id, m] of meta) {
            if (now - m.start > 2e3) {
              inflight.delete(id);
              meta.delete(id);
              this.stagehand.log({
                category: "dom",
                message: "\u23F3 forcing completion of stalled iframe document",
                level: 2,
                auxiliary: {
                  url: {
                    value: m.url.slice(0, 120),
                    type: "string"
                  }
                }
              });
            }
          }
          maybeQuiet();
        }, 500);
        maybeQuiet();
        const guard = setTimeout(() => {
          if (inflight.size)
            this.stagehand.log({
              category: "dom",
              message: "\u26A0\uFE0F DOM-settle timeout reached \u2013 network requests still pending",
              level: 2,
              auxiliary: {
                count: {
                  value: inflight.size.toString(),
                  type: "integer"
                }
              }
            });
          resolveDone();
        }, timeout);
        const resolveDone = () => {
          client.off("Network.requestWillBeSent", onRequest);
          client.off("Network.loadingFinished", onFinish);
          client.off("Network.loadingFailed", onFinish);
          client.off("Network.requestServedFromCache", onCached);
          client.off("Network.responseReceived", onDataUrl);
          client.off("Page.frameStoppedLoading", onFrameStop);
          if (quietTimer) clearTimeout(quietTimer);
          if (stalledRequestSweepTimer) clearInterval(stalledRequestSweepTimer);
          clearTimeout(guard);
          resolve2();
        };
      });
    });
  }
  act(actionOrOptions) {
    return __async(this, null, function* () {
      try {
        if (!this.actHandler) {
          throw new HandlerNotInitializedError("Act");
        }
        yield clearOverlays(this.page);
        if (typeof actionOrOptions === "object" && actionOrOptions !== null) {
          if ("selector" in actionOrOptions && "method" in actionOrOptions) {
            const observeResult = actionOrOptions;
            if (this.api) {
              const result2 = yield this.api.act(__spreadProps(__spreadValues({}, observeResult), {
                frameId: this.rootFrameId
              }));
              this.stagehand.addToHistory("act", observeResult, result2);
              return result2;
            }
            return this.actHandler.actFromObserveResult(observeResult);
          } else {
            if (!("action" in actionOrOptions)) {
              throw new StagehandError(
                "Invalid argument. Valid arguments are: a string, an ActOptions object, or an ObserveResult WITH 'selector' and 'method' fields."
              );
            }
          }
        } else if (typeof actionOrOptions === "string") {
          actionOrOptions = { action: actionOrOptions };
        } else {
          throw new StagehandError(
            "Invalid argument: you may have called act with an empty ObserveResult.\nValid arguments are: a string, an ActOptions object, or an ObserveResult WITH 'selector' and 'method' fields."
          );
        }
        const { action, modelName, modelClientOptions } = actionOrOptions;
        if (this.api) {
          const opts = __spreadProps(__spreadValues({}, actionOrOptions), { frameId: this.rootFrameId });
          const result2 = yield this.api.act(opts);
          this.stagehand.addToHistory("act", actionOrOptions, result2);
          return result2;
        }
        const requestId = Math.random().toString(36).substring(2);
        const llmClient = modelName ? this.stagehand.llmProvider.getClient(modelName, modelClientOptions) : this.llmClient;
        this.stagehand.log({
          category: "act",
          message: "running act",
          level: 1,
          auxiliary: {
            action: {
              value: action,
              type: "string"
            },
            requestId: {
              value: requestId,
              type: "string"
            },
            modelName: {
              value: llmClient.modelName,
              type: "string"
            }
          }
        });
        const result = yield this.actHandler.observeAct(
          actionOrOptions,
          this.observeHandler,
          llmClient,
          requestId
        );
        this.stagehand.addToHistory("act", actionOrOptions, result);
        return result;
      } catch (err) {
        if (err instanceof StagehandError || err instanceof StagehandAPIError) {
          throw err;
        }
        throw new StagehandDefaultError(err);
      }
    });
  }
  extract(instructionOrOptions) {
    return __async(this, null, function* () {
      try {
        if (!this.extractHandler) {
          throw new HandlerNotInitializedError("Extract");
        }
        yield clearOverlays(this.page);
        if (!instructionOrOptions) {
          let result2;
          if (this.api) {
            result2 = yield this.api.extract({ frameId: this.rootFrameId });
          } else {
            result2 = yield this.extractHandler.extract();
          }
          this.stagehand.addToHistory("extract", instructionOrOptions, result2);
          return result2;
        }
        const options = typeof instructionOrOptions === "string" ? {
          instruction: instructionOrOptions,
          schema: defaultExtractSchema
        } : instructionOrOptions.schema ? instructionOrOptions : __spreadProps(__spreadValues({}, instructionOrOptions), {
          schema: defaultExtractSchema
        });
        const {
          instruction,
          schema,
          modelName,
          modelClientOptions,
          domSettleTimeoutMs,
          useTextExtract,
          selector,
          iframes
        } = options;
        if (this.api) {
          const opts = __spreadProps(__spreadValues({}, options), { frameId: this.rootFrameId });
          const result2 = yield this.api.extract(opts);
          this.stagehand.addToHistory("extract", instructionOrOptions, result2);
          return result2;
        }
        const requestId = Math.random().toString(36).substring(2);
        const llmClient = modelName ? this.stagehand.llmProvider.getClient(modelName, modelClientOptions) : this.llmClient;
        this.stagehand.log({
          category: "extract",
          message: "running extract",
          level: 1,
          auxiliary: {
            instruction: {
              value: instruction,
              type: "string"
            },
            requestId: {
              value: requestId,
              type: "string"
            },
            modelName: {
              value: llmClient.modelName,
              type: "string"
            }
          }
        });
        const result = yield this.extractHandler.extract({
          instruction,
          schema,
          llmClient,
          requestId,
          domSettleTimeoutMs,
          useTextExtract,
          selector,
          iframes
        }).catch((e) => {
          this.stagehand.log({
            category: "extract",
            message: "error extracting",
            level: 1,
            auxiliary: {
              error: {
                value: e.message,
                type: "string"
              },
              trace: {
                value: e.stack,
                type: "string"
              }
            }
          });
          if (this.stagehand.enableCaching) {
            this.stagehand.llmProvider.cleanRequestCache(requestId);
          }
          throw e;
        });
        this.stagehand.addToHistory("extract", instructionOrOptions, result);
        return result;
      } catch (err) {
        if (err instanceof StagehandError || err instanceof StagehandAPIError) {
          throw err;
        }
        throw new StagehandDefaultError(err);
      }
    });
  }
  observe(instructionOrOptions) {
    return __async(this, null, function* () {
      try {
        if (!this.observeHandler) {
          throw new HandlerNotInitializedError("Observe");
        }
        yield clearOverlays(this.page);
        const options = typeof instructionOrOptions === "string" ? { instruction: instructionOrOptions } : instructionOrOptions || {};
        const {
          instruction,
          modelName,
          modelClientOptions,
          domSettleTimeoutMs,
          returnAction = true,
          onlyVisible,
          drawOverlay,
          iframes
        } = options;
        if (this.api) {
          const opts = __spreadProps(__spreadValues({}, options), { frameId: this.rootFrameId });
          const result2 = yield this.api.observe(opts);
          this.stagehand.addToHistory("observe", instructionOrOptions, result2);
          return result2;
        }
        const requestId = Math.random().toString(36).substring(2);
        const llmClient = modelName ? this.stagehand.llmProvider.getClient(modelName, modelClientOptions) : this.llmClient;
        this.stagehand.log({
          category: "observe",
          message: "running observe",
          level: 1,
          auxiliary: __spreadValues({
            instruction: {
              value: instruction,
              type: "string"
            },
            requestId: {
              value: requestId,
              type: "string"
            },
            modelName: {
              value: llmClient.modelName,
              type: "string"
            }
          }, onlyVisible !== void 0 && {
            onlyVisible: {
              value: onlyVisible ? "true" : "false",
              type: "boolean"
            }
          })
        });
        const result = yield this.observeHandler.observe({
          instruction,
          llmClient,
          requestId,
          domSettleTimeoutMs,
          returnAction,
          onlyVisible,
          drawOverlay,
          iframes
        }).catch((e) => {
          this.stagehand.log({
            category: "observe",
            message: "error observing",
            level: 1,
            auxiliary: {
              error: {
                value: e.message,
                type: "string"
              },
              trace: {
                value: e.stack,
                type: "string"
              },
              requestId: {
                value: requestId,
                type: "string"
              },
              instruction: {
                value: instruction,
                type: "string"
              }
            }
          });
          if (this.stagehand.enableCaching) {
            this.stagehand.llmProvider.cleanRequestCache(requestId);
          }
          throw e;
        });
        this.stagehand.addToHistory("observe", instructionOrOptions, result);
        return result;
      } catch (err) {
        if (err instanceof StagehandError || err instanceof StagehandAPIError) {
          throw err;
        }
        throw new StagehandDefaultError(err);
      }
    });
  }
  /**
   * Get or create a CDP session for the given target.
   * @param target  The Page or (OOPIF) Frame you want to talk to.
   */
  getCDPClient() {
    return __async(this, arguments, function* (target = this.page) {
      var _a15;
      if (this.isClosed) {
        throw new Error("Cannot create CDP session: page is closed");
      }
      const cached = this.cdpClients.get(target);
      if (cached) return cached;
      try {
        if (!target || target._closed) {
          throw new Error("Target page or frame is closed");
        }
        const session = yield this.context.newCDPSession(target);
        this.cdpClients.set(target, session);
        return session;
      } catch (err) {
        const msg = (_a15 = err.message) != null ? _a15 : "";
        if (msg.includes("No target with given id found") || msg.includes("Target page, context or browser has been closed") || msg.includes("Protocol error")) {
          this.isClosed = true;
          throw new Error(`CDP session creation failed: ${msg}`);
        }
        if (msg.includes("does not have a separate CDP session")) {
          const rootSession = yield this.getCDPClient(this.page);
          this.cdpClients.set(target, rootSession);
          return rootSession;
        }
        throw err;
      }
    });
  }
  /**
   * Send a CDP command to the chosen DevTools target.
   *
   * @param method  Any valid CDP method, e.g. `"DOM.getDocument"`.
   * @param params  Command parameters (optional).
   * @param target  A `Page` or OOPIF `Frame`. Defaults to the main page.
   *
   * @typeParam T  Expected result shape (defaults to `unknown`).
   */
  sendCDP(_0) {
    return __async(this, arguments, function* (method, params = {}, target) {
      var _a15;
      try {
        const client = yield this.getCDPClient(target != null ? target : this.page);
        return client.send(
          method,
          params
        );
      } catch (err) {
        const msg = (_a15 = err.message) != null ? _a15 : "";
        if (msg.includes("CDP session creation failed") || msg.includes("page is closed")) {
          throw new Error(`CDP command failed: ${method} - ${msg}`);
        }
        throw err;
      }
    });
  }
  /** Enable a CDP domain (e.g. `"Network"` or `"DOM"`) on the chosen target. */
  enableCDP(domain, target) {
    return __async(this, null, function* () {
      yield this.sendCDP(`${domain}.enable`, {}, target);
    });
  }
  /** Disable a CDP domain on the chosen target. */
  disableCDP(domain, target) {
    return __async(this, null, function* () {
      yield this.sendCDP(`${domain}.disable`, {}, target);
    });
  }
};

// lib/StagehandContext.ts
var StagehandContext = class _StagehandContext {
  constructor(context, stagehand) {
    this.activeStagehandPage = null;
    this.frameIdMap = /* @__PURE__ */ new Map();
    this.stagehand = stagehand;
    this.pageMap = /* @__PURE__ */ new WeakMap();
    this.intContext = new Proxy(context, {
      get: (target, prop) => {
        if (prop === "newPage") {
          return () => __async(this, null, function* () {
            const pwPage = yield target.newPage();
            const stagehandPage = yield this.createStagehandPage(pwPage);
            yield this.attachFrameNavigatedListener(pwPage);
            this.setActivePage(stagehandPage);
            return stagehandPage.page;
          });
        }
        if (prop === "pages") {
          return () => {
            const pwPages = target.pages();
            return pwPages.map((pwPage) => {
              let stagehandPage = this.pageMap.get(pwPage);
              if (!stagehandPage) {
                stagehandPage = new StagehandPage(
                  pwPage,
                  this.stagehand,
                  this,
                  this.stagehand.llmClient,
                  this.stagehand.userProvidedInstructions,
                  this.stagehand.apiClient,
                  this.stagehand.waitForCaptchaSolves
                );
                this.pageMap.set(pwPage, stagehandPage);
              }
              return stagehandPage.page;
            });
          };
        }
        return target[prop];
      }
    });
  }
  createStagehandPage(page) {
    return __async(this, null, function* () {
      const stagehandPage = yield new StagehandPage(
        page,
        this.stagehand,
        this,
        this.stagehand.llmClient,
        this.stagehand.userProvidedInstructions,
        this.stagehand.apiClient,
        this.stagehand.waitForCaptchaSolves
      ).init();
      this.pageMap.set(page, stagehandPage);
      return stagehandPage;
    });
  }
  static init(context, stagehand) {
    return __async(this, null, function* () {
      const instance = new _StagehandContext(context, stagehand);
      context.on("page", (pwPage) => __async(null, null, function* () {
        yield instance.handleNewPlaywrightPage(pwPage);
        instance.attachFrameNavigatedListener(pwPage).catch(
          (err) => stagehand.logger({
            category: "cdp",
            message: `Failed to attach frameNavigated listener: ${err}`,
            level: 0
          })
        ).finally(
          () => instance.handleNewPlaywrightPage(pwPage).catch(
            (err) => stagehand.logger({
              category: "context",
              message: `Failed to initialise new page: ${err}`,
              level: 0
            })
          )
        );
      }));
      const existingPages = context.pages();
      for (const page of existingPages) {
        const stagehandPage = yield instance.createStagehandPage(page);
        yield instance.attachFrameNavigatedListener(page);
        if (!instance.activeStagehandPage) {
          instance.setActivePage(stagehandPage);
        }
      }
      return instance;
    });
  }
  get frameIdLookup() {
    return this.frameIdMap;
  }
  registerFrameId(frameId, page) {
    this.frameIdMap.set(frameId, page);
  }
  unregisterFrameId(frameId) {
    this.frameIdMap.delete(frameId);
  }
  getStagehandPageByFrameId(frameId) {
    return this.frameIdMap.get(frameId);
  }
  get context() {
    return this.intContext;
  }
  getStagehandPage(page) {
    return __async(this, null, function* () {
      let stagehandPage = this.pageMap.get(page);
      if (!stagehandPage) {
        stagehandPage = yield this.createStagehandPage(page);
      }
      this.setActivePage(stagehandPage);
      return stagehandPage;
    });
  }
  getStagehandPages() {
    return __async(this, null, function* () {
      const pwPages = this.intContext.pages();
      return Promise.all(
        pwPages.map((page) => this.getStagehandPage(page))
      );
    });
  }
  setActivePage(page) {
    this.activeStagehandPage = page;
    this.stagehand["setActivePage"](page);
  }
  getActivePage() {
    return this.activeStagehandPage;
  }
  handleNewPlaywrightPage(pwPage) {
    return __async(this, null, function* () {
      let stagehandPage = this.pageMap.get(pwPage);
      if (!stagehandPage) {
        stagehandPage = yield this.createStagehandPage(pwPage);
      }
      this.setActivePage(stagehandPage);
    });
  }
  attachFrameNavigatedListener(pwPage) {
    return __async(this, null, function* () {
      const shPage = this.pageMap.get(pwPage);
      if (!shPage) return;
      try {
        const session = yield this.intContext.newCDPSession(pwPage);
        yield session.send("Page.enable");
        pwPage.once("close", () => {
          if (shPage.frameId) this.unregisterFrameId(shPage.frameId);
        });
        session.on(
          "Page.frameNavigated",
          (evt) => {
            if (evt.frame.parentId) return;
            if (evt.frame.id === shPage.frameId) return;
            const oldId = shPage.frameId;
            if (oldId) this.unregisterFrameId(oldId);
            this.registerFrameId(evt.frame.id, shPage);
            shPage.updateRootFrameId(evt.frame.id);
          }
        );
      } catch (error) {
        this.stagehand.logger({
          category: "context",
          message: `Failed to attach frameNavigated listener: ${error}`,
          level: 0
        });
      }
    });
  }
};

// lib/api.ts
var import_zod_to_json_schema = __toESM(require("zod-to-json-schema"));
var import_fetch_cookie = __toESM(require("fetch-cookie"));
var StagehandAPI = class {
  constructor({ apiKey, projectId, logger }) {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.logger = logger;
    this.fetchWithCookies = (0, import_fetch_cookie.default)(fetch);
  }
  init(_0) {
    return __async(this, arguments, function* ({
      modelName,
      modelApiKey,
      domSettleTimeoutMs,
      verbose,
      debugDom,
      systemPrompt,
      selfHeal,
      waitForCaptchaSolves,
      actionTimeoutMs,
      browserbaseSessionCreateParams,
      browserbaseSessionID
    }) {
      var _a15;
      if (!modelApiKey) {
        throw new StagehandAPIError("modelApiKey is required");
      }
      this.modelApiKey = modelApiKey;
      const region = browserbaseSessionCreateParams == null ? void 0 : browserbaseSessionCreateParams.region;
      if (region && region !== "us-west-2") {
        return { sessionId: browserbaseSessionID != null ? browserbaseSessionID : null, available: false };
      }
      const sessionResponse = yield this.request("/sessions/start", {
        method: "POST",
        body: JSON.stringify({
          modelName,
          domSettleTimeoutMs,
          verbose,
          debugDom,
          systemPrompt,
          selfHeal,
          waitForCaptchaSolves,
          actionTimeoutMs,
          browserbaseSessionCreateParams,
          browserbaseSessionID
        })
      });
      if (sessionResponse.status === 401) {
        throw new StagehandAPIUnauthorizedError(
          "Unauthorized. Ensure you provided a valid API key and that it is whitelisted."
        );
      } else if (sessionResponse.status !== 200) {
        console.log(yield sessionResponse.text());
        throw new StagehandHttpError(`Unknown error: ${sessionResponse.status}`);
      }
      const sessionResponseBody = yield sessionResponse.json();
      if (sessionResponseBody.success === false) {
        throw new StagehandAPIError(sessionResponseBody.message);
      }
      this.sessionId = sessionResponseBody.data.sessionId;
      if (!((_a15 = sessionResponseBody.data) == null ? void 0 : _a15.available) && browserbaseSessionID) {
        sessionResponseBody.data.sessionId = browserbaseSessionID;
      }
      return sessionResponseBody.data;
    });
  }
  act(options) {
    return __async(this, null, function* () {
      return this.execute({
        method: "act",
        args: __spreadValues({}, options)
      });
    });
  }
  extract(options) {
    return __async(this, null, function* () {
      if (!options.schema) {
        return this.execute({
          method: "extract",
          args: __spreadValues({}, options)
        });
      }
      const parsedSchema = (0, import_zod_to_json_schema.default)(options.schema);
      return this.execute({
        method: "extract",
        args: __spreadProps(__spreadValues({}, options), { schemaDefinition: parsedSchema })
      });
    });
  }
  observe(options) {
    return __async(this, null, function* () {
      return this.execute({
        method: "observe",
        args: __spreadValues({}, options)
      });
    });
  }
  goto(url, options) {
    return __async(this, null, function* () {
      return this.execute({
        method: "navigate",
        args: { url, options }
      });
    });
  }
  agentExecute(agentConfig, executeOptions) {
    return __async(this, null, function* () {
      return this.execute({
        method: "agentExecute",
        args: { agentConfig, executeOptions }
      });
    });
  }
  end() {
    return __async(this, null, function* () {
      const url = `/sessions/${this.sessionId}/end`;
      const response = yield this.request(url, {
        method: "POST"
      });
      return response;
    });
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      method,
      args,
      params
    }) {
      const urlParams = new URLSearchParams(params);
      const queryString = urlParams.toString();
      const url = `/sessions/${this.sessionId}/${method}${queryString ? `?${queryString}` : ""}`;
      const response = yield this.request(url, {
        method: "POST",
        body: JSON.stringify(args)
      });
      if (!response.ok) {
        const errorBody = yield response.text();
        throw new StagehandHttpError(
          `HTTP error! status: ${response.status}, body: ${errorBody}`
        );
      }
      if (!response.body) {
        throw new StagehandResponseBodyError();
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = yield reader.read();
        if (done && !buffer) {
          return null;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const eventData = JSON.parse(line.slice(6));
            if (eventData.type === "system") {
              if (eventData.data.status === "error") {
                throw new StagehandServerError(eventData.data.error);
              }
              if (eventData.data.status === "finished") {
                return eventData.data.result;
              }
            } else if (eventData.type === "log") {
              this.logger(eventData.data.message);
            }
          } catch (e) {
            console.error("Error parsing event data:", e);
            throw new StagehandResponseParseError(
              "Failed to parse server response"
            );
          }
        }
        if (done) break;
      }
    });
  }
  request(_0) {
    return __async(this, arguments, function* (path4, options = {}) {
      var _a15;
      const defaultHeaders = {
        "x-bb-api-key": this.apiKey,
        "x-bb-project-id": this.projectId,
        "x-bb-session-id": this.sessionId,
        // we want real-time logs, so we stream the response
        "x-stream-response": "true",
        "x-model-api-key": this.modelApiKey,
        "x-sent-at": (/* @__PURE__ */ new Date()).toISOString(),
        "x-language": "typescript",
        "x-sdk-version": STAGEHAND_VERSION
      };
      if (options.method === "POST" && options.body) {
        defaultHeaders["Content-Type"] = "application/json";
      }
      const response = yield this.fetchWithCookies(
        `${(_a15 = process.env.STAGEHAND_API_URL) != null ? _a15 : "https://api.stagehand.browserbase.com/v1"}${path4}`,
        __spreadProps(__spreadValues({}, options), {
          headers: __spreadValues(__spreadValues({}, defaultHeaders), options.headers)
        })
      );
      return response;
    });
  }
};

// lib/cache/BaseCache.ts
var fs2 = __toESM(require("fs"));
var path2 = __toESM(require("path"));
var crypto = __toESM(require("crypto"));
var BaseCache = class {
  constructor(logger, cacheDir = path2.join(process.cwd(), "tmp", ".cache"), cacheFile = "cache.json") {
    this.CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1e3;
    // 1 week in milliseconds
    this.CLEANUP_PROBABILITY = 0.01;
    this.LOCK_TIMEOUT_MS = 1e3;
    this.lockAcquired = false;
    this.lockAcquireFailures = 0;
    // Added for request ID tracking
    this.requestIdToUsedHashes = {};
    this.logger = logger;
    this.cacheDir = cacheDir;
    this.cacheFile = path2.join(cacheDir, cacheFile);
    this.lockFile = path2.join(cacheDir, "cache.lock");
    this.ensureCacheDirectory();
    this.setupProcessHandlers();
  }
  setupProcessHandlers() {
    const releaseLockAndExit = () => {
      this.releaseLock();
      process.exit();
    };
    process.on("exit", releaseLockAndExit);
    process.on("SIGINT", releaseLockAndExit);
    process.on("SIGTERM", releaseLockAndExit);
    process.on("uncaughtException", (err) => {
      this.logger({
        category: "base_cache",
        message: "uncaught exception",
        level: 2,
        auxiliary: {
          error: {
            value: err.message,
            type: "string"
          },
          trace: {
            value: err.stack,
            type: "string"
          }
        }
      });
      if (this.lockAcquired) {
        releaseLockAndExit();
      }
    });
  }
  ensureCacheDirectory() {
    if (!fs2.existsSync(this.cacheDir)) {
      fs2.mkdirSync(this.cacheDir, { recursive: true });
      this.logger({
        category: "base_cache",
        message: "created cache directory",
        level: 1,
        auxiliary: {
          cacheDir: {
            value: this.cacheDir,
            type: "string"
          }
        }
      });
    }
  }
  createHash(data) {
    const hash = crypto.createHash("sha256");
    return hash.update(JSON.stringify(data)).digest("hex");
  }
  sleep(ms) {
    return new Promise((resolve2) => setTimeout(resolve2, ms));
  }
  acquireLock() {
    return __async(this, null, function* () {
      const startTime = Date.now();
      while (Date.now() - startTime < this.LOCK_TIMEOUT_MS) {
        try {
          if (fs2.existsSync(this.lockFile)) {
            const lockAge = Date.now() - fs2.statSync(this.lockFile).mtimeMs;
            if (lockAge > this.LOCK_TIMEOUT_MS) {
              fs2.unlinkSync(this.lockFile);
              this.logger({
                category: "base_cache",
                message: "Stale lock file removed",
                level: 1
              });
            }
          }
          fs2.writeFileSync(this.lockFile, process.pid.toString(), { flag: "wx" });
          this.lockAcquireFailures = 0;
          this.lockAcquired = true;
          this.logger({
            category: "base_cache",
            message: "Lock acquired",
            level: 1
          });
          return true;
        } catch (e) {
          this.logger({
            category: "base_cache",
            message: "error acquiring lock",
            level: 2,
            auxiliary: {
              trace: {
                value: e.stack,
                type: "string"
              },
              message: {
                value: e.message,
                type: "string"
              }
            }
          });
          yield this.sleep(5);
        }
      }
      this.logger({
        category: "base_cache",
        message: "Failed to acquire lock after timeout",
        level: 2
      });
      this.lockAcquireFailures++;
      if (this.lockAcquireFailures >= 3) {
        this.logger({
          category: "base_cache",
          message: "Failed to acquire lock 3 times in a row. Releasing lock manually.",
          level: 1
        });
        this.releaseLock();
      }
      return false;
    });
  }
  releaseLock() {
    try {
      if (fs2.existsSync(this.lockFile)) {
        fs2.unlinkSync(this.lockFile);
        this.logger({
          category: "base_cache",
          message: "Lock released",
          level: 1
        });
      }
      this.lockAcquired = false;
    } catch (error) {
      this.logger({
        category: "base_cache",
        message: "error releasing lock",
        level: 2,
        auxiliary: {
          error: {
            value: error.message,
            type: "string"
          },
          trace: {
            value: error.stack,
            type: "string"
          }
        }
      });
    }
  }
  /**
   * Cleans up stale cache entries that exceed the maximum age.
   */
  cleanupStaleEntries() {
    return __async(this, null, function* () {
      if (!(yield this.acquireLock())) {
        this.logger({
          category: "llm_cache",
          message: "failed to acquire lock for cleanup",
          level: 2
        });
        return;
      }
      try {
        const cache = this.readCache();
        const now = Date.now();
        let entriesRemoved = 0;
        for (const [hash, entry] of Object.entries(cache)) {
          if (now - entry.timestamp > this.CACHE_MAX_AGE_MS) {
            delete cache[hash];
            entriesRemoved++;
          }
        }
        if (entriesRemoved > 0) {
          this.writeCache(cache);
          this.logger({
            category: "llm_cache",
            message: "cleaned up stale cache entries",
            level: 1,
            auxiliary: {
              entriesRemoved: {
                value: entriesRemoved.toString(),
                type: "integer"
              }
            }
          });
        }
      } catch (error) {
        this.logger({
          category: "llm_cache",
          message: "error during cache cleanup",
          level: 2,
          auxiliary: {
            error: {
              value: error.message,
              type: "string"
            },
            trace: {
              value: error.stack,
              type: "string"
            }
          }
        });
      } finally {
        this.releaseLock();
      }
    });
  }
  readCache() {
    if (fs2.existsSync(this.cacheFile)) {
      try {
        const data = fs2.readFileSync(this.cacheFile, "utf-8");
        return JSON.parse(data);
      } catch (error) {
        this.logger({
          category: "base_cache",
          message: "error reading cache file. resetting cache.",
          level: 1,
          auxiliary: {
            error: {
              value: error.message,
              type: "string"
            },
            trace: {
              value: error.stack,
              type: "string"
            }
          }
        });
        this.resetCache();
        return {};
      }
    }
    return {};
  }
  writeCache(cache) {
    try {
      fs2.writeFileSync(this.cacheFile, JSON.stringify(cache, null, 2));
      this.logger({
        category: "base_cache",
        message: "Cache written to file",
        level: 1
      });
    } catch (error) {
      this.logger({
        category: "base_cache",
        message: "error writing cache file",
        level: 2,
        auxiliary: {
          error: {
            value: error.message,
            type: "string"
          },
          trace: {
            value: error.stack,
            type: "string"
          }
        }
      });
    } finally {
      this.releaseLock();
    }
  }
  /**
   * Retrieves data from the cache based on the provided options.
   * @param hashObj - The options used to generate the cache key.
   * @param requestId - The identifier for the current request.
   * @returns The cached data if available, otherwise null.
   */
  get(hashObj, requestId) {
    return __async(this, null, function* () {
      if (!(yield this.acquireLock())) {
        this.logger({
          category: "base_cache",
          message: "Failed to acquire lock for getting cache",
          level: 2
        });
        return null;
      }
      try {
        const hash = this.createHash(hashObj);
        const cache = this.readCache();
        if (cache[hash]) {
          this.trackRequestIdUsage(requestId, hash);
          return cache[hash].data;
        }
        return null;
      } catch (error) {
        this.logger({
          category: "base_cache",
          message: "error getting cache. resetting cache.",
          level: 1,
          auxiliary: {
            error: {
              value: error.message,
              type: "string"
            },
            trace: {
              value: error.stack,
              type: "string"
            }
          }
        });
        this.resetCache();
        return null;
      } finally {
        this.releaseLock();
      }
    });
  }
  /**
   * Stores data in the cache based on the provided options and requestId.
   * @param hashObj - The options used to generate the cache key.
   * @param data - The data to be cached.
   * @param requestId - The identifier for the cache entry.
   */
  set(hashObj, data, requestId) {
    return __async(this, null, function* () {
      if (!(yield this.acquireLock())) {
        this.logger({
          category: "base_cache",
          message: "Failed to acquire lock for setting cache",
          level: 2
        });
        return;
      }
      try {
        const hash = this.createHash(hashObj);
        const cache = this.readCache();
        cache[hash] = {
          data,
          timestamp: Date.now(),
          requestId
        };
        this.writeCache(cache);
        this.trackRequestIdUsage(requestId, hash);
      } catch (error) {
        this.logger({
          category: "base_cache",
          message: "error setting cache. resetting cache.",
          level: 1,
          auxiliary: {
            error: {
              value: error.message,
              type: "string"
            },
            trace: {
              value: error.stack,
              type: "string"
            }
          }
        });
        this.resetCache();
      } finally {
        this.releaseLock();
        if (Math.random() < this.CLEANUP_PROBABILITY) {
          this.cleanupStaleEntries();
        }
      }
    });
  }
  delete(hashObj) {
    return __async(this, null, function* () {
      if (!(yield this.acquireLock())) {
        this.logger({
          category: "base_cache",
          message: "Failed to acquire lock for removing cache entry",
          level: 2
        });
        return;
      }
      try {
        const hash = this.createHash(hashObj);
        const cache = this.readCache();
        if (cache[hash]) {
          delete cache[hash];
          this.writeCache(cache);
        } else {
          this.logger({
            category: "base_cache",
            message: "Cache entry not found to delete",
            level: 1
          });
        }
      } catch (error) {
        this.logger({
          category: "base_cache",
          message: "error removing cache entry",
          level: 2,
          auxiliary: {
            error: {
              value: error.message,
              type: "string"
            },
            trace: {
              value: error.stack,
              type: "string"
            }
          }
        });
      } finally {
        this.releaseLock();
      }
    });
  }
  /**
   * Tracks the usage of a hash with a specific requestId.
   * @param requestId - The identifier for the current request.
   * @param hash - The cache key hash.
   */
  trackRequestIdUsage(requestId, hash) {
    var _a15, _b;
    (_b = (_a15 = this.requestIdToUsedHashes)[requestId]) != null ? _b : _a15[requestId] = [];
    this.requestIdToUsedHashes[requestId].push(hash);
  }
  /**
   * Deletes all cache entries associated with a specific requestId.
   * @param requestId - The identifier for the request whose cache entries should be deleted.
   */
  deleteCacheForRequestId(requestId) {
    return __async(this, null, function* () {
      var _a15;
      if (!(yield this.acquireLock())) {
        this.logger({
          category: "base_cache",
          message: "Failed to acquire lock for deleting cache",
          level: 2
        });
        return;
      }
      try {
        const cache = this.readCache();
        const hashes = (_a15 = this.requestIdToUsedHashes[requestId]) != null ? _a15 : [];
        let entriesRemoved = 0;
        for (const hash of hashes) {
          if (cache[hash]) {
            delete cache[hash];
            entriesRemoved++;
          }
        }
        if (entriesRemoved > 0) {
          this.writeCache(cache);
        } else {
          this.logger({
            category: "base_cache",
            message: "no cache entries found for requestId",
            level: 1,
            auxiliary: {
              requestId: {
                value: requestId,
                type: "string"
              }
            }
          });
        }
        delete this.requestIdToUsedHashes[requestId];
      } catch (error) {
        this.logger({
          category: "base_cache",
          message: "error deleting cache for requestId",
          level: 2,
          auxiliary: {
            error: {
              value: error.message,
              type: "string"
            },
            trace: {
              value: error.stack,
              type: "string"
            },
            requestId: {
              value: requestId,
              type: "string"
            }
          }
        });
      } finally {
        this.releaseLock();
      }
    });
  }
  /**
   * Resets the entire cache by clearing the cache file.
   */
  resetCache() {
    try {
      fs2.writeFileSync(this.cacheFile, "{}");
      this.requestIdToUsedHashes = {};
    } catch (error) {
      this.logger({
        category: "base_cache",
        message: "error resetting cache",
        level: 2,
        auxiliary: {
          error: {
            value: error.message,
            type: "string"
          },
          trace: {
            value: error.stack,
            type: "string"
          }
        }
      });
    } finally {
      this.releaseLock();
    }
  }
};

// lib/cache/LLMCache.ts
var LLMCache = class _LLMCache extends BaseCache {
  constructor(logger, cacheDir, cacheFile) {
    super(logger, cacheDir, cacheFile || "llm_calls.json");
  }
  /**
   * Overrides the get method to track used hashes by requestId.
   * @param options - The options used to generate the cache key.
   * @param requestId - The identifier for the current request.
   * @returns The cached data if available, otherwise null.
   */
  get(options, requestId) {
    return __async(this, null, function* () {
      const data = yield __superGet(_LLMCache.prototype, this, "get").call(this, options, requestId);
      return data;
    });
  }
  /**
   * Overrides the set method to include cache cleanup logic.
   * @param options - The options used to generate the cache key.
   * @param data - The data to be cached.
   * @param requestId - The identifier for the current request.
   */
  set(options, data, requestId) {
    return __async(this, null, function* () {
      yield __superGet(_LLMCache.prototype, this, "set").call(this, options, data, requestId);
      this.logger({
        category: "llm_cache",
        message: "Cache miss - saved new response",
        level: 1
      });
    });
  }
};

// lib/llm/aisdk.ts
var import_ai2 = require("ai");

// lib/llm/LLMClient.ts
var import_ai = require("ai");
var AnnotatedScreenshotText = "This is a screenshot of the current page state with the elements annotated on it. Each element id is annotated with a number to the top left of it. Duplicate annotations at the same location are under each other vertically.";
var LLMClient = class {
  constructor(modelName, userProvidedInstructions) {
    this.generateObject = import_ai.generateObject;
    this.generateText = import_ai.generateText;
    this.streamText = import_ai.streamText;
    this.streamObject = import_ai.streamObject;
    this.generateImage = import_ai.experimental_generateImage;
    this.embed = import_ai.embed;
    this.embedMany = import_ai.embedMany;
    this.transcribe = import_ai.experimental_transcribe;
    this.generateSpeech = import_ai.experimental_generateSpeech;
    this.modelName = modelName;
    this.userProvidedInstructions = userProvidedInstructions;
  }
};

// lib/llm/aisdk.ts
var AISdkClient = class extends LLMClient {
  constructor({
    model,
    logger,
    enableCaching = false,
    cache
  }) {
    super(model.modelId);
    this.type = "aisdk";
    this.model = model;
    this.logger = logger;
    this.cache = cache;
    this.enableCaching = enableCaching;
  }
  createChatCompletion(_0) {
    return __async(this, arguments, function* ({
      options
    }) {
      var _a15, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
      (_a15 = this.logger) == null ? void 0 : _a15.call(this, {
        category: "aisdk",
        message: "creating chat completion",
        level: 2,
        auxiliary: {
          options: {
            value: JSON.stringify(__spreadProps(__spreadValues({}, options), { image: void 0 })),
            type: "object"
          },
          modelName: {
            value: this.model.modelId,
            type: "string"
          }
        }
      });
      const cacheOptions = {
        model: this.model.modelId,
        messages: options.messages,
        response_model: options.response_model
      };
      if (this.enableCaching && this.cache) {
        const cachedResponse = yield this.cache.get(
          cacheOptions,
          options.requestId
        );
        if (cachedResponse) {
          (_b = this.logger) == null ? void 0 : _b.call(this, {
            category: "llm_cache",
            message: "LLM cache hit - returning cached response",
            level: 1,
            auxiliary: {
              requestId: {
                value: options.requestId,
                type: "string"
              },
              cachedResponse: {
                value: JSON.stringify(cachedResponse),
                type: "object"
              }
            }
          });
          return cachedResponse;
        } else {
          (_c = this.logger) == null ? void 0 : _c.call(this, {
            category: "llm_cache",
            message: "LLM cache miss - no cached response found",
            level: 1,
            auxiliary: {
              requestId: {
                value: options.requestId,
                type: "string"
              }
            }
          });
        }
      }
      const formattedMessages = options.messages.map((message) => {
        if (Array.isArray(message.content)) {
          if (message.role === "system") {
            const systemMessage = {
              role: "system",
              content: message.content.map((c) => "text" in c ? c.text : "").join("\n")
            };
            return systemMessage;
          }
          const contentParts = message.content.map((content) => {
            if ("image_url" in content) {
              const imageContent = {
                type: "image",
                image: content.image_url.url
              };
              return imageContent;
            } else {
              const textContent = {
                type: "text",
                text: content.text
              };
              return textContent;
            }
          });
          if (message.role === "user") {
            const userMessage = {
              role: "user",
              content: contentParts
            };
            return userMessage;
          } else {
            const textOnlyParts = contentParts.map((part) => ({
              type: "text",
              text: part.type === "image" ? "[Image]" : part.text
            }));
            const assistantMessage = {
              role: "assistant",
              content: textOnlyParts
            };
            return assistantMessage;
          }
        }
        return {
          role: message.role,
          content: message.content
        };
      });
      let objectResponse;
      const isGPT5 = this.model.modelId.includes("gpt-5");
      if (options.response_model) {
        try {
          objectResponse = yield (0, import_ai2.generateObject)({
            model: this.model,
            messages: formattedMessages,
            schema: options.response_model.schema,
            temperature: options.temperature,
            providerOptions: isGPT5 ? {
              openai: {
                textVerbosity: "low",
                // Making these the default for gpt-5 for now
                reasoningEffort: "minimal"
              }
            } : void 0
          });
        } catch (err) {
          if (import_ai2.NoObjectGeneratedError.isInstance(err)) {
            (_i = this.logger) == null ? void 0 : _i.call(this, {
              category: "AISDK error",
              message: err.message,
              level: 0,
              auxiliary: {
                cause: {
                  value: JSON.stringify((_d = err.cause) != null ? _d : {}),
                  type: "object"
                },
                text: {
                  value: (_e = err.text) != null ? _e : "",
                  type: "string"
                },
                response: {
                  value: JSON.stringify((_f = err.response) != null ? _f : {}),
                  type: "object"
                },
                usage: {
                  value: JSON.stringify((_g = err.usage) != null ? _g : {}),
                  type: "object"
                },
                finishReason: {
                  value: (_h = err.finishReason) != null ? _h : "unknown",
                  type: "string"
                },
                requestId: {
                  value: options.requestId,
                  type: "string"
                }
              }
            });
            throw err;
          }
          throw err;
        }
        const result2 = {
          data: objectResponse.object,
          usage: {
            prompt_tokens: (_j = objectResponse.usage.promptTokens) != null ? _j : 0,
            completion_tokens: (_k = objectResponse.usage.completionTokens) != null ? _k : 0,
            total_tokens: (_l = objectResponse.usage.totalTokens) != null ? _l : 0
          }
        };
        if (this.enableCaching) {
          (_m = this.logger) == null ? void 0 : _m.call(this, {
            category: "llm_cache",
            message: "caching response",
            level: 1,
            auxiliary: {
              requestId: {
                value: options.requestId,
                type: "string"
              },
              cacheOptions: {
                value: JSON.stringify(cacheOptions),
                type: "object"
              },
              response: {
                value: JSON.stringify(result2),
                type: "object"
              }
            }
          });
          this.cache.set(cacheOptions, result2, options.requestId);
        }
        (_n = this.logger) == null ? void 0 : _n.call(this, {
          category: "aisdk",
          message: "response",
          level: 2,
          auxiliary: {
            response: {
              value: JSON.stringify(objectResponse),
              type: "object"
            },
            requestId: {
              value: options.requestId,
              type: "string"
            }
          }
        });
        return result2;
      }
      const tools = {};
      for (const rawTool of (_o = options.tools) != null ? _o : []) {
        tools[rawTool.name] = {
          description: rawTool.description,
          parameters: rawTool.parameters
        };
      }
      const textResponse = yield (0, import_ai2.generateText)({
        model: this.model,
        messages: formattedMessages,
        temperature: options.temperature,
        tools
      });
      const result = {
        data: textResponse.text,
        usage: {
          prompt_tokens: (_p = textResponse.usage.promptTokens) != null ? _p : 0,
          completion_tokens: (_q = textResponse.usage.completionTokens) != null ? _q : 0,
          total_tokens: (_r = textResponse.usage.totalTokens) != null ? _r : 0
        }
      };
      if (this.enableCaching) {
        (_s = this.logger) == null ? void 0 : _s.call(this, {
          category: "llm_cache",
          message: "caching response",
          level: 1,
          auxiliary: {
            requestId: {
              value: options.requestId,
              type: "string"
            },
            cacheOptions: {
              value: JSON.stringify(cacheOptions),
              type: "object"
            },
            response: {
              value: JSON.stringify(result),
              type: "object"
            }
          }
        });
        this.cache.set(cacheOptions, result, options.requestId);
      }
      (_t = this.logger) == null ? void 0 : _t.call(this, {
        category: "aisdk",
        message: "response",
        level: 2,
        auxiliary: {
          response: {
            value: JSON.stringify(textResponse),
            type: "object"
          },
          requestId: {
            value: options.requestId,
            type: "string"
          }
        }
      });
      return result;
    });
  }
};

// lib/llm/AnthropicClient.ts
var import_sdk = __toESM(require("@anthropic-ai/sdk"));
var import_zod_to_json_schema2 = require("zod-to-json-schema");
var AnthropicClient = class extends LLMClient {
  constructor({
    enableCaching = false,
    cache,
    modelName,
    clientOptions,
    userProvidedInstructions
  }) {
    super(modelName);
    this.type = "anthropic";
    this.client = new import_sdk.default(clientOptions);
    this.cache = cache;
    this.enableCaching = enableCaching;
    this.modelName = modelName;
    this.clientOptions = clientOptions;
    this.userProvidedInstructions = userProvidedInstructions;
  }
  createChatCompletion(_0) {
    return __async(this, arguments, function* ({
      options,
      retries,
      logger
    }) {
      var _a15, _b;
      const optionsWithoutImage = __spreadValues({}, options);
      delete optionsWithoutImage.image;
      logger({
        category: "anthropic",
        message: "creating chat completion",
        level: 2,
        auxiliary: {
          options: {
            value: JSON.stringify(optionsWithoutImage),
            type: "object"
          }
        }
      });
      const cacheOptions = {
        model: this.modelName,
        messages: options.messages,
        temperature: options.temperature,
        image: options.image,
        response_model: options.response_model,
        tools: options.tools,
        retries
      };
      if (this.enableCaching) {
        const cachedResponse = yield this.cache.get(
          cacheOptions,
          options.requestId
        );
        if (cachedResponse) {
          logger({
            category: "llm_cache",
            message: "LLM cache hit - returning cached response",
            level: 1,
            auxiliary: {
              cachedResponse: {
                value: JSON.stringify(cachedResponse),
                type: "object"
              },
              requestId: {
                value: options.requestId,
                type: "string"
              },
              cacheOptions: {
                value: JSON.stringify(cacheOptions),
                type: "object"
              }
            }
          });
          return cachedResponse;
        } else {
          logger({
            category: "llm_cache",
            message: "LLM cache miss - no cached response found",
            level: 1,
            auxiliary: {
              cacheOptions: {
                value: JSON.stringify(cacheOptions),
                type: "object"
              },
              requestId: {
                value: options.requestId,
                type: "string"
              }
            }
          });
        }
      }
      const systemMessage = options.messages.find((msg) => {
        if (msg.role === "system") {
          if (typeof msg.content === "string") {
            return true;
          } else if (Array.isArray(msg.content)) {
            return msg.content.every((content) => content.type !== "image_url");
          }
        }
        return false;
      });
      const userMessages = options.messages.filter(
        (msg) => msg.role !== "system"
      );
      const formattedMessages = userMessages.map((msg) => {
        if (typeof msg.content === "string") {
          return {
            role: msg.role,
            // ensure its not checking for system types
            content: msg.content
          };
        } else {
          return {
            role: msg.role,
            content: msg.content.map((content) => {
              if ("image_url" in content) {
                const formattedContent = {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: "image/jpeg",
                    data: content.image_url.url
                  }
                };
                return formattedContent;
              } else {
                return { type: "text", text: content.text };
              }
            })
          };
        }
      });
      if (options.image) {
        const screenshotMessage = {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: options.image.buffer.toString("base64")
              }
            }
          ]
        };
        if (options.image.description && Array.isArray(screenshotMessage.content)) {
          screenshotMessage.content.push({
            type: "text",
            text: options.image.description
          });
        }
        formattedMessages.push(screenshotMessage);
      }
      let anthropicTools2 = (_a15 = options.tools) == null ? void 0 : _a15.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: {
            type: "object",
            properties: tool.parameters.properties,
            required: tool.parameters.required
          }
        };
      });
      let toolDefinition;
      if (options.response_model) {
        const jsonSchema = (0, import_zod_to_json_schema2.zodToJsonSchema)(options.response_model.schema);
        const { properties: schemaProperties, required: schemaRequired } = extractSchemaProperties(jsonSchema);
        toolDefinition = {
          name: "print_extracted_data",
          description: "Prints the extracted data based on the provided schema.",
          input_schema: {
            type: "object",
            properties: schemaProperties,
            required: schemaRequired
          }
        };
      }
      if (toolDefinition) {
        anthropicTools2 = anthropicTools2 != null ? anthropicTools2 : [];
        anthropicTools2.push(toolDefinition);
      }
      const response = yield this.client.messages.create({
        model: this.modelName,
        max_tokens: options.maxTokens || 8192,
        messages: formattedMessages,
        tools: anthropicTools2,
        system: systemMessage ? systemMessage.content : void 0,
        temperature: options.temperature
      });
      logger({
        category: "anthropic",
        message: "response",
        level: 2,
        auxiliary: {
          response: {
            value: JSON.stringify(response),
            type: "object"
          },
          requestId: {
            value: options.requestId,
            type: "string"
          }
        }
      });
      const usageData = {
        prompt_tokens: response.usage.input_tokens,
        completion_tokens: response.usage.output_tokens,
        total_tokens: response.usage.input_tokens + response.usage.output_tokens
      };
      const transformedResponse = {
        id: response.id,
        object: "chat.completion",
        created: Date.now(),
        model: response.model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: ((_b = response.content.find((c) => c.type === "text")) == null ? void 0 : _b.text) || null,
              tool_calls: response.content.filter((c) => c.type === "tool_use").map((toolUse) => ({
                id: toolUse.id,
                type: "function",
                function: {
                  name: toolUse.name,
                  arguments: JSON.stringify(toolUse.input)
                }
              }))
            },
            finish_reason: response.stop_reason
          }
        ],
        usage: usageData
      };
      logger({
        category: "anthropic",
        message: "transformed response",
        level: 2,
        auxiliary: {
          transformedResponse: {
            value: JSON.stringify(transformedResponse),
            type: "object"
          },
          requestId: {
            value: options.requestId,
            type: "string"
          }
        }
      });
      if (options.response_model) {
        const toolUse = response.content.find((c) => c.type === "tool_use");
        if (toolUse && "input" in toolUse) {
          const result = toolUse.input;
          const finalParsedResponse = {
            data: result,
            usage: usageData
          };
          if (this.enableCaching) {
            this.cache.set(cacheOptions, finalParsedResponse, options.requestId);
          }
          return finalParsedResponse;
        } else {
          if (!retries || retries < 5) {
            return this.createChatCompletion({
              options,
              logger,
              retries: (retries != null ? retries : 0) + 1
            });
          }
          logger({
            category: "anthropic",
            message: "error creating chat completion",
            level: 0,
            auxiliary: {
              requestId: {
                value: options.requestId,
                type: "string"
              }
            }
          });
          throw new CreateChatCompletionResponseError(
            "No tool use with input in response"
          );
        }
      }
      if (this.enableCaching) {
        this.cache.set(cacheOptions, transformedResponse, options.requestId);
        logger({
          category: "anthropic",
          message: "cached response",
          level: 1,
          auxiliary: {
            requestId: {
              value: options.requestId,
              type: "string"
            },
            transformedResponse: {
              value: JSON.stringify(transformedResponse),
              type: "object"
            },
            cacheOptions: {
              value: JSON.stringify(cacheOptions),
              type: "object"
            }
          }
        });
      }
      return transformedResponse;
    });
  }
};
var extractSchemaProperties = (jsonSchema) => {
  var _a15;
  const schemaRoot = ((_a15 = jsonSchema.definitions) == null ? void 0 : _a15.MySchema) || jsonSchema;
  return {
    properties: schemaRoot.properties,
    required: schemaRoot.required
  };
};

// lib/llm/CerebrasClient.ts
var import_openai = __toESM(require("openai"));
var import_zod_to_json_schema3 = require("zod-to-json-schema");
var CerebrasClient = class extends LLMClient {
  constructor({
    enableCaching = false,
    cache,
    modelName,
    clientOptions,
    userProvidedInstructions
  }) {
    super(modelName, userProvidedInstructions);
    this.type = "cerebras";
    this.hasVision = false;
    this.client = new import_openai.default(__spreadValues({
      baseURL: "https://api.cerebras.ai/v1",
      apiKey: (clientOptions == null ? void 0 : clientOptions.apiKey) || process.env.CEREBRAS_API_KEY
    }, clientOptions));
    this.cache = cache;
    this.enableCaching = enableCaching;
    this.modelName = modelName;
    this.clientOptions = clientOptions;
  }
  createChatCompletion(_0) {
    return __async(this, arguments, function* ({
      options,
      retries,
      logger
    }) {
      var _a15, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      const optionsWithoutImage = __spreadValues({}, options);
      delete optionsWithoutImage.image;
      logger({
        category: "cerebras",
        message: "creating chat completion",
        level: 2,
        auxiliary: {
          options: {
            value: JSON.stringify(optionsWithoutImage),
            type: "object"
          }
        }
      });
      const cacheOptions = {
        model: this.modelName.split("cerebras-")[1],
        messages: options.messages,
        temperature: options.temperature,
        response_model: options.response_model,
        tools: options.tools,
        retries
      };
      if (this.enableCaching) {
        const cachedResponse = yield this.cache.get(
          cacheOptions,
          options.requestId
        );
        if (cachedResponse) {
          logger({
            category: "llm_cache",
            message: "LLM cache hit - returning cached response",
            level: 1,
            auxiliary: {
              cachedResponse: {
                value: JSON.stringify(cachedResponse),
                type: "object"
              },
              requestId: {
                value: options.requestId,
                type: "string"
              },
              cacheOptions: {
                value: JSON.stringify(cacheOptions),
                type: "object"
              }
            }
          });
          return cachedResponse;
        }
      }
      const formattedMessages = options.messages.map((msg) => {
        const baseMessage = {
          content: typeof msg.content === "string" ? msg.content : Array.isArray(msg.content) && msg.content.length > 0 && "text" in msg.content[0] ? msg.content[0].text : ""
        };
        if (msg.role === "system") {
          return __spreadProps(__spreadValues({}, baseMessage), { role: "system" });
        } else if (msg.role === "assistant") {
          return __spreadProps(__spreadValues({}, baseMessage), { role: "assistant" });
        } else {
          return __spreadProps(__spreadValues({}, baseMessage), { role: "user" });
        }
      });
      let tools = (_a15 = options.tools) == null ? void 0 : _a15.map((tool) => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: {
            type: "object",
            properties: tool.parameters.properties,
            required: tool.parameters.required
          }
        }
      }));
      if (options.response_model) {
        const jsonSchema = (0, import_zod_to_json_schema3.zodToJsonSchema)(options.response_model.schema);
        const schemaProperties = jsonSchema.properties || {};
        const schemaRequired = jsonSchema.required || [];
        const responseTool = {
          type: "function",
          function: {
            name: "print_extracted_data",
            description: "Prints the extracted data based on the provided schema.",
            parameters: {
              type: "object",
              properties: schemaProperties,
              required: schemaRequired
            }
          }
        };
        tools = tools ? [...tools, responseTool] : [responseTool];
      }
      try {
        const apiResponse = yield this.client.chat.completions.create({
          model: this.modelName.split("cerebras-")[1],
          messages: [
            ...formattedMessages,
            // Add explicit instruction to return JSON if we have a response model
            ...options.response_model ? [
              {
                role: "system",
                content: `IMPORTANT: Your response must be valid JSON that matches this schema: ${JSON.stringify(
                  options.response_model.schema
                )}`
              }
            ] : []
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens,
          tools,
          tool_choice: options.tool_choice || "auto"
        });
        const response = {
          id: apiResponse.id,
          object: "chat.completion",
          created: Date.now(),
          model: this.modelName.split("cerebras-")[1],
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: ((_c = (_b = apiResponse.choices[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content) || null,
                tool_calls: ((_e = (_d = apiResponse.choices[0]) == null ? void 0 : _d.message) == null ? void 0 : _e.tool_calls) || []
              },
              finish_reason: ((_f = apiResponse.choices[0]) == null ? void 0 : _f.finish_reason) || "stop"
            }
          ],
          usage: {
            prompt_tokens: ((_g = apiResponse.usage) == null ? void 0 : _g.prompt_tokens) || 0,
            completion_tokens: ((_h = apiResponse.usage) == null ? void 0 : _h.completion_tokens) || 0,
            total_tokens: ((_i = apiResponse.usage) == null ? void 0 : _i.total_tokens) || 0
          }
        };
        logger({
          category: "cerebras",
          message: "response",
          level: 2,
          auxiliary: {
            response: {
              value: JSON.stringify(response),
              type: "object"
            },
            requestId: {
              value: options.requestId,
              type: "string"
            }
          }
        });
        if (!options.response_model) {
          if (this.enableCaching) {
            yield this.cache.set(cacheOptions, response, options.requestId);
          }
          return response;
        }
        const toolCall = (_l = (_k = (_j = response.choices[0]) == null ? void 0 : _j.message) == null ? void 0 : _k.tool_calls) == null ? void 0 : _l[0];
        if ((_m = toolCall == null ? void 0 : toolCall.function) == null ? void 0 : _m.arguments) {
          try {
            const result = JSON.parse(toolCall.function.arguments);
            const finalResponse = {
              data: result,
              usage: response.usage
            };
            if (this.enableCaching) {
              yield this.cache.set(
                cacheOptions,
                finalResponse,
                options.requestId
              );
            }
            return finalResponse;
          } catch (e) {
            logger({
              category: "cerebras",
              message: "failed to parse tool call arguments as JSON, retrying",
              level: 0,
              auxiliary: {
                error: {
                  value: e.message,
                  type: "string"
                }
              }
            });
          }
        }
        const content = (_o = (_n = response.choices[0]) == null ? void 0 : _n.message) == null ? void 0 : _o.content;
        if (content) {
          try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const result = JSON.parse(jsonMatch[0]);
              const finalResponse = {
                data: result,
                usage: response.usage
              };
              if (this.enableCaching) {
                yield this.cache.set(
                  cacheOptions,
                  finalResponse,
                  options.requestId
                );
              }
              return finalResponse;
            }
          } catch (e) {
            logger({
              category: "cerebras",
              message: "failed to parse content as JSON",
              level: 0,
              auxiliary: {
                error: {
                  value: e.message,
                  type: "string"
                }
              }
            });
          }
        }
        if (!retries || retries < 5) {
          return this.createChatCompletion({
            options,
            logger,
            retries: (retries != null ? retries : 0) + 1
          });
        }
        throw new CreateChatCompletionResponseError("Invalid response schema");
      } catch (error) {
        logger({
          category: "cerebras",
          message: "error creating chat completion",
          level: 0,
          auxiliary: {
            error: {
              value: error.message,
              type: "string"
            },
            requestId: {
              value: options.requestId,
              type: "string"
            }
          }
        });
        throw error;
      }
    });
  }
};

// lib/llm/GoogleClient.ts
var import_genai2 = require("@google/genai");
var import_zod_to_json_schema4 = __toESM(require("zod-to-json-schema"));
var roleMap = {
  user: "user",
  assistant: "model",
  system: "user"
  // Gemini API prefers system instructions either via system_instruction or at the start of 'user' content
};
var safetySettings = [
  {
    category: import_genai2.HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: import_genai2.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: import_genai2.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: import_genai2.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: import_genai2.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: import_genai2.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: import_genai2.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: import_genai2.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  }
];
var GoogleClient = class extends LLMClient {
  constructor({
    logger,
    // Added logger based on other clients
    enableCaching = false,
    cache,
    modelName,
    clientOptions
  }) {
    super(modelName);
    this.type = "google";
    if (!(clientOptions == null ? void 0 : clientOptions.apiKey)) {
      clientOptions.apiKey = loadApiKeyFromEnv("google_legacy", logger);
    }
    this.clientOptions = clientOptions;
    this.client = new import_genai2.GoogleGenAI({ apiKey: clientOptions.apiKey });
    this.cache = cache;
    this.enableCaching = enableCaching;
    this.modelName = modelName;
    this.logger = logger;
    this.hasVision = modelName.includes("vision") || modelName.includes("gemini-1.5");
  }
  // Helper to convert project's ChatMessage[] to Gemini's Content[]
  formatMessages(messages, image) {
    const contents = [];
    let systemInstruction = null;
    messages.forEach((msg, index) => {
      const role = roleMap[msg.role];
      if (!role) {
        this.logger({
          category: "google",
          message: `WARNING: Unsupported role: ${msg.role}`,
          level: 1
        });
        return;
      }
      if (msg.role === "system") {
        if (typeof msg.content === "string") {
          systemInstruction = (systemInstruction ? systemInstruction + "\n\n" : "") + msg.content;
        }
        return;
      }
      const parts = [];
      if (Array.isArray(msg.content)) {
        msg.content.forEach((partContent) => {
          var _a15;
          if (partContent.type === "text") {
            parts.push({ text: partContent.text });
          } else if (partContent.type === "image_url") {
            if ("image_url" in partContent && ((_a15 = partContent.image_url) == null ? void 0 : _a15.url)) {
              const base64Data = partContent.image_url.url.split(",")[1];
              const mimeTypeMatch = partContent.image_url.url.match(
                /^data:(image\/\w+);base64,/
              );
              if (base64Data && mimeTypeMatch) {
                parts.push({
                  inlineData: { mimeType: mimeTypeMatch[1], data: base64Data }
                });
              } else {
                this.logger({
                  category: "google",
                  message: "WARNING: Could not parse image data URI format",
                  level: 1
                });
              }
            }
          }
        });
      } else if (typeof msg.content === "string") {
        parts.push({ text: msg.content });
      }
      if (image && index === messages.length - 1 && msg.role === "user") {
        const imageDesc = image.description || AnnotatedScreenshotText;
        parts.push({ text: imageDesc });
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            // Assuming JPEG, adjust if needed
            data: image.buffer.toString("base64")
          }
        });
      }
      if (systemInstruction && contents.length === 0 && role === "user") {
        const firstPartText = parts.find((p) => "text" in p);
        if (firstPartText && "text" in firstPartText) {
          firstPartText.text = `${systemInstruction}

${firstPartText.text}`;
        } else {
          parts.unshift({ text: systemInstruction });
        }
        systemInstruction = null;
      }
      if (parts.length > 0) {
        contents.push({ role, parts });
      }
    });
    if (systemInstruction) {
      contents.unshift({ role: "user", parts: [{ text: systemInstruction }] });
    }
    return contents;
  }
  // Helper to convert LLMTool[] to Gemini's Tool[]
  formatTools(tools) {
    if (!tools || tools.length === 0) {
      return void 0;
    }
    return [
      {
        functionDeclarations: tools.map((tool) => {
          let parameters = void 0;
          if (tool.parameters) {
            parameters = {
              type: import_genai2.Type.OBJECT,
              properties: tool.parameters.properties,
              required: tool.parameters.required
            };
          }
          return {
            name: tool.name,
            description: tool.description,
            parameters
          };
        })
      }
    ];
  }
  createChatCompletion(_0) {
    return __async(this, arguments, function* ({
      // Ensure LLMResponse is compatible
      options,
      logger,
      retries = 3
    }) {
      var _a15, _b, _c, _d, _e, _f, _g, _h, _i;
      const {
        image,
        requestId,
        response_model,
        tools,
        temperature,
        top_p,
        maxTokens
      } = options;
      const cacheKeyOptions = {
        model: this.modelName,
        messages: options.messages,
        temperature,
        top_p,
        // frequency_penalty and presence_penalty are not directly supported in Gemini API
        image: image ? { description: image.description, bufferLength: image.buffer.length } : void 0,
        // Use buffer length for caching key stability
        response_model: response_model ? {
          name: response_model.name,
          schema: JSON.stringify((0, import_zod_to_json_schema4.default)(response_model.schema))
        } : void 0,
        tools,
        maxTokens
      };
      if (this.enableCaching) {
        const cachedResponse = yield this.cache.get(
          cacheKeyOptions,
          requestId
        );
        if (cachedResponse) {
          logger({
            category: "llm_cache",
            message: "LLM cache hit - returning cached response",
            level: 1,
            auxiliary: { requestId: { value: requestId, type: "string" } }
          });
          return cachedResponse;
        } else {
          logger({
            category: "llm_cache",
            message: "LLM cache miss - proceeding with API call",
            level: 1,
            auxiliary: { requestId: { value: requestId, type: "string" } }
          });
        }
      }
      const formattedMessages = this.formatMessages(options.messages, image);
      const formattedTools = this.formatTools(tools);
      const generationConfig = {
        maxOutputTokens: maxTokens,
        temperature,
        topP: top_p,
        responseMimeType: response_model ? "application/json" : void 0,
        responseSchema: response_model ? toGeminiSchema(response_model.schema) : void 0
      };
      logger({
        category: "google",
        message: "creating chat completion",
        level: 2,
        auxiliary: {
          modelName: { value: this.modelName, type: "string" },
          requestId: { value: requestId, type: "string" },
          requestPayloadSummary: {
            value: `Model: ${this.modelName}, Messages: ${formattedMessages.length}, Config Keys: ${Object.keys(generationConfig).join(", ")}, Tools: ${formattedTools ? formattedTools.length : 0}, Safety Categories: ${safetySettings.map((s) => s.category).join(", ")}`,
            type: "string"
          }
        }
      });
      const requestPayload = {
        model: this.modelName,
        contents: formattedMessages,
        config: __spreadProps(__spreadValues({}, generationConfig), {
          safetySettings,
          tools: formattedTools
        })
      };
      try {
        logger({
          category: "google",
          message: "Full request payload",
          level: 2,
          auxiliary: {
            requestId: { value: requestId, type: "string" },
            fullPayload: {
              value: JSON.stringify(requestPayload),
              type: "object"
            }
          }
        });
      } catch (e) {
        logger({
          category: "google",
          message: "Failed to stringify full request payload for logging",
          level: 0,
          auxiliary: {
            requestId: { value: requestId, type: "string" },
            error: { value: e.message, type: "string" }
          }
        });
      }
      try {
        const result = yield this.client.models.generateContent(requestPayload);
        logger({
          category: "google",
          message: "received response",
          level: 2,
          auxiliary: {
            requestId: { value: requestId, type: "string" },
            response: {
              value: JSON.stringify(result),
              type: "object"
            }
          }
        });
        const finishReason = ((_b = (_a15 = result.candidates) == null ? void 0 : _a15[0]) == null ? void 0 : _b.finishReason) || "unknown";
        const toolCalls = (_c = result.functionCalls) == null ? void 0 : _c.map(
          (fc, index) => ({
            id: `tool_call_${requestId}_${index}`,
            type: "function",
            function: {
              name: fc.name,
              arguments: JSON.stringify(fc.args)
            }
          })
        );
        let content = null;
        try {
          content = result.text;
        } catch (e) {
          logger({
            category: "google",
            message: `Could not extract text content: ${e.message}`,
            level: 1,
            auxiliary: { requestId: { value: requestId, type: "string" } }
          });
          content = null;
        }
        const llmResponse = {
          id: ((_f = (_e = (_d = result.candidates) == null ? void 0 : _d[0]) == null ? void 0 : _e.index) == null ? void 0 : _f.toString()) || requestId,
          object: "chat.completion",
          created: Math.floor(Date.now() / 1e3),
          model: this.modelName,
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content,
                tool_calls: toolCalls
              },
              finish_reason: finishReason
            }
          ],
          usage: {
            prompt_tokens: ((_g = result.usageMetadata) == null ? void 0 : _g.promptTokenCount) || 0,
            completion_tokens: ((_h = result.usageMetadata) == null ? void 0 : _h.candidatesTokenCount) || 0,
            total_tokens: ((_i = result.usageMetadata) == null ? void 0 : _i.totalTokenCount) || 0
          }
        };
        if (response_model) {
          let parsedData;
          try {
            const potentialJson = (content == null ? void 0 : content.trim().replace(/^```json\n?|\n?```$/g, "")) || "{}";
            parsedData = JSON.parse(potentialJson);
          } catch (e) {
            logger({
              category: "google",
              message: `Failed to parse JSON response: ${e.message}`,
              level: 0,
              auxiliary: {
                content: { value: content || "null", type: "string" }
              }
            });
            if (retries > 0) {
              return this.createChatCompletion({
                options,
                logger,
                retries: retries - 1
              });
            }
            throw new CreateChatCompletionResponseError(
              `Failed to parse JSON response: ${e.message}`
            );
          }
          try {
            validateZodSchema(response_model.schema, parsedData);
          } catch (err) {
            logger({
              category: "google",
              message: "Response failed Zod schema validation",
              level: 0
            });
            if (retries > 0) {
              return this.createChatCompletion({
                options,
                logger,
                retries: retries - 1
              });
            }
            throw err;
          }
          const extractionResult = {
            data: parsedData,
            usage: llmResponse.usage
          };
          if (this.enableCaching) {
            yield this.cache.set(cacheKeyOptions, extractionResult, requestId);
          }
          return extractionResult;
        }
        if (this.enableCaching) {
          yield this.cache.set(cacheKeyOptions, llmResponse, requestId);
        }
        return llmResponse;
      } catch (error) {
        logger({
          category: "google",
          message: `Error during Google AI chat completion: ${error.message}`,
          level: 0,
          auxiliary: {
            errorDetails: {
              value: `Message: ${error.message}${error.stack ? "\nStack: " + error.stack : ""}`,
              type: "string"
            },
            requestId: { value: requestId, type: "string" }
          }
        });
        if (retries > 0) {
          logger({
            category: "google",
            message: `Retrying... (${retries} attempts left)`,
            level: 1
          });
          yield new Promise(
            (resolve2) => setTimeout(resolve2, 1e3 * (4 - retries))
          );
          return this.createChatCompletion({
            options,
            logger,
            retries: retries - 1
          });
        }
        if (error instanceof StagehandError) {
          throw error;
        }
        throw new StagehandError(
          `Google AI API request failed: ${error.message}`
        );
      }
    });
  }
};

// lib/llm/GroqClient.ts
var import_openai2 = __toESM(require("openai"));
var import_zod_to_json_schema5 = require("zod-to-json-schema");
var GroqClient = class extends LLMClient {
  constructor({
    enableCaching = false,
    cache,
    modelName,
    clientOptions,
    userProvidedInstructions
  }) {
    super(modelName, userProvidedInstructions);
    this.type = "groq";
    this.hasVision = false;
    this.client = new import_openai2.default(__spreadValues({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: (clientOptions == null ? void 0 : clientOptions.apiKey) || process.env.GROQ_API_KEY
    }, clientOptions));
    this.cache = cache;
    this.enableCaching = enableCaching;
    this.modelName = modelName;
    this.clientOptions = clientOptions;
  }
  createChatCompletion(_0) {
    return __async(this, arguments, function* ({
      options,
      retries,
      logger
    }) {
      var _a15, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      const optionsWithoutImage = __spreadValues({}, options);
      delete optionsWithoutImage.image;
      logger({
        category: "groq",
        message: "creating chat completion",
        level: 2,
        auxiliary: {
          options: {
            value: JSON.stringify(optionsWithoutImage),
            type: "object"
          }
        }
      });
      const cacheOptions = {
        model: this.modelName.split("groq-")[1],
        messages: options.messages,
        temperature: options.temperature,
        response_model: options.response_model,
        tools: options.tools,
        retries
      };
      if (this.enableCaching) {
        const cachedResponse = yield this.cache.get(
          cacheOptions,
          options.requestId
        );
        if (cachedResponse) {
          logger({
            category: "llm_cache",
            message: "LLM cache hit - returning cached response",
            level: 1,
            auxiliary: {
              cachedResponse: {
                value: JSON.stringify(cachedResponse),
                type: "object"
              },
              requestId: {
                value: options.requestId,
                type: "string"
              },
              cacheOptions: {
                value: JSON.stringify(cacheOptions),
                type: "object"
              }
            }
          });
          return cachedResponse;
        }
      }
      const formattedMessages = options.messages.map((msg) => {
        const baseMessage = {
          content: typeof msg.content === "string" ? msg.content : Array.isArray(msg.content) && msg.content.length > 0 && "text" in msg.content[0] ? msg.content[0].text : ""
        };
        if (msg.role === "system") {
          return __spreadProps(__spreadValues({}, baseMessage), { role: "system" });
        } else if (msg.role === "assistant") {
          return __spreadProps(__spreadValues({}, baseMessage), { role: "assistant" });
        } else {
          return __spreadProps(__spreadValues({}, baseMessage), { role: "user" });
        }
      });
      let tools = (_a15 = options.tools) == null ? void 0 : _a15.map((tool) => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: {
            type: "object",
            properties: tool.parameters.properties,
            required: tool.parameters.required
          }
        }
      }));
      if (options.response_model) {
        const jsonSchema = (0, import_zod_to_json_schema5.zodToJsonSchema)(options.response_model.schema);
        const schemaProperties = jsonSchema.properties || {};
        const schemaRequired = jsonSchema.required || [];
        const responseTool = {
          type: "function",
          function: {
            name: "print_extracted_data",
            description: "Prints the extracted data based on the provided schema.",
            parameters: {
              type: "object",
              properties: schemaProperties,
              required: schemaRequired
            }
          }
        };
        tools = tools ? [...tools, responseTool] : [responseTool];
      }
      try {
        const apiResponse = yield this.client.chat.completions.create({
          model: this.modelName.split("groq-")[1],
          messages: [
            ...formattedMessages,
            // Add explicit instruction to return JSON if we have a response model
            ...options.response_model ? [
              {
                role: "system",
                content: `IMPORTANT: Your response must be valid JSON that matches this schema: ${JSON.stringify(
                  options.response_model.schema
                )}`
              }
            ] : []
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens,
          tools,
          tool_choice: options.tool_choice || "auto"
        });
        const response = {
          id: apiResponse.id,
          object: "chat.completion",
          created: Date.now(),
          model: this.modelName.split("groq-")[1],
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: ((_c = (_b = apiResponse.choices[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content) || null,
                tool_calls: ((_e = (_d = apiResponse.choices[0]) == null ? void 0 : _d.message) == null ? void 0 : _e.tool_calls) || []
              },
              finish_reason: ((_f = apiResponse.choices[0]) == null ? void 0 : _f.finish_reason) || "stop"
            }
          ],
          usage: {
            prompt_tokens: ((_g = apiResponse.usage) == null ? void 0 : _g.prompt_tokens) || 0,
            completion_tokens: ((_h = apiResponse.usage) == null ? void 0 : _h.completion_tokens) || 0,
            total_tokens: ((_i = apiResponse.usage) == null ? void 0 : _i.total_tokens) || 0
          }
        };
        logger({
          category: "groq",
          message: "response",
          level: 2,
          auxiliary: {
            response: {
              value: JSON.stringify(response),
              type: "object"
            },
            requestId: {
              value: options.requestId,
              type: "string"
            }
          }
        });
        if (!options.response_model) {
          if (this.enableCaching) {
            yield this.cache.set(cacheOptions, response, options.requestId);
          }
          return response;
        }
        const toolCall = (_l = (_k = (_j = response.choices[0]) == null ? void 0 : _j.message) == null ? void 0 : _k.tool_calls) == null ? void 0 : _l[0];
        if ((_m = toolCall == null ? void 0 : toolCall.function) == null ? void 0 : _m.arguments) {
          try {
            const result = JSON.parse(toolCall.function.arguments);
            const finalResponse = {
              data: result,
              usage: response.usage
            };
            if (this.enableCaching) {
              yield this.cache.set(
                cacheOptions,
                finalResponse,
                options.requestId
              );
            }
            return finalResponse;
          } catch (e) {
            logger({
              category: "groq",
              message: "failed to parse tool call arguments as JSON, retrying",
              level: 0,
              auxiliary: {
                error: {
                  value: e.message,
                  type: "string"
                }
              }
            });
          }
        }
        const content = (_o = (_n = response.choices[0]) == null ? void 0 : _n.message) == null ? void 0 : _o.content;
        if (content) {
          try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const result = JSON.parse(jsonMatch[0]);
              const finalResponse = {
                data: result,
                usage: response.usage
              };
              if (this.enableCaching) {
                yield this.cache.set(
                  cacheOptions,
                  finalResponse,
                  options.requestId
                );
              }
              return finalResponse;
            }
          } catch (e) {
            logger({
              category: "groq",
              message: "failed to parse content as JSON",
              level: 0,
              auxiliary: {
                error: {
                  value: e.message,
                  type: "string"
                }
              }
            });
          }
        }
        if (!retries || retries < 5) {
          return this.createChatCompletion({
            options,
            logger,
            retries: (retries != null ? retries : 0) + 1
          });
        }
        throw new CreateChatCompletionResponseError("Invalid response schema");
      } catch (error) {
        logger({
          category: "groq",
          message: "error creating chat completion",
          level: 0,
          auxiliary: {
            error: {
              value: error.message,
              type: "string"
            },
            requestId: {
              value: options.requestId,
              type: "string"
            }
          }
        });
        throw error;
      }
    });
  }
};

// lib/llm/OpenAIClient.ts
var import_openai3 = __toESM(require("openai"));
var import_zod = require("openai/helpers/zod");
var import_zod_to_json_schema6 = __toESM(require("zod-to-json-schema"));
var OpenAIClient = class extends LLMClient {
  constructor({
    enableCaching = false,
    cache,
    modelName,
    clientOptions
  }) {
    super(modelName);
    this.type = "openai";
    this.clientOptions = clientOptions;
    this.client = new import_openai3.default(clientOptions);
    this.cache = cache;
    this.enableCaching = enableCaching;
    this.modelName = modelName;
  }
  createChatCompletion(_0) {
    return __async(this, arguments, function* ({
      options: optionsInitial,
      logger,
      retries = 3
    }) {
      var _a15, _b, _e;
      let options = optionsInitial;
      let isToolsOverridedForO1 = false;
      if (this.modelName.startsWith("o1") || this.modelName.startsWith("o3")) {
        let {
          tool_choice,
          top_p,
          frequency_penalty,
          presence_penalty,
          temperature
        } = options;
        _a15 = options, {
          tool_choice,
          top_p,
          frequency_penalty,
          presence_penalty,
          temperature
        } = _a15, options = __objRest(_a15, [
          "tool_choice",
          "top_p",
          "frequency_penalty",
          "presence_penalty",
          "temperature"
        ]);
        options.messages = options.messages.map((message) => __spreadProps(__spreadValues({}, message), {
          role: "user"
        }));
        if (options.tools && options.response_model) {
          throw new StagehandError(
            "Cannot use both tool and response_model for o1 models"
          );
        }
        if (options.tools) {
          let { tools } = options;
          _b = options, { tools } = _b, options = __objRest(_b, ["tools"]);
          isToolsOverridedForO1 = true;
          options.messages.push({
            role: "user",
            content: `You have the following tools available to you:
${JSON.stringify(
              tools
            )}

          Respond with the following zod schema format to use a method: {
            "name": "<tool_name>",
            "arguments": <tool_args>
          }
          
          Do not include any other text or formattings like \`\`\` in your response. Just the JSON object.`
          });
        }
      }
      if (options.temperature && (this.modelName.startsWith("o1") || this.modelName.startsWith("o3"))) {
        throw new StagehandError("Temperature is not supported for o1 models");
      }
      const _c = options, { image, requestId } = _c, optionsWithoutImageAndRequestId = __objRest(_c, ["image", "requestId"]);
      logger({
        category: "openai",
        message: "creating chat completion",
        level: 2,
        auxiliary: {
          options: {
            value: JSON.stringify(__spreadProps(__spreadValues({}, optionsWithoutImageAndRequestId), {
              requestId
            })),
            type: "object"
          },
          modelName: {
            value: this.modelName,
            type: "string"
          }
        }
      });
      const cacheOptions = {
        model: this.modelName,
        messages: options.messages,
        temperature: options.temperature,
        top_p: options.top_p,
        frequency_penalty: options.frequency_penalty,
        presence_penalty: options.presence_penalty,
        image,
        response_model: options.response_model
      };
      if (this.enableCaching) {
        const cachedResponse = yield this.cache.get(
          cacheOptions,
          options.requestId
        );
        if (cachedResponse) {
          logger({
            category: "llm_cache",
            message: "LLM cache hit - returning cached response",
            level: 1,
            auxiliary: {
              requestId: {
                value: options.requestId,
                type: "string"
              },
              cachedResponse: {
                value: JSON.stringify(cachedResponse),
                type: "object"
              }
            }
          });
          return cachedResponse;
        } else {
          logger({
            category: "llm_cache",
            message: "LLM cache miss - no cached response found",
            level: 1,
            auxiliary: {
              requestId: {
                value: options.requestId,
                type: "string"
              }
            }
          });
        }
      }
      if (options.image) {
        const screenshotMessage = {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${options.image.buffer.toString("base64")}`
              }
            },
            ...options.image.description ? [{ type: "text", text: options.image.description }] : []
          ]
        };
        options.messages.push(screenshotMessage);
      }
      let responseFormat = void 0;
      if (options.response_model) {
        if (this.modelName.startsWith("o1") || this.modelName.startsWith("o3")) {
          try {
            const parsedSchema = JSON.stringify(
              (0, import_zod_to_json_schema6.default)(options.response_model.schema)
            );
            options.messages.push({
              role: "user",
              content: `Respond in this zod schema format:
${parsedSchema}


          Do not include any other text, formatting or markdown in your output. Do not include \`\`\` or \`\`\`json in your response. Only the JSON object itself.`
            });
          } catch (error) {
            logger({
              category: "openai",
              message: "Failed to parse response model schema",
              level: 0
            });
            if (retries > 0) {
              return this.createChatCompletion({
                options,
                logger,
                retries: retries - 1
              });
            }
            throw error;
          }
        } else {
          responseFormat = (0, import_zod.zodResponseFormat)(
            options.response_model.schema,
            options.response_model.name
          );
        }
      }
      const _d = __spreadProps(__spreadValues({}, optionsWithoutImageAndRequestId), {
        model: this.modelName
      }), { response_model } = _d, openAiOptions = __objRest(_d, ["response_model"]);
      logger({
        category: "openai",
        message: "creating chat completion",
        level: 2,
        auxiliary: {
          openAiOptions: {
            value: JSON.stringify(openAiOptions),
            type: "object"
          }
        }
      });
      const formattedMessages = options.messages.map((message) => {
        if (Array.isArray(message.content)) {
          const contentParts = message.content.map((content) => {
            if ("image_url" in content) {
              const imageContent = {
                image_url: {
                  url: content.image_url.url
                },
                type: "image_url"
              };
              return imageContent;
            } else {
              const textContent = {
                text: content.text,
                type: "text"
              };
              return textContent;
            }
          });
          if (message.role === "system") {
            const formattedMessage2 = __spreadProps(__spreadValues({}, message), {
              role: "system",
              content: contentParts.filter(
                (content) => content.type === "text"
              )
            });
            return formattedMessage2;
          } else if (message.role === "user") {
            const formattedMessage2 = __spreadProps(__spreadValues({}, message), {
              role: "user",
              content: contentParts
            });
            return formattedMessage2;
          } else {
            const formattedMessage2 = __spreadProps(__spreadValues({}, message), {
              role: "assistant",
              content: contentParts.filter(
                (content) => content.type === "text"
              )
            });
            return formattedMessage2;
          }
        }
        const formattedMessage = {
          role: "user",
          content: message.content
        };
        return formattedMessage;
      });
      const body = __spreadProps(__spreadValues({}, openAiOptions), {
        model: this.modelName,
        messages: formattedMessages,
        response_format: responseFormat,
        stream: false,
        tools: (_e = options.tools) == null ? void 0 : _e.map((tool) => ({
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters
          },
          type: "function"
        }))
      });
      const response = yield this.client.chat.completions.create(body);
      if (isToolsOverridedForO1) {
        try {
          const parsedContent = JSON.parse(response.choices[0].message.content);
          response.choices[0].message.tool_calls = [
            {
              function: {
                name: parsedContent["name"],
                arguments: JSON.stringify(parsedContent["arguments"])
              },
              type: "function",
              id: "-1"
            }
          ];
          response.choices[0].message.content = null;
        } catch (error) {
          logger({
            category: "openai",
            message: "Failed to parse tool call response",
            level: 0,
            auxiliary: {
              error: {
                value: error.message,
                type: "string"
              },
              content: {
                value: response.choices[0].message.content,
                type: "string"
              }
            }
          });
          if (retries > 0) {
            return this.createChatCompletion({
              options,
              logger,
              retries: retries - 1
            });
          }
          throw error;
        }
      }
      logger({
        category: "openai",
        message: "response",
        level: 2,
        auxiliary: {
          response: {
            value: JSON.stringify(response),
            type: "object"
          },
          requestId: {
            value: requestId,
            type: "string"
          }
        }
      });
      if (options.response_model) {
        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData);
        try {
          validateZodSchema(options.response_model.schema, parsedData);
        } catch (e) {
          logger({
            category: "openai",
            message: "Response failed Zod schema validation",
            level: 0
          });
          if (retries > 0) {
            return this.createChatCompletion({
              options,
              logger,
              retries: retries - 1
            });
          }
          if (e instanceof ZodSchemaValidationError) {
            logger({
              category: "openai",
              message: `Error during OpenAI chat completion: ${e.message}`,
              level: 0,
              auxiliary: {
                errorDetails: {
                  value: `Message: ${e.message}${e.stack ? "\nStack: " + e.stack : ""}`,
                  type: "string"
                },
                requestId: { value: requestId, type: "string" }
              }
            });
            throw new CreateChatCompletionResponseError(e.message);
          }
          throw e;
        }
        if (this.enableCaching) {
          this.cache.set(
            cacheOptions,
            __spreadValues({}, parsedData),
            options.requestId
          );
        }
        return {
          data: parsedData,
          usage: response.usage
        };
      }
      if (this.enableCaching) {
        logger({
          category: "llm_cache",
          message: "caching response",
          level: 1,
          auxiliary: {
            requestId: {
              value: options.requestId,
              type: "string"
            },
            cacheOptions: {
              value: JSON.stringify(cacheOptions),
              type: "object"
            },
            response: {
              value: JSON.stringify(response),
              type: "object"
            }
          }
        });
        this.cache.set(cacheOptions, response, options.requestId);
      }
      return response;
    });
  }
};

// node_modules/.pnpm/@ai-sdk+provider@1.1.3/node_modules/@ai-sdk/provider/dist/index.mjs
var marker = "vercel.ai.error";
var symbol = Symbol.for(marker);
var _a;
var _AISDKError = class _AISDKError2 extends Error {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name14,
    message,
    cause
  }) {
    super(message);
    this[_a] = true;
    this.name = name14;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError2.hasMarker(error, marker);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
_a = symbol;
var AISDKError = _AISDKError;
var name = "AI_APICallError";
var marker2 = `vercel.ai.error.${name}`;
var symbol2 = Symbol.for(marker2);
var _a2;
var APICallError = class extends AISDKError {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name, message, cause });
    this[_a2] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker2);
  }
};
_a2 = symbol2;
var name2 = "AI_EmptyResponseBodyError";
var marker3 = `vercel.ai.error.${name2}`;
var symbol3 = Symbol.for(marker3);
var _a3;
var EmptyResponseBodyError = class extends AISDKError {
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2, message });
    this[_a3] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker3);
  }
};
_a3 = symbol3;
function getErrorMessage(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}
var name3 = "AI_InvalidArgumentError";
var marker4 = `vercel.ai.error.${name3}`;
var symbol4 = Symbol.for(marker4);
var _a4;
var InvalidArgumentError = class extends AISDKError {
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3, message, cause });
    this[_a4] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker4);
  }
};
_a4 = symbol4;
var name4 = "AI_InvalidPromptError";
var marker5 = `vercel.ai.error.${name4}`;
var symbol5 = Symbol.for(marker5);
var _a5;
var InvalidPromptError = class extends AISDKError {
  constructor({
    prompt,
    message,
    cause
  }) {
    super({ name: name4, message: `Invalid prompt: ${message}`, cause });
    this[_a5] = true;
    this.prompt = prompt;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker5);
  }
};
_a5 = symbol5;
var name5 = "AI_InvalidResponseDataError";
var marker6 = `vercel.ai.error.${name5}`;
var symbol6 = Symbol.for(marker6);
var _a6;
var InvalidResponseDataError = class extends AISDKError {
  constructor({
    data,
    message = `Invalid response data: ${JSON.stringify(data)}.`
  }) {
    super({ name: name5, message });
    this[_a6] = true;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker6);
  }
};
_a6 = symbol6;
var name6 = "AI_JSONParseError";
var marker7 = `vercel.ai.error.${name6}`;
var symbol7 = Symbol.for(marker7);
var _a7;
var JSONParseError = class extends AISDKError {
  constructor({ text, cause }) {
    super({
      name: name6,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a7] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker7);
  }
};
_a7 = symbol7;
var name7 = "AI_LoadAPIKeyError";
var marker8 = `vercel.ai.error.${name7}`;
var symbol8 = Symbol.for(marker8);
var _a8;
var LoadAPIKeyError = class extends AISDKError {
  // used in isInstance
  constructor({ message }) {
    super({ name: name7, message });
    this[_a8] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker8);
  }
};
_a8 = symbol8;
var name8 = "AI_LoadSettingError";
var marker9 = `vercel.ai.error.${name8}`;
var symbol9 = Symbol.for(marker9);
var _a9;
var LoadSettingError = class extends AISDKError {
  // used in isInstance
  constructor({ message }) {
    super({ name: name8, message });
    this[_a9] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker9);
  }
};
_a9 = symbol9;
var name9 = "AI_NoContentGeneratedError";
var marker10 = `vercel.ai.error.${name9}`;
var symbol10 = Symbol.for(marker10);
var _a10;
_a10 = symbol10;
var name10 = "AI_NoSuchModelError";
var marker11 = `vercel.ai.error.${name10}`;
var symbol11 = Symbol.for(marker11);
var _a11;
var NoSuchModelError = class extends AISDKError {
  constructor({
    errorName = name10,
    modelId,
    modelType,
    message = `No such ${modelType}: ${modelId}`
  }) {
    super({ name: errorName, message });
    this[_a11] = true;
    this.modelId = modelId;
    this.modelType = modelType;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker11);
  }
};
_a11 = symbol11;
var name11 = "AI_TooManyEmbeddingValuesForCallError";
var marker12 = `vercel.ai.error.${name11}`;
var symbol12 = Symbol.for(marker12);
var _a12;
var TooManyEmbeddingValuesForCallError = class extends AISDKError {
  constructor(options) {
    super({
      name: name11,
      message: `Too many values for a single embedding call. The ${options.provider} model "${options.modelId}" can only embed up to ${options.maxEmbeddingsPerCall} values per call, but ${options.values.length} values were provided.`
    });
    this[_a12] = true;
    this.provider = options.provider;
    this.modelId = options.modelId;
    this.maxEmbeddingsPerCall = options.maxEmbeddingsPerCall;
    this.values = options.values;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker12);
  }
};
_a12 = symbol12;
var name12 = "AI_TypeValidationError";
var marker13 = `vercel.ai.error.${name12}`;
var symbol13 = Symbol.for(marker13);
var _a13;
var _TypeValidationError = class _TypeValidationError2 extends AISDKError {
  constructor({ value, cause }) {
    super({
      name: name12,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a13] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker13);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause
  }) {
    return _TypeValidationError2.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError2({ value, cause });
  }
};
_a13 = symbol13;
var TypeValidationError = _TypeValidationError;
var name13 = "AI_UnsupportedFunctionalityError";
var marker14 = `vercel.ai.error.${name13}`;
var symbol14 = Symbol.for(marker14);
var _a14;
var UnsupportedFunctionalityError = class extends AISDKError {
  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`
  }) {
    super({ name: name13, message });
    this[_a14] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker14);
  }
};
_a14 = symbol14;

// node_modules/.pnpm/nanoid@3.3.11/node_modules/nanoid/non-secure/index.js
var customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = "";
    let i = size | 0;
    while (i--) {
      id += alphabet[Math.random() * alphabet.length | 0];
    }
    return id;
  };
};

// node_modules/.pnpm/@ai-sdk+provider-utils@2.2.7_zod@3.25.67/node_modules/@ai-sdk/provider-utils/dist/index.mjs
var import_secure_json_parse = __toESM(require_secure_json_parse(), 1);
function combineHeaders(...headers) {
  return headers.reduce(
    (combinedHeaders, currentHeaders) => __spreadValues(__spreadValues({}, combinedHeaders), currentHeaders != null ? currentHeaders : {}),
    {}
  );
}
function createEventSourceParserStream() {
  let buffer = "";
  let event = void 0;
  let data = [];
  let lastEventId = void 0;
  let retry = void 0;
  function parseLine(line, controller) {
    if (line === "") {
      dispatchEvent(controller);
      return;
    }
    if (line.startsWith(":")) {
      return;
    }
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) {
      handleField(line, "");
      return;
    }
    const field = line.slice(0, colonIndex);
    const valueStart = colonIndex + 1;
    const value = valueStart < line.length && line[valueStart] === " " ? line.slice(valueStart + 1) : line.slice(valueStart);
    handleField(field, value);
  }
  function dispatchEvent(controller) {
    if (data.length > 0) {
      controller.enqueue({
        event,
        data: data.join("\n"),
        id: lastEventId,
        retry
      });
      data = [];
      event = void 0;
      retry = void 0;
    }
  }
  function handleField(field, value) {
    switch (field) {
      case "event":
        event = value;
        break;
      case "data":
        data.push(value);
        break;
      case "id":
        lastEventId = value;
        break;
      case "retry":
        const parsedRetry = parseInt(value, 10);
        if (!isNaN(parsedRetry)) {
          retry = parsedRetry;
        }
        break;
    }
  }
  return new TransformStream({
    transform(chunk, controller) {
      const { lines, incompleteLine } = splitLines(buffer, chunk);
      buffer = incompleteLine;
      for (let i = 0; i < lines.length; i++) {
        parseLine(lines[i], controller);
      }
    },
    flush(controller) {
      parseLine(buffer, controller);
      dispatchEvent(controller);
    }
  });
}
function splitLines(buffer, chunk) {
  const lines = [];
  let currentLine = buffer;
  for (let i = 0; i < chunk.length; ) {
    const char = chunk[i++];
    if (char === "\n") {
      lines.push(currentLine);
      currentLine = "";
    } else if (char === "\r") {
      lines.push(currentLine);
      currentLine = "";
      if (chunk[i + 1] === "\n") {
        i++;
      }
    } else {
      currentLine += char;
    }
  }
  return { lines, incompleteLine: currentLine };
}
function extractResponseHeaders(response) {
  const headers = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
}
var createIdGenerator = ({
  prefix,
  size: defaultSize = 16,
  alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator = "-"
} = {}) => {
  const generator = customAlphabet(alphabet, defaultSize);
  if (prefix == null) {
    return generator;
  }
  if (alphabet.includes(separator)) {
    throw new InvalidArgumentError({
      argument: "separator",
      message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
    });
  }
  return (size) => `${prefix}${separator}${generator(size)}`;
};
var generateId = createIdGenerator();
function removeUndefinedEntries(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([_key, value]) => value != null)
  );
}
function isAbortError(error) {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}
function loadApiKey({
  apiKey,
  environmentVariableName,
  apiKeyParameterName = "apiKey",
  description
}) {
  if (typeof apiKey === "string") {
    return apiKey;
  }
  if (apiKey != null) {
    throw new LoadAPIKeyError({
      message: `${description} API key must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter. Environment variables is not supported in this environment.`
    });
  }
  apiKey = process.env[environmentVariableName];
  if (apiKey == null) {
    throw new LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof apiKey !== "string") {
    throw new LoadAPIKeyError({
      message: `${description} API key must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return apiKey;
}
function loadSetting({
  settingValue,
  environmentVariableName,
  settingName,
  description
}) {
  if (typeof settingValue === "string") {
    return settingValue;
  }
  if (settingValue != null) {
    throw new LoadSettingError({
      message: `${description} setting must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new LoadSettingError({
      message: `${description} setting is missing. Pass it using the '${settingName}' parameter. Environment variables is not supported in this environment.`
    });
  }
  settingValue = process.env[environmentVariableName];
  if (settingValue == null) {
    throw new LoadSettingError({
      message: `${description} setting is missing. Pass it using the '${settingName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof settingValue !== "string") {
    throw new LoadSettingError({
      message: `${description} setting must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return settingValue;
}
var validatorSymbol = Symbol.for("vercel.ai.validator");
function validator(validate) {
  return { [validatorSymbol]: true, validate };
}
function isValidator(value) {
  return typeof value === "object" && value !== null && validatorSymbol in value && value[validatorSymbol] === true && "validate" in value;
}
function asValidator(value) {
  return isValidator(value) ? value : zodValidator(value);
}
function zodValidator(zodSchema) {
  return validator((value) => {
    const result = zodSchema.safeParse(value);
    return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
  });
}
function validateTypes({
  value,
  schema: inputSchema
}) {
  const result = safeValidateTypes({ value, schema: inputSchema });
  if (!result.success) {
    throw TypeValidationError.wrap({ value, cause: result.error });
  }
  return result.value;
}
function safeValidateTypes({
  value,
  schema
}) {
  const validator2 = asValidator(schema);
  try {
    if (validator2.validate == null) {
      return { success: true, value };
    }
    const result = validator2.validate(value);
    if (result.success) {
      return result;
    }
    return {
      success: false,
      error: TypeValidationError.wrap({ value, cause: result.error })
    };
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError.wrap({ value, cause: error })
    };
  }
}
function parseJSON({
  text,
  schema
}) {
  try {
    const value = import_secure_json_parse.default.parse(text);
    if (schema == null) {
      return value;
    }
    return validateTypes({ value, schema });
  } catch (error) {
    if (JSONParseError.isInstance(error) || TypeValidationError.isInstance(error)) {
      throw error;
    }
    throw new JSONParseError({ text, cause: error });
  }
}
function safeParseJSON({
  text,
  schema
}) {
  try {
    const value = import_secure_json_parse.default.parse(text);
    if (schema == null) {
      return { success: true, value, rawValue: value };
    }
    const validationResult = safeValidateTypes({ value, schema });
    return validationResult.success ? __spreadProps(__spreadValues({}, validationResult), { rawValue: value }) : validationResult;
  } catch (error) {
    return {
      success: false,
      error: JSONParseError.isInstance(error) ? error : new JSONParseError({ text, cause: error })
    };
  }
}
function isParsableJson(input) {
  try {
    import_secure_json_parse.default.parse(input);
    return true;
  } catch (e) {
    return false;
  }
}
function parseProviderOptions({
  provider,
  providerOptions,
  schema
}) {
  if ((providerOptions == null ? void 0 : providerOptions[provider]) == null) {
    return void 0;
  }
  const parsedProviderOptions = safeValidateTypes({
    value: providerOptions[provider],
    schema
  });
  if (!parsedProviderOptions.success) {
    throw new InvalidArgumentError({
      argument: "providerOptions",
      message: `invalid ${provider} provider options`,
      cause: parsedProviderOptions.error
    });
  }
  return parsedProviderOptions.value;
}
var getOriginalFetch2 = () => globalThis.fetch;
var postJsonToApi = (_0) => __async(null, [_0], function* ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch: fetch2
}) {
  return postToApi({
    url,
    headers: __spreadValues({
      "Content-Type": "application/json"
    }, headers),
    body: {
      content: JSON.stringify(body),
      values: body
    },
    failedResponseHandler,
    successfulResponseHandler,
    abortSignal,
    fetch: fetch2
  });
});
var postFormDataToApi = (_0) => __async(null, [_0], function* ({
  url,
  headers,
  formData,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch: fetch2
}) {
  return postToApi({
    url,
    headers,
    body: {
      content: formData,
      values: Object.fromEntries(formData.entries())
    },
    failedResponseHandler,
    successfulResponseHandler,
    abortSignal,
    fetch: fetch2
  });
});
var postToApi = (_0) => __async(null, [_0], function* ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch: fetch2 = getOriginalFetch2()
}) {
  try {
    const response = yield fetch2(url, {
      method: "POST",
      headers: removeUndefinedEntries(headers),
      body: body.content,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = yield failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
        throw new APICallError({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
      throw errorInformation.value;
    }
    try {
      return yield successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    if (error instanceof TypeError && error.message === "fetch failed") {
      const cause = error.cause;
      if (cause != null) {
        throw new APICallError({
          message: `Cannot connect to API: ${cause.message}`,
          cause,
          url,
          requestBodyValues: body.values,
          isRetryable: true
          // retry when network error
        });
      }
    }
    throw error;
  }
});
function resolve(value) {
  return __async(this, null, function* () {
    if (typeof value === "function") {
      value = value();
    }
    return Promise.resolve(value);
  });
}
var createJsonErrorResponseHandler = ({
  errorSchema,
  errorToMessage: errorToMessage2,
  isRetryable
}) => (_0) => __async(null, [_0], function* ({ response, url, requestBodyValues }) {
  const responseBody = yield response.text();
  const responseHeaders = extractResponseHeaders(response);
  if (responseBody.trim() === "") {
    return {
      responseHeaders,
      value: new APICallError({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
  try {
    const parsedError = parseJSON({
      text: responseBody,
      schema: errorSchema
    });
    return {
      responseHeaders,
      value: new APICallError({
        message: errorToMessage2(parsedError),
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        data: parsedError,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
      })
    };
  } catch (parseError) {
    return {
      responseHeaders,
      value: new APICallError({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
});
var createEventSourceResponseHandler = (chunkSchema2) => (_0) => __async(null, [_0], function* ({ response }) {
  const responseHeaders = extractResponseHeaders(response);
  if (response.body == null) {
    throw new EmptyResponseBodyError({});
  }
  return {
    responseHeaders,
    value: response.body.pipeThrough(new TextDecoderStream()).pipeThrough(createEventSourceParserStream()).pipeThrough(
      new TransformStream({
        transform({ data }, controller) {
          if (data === "[DONE]") {
            return;
          }
          controller.enqueue(
            safeParseJSON({
              text: data,
              schema: chunkSchema2
            })
          );
        }
      })
    )
  };
});
var createJsonResponseHandler = (responseSchema2) => (_0) => __async(null, [_0], function* ({ response, url, requestBodyValues }) {
  const responseBody = yield response.text();
  const parsedResult = safeParseJSON({
    text: responseBody,
    schema: responseSchema2
  });
  const responseHeaders = extractResponseHeaders(response);
  if (!parsedResult.success) {
    throw new APICallError({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseHeaders,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    responseHeaders,
    value: parsedResult.value,
    rawValue: parsedResult.rawValue
  };
});
var createBinaryResponseHandler = () => (_0) => __async(null, [_0], function* ({ response, url, requestBodyValues }) {
  const responseHeaders = extractResponseHeaders(response);
  if (!response.body) {
    throw new APICallError({
      message: "Response body is empty",
      url,
      requestBodyValues,
      statusCode: response.status,
      responseHeaders,
      responseBody: void 0
    });
  }
  try {
    const buffer = yield response.arrayBuffer();
    return {
      responseHeaders,
      value: new Uint8Array(buffer)
    };
  } catch (error) {
    throw new APICallError({
      message: "Failed to read response as array buffer",
      url,
      requestBodyValues,
      statusCode: response.status,
      responseHeaders,
      responseBody: void 0,
      cause: error
    });
  }
});
var { btoa, atob } = globalThis;
function convertBase64ToUint8Array(base64String) {
  const base64Url = base64String.replace(/-/g, "+").replace(/_/g, "/");
  const latin1string = atob(base64Url);
  return Uint8Array.from(latin1string, (byte) => byte.codePointAt(0));
}
function convertUint8ArrayToBase64(array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return btoa(latin1string);
}
function withoutTrailingSlash(url) {
  return url == null ? void 0 : url.replace(/\/$/, "");
}

// node_modules/.pnpm/@ai-sdk+openai@1.3.21_zod@3.25.67/node_modules/@ai-sdk/openai/dist/index.mjs
var import_zod2 = require("zod");
var import_zod3 = require("zod");
var import_zod4 = require("zod");
var import_zod5 = require("zod");
var import_zod6 = require("zod");
var import_zod7 = require("zod");
var import_zod8 = require("zod");
var import_zod9 = require("zod");
var import_zod10 = require("zod");
function convertToOpenAIChatMessages({
  prompt,
  useLegacyFunctionCalling = false,
  systemMessageMode = "system"
}) {
  const messages = [];
  const warnings = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        switch (systemMessageMode) {
          case "system": {
            messages.push({ role: "system", content });
            break;
          }
          case "developer": {
            messages.push({ role: "developer", content });
            break;
          }
          case "remove": {
            warnings.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            const _exhaustiveCheck = systemMessageMode;
            throw new Error(
              `Unsupported system message mode: ${_exhaustiveCheck}`
            );
          }
        }
        break;
      }
      case "user": {
        if (content.length === 1 && content[0].type === "text") {
          messages.push({ role: "user", content: content[0].text });
          break;
        }
        messages.push({
          role: "user",
          content: content.map((part, index) => {
            var _a15, _b, _c, _d;
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text };
              }
              case "image": {
                return {
                  type: "image_url",
                  image_url: {
                    url: part.image instanceof URL ? part.image.toString() : `data:${(_a15 = part.mimeType) != null ? _a15 : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`,
                    // OpenAI specific extension: image detail
                    detail: (_c = (_b = part.providerMetadata) == null ? void 0 : _b.openai) == null ? void 0 : _c.imageDetail
                  }
                };
              }
              case "file": {
                if (part.data instanceof URL) {
                  throw new UnsupportedFunctionalityError({
                    functionality: "'File content parts with URL data' functionality not supported."
                  });
                }
                switch (part.mimeType) {
                  case "audio/wav": {
                    return {
                      type: "input_audio",
                      input_audio: { data: part.data, format: "wav" }
                    };
                  }
                  case "audio/mp3":
                  case "audio/mpeg": {
                    return {
                      type: "input_audio",
                      input_audio: { data: part.data, format: "mp3" }
                    };
                  }
                  case "application/pdf": {
                    return {
                      type: "file",
                      file: {
                        filename: (_d = part.filename) != null ? _d : `part-${index}.pdf`,
                        file_data: `data:application/pdf;base64,${part.data}`
                      }
                    };
                  }
                  default: {
                    throw new UnsupportedFunctionalityError({
                      functionality: `File content part type ${part.mimeType} in user messages`
                    });
                  }
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        let text = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                }
              });
              break;
            }
          }
        }
        if (useLegacyFunctionCalling) {
          if (toolCalls.length > 1) {
            throw new UnsupportedFunctionalityError({
              functionality: "useLegacyFunctionCalling with multiple tool calls in one message"
            });
          }
          messages.push({
            role: "assistant",
            content: text,
            function_call: toolCalls.length > 0 ? toolCalls[0].function : void 0
          });
        } else {
          messages.push({
            role: "assistant",
            content: text,
            tool_calls: toolCalls.length > 0 ? toolCalls : void 0
          });
        }
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          if (useLegacyFunctionCalling) {
            messages.push({
              role: "function",
              name: toolResponse.toolName,
              content: JSON.stringify(toolResponse.result)
            });
          } else {
            messages.push({
              role: "tool",
              tool_call_id: toolResponse.toolCallId,
              content: JSON.stringify(toolResponse.result)
            });
          }
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return { messages, warnings };
}
function mapOpenAIChatLogProbsOutput(logprobs) {
  var _a15, _b;
  return (_b = (_a15 = logprobs == null ? void 0 : logprobs.content) == null ? void 0 : _a15.map(({ token, logprob, top_logprobs }) => ({
    token,
    logprob,
    topLogprobs: top_logprobs ? top_logprobs.map(({ token: token2, logprob: logprob2 }) => ({
      token: token2,
      logprob: logprob2
    })) : []
  }))) != null ? _b : void 0;
}
function mapOpenAIFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var openaiErrorDataSchema = import_zod3.z.object({
  error: import_zod3.z.object({
    message: import_zod3.z.string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: import_zod3.z.string().nullish(),
    param: import_zod3.z.any().nullish(),
    code: import_zod3.z.union([import_zod3.z.string(), import_zod3.z.number()]).nullish()
  })
});
var openaiFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: openaiErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
function getResponseMetadata({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}
function prepareTools({
  mode,
  useLegacyFunctionCalling = false,
  structuredOutputs
}) {
  var _a15;
  const tools = ((_a15 = mode.tools) == null ? void 0 : _a15.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const toolChoice = mode.toolChoice;
  if (useLegacyFunctionCalling) {
    const openaiFunctions = [];
    for (const tool of tools) {
      if (tool.type === "provider-defined") {
        toolWarnings.push({ type: "unsupported-tool", tool });
      } else {
        openaiFunctions.push({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        });
      }
    }
    if (toolChoice == null) {
      return {
        functions: openaiFunctions,
        function_call: void 0,
        toolWarnings
      };
    }
    const type2 = toolChoice.type;
    switch (type2) {
      case "auto":
      case "none":
      case void 0:
        return {
          functions: openaiFunctions,
          function_call: void 0,
          toolWarnings
        };
      case "required":
        throw new UnsupportedFunctionalityError({
          functionality: "useLegacyFunctionCalling and toolChoice: required"
        });
      default:
        return {
          functions: openaiFunctions,
          function_call: { name: toolChoice.toolName },
          toolWarnings
        };
    }
  }
  const openaiTools2 = [];
  for (const tool of tools) {
    if (tool.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool });
    } else {
      openaiTools2.push({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
          strict: structuredOutputs ? true : void 0
        }
      });
    }
  }
  if (toolChoice == null) {
    return { tools: openaiTools2, tool_choice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiTools2, tool_choice: type, toolWarnings };
    case "tool":
      return {
        tools: openaiTools2,
        tool_choice: {
          type: "function",
          function: {
            name: toolChoice.toolName
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var OpenAIChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get supportsStructuredOutputs() {
    var _a15;
    return (_a15 = this.settings.structuredOutputs) != null ? _a15 : isReasoningModel(this.modelId);
  }
  get defaultObjectGenerationMode() {
    if (isAudioModel(this.modelId)) {
      return "tool";
    }
    return this.supportsStructuredOutputs ? "json" : "tool";
  }
  get provider() {
    return this.config.provider;
  }
  get supportsImageUrls() {
    return !this.settings.downloadImages;
  }
  getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    providerMetadata
  }) {
    var _a15, _b, _c, _d, _e, _f, _g, _h;
    const type = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if ((responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && !this.supportsStructuredOutputs) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is only supported with structuredOutputs"
      });
    }
    const useLegacyFunctionCalling = this.settings.useLegacyFunctionCalling;
    if (useLegacyFunctionCalling && this.settings.parallelToolCalls === true) {
      throw new UnsupportedFunctionalityError({
        functionality: "useLegacyFunctionCalling with parallelToolCalls"
      });
    }
    if (useLegacyFunctionCalling && this.supportsStructuredOutputs) {
      throw new UnsupportedFunctionalityError({
        functionality: "structuredOutputs with useLegacyFunctionCalling"
      });
    }
    const { messages, warnings: messageWarnings } = convertToOpenAIChatMessages(
      {
        prompt,
        useLegacyFunctionCalling,
        systemMessageMode: getSystemMessageMode(this.modelId)
      }
    );
    warnings.push(...messageWarnings);
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      logit_bias: this.settings.logitBias,
      logprobs: this.settings.logprobs === true || typeof this.settings.logprobs === "number" ? true : void 0,
      top_logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      user: this.settings.user,
      parallel_tool_calls: this.settings.parallelToolCalls,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? this.supportsStructuredOutputs && responseFormat.schema != null ? {
        type: "json_schema",
        json_schema: {
          schema: responseFormat.schema,
          strict: true,
          name: (_a15 = responseFormat.name) != null ? _a15 : "response",
          description: responseFormat.description
        }
      } : { type: "json_object" } : void 0,
      stop: stopSequences,
      seed,
      // openai specific settings:
      // TODO remove in next major version; we auto-map maxTokens now
      max_completion_tokens: (_b = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _b.maxCompletionTokens,
      store: (_c = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _c.store,
      metadata: (_d = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _d.metadata,
      prediction: (_e = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _e.prediction,
      reasoning_effort: (_g = (_f = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _f.reasoningEffort) != null ? _g : this.settings.reasoningEffort,
      // messages:
      messages
    };
    if (isReasoningModel(this.modelId)) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported for reasoning models"
        });
      }
      if (baseArgs.top_p != null) {
        baseArgs.top_p = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "topP",
          details: "topP is not supported for reasoning models"
        });
      }
      if (baseArgs.frequency_penalty != null) {
        baseArgs.frequency_penalty = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "frequencyPenalty",
          details: "frequencyPenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.presence_penalty != null) {
        baseArgs.presence_penalty = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "presencePenalty",
          details: "presencePenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.logit_bias != null) {
        baseArgs.logit_bias = void 0;
        warnings.push({
          type: "other",
          message: "logitBias is not supported for reasoning models"
        });
      }
      if (baseArgs.logprobs != null) {
        baseArgs.logprobs = void 0;
        warnings.push({
          type: "other",
          message: "logprobs is not supported for reasoning models"
        });
      }
      if (baseArgs.top_logprobs != null) {
        baseArgs.top_logprobs = void 0;
        warnings.push({
          type: "other",
          message: "topLogprobs is not supported for reasoning models"
        });
      }
      if (baseArgs.max_tokens != null) {
        if (baseArgs.max_completion_tokens == null) {
          baseArgs.max_completion_tokens = baseArgs.max_tokens;
        }
        baseArgs.max_tokens = void 0;
      }
    } else if (this.modelId.startsWith("gpt-4o-search-preview") || this.modelId.startsWith("gpt-4o-mini-search-preview")) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported for the search preview models and has been removed."
        });
      }
    }
    switch (type) {
      case "regular": {
        const { tools, tool_choice, functions, function_call, toolWarnings } = prepareTools({
          mode,
          useLegacyFunctionCalling,
          structuredOutputs: this.supportsStructuredOutputs
        });
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            tools,
            tool_choice,
            functions,
            function_call
          }),
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            response_format: this.supportsStructuredOutputs && mode.schema != null ? {
              type: "json_schema",
              json_schema: {
                schema: mode.schema,
                strict: true,
                name: (_h = mode.name) != null ? _h : "response",
                description: mode.description
              }
            } : { type: "json_object" }
          }),
          warnings
        };
      }
      case "object-tool": {
        return {
          args: useLegacyFunctionCalling ? __spreadProps(__spreadValues({}, baseArgs), {
            function_call: {
              name: mode.tool.name
            },
            functions: [
              {
                name: mode.tool.name,
                description: mode.tool.description,
                parameters: mode.tool.parameters
              }
            ]
          }) : __spreadProps(__spreadValues({}, baseArgs), {
            tool_choice: {
              type: "function",
              function: { name: mode.tool.name }
            },
            tools: [
              {
                type: "function",
                function: {
                  name: mode.tool.name,
                  description: mode.tool.description,
                  parameters: mode.tool.parameters,
                  strict: this.supportsStructuredOutputs ? true : void 0
                }
              }
            ]
          }),
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d, _e, _f, _g, _h;
      const { args: body, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiChatResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a16 = body, { messages: rawPrompt } = _a16, rawSettings = __objRest(_a16, ["messages"]);
      const choice = response.choices[0];
      const completionTokenDetails = (_a15 = response.usage) == null ? void 0 : _a15.completion_tokens_details;
      const promptTokenDetails = (_b = response.usage) == null ? void 0 : _b.prompt_tokens_details;
      const providerMetadata = { openai: {} };
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens) != null) {
        providerMetadata.openai.reasoningTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens;
      }
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens) != null) {
        providerMetadata.openai.acceptedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens;
      }
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens) != null) {
        providerMetadata.openai.rejectedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens;
      }
      if ((promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens) != null) {
        providerMetadata.openai.cachedPromptTokens = promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens;
      }
      return {
        text: (_c = choice.message.content) != null ? _c : void 0,
        toolCalls: this.settings.useLegacyFunctionCalling && choice.message.function_call ? [
          {
            toolCallType: "function",
            toolCallId: generateId(),
            toolName: choice.message.function_call.name,
            args: choice.message.function_call.arguments
          }
        ] : (_d = choice.message.tool_calls) == null ? void 0 : _d.map((toolCall) => {
          var _a22;
          return {
            toolCallType: "function",
            toolCallId: (_a22 = toolCall.id) != null ? _a22 : generateId(),
            toolName: toolCall.function.name,
            args: toolCall.function.arguments
          };
        }),
        finishReason: mapOpenAIFinishReason(choice.finish_reason),
        usage: {
          promptTokens: (_f = (_e = response.usage) == null ? void 0 : _e.prompt_tokens) != null ? _f : NaN,
          completionTokens: (_h = (_g = response.usage) == null ? void 0 : _g.completion_tokens) != null ? _h : NaN
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        request: { body: JSON.stringify(body) },
        response: getResponseMetadata(response),
        warnings,
        logprobs: mapOpenAIChatLogProbsOutput(choice.logprobs),
        providerMetadata
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      if (this.settings.simulateStreaming) {
        const result = yield this.doGenerate(options);
        const simulatedStream = new ReadableStream({
          start(controller) {
            controller.enqueue(__spreadValues({ type: "response-metadata" }, result.response));
            if (result.text) {
              controller.enqueue({
                type: "text-delta",
                textDelta: result.text
              });
            }
            if (result.toolCalls) {
              for (const toolCall of result.toolCalls) {
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  argsTextDelta: toolCall.args
                });
                controller.enqueue(__spreadValues({
                  type: "tool-call"
                }, toolCall));
              }
            }
            controller.enqueue({
              type: "finish",
              finishReason: result.finishReason,
              usage: result.usage,
              logprobs: result.logprobs,
              providerMetadata: result.providerMetadata
            });
            controller.close();
          }
        });
        return {
          stream: simulatedStream,
          rawCall: result.rawCall,
          rawResponse: result.rawResponse,
          warnings: result.warnings
        };
      }
      const { args, warnings } = this.getArgs(options);
      const body = __spreadProps(__spreadValues({}, args), {
        stream: true,
        // only include stream_options when in strict compatibility mode:
        stream_options: this.config.compatibility === "strict" ? { include_usage: true } : void 0
      });
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          openaiChatChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { messages: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["messages"]);
      const toolCalls = [];
      let finishReason = "unknown";
      let usage = {
        promptTokens: void 0,
        completionTokens: void 0
      };
      let logprobs;
      let isFirstChunk = true;
      const { useLegacyFunctionCalling } = this.settings;
      const providerMetadata = { openai: {} };
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a16, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if ("error" in value) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: value.error });
                return;
              }
              if (isFirstChunk) {
                isFirstChunk = false;
                controller.enqueue(__spreadValues({
                  type: "response-metadata"
                }, getResponseMetadata(value)));
              }
              if (value.usage != null) {
                const {
                  prompt_tokens,
                  completion_tokens,
                  prompt_tokens_details,
                  completion_tokens_details
                } = value.usage;
                usage = {
                  promptTokens: prompt_tokens != null ? prompt_tokens : void 0,
                  completionTokens: completion_tokens != null ? completion_tokens : void 0
                };
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens) != null) {
                  providerMetadata.openai.reasoningTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens;
                }
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens) != null) {
                  providerMetadata.openai.acceptedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens;
                }
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens) != null) {
                  providerMetadata.openai.rejectedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens;
                }
                if ((prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens) != null) {
                  providerMetadata.openai.cachedPromptTokens = prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens;
                }
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapOpenAIFinishReason(choice.finish_reason);
              }
              if ((choice == null ? void 0 : choice.delta) == null) {
                return;
              }
              const delta = choice.delta;
              if (delta.content != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: delta.content
                });
              }
              const mappedLogprobs = mapOpenAIChatLogProbsOutput(
                choice == null ? void 0 : choice.logprobs
              );
              if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
                if (logprobs === void 0) logprobs = [];
                logprobs.push(...mappedLogprobs);
              }
              const mappedToolCalls = useLegacyFunctionCalling && delta.function_call != null ? [
                {
                  type: "function",
                  id: generateId(),
                  function: delta.function_call,
                  index: 0
                }
              ] : delta.tool_calls;
              if (mappedToolCalls != null) {
                for (const toolCallDelta of mappedToolCalls) {
                  const index = toolCallDelta.index;
                  if (toolCalls[index] == null) {
                    if (toolCallDelta.type !== "function") {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function' type.`
                      });
                    }
                    if (toolCallDelta.id == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'id' to be a string.`
                      });
                    }
                    if (((_a16 = toolCallDelta.function) == null ? void 0 : _a16.name) == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function.name' to be a string.`
                      });
                    }
                    toolCalls[index] = {
                      id: toolCallDelta.id,
                      type: "function",
                      function: {
                        name: toolCallDelta.function.name,
                        arguments: (_b = toolCallDelta.function.arguments) != null ? _b : ""
                      },
                      hasFinished: false
                    };
                    const toolCall2 = toolCalls[index];
                    if (((_c = toolCall2.function) == null ? void 0 : _c.name) != null && ((_d = toolCall2.function) == null ? void 0 : _d.arguments) != null) {
                      if (toolCall2.function.arguments.length > 0) {
                        controller.enqueue({
                          type: "tool-call-delta",
                          toolCallType: "function",
                          toolCallId: toolCall2.id,
                          toolName: toolCall2.function.name,
                          argsTextDelta: toolCall2.function.arguments
                        });
                      }
                      if (isParsableJson(toolCall2.function.arguments)) {
                        controller.enqueue({
                          type: "tool-call",
                          toolCallType: "function",
                          toolCallId: (_e = toolCall2.id) != null ? _e : generateId(),
                          toolName: toolCall2.function.name,
                          args: toolCall2.function.arguments
                        });
                        toolCall2.hasFinished = true;
                      }
                    }
                    continue;
                  }
                  const toolCall = toolCalls[index];
                  if (toolCall.hasFinished) {
                    continue;
                  }
                  if (((_f = toolCallDelta.function) == null ? void 0 : _f.arguments) != null) {
                    toolCall.function.arguments += (_h = (_g = toolCallDelta.function) == null ? void 0 : _g.arguments) != null ? _h : "";
                  }
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    argsTextDelta: (_i = toolCallDelta.function.arguments) != null ? _i : ""
                  });
                  if (((_j = toolCall.function) == null ? void 0 : _j.name) != null && ((_k = toolCall.function) == null ? void 0 : _k.arguments) != null && isParsableJson(toolCall.function.arguments)) {
                    controller.enqueue({
                      type: "tool-call",
                      toolCallType: "function",
                      toolCallId: (_l = toolCall.id) != null ? _l : generateId(),
                      toolName: toolCall.function.name,
                      args: toolCall.function.arguments
                    });
                    toolCall.hasFinished = true;
                  }
                }
              }
            },
            flush(controller) {
              var _a16, _b;
              controller.enqueue(__spreadValues({
                type: "finish",
                finishReason,
                logprobs,
                usage: {
                  promptTokens: (_a16 = usage.promptTokens) != null ? _a16 : NaN,
                  completionTokens: (_b = usage.completionTokens) != null ? _b : NaN
                }
              }, providerMetadata != null ? { providerMetadata } : {}));
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        warnings
      };
    });
  }
};
var openaiTokenUsageSchema = import_zod2.z.object({
  prompt_tokens: import_zod2.z.number().nullish(),
  completion_tokens: import_zod2.z.number().nullish(),
  prompt_tokens_details: import_zod2.z.object({
    cached_tokens: import_zod2.z.number().nullish()
  }).nullish(),
  completion_tokens_details: import_zod2.z.object({
    reasoning_tokens: import_zod2.z.number().nullish(),
    accepted_prediction_tokens: import_zod2.z.number().nullish(),
    rejected_prediction_tokens: import_zod2.z.number().nullish()
  }).nullish()
}).nullish();
var openaiChatResponseSchema = import_zod2.z.object({
  id: import_zod2.z.string().nullish(),
  created: import_zod2.z.number().nullish(),
  model: import_zod2.z.string().nullish(),
  choices: import_zod2.z.array(
    import_zod2.z.object({
      message: import_zod2.z.object({
        role: import_zod2.z.literal("assistant").nullish(),
        content: import_zod2.z.string().nullish(),
        function_call: import_zod2.z.object({
          arguments: import_zod2.z.string(),
          name: import_zod2.z.string()
        }).nullish(),
        tool_calls: import_zod2.z.array(
          import_zod2.z.object({
            id: import_zod2.z.string().nullish(),
            type: import_zod2.z.literal("function"),
            function: import_zod2.z.object({
              name: import_zod2.z.string(),
              arguments: import_zod2.z.string()
            })
          })
        ).nullish()
      }),
      index: import_zod2.z.number(),
      logprobs: import_zod2.z.object({
        content: import_zod2.z.array(
          import_zod2.z.object({
            token: import_zod2.z.string(),
            logprob: import_zod2.z.number(),
            top_logprobs: import_zod2.z.array(
              import_zod2.z.object({
                token: import_zod2.z.string(),
                logprob: import_zod2.z.number()
              })
            )
          })
        ).nullable()
      }).nullish(),
      finish_reason: import_zod2.z.string().nullish()
    })
  ),
  usage: openaiTokenUsageSchema
});
var openaiChatChunkSchema = import_zod2.z.union([
  import_zod2.z.object({
    id: import_zod2.z.string().nullish(),
    created: import_zod2.z.number().nullish(),
    model: import_zod2.z.string().nullish(),
    choices: import_zod2.z.array(
      import_zod2.z.object({
        delta: import_zod2.z.object({
          role: import_zod2.z.enum(["assistant"]).nullish(),
          content: import_zod2.z.string().nullish(),
          function_call: import_zod2.z.object({
            name: import_zod2.z.string().optional(),
            arguments: import_zod2.z.string().optional()
          }).nullish(),
          tool_calls: import_zod2.z.array(
            import_zod2.z.object({
              index: import_zod2.z.number(),
              id: import_zod2.z.string().nullish(),
              type: import_zod2.z.literal("function").nullish(),
              function: import_zod2.z.object({
                name: import_zod2.z.string().nullish(),
                arguments: import_zod2.z.string().nullish()
              })
            })
          ).nullish()
        }).nullish(),
        logprobs: import_zod2.z.object({
          content: import_zod2.z.array(
            import_zod2.z.object({
              token: import_zod2.z.string(),
              logprob: import_zod2.z.number(),
              top_logprobs: import_zod2.z.array(
                import_zod2.z.object({
                  token: import_zod2.z.string(),
                  logprob: import_zod2.z.number()
                })
              )
            })
          ).nullable()
        }).nullish(),
        finish_reason: import_zod2.z.string().nullish(),
        index: import_zod2.z.number()
      })
    ),
    usage: openaiTokenUsageSchema
  }),
  openaiErrorDataSchema
]);
function isReasoningModel(modelId) {
  return modelId.startsWith("o");
}
function isAudioModel(modelId) {
  return modelId.startsWith("gpt-4o-audio-preview");
}
function getSystemMessageMode(modelId) {
  var _a15, _b;
  if (!isReasoningModel(modelId)) {
    return "system";
  }
  return (_b = (_a15 = reasoningModels[modelId]) == null ? void 0 : _a15.systemMessageMode) != null ? _b : "developer";
}
var reasoningModels = {
  "o1-mini": {
    systemMessageMode: "remove"
  },
  "o1-mini-2024-09-12": {
    systemMessageMode: "remove"
  },
  "o1-preview": {
    systemMessageMode: "remove"
  },
  "o1-preview-2024-09-12": {
    systemMessageMode: "remove"
  },
  o3: {
    systemMessageMode: "developer"
  },
  "o3-2025-04-16": {
    systemMessageMode: "developer"
  },
  "o3-mini": {
    systemMessageMode: "developer"
  },
  "o3-mini-2025-01-31": {
    systemMessageMode: "developer"
  },
  "o4-mini": {
    systemMessageMode: "developer"
  },
  "o4-mini-2025-04-16": {
    systemMessageMode: "developer"
  }
};
function convertToOpenAICompletionPrompt({
  prompt,
  inputFormat,
  user = "user",
  assistant = "assistant"
}) {
  if (inputFormat === "prompt" && prompt.length === 1 && prompt[0].role === "user" && prompt[0].content.length === 1 && prompt[0].content[0].type === "text") {
    return { prompt: prompt[0].content[0].text };
  }
  let text = "";
  if (prompt[0].role === "system") {
    text += `${prompt[0].content}

`;
    prompt = prompt.slice(1);
  }
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        throw new InvalidPromptError({
          message: "Unexpected system message in prompt: ${content}",
          prompt
        });
      }
      case "user": {
        const userMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "image": {
              throw new UnsupportedFunctionalityError({
                functionality: "images"
              });
            }
          }
        }).join("");
        text += `${user}:
${userMessage}

`;
        break;
      }
      case "assistant": {
        const assistantMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "tool-call": {
              throw new UnsupportedFunctionalityError({
                functionality: "tool-call messages"
              });
            }
          }
        }).join("");
        text += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case "tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "tool messages"
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  text += `${assistant}:
`;
  return {
    prompt: text,
    stopSequences: [`
${user}:`]
  };
}
function mapOpenAICompletionLogProbs(logprobs) {
  return logprobs == null ? void 0 : logprobs.tokens.map((token, index) => ({
    token,
    logprob: logprobs.token_logprobs[index],
    topLogprobs: logprobs.top_logprobs ? Object.entries(logprobs.top_logprobs[index]).map(
      ([token2, logprob]) => ({
        token: token2,
        logprob
      })
    ) : []
  }));
}
var OpenAICompletionLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = void 0;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    mode,
    inputFormat,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences: userStopSequences,
    responseFormat,
    seed
  }) {
    var _a15;
    const type = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const { prompt: completionPrompt, stopSequences } = convertToOpenAICompletionPrompt({ prompt, inputFormat });
    const stop = [...stopSequences != null ? stopSequences : [], ...userStopSequences != null ? userStopSequences : []];
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      echo: this.settings.echo,
      logit_bias: this.settings.logitBias,
      logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      suffix: this.settings.suffix,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      seed,
      // prompt:
      prompt: completionPrompt,
      // stop sequences:
      stop: stop.length > 0 ? stop : void 0
    };
    switch (type) {
      case "regular": {
        if ((_a15 = mode.tools) == null ? void 0 : _a15.length) {
          throw new UnsupportedFunctionalityError({
            functionality: "tools"
          });
        }
        if (mode.toolChoice) {
          throw new UnsupportedFunctionalityError({
            functionality: "toolChoice"
          });
        }
        return { args: baseArgs, warnings };
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-tool mode"
        });
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      const { args, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: this.config.url({
          path: "/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: args,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiCompletionResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { prompt: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["prompt"]);
      const choice = response.choices[0];
      return {
        text: choice.text,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens
        },
        finishReason: mapOpenAIFinishReason(choice.finish_reason),
        logprobs: mapOpenAICompletionLogProbs(choice.logprobs),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        response: getResponseMetadata(response),
        warnings,
        request: { body: JSON.stringify(args) }
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      const { args, warnings } = this.getArgs(options);
      const body = __spreadProps(__spreadValues({}, args), {
        stream: true,
        // only include stream_options when in strict compatibility mode:
        stream_options: this.config.compatibility === "strict" ? { include_usage: true } : void 0
      });
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          openaiCompletionChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { prompt: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["prompt"]);
      let finishReason = "unknown";
      let usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      let logprobs;
      let isFirstChunk = true;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if ("error" in value) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: value.error });
                return;
              }
              if (isFirstChunk) {
                isFirstChunk = false;
                controller.enqueue(__spreadValues({
                  type: "response-metadata"
                }, getResponseMetadata(value)));
              }
              if (value.usage != null) {
                usage = {
                  promptTokens: value.usage.prompt_tokens,
                  completionTokens: value.usage.completion_tokens
                };
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapOpenAIFinishReason(choice.finish_reason);
              }
              if ((choice == null ? void 0 : choice.text) != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: choice.text
                });
              }
              const mappedLogprobs = mapOpenAICompletionLogProbs(
                choice == null ? void 0 : choice.logprobs
              );
              if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
                if (logprobs === void 0) logprobs = [];
                logprobs.push(...mappedLogprobs);
              }
            },
            flush(controller) {
              controller.enqueue({
                type: "finish",
                finishReason,
                logprobs,
                usage
              });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        warnings,
        request: { body: JSON.stringify(body) }
      };
    });
  }
};
var openaiCompletionResponseSchema = import_zod4.z.object({
  id: import_zod4.z.string().nullish(),
  created: import_zod4.z.number().nullish(),
  model: import_zod4.z.string().nullish(),
  choices: import_zod4.z.array(
    import_zod4.z.object({
      text: import_zod4.z.string(),
      finish_reason: import_zod4.z.string(),
      logprobs: import_zod4.z.object({
        tokens: import_zod4.z.array(import_zod4.z.string()),
        token_logprobs: import_zod4.z.array(import_zod4.z.number()),
        top_logprobs: import_zod4.z.array(import_zod4.z.record(import_zod4.z.string(), import_zod4.z.number())).nullable()
      }).nullish()
    })
  ),
  usage: import_zod4.z.object({
    prompt_tokens: import_zod4.z.number(),
    completion_tokens: import_zod4.z.number()
  })
});
var openaiCompletionChunkSchema = import_zod4.z.union([
  import_zod4.z.object({
    id: import_zod4.z.string().nullish(),
    created: import_zod4.z.number().nullish(),
    model: import_zod4.z.string().nullish(),
    choices: import_zod4.z.array(
      import_zod4.z.object({
        text: import_zod4.z.string(),
        finish_reason: import_zod4.z.string().nullish(),
        index: import_zod4.z.number(),
        logprobs: import_zod4.z.object({
          tokens: import_zod4.z.array(import_zod4.z.string()),
          token_logprobs: import_zod4.z.array(import_zod4.z.number()),
          top_logprobs: import_zod4.z.array(import_zod4.z.record(import_zod4.z.string(), import_zod4.z.number())).nullable()
        }).nullish()
      })
    ),
    usage: import_zod4.z.object({
      prompt_tokens: import_zod4.z.number(),
      completion_tokens: import_zod4.z.number()
    }).nullish()
  }),
  openaiErrorDataSchema
]);
var OpenAIEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    var _a15;
    return (_a15 = this.settings.maxEmbeddingsPerCall) != null ? _a15 : 2048;
  }
  get supportsParallelCalls() {
    var _a15;
    return (_a15 = this.settings.supportsParallelCalls) != null ? _a15 : true;
  }
  doEmbed(_0) {
    return __async(this, arguments, function* ({
      values,
      headers,
      abortSignal
    }) {
      if (values.length > this.maxEmbeddingsPerCall) {
        throw new TooManyEmbeddingValuesForCallError({
          provider: this.provider,
          modelId: this.modelId,
          maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
          values
        });
      }
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/embeddings",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), headers),
        body: {
          model: this.modelId,
          input: values,
          encoding_format: "float",
          dimensions: this.settings.dimensions,
          user: this.settings.user
        },
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiTextEmbeddingResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        embeddings: response.data.map((item) => item.embedding),
        usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
        rawResponse: { headers: responseHeaders }
      };
    });
  }
};
var openaiTextEmbeddingResponseSchema = import_zod5.z.object({
  data: import_zod5.z.array(import_zod5.z.object({ embedding: import_zod5.z.array(import_zod5.z.number()) })),
  usage: import_zod5.z.object({ prompt_tokens: import_zod5.z.number() }).nullish()
});
var modelMaxImagesPerCall = {
  "dall-e-3": 1,
  "dall-e-2": 10,
  "gpt-image-1": 10
};
var hasDefaultResponseFormat = /* @__PURE__ */ new Set(["gpt-image-1"]);
var OpenAIImageModel = class {
  constructor(modelId, settings, config) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    this.specificationVersion = "v1";
  }
  get maxImagesPerCall() {
    var _a15, _b;
    return (_b = (_a15 = this.settings.maxImagesPerCall) != null ? _a15 : modelMaxImagesPerCall[this.modelId]) != null ? _b : 1;
  }
  get provider() {
    return this.config.provider;
  }
  doGenerate(_0) {
    return __async(this, arguments, function* ({
      prompt,
      n,
      size,
      aspectRatio,
      seed,
      providerOptions,
      headers,
      abortSignal
    }) {
      var _a15, _b, _c, _d;
      const warnings = [];
      if (aspectRatio != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "aspectRatio",
          details: "This model does not support aspect ratio. Use `size` instead."
        });
      }
      if (seed != null) {
        warnings.push({ type: "unsupported-setting", setting: "seed" });
      }
      const currentDate = (_c = (_b = (_a15 = this.config._internal) == null ? void 0 : _a15.currentDate) == null ? void 0 : _b.call(_a15)) != null ? _c : /* @__PURE__ */ new Date();
      const { value: response, responseHeaders } = yield postJsonToApi({
        url: this.config.url({
          path: "/images/generations",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), headers),
        body: __spreadValues(__spreadValues({
          model: this.modelId,
          prompt,
          n,
          size
        }, (_d = providerOptions.openai) != null ? _d : {}), !hasDefaultResponseFormat.has(this.modelId) ? { response_format: "b64_json" } : {}),
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiImageResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        images: response.data.map((item) => item.b64_json),
        warnings,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders
        }
      };
    });
  }
};
var openaiImageResponseSchema = import_zod6.z.object({
  data: import_zod6.z.array(import_zod6.z.object({ b64_json: import_zod6.z.string() }))
});
var openAIProviderOptionsSchema = import_zod7.z.object({
  include: import_zod7.z.array(import_zod7.z.string()).nullish(),
  language: import_zod7.z.string().nullish(),
  prompt: import_zod7.z.string().nullish(),
  temperature: import_zod7.z.number().min(0).max(1).nullish().default(0),
  timestampGranularities: import_zod7.z.array(import_zod7.z.enum(["word", "segment"])).nullish().default(["segment"])
});
var languageMap = {
  afrikaans: "af",
  arabic: "ar",
  armenian: "hy",
  azerbaijani: "az",
  belarusian: "be",
  bosnian: "bs",
  bulgarian: "bg",
  catalan: "ca",
  chinese: "zh",
  croatian: "hr",
  czech: "cs",
  danish: "da",
  dutch: "nl",
  english: "en",
  estonian: "et",
  finnish: "fi",
  french: "fr",
  galician: "gl",
  german: "de",
  greek: "el",
  hebrew: "he",
  hindi: "hi",
  hungarian: "hu",
  icelandic: "is",
  indonesian: "id",
  italian: "it",
  japanese: "ja",
  kannada: "kn",
  kazakh: "kk",
  korean: "ko",
  latvian: "lv",
  lithuanian: "lt",
  macedonian: "mk",
  malay: "ms",
  marathi: "mr",
  maori: "mi",
  nepali: "ne",
  norwegian: "no",
  persian: "fa",
  polish: "pl",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  serbian: "sr",
  slovak: "sk",
  slovenian: "sl",
  spanish: "es",
  swahili: "sw",
  swedish: "sv",
  tagalog: "tl",
  tamil: "ta",
  thai: "th",
  turkish: "tr",
  ukrainian: "uk",
  urdu: "ur",
  vietnamese: "vi",
  welsh: "cy"
};
var OpenAITranscriptionModel = class {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v1";
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    audio,
    mediaType,
    providerOptions
  }) {
    var _a15, _b, _c, _d, _e;
    const warnings = [];
    const openAIOptions = parseProviderOptions({
      provider: "openai",
      providerOptions,
      schema: openAIProviderOptionsSchema
    });
    const formData = new FormData();
    const blob = audio instanceof Uint8Array ? new Blob([audio]) : new Blob([convertBase64ToUint8Array(audio)]);
    formData.append("model", this.modelId);
    formData.append("file", new File([blob], "audio", { type: mediaType }));
    if (openAIOptions) {
      const transcriptionModelOptions = {
        include: (_a15 = openAIOptions.include) != null ? _a15 : void 0,
        language: (_b = openAIOptions.language) != null ? _b : void 0,
        prompt: (_c = openAIOptions.prompt) != null ? _c : void 0,
        temperature: (_d = openAIOptions.temperature) != null ? _d : void 0,
        timestamp_granularities: (_e = openAIOptions.timestampGranularities) != null ? _e : void 0
      };
      for (const key in transcriptionModelOptions) {
        const value = transcriptionModelOptions[key];
        if (value !== void 0) {
          formData.append(key, String(value));
        }
      }
    }
    return {
      formData,
      warnings
    };
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d, _e, _f;
      const currentDate = (_c = (_b = (_a15 = this.config._internal) == null ? void 0 : _a15.currentDate) == null ? void 0 : _b.call(_a15)) != null ? _c : /* @__PURE__ */ new Date();
      const { formData, warnings } = this.getArgs(options);
      const {
        value: response,
        responseHeaders,
        rawValue: rawResponse
      } = yield postFormDataToApi({
        url: this.config.url({
          path: "/audio/transcriptions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        formData,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiTranscriptionResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const language = response.language != null && response.language in languageMap ? languageMap[response.language] : void 0;
      return {
        text: response.text,
        segments: (_e = (_d = response.words) == null ? void 0 : _d.map((word) => ({
          text: word.word,
          startSecond: word.start,
          endSecond: word.end
        }))) != null ? _e : [],
        language,
        durationInSeconds: (_f = response.duration) != null ? _f : void 0,
        warnings,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders,
          body: rawResponse
        }
      };
    });
  }
};
var openaiTranscriptionResponseSchema = import_zod7.z.object({
  text: import_zod7.z.string(),
  language: import_zod7.z.string().nullish(),
  duration: import_zod7.z.number().nullish(),
  words: import_zod7.z.array(
    import_zod7.z.object({
      word: import_zod7.z.string(),
      start: import_zod7.z.number(),
      end: import_zod7.z.number()
    })
  ).nullish()
});
function convertToOpenAIResponsesMessages({
  prompt,
  systemMessageMode
}) {
  const messages = [];
  const warnings = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        switch (systemMessageMode) {
          case "system": {
            messages.push({ role: "system", content });
            break;
          }
          case "developer": {
            messages.push({ role: "developer", content });
            break;
          }
          case "remove": {
            warnings.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            const _exhaustiveCheck = systemMessageMode;
            throw new Error(
              `Unsupported system message mode: ${_exhaustiveCheck}`
            );
          }
        }
        break;
      }
      case "user": {
        messages.push({
          role: "user",
          content: content.map((part, index) => {
            var _a15, _b, _c, _d;
            switch (part.type) {
              case "text": {
                return { type: "input_text", text: part.text };
              }
              case "image": {
                return {
                  type: "input_image",
                  image_url: part.image instanceof URL ? part.image.toString() : `data:${(_a15 = part.mimeType) != null ? _a15 : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`,
                  // OpenAI specific extension: image detail
                  detail: (_c = (_b = part.providerMetadata) == null ? void 0 : _b.openai) == null ? void 0 : _c.imageDetail
                };
              }
              case "file": {
                if (part.data instanceof URL) {
                  throw new UnsupportedFunctionalityError({
                    functionality: "File URLs in user messages"
                  });
                }
                switch (part.mimeType) {
                  case "application/pdf": {
                    return {
                      type: "input_file",
                      filename: (_d = part.filename) != null ? _d : `part-${index}.pdf`,
                      file_data: `data:application/pdf;base64,${part.data}`
                    };
                  }
                  default: {
                    throw new UnsupportedFunctionalityError({
                      functionality: "Only PDF files are supported in user messages"
                    });
                  }
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        for (const part of content) {
          switch (part.type) {
            case "text": {
              messages.push({
                role: "assistant",
                content: [{ type: "output_text", text: part.text }]
              });
              break;
            }
            case "tool-call": {
              messages.push({
                type: "function_call",
                call_id: part.toolCallId,
                name: part.toolName,
                arguments: JSON.stringify(part.args)
              });
              break;
            }
          }
        }
        break;
      }
      case "tool": {
        for (const part of content) {
          messages.push({
            type: "function_call_output",
            call_id: part.toolCallId,
            output: JSON.stringify(part.result)
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return { messages, warnings };
}
function mapOpenAIResponseFinishReason({
  finishReason,
  hasToolCalls
}) {
  switch (finishReason) {
    case void 0:
    case null:
      return hasToolCalls ? "tool-calls" : "stop";
    case "max_output_tokens":
      return "length";
    case "content_filter":
      return "content-filter";
    default:
      return hasToolCalls ? "tool-calls" : "unknown";
  }
}
function prepareResponsesTools({
  mode,
  strict
}) {
  var _a15;
  const tools = ((_a15 = mode.tools) == null ? void 0 : _a15.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const toolChoice = mode.toolChoice;
  const openaiTools2 = [];
  for (const tool of tools) {
    switch (tool.type) {
      case "function":
        openaiTools2.push({
          type: "function",
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
          strict: strict ? true : void 0
        });
        break;
      case "provider-defined":
        switch (tool.id) {
          case "openai.web_search_preview":
            openaiTools2.push({
              type: "web_search_preview",
              search_context_size: tool.args.searchContextSize,
              user_location: tool.args.userLocation
            });
            break;
          default:
            toolWarnings.push({ type: "unsupported-tool", tool });
            break;
        }
        break;
      default:
        toolWarnings.push({ type: "unsupported-tool", tool });
        break;
    }
  }
  if (toolChoice == null) {
    return { tools: openaiTools2, tool_choice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiTools2, tool_choice: type, toolWarnings };
    case "tool": {
      if (toolChoice.toolName === "web_search_preview") {
        return {
          tools: openaiTools2,
          tool_choice: {
            type: "web_search_preview"
          },
          toolWarnings
        };
      }
      return {
        tools: openaiTools2,
        tool_choice: {
          type: "function",
          name: toolChoice.toolName
        },
        toolWarnings
      };
    }
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var OpenAIResponsesLanguageModel = class {
  constructor(modelId, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "json";
    this.supportsStructuredOutputs = true;
    this.modelId = modelId;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    mode,
    maxTokens,
    temperature,
    stopSequences,
    topP,
    topK,
    presencePenalty,
    frequencyPenalty,
    seed,
    prompt,
    providerMetadata,
    responseFormat
  }) {
    var _a15, _b, _c;
    const warnings = [];
    const modelConfig = getResponsesModelConfig(this.modelId);
    const type = mode.type;
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (seed != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "seed"
      });
    }
    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty"
      });
    }
    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty"
      });
    }
    if (stopSequences != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "stopSequences"
      });
    }
    const { messages, warnings: messageWarnings } = convertToOpenAIResponsesMessages({
      prompt,
      systemMessageMode: modelConfig.systemMessageMode
    });
    warnings.push(...messageWarnings);
    const openaiOptions = parseProviderOptions({
      provider: "openai",
      providerOptions: providerMetadata,
      schema: openaiResponsesProviderOptionsSchema
    });
    const isStrict = (_a15 = openaiOptions == null ? void 0 : openaiOptions.strictSchemas) != null ? _a15 : true;
    const baseArgs = __spreadValues(__spreadValues(__spreadProps(__spreadValues({
      model: this.modelId,
      input: messages,
      temperature,
      top_p: topP,
      max_output_tokens: maxTokens
    }, (responseFormat == null ? void 0 : responseFormat.type) === "json" && {
      text: {
        format: responseFormat.schema != null ? {
          type: "json_schema",
          strict: isStrict,
          name: (_b = responseFormat.name) != null ? _b : "response",
          description: responseFormat.description,
          schema: responseFormat.schema
        } : { type: "json_object" }
      }
    }), {
      // provider options:
      metadata: openaiOptions == null ? void 0 : openaiOptions.metadata,
      parallel_tool_calls: openaiOptions == null ? void 0 : openaiOptions.parallelToolCalls,
      previous_response_id: openaiOptions == null ? void 0 : openaiOptions.previousResponseId,
      store: openaiOptions == null ? void 0 : openaiOptions.store,
      user: openaiOptions == null ? void 0 : openaiOptions.user,
      instructions: openaiOptions == null ? void 0 : openaiOptions.instructions
    }), modelConfig.isReasoningModel && ((openaiOptions == null ? void 0 : openaiOptions.reasoningEffort) != null || (openaiOptions == null ? void 0 : openaiOptions.reasoningSummary) != null) && {
      reasoning: __spreadValues(__spreadValues({}, (openaiOptions == null ? void 0 : openaiOptions.reasoningEffort) != null && {
        effort: openaiOptions.reasoningEffort
      }), (openaiOptions == null ? void 0 : openaiOptions.reasoningSummary) != null && {
        summary: openaiOptions.reasoningSummary
      })
    }), modelConfig.requiredAutoTruncation && {
      truncation: "auto"
    });
    if (modelConfig.isReasoningModel) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported for reasoning models"
        });
      }
      if (baseArgs.top_p != null) {
        baseArgs.top_p = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "topP",
          details: "topP is not supported for reasoning models"
        });
      }
    }
    switch (type) {
      case "regular": {
        const { tools, tool_choice, toolWarnings } = prepareResponsesTools({
          mode,
          strict: isStrict
          // TODO support provider options on tools
        });
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            tools,
            tool_choice
          }),
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            text: {
              format: mode.schema != null ? {
                type: "json_schema",
                strict: isStrict,
                name: (_c = mode.name) != null ? _c : "response",
                description: mode.description,
                schema: mode.schema
              } : { type: "json_object" }
            }
          }),
          warnings
        };
      }
      case "object-tool": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            tool_choice: { type: "function", name: mode.tool.name },
            tools: [
              {
                type: "function",
                name: mode.tool.name,
                description: mode.tool.description,
                parameters: mode.tool.parameters,
                strict: isStrict
              }
            ]
          }),
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d, _e, _f, _g;
      const { args: body, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: this.config.url({
          path: "/responses",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          import_zod8.z.object({
            id: import_zod8.z.string(),
            created_at: import_zod8.z.number(),
            model: import_zod8.z.string(),
            output: import_zod8.z.array(
              import_zod8.z.discriminatedUnion("type", [
                import_zod8.z.object({
                  type: import_zod8.z.literal("message"),
                  role: import_zod8.z.literal("assistant"),
                  content: import_zod8.z.array(
                    import_zod8.z.object({
                      type: import_zod8.z.literal("output_text"),
                      text: import_zod8.z.string(),
                      annotations: import_zod8.z.array(
                        import_zod8.z.object({
                          type: import_zod8.z.literal("url_citation"),
                          start_index: import_zod8.z.number(),
                          end_index: import_zod8.z.number(),
                          url: import_zod8.z.string(),
                          title: import_zod8.z.string()
                        })
                      )
                    })
                  )
                }),
                import_zod8.z.object({
                  type: import_zod8.z.literal("function_call"),
                  call_id: import_zod8.z.string(),
                  name: import_zod8.z.string(),
                  arguments: import_zod8.z.string()
                }),
                import_zod8.z.object({
                  type: import_zod8.z.literal("web_search_call")
                }),
                import_zod8.z.object({
                  type: import_zod8.z.literal("computer_call")
                }),
                import_zod8.z.object({
                  type: import_zod8.z.literal("reasoning"),
                  summary: import_zod8.z.array(
                    import_zod8.z.object({
                      type: import_zod8.z.literal("summary_text"),
                      text: import_zod8.z.string()
                    })
                  )
                })
              ])
            ),
            incomplete_details: import_zod8.z.object({ reason: import_zod8.z.string() }).nullable(),
            usage: usageSchema
          })
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const outputTextElements = response.output.filter((output) => output.type === "message").flatMap((output) => output.content).filter((content) => content.type === "output_text");
      const toolCalls = response.output.filter((output) => output.type === "function_call").map((output) => ({
        toolCallType: "function",
        toolCallId: output.call_id,
        toolName: output.name,
        args: output.arguments
      }));
      const reasoningSummary = (_b = (_a15 = response.output.find((item) => item.type === "reasoning")) == null ? void 0 : _a15.summary) != null ? _b : null;
      return {
        text: outputTextElements.map((content) => content.text).join("\n"),
        sources: outputTextElements.flatMap(
          (content) => content.annotations.map((annotation) => {
            var _a22, _b2, _c2;
            return {
              sourceType: "url",
              id: (_c2 = (_b2 = (_a22 = this.config).generateId) == null ? void 0 : _b2.call(_a22)) != null ? _c2 : generateId(),
              url: annotation.url,
              title: annotation.title
            };
          })
        ),
        finishReason: mapOpenAIResponseFinishReason({
          finishReason: (_c = response.incomplete_details) == null ? void 0 : _c.reason,
          hasToolCalls: toolCalls.length > 0
        }),
        toolCalls: toolCalls.length > 0 ? toolCalls : void 0,
        reasoning: reasoningSummary ? reasoningSummary.map((summary) => ({
          type: "text",
          text: summary.text
        })) : void 0,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens
        },
        rawCall: {
          rawPrompt: void 0,
          rawSettings: {}
        },
        rawResponse: {
          headers: responseHeaders,
          body: rawResponse
        },
        request: {
          body: JSON.stringify(body)
        },
        response: {
          id: response.id,
          timestamp: new Date(response.created_at * 1e3),
          modelId: response.model
        },
        providerMetadata: {
          openai: {
            responseId: response.id,
            cachedPromptTokens: (_e = (_d = response.usage.input_tokens_details) == null ? void 0 : _d.cached_tokens) != null ? _e : null,
            reasoningTokens: (_g = (_f = response.usage.output_tokens_details) == null ? void 0 : _f.reasoning_tokens) != null ? _g : null
          }
        },
        warnings
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      const { args: body, warnings } = this.getArgs(options);
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/responses",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: __spreadProps(__spreadValues({}, body), {
          stream: true
        }),
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          openaiResponsesChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const self = this;
      let finishReason = "unknown";
      let promptTokens = NaN;
      let completionTokens = NaN;
      let cachedPromptTokens = null;
      let reasoningTokens = null;
      let responseId = null;
      const ongoingToolCalls = {};
      let hasToolCalls = false;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a15, _b, _c, _d, _e, _f, _g, _h;
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if (isResponseOutputItemAddedChunk(value)) {
                if (value.item.type === "function_call") {
                  ongoingToolCalls[value.output_index] = {
                    toolName: value.item.name,
                    toolCallId: value.item.call_id
                  };
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: value.item.call_id,
                    toolName: value.item.name,
                    argsTextDelta: value.item.arguments
                  });
                }
              } else if (isResponseFunctionCallArgumentsDeltaChunk(value)) {
                const toolCall = ongoingToolCalls[value.output_index];
                if (toolCall != null) {
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: toolCall.toolCallId,
                    toolName: toolCall.toolName,
                    argsTextDelta: value.delta
                  });
                }
              } else if (isResponseCreatedChunk(value)) {
                responseId = value.response.id;
                controller.enqueue({
                  type: "response-metadata",
                  id: value.response.id,
                  timestamp: new Date(value.response.created_at * 1e3),
                  modelId: value.response.model
                });
              } else if (isTextDeltaChunk(value)) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: value.delta
                });
              } else if (isResponseReasoningSummaryTextDeltaChunk(value)) {
                controller.enqueue({
                  type: "reasoning",
                  textDelta: value.delta
                });
              } else if (isResponseOutputItemDoneChunk(value) && value.item.type === "function_call") {
                ongoingToolCalls[value.output_index] = void 0;
                hasToolCalls = true;
                controller.enqueue({
                  type: "tool-call",
                  toolCallType: "function",
                  toolCallId: value.item.call_id,
                  toolName: value.item.name,
                  args: value.item.arguments
                });
              } else if (isResponseFinishedChunk(value)) {
                finishReason = mapOpenAIResponseFinishReason({
                  finishReason: (_a15 = value.response.incomplete_details) == null ? void 0 : _a15.reason,
                  hasToolCalls
                });
                promptTokens = value.response.usage.input_tokens;
                completionTokens = value.response.usage.output_tokens;
                cachedPromptTokens = (_c = (_b = value.response.usage.input_tokens_details) == null ? void 0 : _b.cached_tokens) != null ? _c : cachedPromptTokens;
                reasoningTokens = (_e = (_d = value.response.usage.output_tokens_details) == null ? void 0 : _d.reasoning_tokens) != null ? _e : reasoningTokens;
              } else if (isResponseAnnotationAddedChunk(value)) {
                controller.enqueue({
                  type: "source",
                  source: {
                    sourceType: "url",
                    id: (_h = (_g = (_f = self.config).generateId) == null ? void 0 : _g.call(_f)) != null ? _h : generateId(),
                    url: value.annotation.url,
                    title: value.annotation.title
                  }
                });
              }
            },
            flush(controller) {
              controller.enqueue(__spreadValues({
                type: "finish",
                finishReason,
                usage: { promptTokens, completionTokens }
              }, (cachedPromptTokens != null || reasoningTokens != null) && {
                providerMetadata: {
                  openai: {
                    responseId,
                    cachedPromptTokens,
                    reasoningTokens
                  }
                }
              }));
            }
          })
        ),
        rawCall: {
          rawPrompt: void 0,
          rawSettings: {}
        },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        warnings
      };
    });
  }
};
var usageSchema = import_zod8.z.object({
  input_tokens: import_zod8.z.number(),
  input_tokens_details: import_zod8.z.object({ cached_tokens: import_zod8.z.number().nullish() }).nullish(),
  output_tokens: import_zod8.z.number(),
  output_tokens_details: import_zod8.z.object({ reasoning_tokens: import_zod8.z.number().nullish() }).nullish()
});
var textDeltaChunkSchema = import_zod8.z.object({
  type: import_zod8.z.literal("response.output_text.delta"),
  delta: import_zod8.z.string()
});
var responseFinishedChunkSchema = import_zod8.z.object({
  type: import_zod8.z.enum(["response.completed", "response.incomplete"]),
  response: import_zod8.z.object({
    incomplete_details: import_zod8.z.object({ reason: import_zod8.z.string() }).nullish(),
    usage: usageSchema
  })
});
var responseCreatedChunkSchema = import_zod8.z.object({
  type: import_zod8.z.literal("response.created"),
  response: import_zod8.z.object({
    id: import_zod8.z.string(),
    created_at: import_zod8.z.number(),
    model: import_zod8.z.string()
  })
});
var responseOutputItemDoneSchema = import_zod8.z.object({
  type: import_zod8.z.literal("response.output_item.done"),
  output_index: import_zod8.z.number(),
  item: import_zod8.z.discriminatedUnion("type", [
    import_zod8.z.object({
      type: import_zod8.z.literal("message")
    }),
    import_zod8.z.object({
      type: import_zod8.z.literal("function_call"),
      id: import_zod8.z.string(),
      call_id: import_zod8.z.string(),
      name: import_zod8.z.string(),
      arguments: import_zod8.z.string(),
      status: import_zod8.z.literal("completed")
    })
  ])
});
var responseFunctionCallArgumentsDeltaSchema = import_zod8.z.object({
  type: import_zod8.z.literal("response.function_call_arguments.delta"),
  item_id: import_zod8.z.string(),
  output_index: import_zod8.z.number(),
  delta: import_zod8.z.string()
});
var responseOutputItemAddedSchema = import_zod8.z.object({
  type: import_zod8.z.literal("response.output_item.added"),
  output_index: import_zod8.z.number(),
  item: import_zod8.z.discriminatedUnion("type", [
    import_zod8.z.object({
      type: import_zod8.z.literal("message")
    }),
    import_zod8.z.object({
      type: import_zod8.z.literal("function_call"),
      id: import_zod8.z.string(),
      call_id: import_zod8.z.string(),
      name: import_zod8.z.string(),
      arguments: import_zod8.z.string()
    })
  ])
});
var responseAnnotationAddedSchema = import_zod8.z.object({
  type: import_zod8.z.literal("response.output_text.annotation.added"),
  annotation: import_zod8.z.object({
    type: import_zod8.z.literal("url_citation"),
    url: import_zod8.z.string(),
    title: import_zod8.z.string()
  })
});
var responseReasoningSummaryTextDeltaSchema = import_zod8.z.object({
  type: import_zod8.z.literal("response.reasoning_summary_text.delta"),
  item_id: import_zod8.z.string(),
  output_index: import_zod8.z.number(),
  summary_index: import_zod8.z.number(),
  delta: import_zod8.z.string()
});
var openaiResponsesChunkSchema = import_zod8.z.union([
  textDeltaChunkSchema,
  responseFinishedChunkSchema,
  responseCreatedChunkSchema,
  responseOutputItemDoneSchema,
  responseFunctionCallArgumentsDeltaSchema,
  responseOutputItemAddedSchema,
  responseAnnotationAddedSchema,
  responseReasoningSummaryTextDeltaSchema,
  import_zod8.z.object({ type: import_zod8.z.string() }).passthrough()
  // fallback for unknown chunks
]);
function isTextDeltaChunk(chunk) {
  return chunk.type === "response.output_text.delta";
}
function isResponseOutputItemDoneChunk(chunk) {
  return chunk.type === "response.output_item.done";
}
function isResponseFinishedChunk(chunk) {
  return chunk.type === "response.completed" || chunk.type === "response.incomplete";
}
function isResponseCreatedChunk(chunk) {
  return chunk.type === "response.created";
}
function isResponseFunctionCallArgumentsDeltaChunk(chunk) {
  return chunk.type === "response.function_call_arguments.delta";
}
function isResponseOutputItemAddedChunk(chunk) {
  return chunk.type === "response.output_item.added";
}
function isResponseAnnotationAddedChunk(chunk) {
  return chunk.type === "response.output_text.annotation.added";
}
function isResponseReasoningSummaryTextDeltaChunk(chunk) {
  return chunk.type === "response.reasoning_summary_text.delta";
}
function getResponsesModelConfig(modelId) {
  if (modelId.startsWith("o")) {
    if (modelId.startsWith("o1-mini") || modelId.startsWith("o1-preview")) {
      return {
        isReasoningModel: true,
        systemMessageMode: "remove",
        requiredAutoTruncation: false
      };
    }
    return {
      isReasoningModel: true,
      systemMessageMode: "developer",
      requiredAutoTruncation: false
    };
  }
  return {
    isReasoningModel: false,
    systemMessageMode: "system",
    requiredAutoTruncation: false
  };
}
var openaiResponsesProviderOptionsSchema = import_zod8.z.object({
  metadata: import_zod8.z.any().nullish(),
  parallelToolCalls: import_zod8.z.boolean().nullish(),
  previousResponseId: import_zod8.z.string().nullish(),
  store: import_zod8.z.boolean().nullish(),
  user: import_zod8.z.string().nullish(),
  reasoningEffort: import_zod8.z.string().nullish(),
  strictSchemas: import_zod8.z.boolean().nullish(),
  instructions: import_zod8.z.string().nullish(),
  reasoningSummary: import_zod8.z.string().nullish()
});
var WebSearchPreviewParameters = import_zod9.z.object({});
function webSearchPreviewTool({
  searchContextSize,
  userLocation
} = {}) {
  return {
    type: "provider-defined",
    id: "openai.web_search_preview",
    args: {
      searchContextSize,
      userLocation
    },
    parameters: WebSearchPreviewParameters
  };
}
var openaiTools = {
  webSearchPreview: webSearchPreviewTool
};
var OpenAIProviderOptionsSchema = import_zod10.z.object({
  instructions: import_zod10.z.string().nullish(),
  speed: import_zod10.z.number().min(0.25).max(4).default(1).nullish()
});
var OpenAISpeechModel = class {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v1";
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    text,
    voice = "alloy",
    outputFormat = "mp3",
    speed,
    instructions,
    providerOptions
  }) {
    const warnings = [];
    const openAIOptions = parseProviderOptions({
      provider: "openai",
      providerOptions,
      schema: OpenAIProviderOptionsSchema
    });
    const requestBody = {
      model: this.modelId,
      input: text,
      voice,
      response_format: "mp3",
      speed,
      instructions
    };
    if (outputFormat) {
      if (["mp3", "opus", "aac", "flac", "wav", "pcm"].includes(outputFormat)) {
        requestBody.response_format = outputFormat;
      } else {
        warnings.push({
          type: "unsupported-setting",
          setting: "outputFormat",
          details: `Unsupported output format: ${outputFormat}. Using mp3 instead.`
        });
      }
    }
    if (openAIOptions) {
      const speechModelOptions = {};
      for (const key in speechModelOptions) {
        const value = speechModelOptions[key];
        if (value !== void 0) {
          requestBody[key] = value;
        }
      }
    }
    return {
      requestBody,
      warnings
    };
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c;
      const currentDate = (_c = (_b = (_a15 = this.config._internal) == null ? void 0 : _a15.currentDate) == null ? void 0 : _b.call(_a15)) != null ? _c : /* @__PURE__ */ new Date();
      const { requestBody, warnings } = this.getArgs(options);
      const {
        value: audio,
        responseHeaders,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: this.config.url({
          path: "/audio/speech",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: requestBody,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createBinaryResponseHandler(),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      return {
        audio,
        warnings,
        request: {
          body: JSON.stringify(requestBody)
        },
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders,
          body: rawResponse
        }
      };
    });
  }
};
function createOpenAI(options = {}) {
  var _a15, _b, _c;
  const baseURL = (_a15 = withoutTrailingSlash(options.baseURL)) != null ? _a15 : "https://api.openai.com/v1";
  const compatibility = (_b = options.compatibility) != null ? _b : "compatible";
  const providerName = (_c = options.name) != null ? _c : "openai";
  const getHeaders = () => __spreadValues({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "OPENAI_API_KEY",
      description: "OpenAI"
    })}`,
    "OpenAI-Organization": options.organization,
    "OpenAI-Project": options.project
  }, options.headers);
  const createChatModel = (modelId, settings = {}) => new OpenAIChatLanguageModel(modelId, settings, {
    provider: `${providerName}.chat`,
    url: ({ path: path4 }) => `${baseURL}${path4}`,
    headers: getHeaders,
    compatibility,
    fetch: options.fetch
  });
  const createCompletionModel = (modelId, settings = {}) => new OpenAICompletionLanguageModel(modelId, settings, {
    provider: `${providerName}.completion`,
    url: ({ path: path4 }) => `${baseURL}${path4}`,
    headers: getHeaders,
    compatibility,
    fetch: options.fetch
  });
  const createEmbeddingModel = (modelId, settings = {}) => new OpenAIEmbeddingModel(modelId, settings, {
    provider: `${providerName}.embedding`,
    url: ({ path: path4 }) => `${baseURL}${path4}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createImageModel = (modelId, settings = {}) => new OpenAIImageModel(modelId, settings, {
    provider: `${providerName}.image`,
    url: ({ path: path4 }) => `${baseURL}${path4}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createTranscriptionModel = (modelId) => new OpenAITranscriptionModel(modelId, {
    provider: `${providerName}.transcription`,
    url: ({ path: path4 }) => `${baseURL}${path4}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createSpeechModel = (modelId) => new OpenAISpeechModel(modelId, {
    provider: `${providerName}.speech`,
    url: ({ path: path4 }) => `${baseURL}${path4}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createLanguageModel = (modelId, settings) => {
    if (new.target) {
      throw new Error(
        "The OpenAI model function cannot be called with the new keyword."
      );
    }
    if (modelId === "gpt-3.5-turbo-instruct") {
      return createCompletionModel(
        modelId,
        settings
      );
    }
    return createChatModel(modelId, settings);
  };
  const createResponsesModel = (modelId) => {
    return new OpenAIResponsesLanguageModel(modelId, {
      provider: `${providerName}.responses`,
      url: ({ path: path4 }) => `${baseURL}${path4}`,
      headers: getHeaders,
      fetch: options.fetch
    });
  };
  const provider = function(modelId, settings) {
    return createLanguageModel(modelId, settings);
  };
  provider.languageModel = createLanguageModel;
  provider.chat = createChatModel;
  provider.completion = createCompletionModel;
  provider.responses = createResponsesModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  provider.image = createImageModel;
  provider.imageModel = createImageModel;
  provider.transcription = createTranscriptionModel;
  provider.transcriptionModel = createTranscriptionModel;
  provider.speech = createSpeechModel;
  provider.speechModel = createSpeechModel;
  provider.tools = openaiTools;
  return provider;
}
var openai = createOpenAI({
  compatibility: "strict"
  // strict for OpenAI API
});

// node_modules/.pnpm/@ai-sdk+anthropic@1.2.10_zod@3.25.67/node_modules/@ai-sdk/anthropic/dist/index.mjs
var import_zod11 = require("zod");
var import_zod12 = require("zod");
var import_zod13 = require("zod");
var anthropicErrorDataSchema = import_zod12.z.object({
  type: import_zod12.z.literal("error"),
  error: import_zod12.z.object({
    type: import_zod12.z.string(),
    message: import_zod12.z.string()
  })
});
var anthropicFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: anthropicErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
function prepareTools2(mode) {
  var _a15;
  const tools = ((_a15 = mode.tools) == null ? void 0 : _a15.length) ? mode.tools : void 0;
  const toolWarnings = [];
  const betas = /* @__PURE__ */ new Set();
  if (tools == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings, betas };
  }
  const anthropicTools2 = [];
  for (const tool of tools) {
    switch (tool.type) {
      case "function":
        anthropicTools2.push({
          name: tool.name,
          description: tool.description,
          input_schema: tool.parameters
        });
        break;
      case "provider-defined":
        switch (tool.id) {
          case "anthropic.computer_20250124":
            betas.add("computer-use-2025-01-24");
            anthropicTools2.push({
              name: tool.name,
              type: "computer_20250124",
              display_width_px: tool.args.displayWidthPx,
              display_height_px: tool.args.displayHeightPx,
              display_number: tool.args.displayNumber
            });
            break;
          case "anthropic.computer_20241022":
            betas.add("computer-use-2024-10-22");
            anthropicTools2.push({
              name: tool.name,
              type: "computer_20241022",
              display_width_px: tool.args.displayWidthPx,
              display_height_px: tool.args.displayHeightPx,
              display_number: tool.args.displayNumber
            });
            break;
          case "anthropic.text_editor_20250124":
            betas.add("computer-use-2025-01-24");
            anthropicTools2.push({
              name: tool.name,
              type: "text_editor_20250124"
            });
            break;
          case "anthropic.text_editor_20241022":
            betas.add("computer-use-2024-10-22");
            anthropicTools2.push({
              name: tool.name,
              type: "text_editor_20241022"
            });
            break;
          case "anthropic.bash_20250124":
            betas.add("computer-use-2025-01-24");
            anthropicTools2.push({
              name: tool.name,
              type: "bash_20250124"
            });
            break;
          case "anthropic.bash_20241022":
            betas.add("computer-use-2024-10-22");
            anthropicTools2.push({
              name: tool.name,
              type: "bash_20241022"
            });
            break;
          default:
            toolWarnings.push({ type: "unsupported-tool", tool });
            break;
        }
        break;
      default:
        toolWarnings.push({ type: "unsupported-tool", tool });
        break;
    }
  }
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return {
      tools: anthropicTools2,
      tool_choice: void 0,
      toolWarnings,
      betas
    };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
      return {
        tools: anthropicTools2,
        tool_choice: { type: "auto" },
        toolWarnings,
        betas
      };
    case "required":
      return {
        tools: anthropicTools2,
        tool_choice: { type: "any" },
        toolWarnings,
        betas
      };
    case "none":
      return { tools: void 0, tool_choice: void 0, toolWarnings, betas };
    case "tool":
      return {
        tools: anthropicTools2,
        tool_choice: { type: "tool", name: toolChoice.toolName },
        toolWarnings,
        betas
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
function convertToAnthropicMessagesPrompt({
  prompt,
  sendReasoning,
  warnings
}) {
  var _a15, _b, _c, _d;
  const betas = /* @__PURE__ */ new Set();
  const blocks = groupIntoBlocks(prompt);
  let system = void 0;
  const messages = [];
  function getCacheControl(providerMetadata) {
    var _a22;
    const anthropic2 = providerMetadata == null ? void 0 : providerMetadata.anthropic;
    const cacheControlValue = (_a22 = anthropic2 == null ? void 0 : anthropic2.cacheControl) != null ? _a22 : anthropic2 == null ? void 0 : anthropic2.cache_control;
    return cacheControlValue;
  }
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const isLastBlock = i === blocks.length - 1;
    const type = block.type;
    switch (type) {
      case "system": {
        if (system != null) {
          throw new UnsupportedFunctionalityError({
            functionality: "Multiple system messages that are separated by user/assistant messages"
          });
        }
        system = block.messages.map(({ content, providerMetadata }) => ({
          type: "text",
          text: content,
          cache_control: getCacheControl(providerMetadata)
        }));
        break;
      }
      case "user": {
        const anthropicContent = [];
        for (const message of block.messages) {
          const { role, content } = message;
          switch (role) {
            case "user": {
              for (let j = 0; j < content.length; j++) {
                const part = content[j];
                const isLastPart = j === content.length - 1;
                const cacheControl = (_a15 = getCacheControl(part.providerMetadata)) != null ? _a15 : isLastPart ? getCacheControl(message.providerMetadata) : void 0;
                switch (part.type) {
                  case "text": {
                    anthropicContent.push({
                      type: "text",
                      text: part.text,
                      cache_control: cacheControl
                    });
                    break;
                  }
                  case "image": {
                    anthropicContent.push({
                      type: "image",
                      source: part.image instanceof URL ? {
                        type: "url",
                        url: part.image.toString()
                      } : {
                        type: "base64",
                        media_type: (_b = part.mimeType) != null ? _b : "image/jpeg",
                        data: convertUint8ArrayToBase64(part.image)
                      },
                      cache_control: cacheControl
                    });
                    break;
                  }
                  case "file": {
                    if (part.mimeType !== "application/pdf") {
                      throw new UnsupportedFunctionalityError({
                        functionality: "Non-PDF files in user messages"
                      });
                    }
                    betas.add("pdfs-2024-09-25");
                    anthropicContent.push({
                      type: "document",
                      source: part.data instanceof URL ? {
                        type: "url",
                        url: part.data.toString()
                      } : {
                        type: "base64",
                        media_type: "application/pdf",
                        data: part.data
                      },
                      cache_control: cacheControl
                    });
                    break;
                  }
                }
              }
              break;
            }
            case "tool": {
              for (let i2 = 0; i2 < content.length; i2++) {
                const part = content[i2];
                const isLastPart = i2 === content.length - 1;
                const cacheControl = (_c = getCacheControl(part.providerMetadata)) != null ? _c : isLastPart ? getCacheControl(message.providerMetadata) : void 0;
                const toolResultContent = part.content != null ? part.content.map((part2) => {
                  var _a22;
                  switch (part2.type) {
                    case "text":
                      return {
                        type: "text",
                        text: part2.text,
                        cache_control: void 0
                      };
                    case "image":
                      return {
                        type: "image",
                        source: {
                          type: "base64",
                          media_type: (_a22 = part2.mimeType) != null ? _a22 : "image/jpeg",
                          data: part2.data
                        },
                        cache_control: void 0
                      };
                  }
                }) : JSON.stringify(part.result);
                anthropicContent.push({
                  type: "tool_result",
                  tool_use_id: part.toolCallId,
                  content: toolResultContent,
                  is_error: part.isError,
                  cache_control: cacheControl
                });
              }
              break;
            }
            default: {
              const _exhaustiveCheck = role;
              throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
            }
          }
        }
        messages.push({ role: "user", content: anthropicContent });
        break;
      }
      case "assistant": {
        const anthropicContent = [];
        for (let j = 0; j < block.messages.length; j++) {
          const message = block.messages[j];
          const isLastMessage = j === block.messages.length - 1;
          const { content } = message;
          for (let k = 0; k < content.length; k++) {
            const part = content[k];
            const isLastContentPart = k === content.length - 1;
            const cacheControl = (_d = getCacheControl(part.providerMetadata)) != null ? _d : isLastContentPart ? getCacheControl(message.providerMetadata) : void 0;
            switch (part.type) {
              case "text": {
                anthropicContent.push({
                  type: "text",
                  text: (
                    // trim the last text part if it's the last message in the block
                    // because Anthropic does not allow trailing whitespace
                    // in pre-filled assistant responses
                    isLastBlock && isLastMessage && isLastContentPart ? part.text.trim() : part.text
                  ),
                  cache_control: cacheControl
                });
                break;
              }
              case "reasoning": {
                if (sendReasoning) {
                  anthropicContent.push({
                    type: "thinking",
                    thinking: part.text,
                    signature: part.signature,
                    cache_control: cacheControl
                  });
                } else {
                  warnings.push({
                    type: "other",
                    message: "sending reasoning content is disabled for this model"
                  });
                }
                break;
              }
              case "redacted-reasoning": {
                anthropicContent.push({
                  type: "redacted_thinking",
                  data: part.data,
                  cache_control: cacheControl
                });
                break;
              }
              case "tool-call": {
                anthropicContent.push({
                  type: "tool_use",
                  id: part.toolCallId,
                  name: part.toolName,
                  input: part.args,
                  cache_control: cacheControl
                });
                break;
              }
            }
          }
        }
        messages.push({ role: "assistant", content: anthropicContent });
        break;
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  return {
    prompt: { system, messages },
    betas
  };
}
function groupIntoBlocks(prompt) {
  const blocks = [];
  let currentBlock = void 0;
  for (const message of prompt) {
    const { role } = message;
    switch (role) {
      case "system": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "system") {
          currentBlock = { type: "system", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "assistant": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "assistant") {
          currentBlock = { type: "assistant", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "user": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
          currentBlock = { type: "user", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "tool": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
          currentBlock = { type: "user", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return blocks;
}
function mapAnthropicStopReason(finishReason) {
  switch (finishReason) {
    case "end_turn":
    case "stop_sequence":
      return "stop";
    case "tool_use":
      return "tool-calls";
    case "max_tokens":
      return "length";
    default:
      return "unknown";
  }
}
var AnthropicMessagesLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "tool";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  supportsUrl(url) {
    return url.protocol === "https:";
  }
  get provider() {
    return this.config.provider;
  }
  get supportsImageUrls() {
    return this.config.supportsImageUrls;
  }
  getArgs(_0) {
    return __async(this, arguments, function* ({
      mode,
      prompt,
      maxTokens = 4096,
      // 4096: max model output tokens TODO update default in v5
      temperature,
      topP,
      topK,
      frequencyPenalty,
      presencePenalty,
      stopSequences,
      responseFormat,
      seed,
      providerMetadata: providerOptions
    }) {
      var _a15, _b, _c;
      const type = mode.type;
      const warnings = [];
      if (frequencyPenalty != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "frequencyPenalty"
        });
      }
      if (presencePenalty != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "presencePenalty"
        });
      }
      if (seed != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "seed"
        });
      }
      if (responseFormat != null && responseFormat.type !== "text") {
        warnings.push({
          type: "unsupported-setting",
          setting: "responseFormat",
          details: "JSON response format is not supported."
        });
      }
      const { prompt: messagesPrompt, betas: messagesBetas } = convertToAnthropicMessagesPrompt({
        prompt,
        sendReasoning: (_a15 = this.settings.sendReasoning) != null ? _a15 : true,
        warnings
      });
      const anthropicOptions = parseProviderOptions({
        provider: "anthropic",
        providerOptions,
        schema: anthropicProviderOptionsSchema
      });
      const isThinking = ((_b = anthropicOptions == null ? void 0 : anthropicOptions.thinking) == null ? void 0 : _b.type) === "enabled";
      const thinkingBudget = (_c = anthropicOptions == null ? void 0 : anthropicOptions.thinking) == null ? void 0 : _c.budgetTokens;
      const baseArgs = __spreadProps(__spreadValues({
        // model id:
        model: this.modelId,
        // standardized settings:
        max_tokens: maxTokens,
        temperature,
        top_k: topK,
        top_p: topP,
        stop_sequences: stopSequences
      }, isThinking && {
        thinking: { type: "enabled", budget_tokens: thinkingBudget }
      }), {
        // prompt:
        system: messagesPrompt.system,
        messages: messagesPrompt.messages
      });
      if (isThinking) {
        if (thinkingBudget == null) {
          throw new UnsupportedFunctionalityError({
            functionality: "thinking requires a budget"
          });
        }
        if (baseArgs.temperature != null) {
          baseArgs.temperature = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "temperature",
            details: "temperature is not supported when thinking is enabled"
          });
        }
        if (topK != null) {
          baseArgs.top_k = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "topK",
            details: "topK is not supported when thinking is enabled"
          });
        }
        if (topP != null) {
          baseArgs.top_p = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "topP",
            details: "topP is not supported when thinking is enabled"
          });
        }
        baseArgs.max_tokens = maxTokens + thinkingBudget;
      }
      switch (type) {
        case "regular": {
          const {
            tools,
            tool_choice,
            toolWarnings,
            betas: toolsBetas
          } = prepareTools2(mode);
          return {
            args: __spreadProps(__spreadValues({}, baseArgs), { tools, tool_choice }),
            warnings: [...warnings, ...toolWarnings],
            betas: /* @__PURE__ */ new Set([...messagesBetas, ...toolsBetas])
          };
        }
        case "object-json": {
          throw new UnsupportedFunctionalityError({
            functionality: "json-mode object generation"
          });
        }
        case "object-tool": {
          const { name: name14, description, parameters } = mode.tool;
          return {
            args: __spreadProps(__spreadValues({}, baseArgs), {
              tools: [{ name: name14, description, input_schema: parameters }],
              tool_choice: { type: "tool", name: name14 }
            }),
            warnings,
            betas: messagesBetas
          };
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    });
  }
  getHeaders(_0) {
    return __async(this, arguments, function* ({
      betas,
      headers
    }) {
      return combineHeaders(
        yield resolve(this.config.headers),
        betas.size > 0 ? { "anthropic-beta": Array.from(betas).join(",") } : {},
        headers
      );
    });
  }
  buildRequestUrl(isStreaming) {
    var _a15, _b, _c;
    return (_c = (_b = (_a15 = this.config).buildRequestUrl) == null ? void 0 : _b.call(_a15, this.config.baseURL, isStreaming)) != null ? _c : `${this.config.baseURL}/messages`;
  }
  transformRequestBody(args) {
    var _a15, _b, _c;
    return (_c = (_b = (_a15 = this.config).transformRequestBody) == null ? void 0 : _b.call(_a15, args)) != null ? _c : args;
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d;
      const { args, warnings, betas } = yield this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: this.buildRequestUrl(false),
        headers: yield this.getHeaders({ betas, headers: options.headers }),
        body: this.transformRequestBody(args),
        failedResponseHandler: anthropicFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          anthropicMessagesResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a16 = args, { messages: rawPrompt } = _a16, rawSettings = __objRest(_a16, ["messages"]);
      let text = "";
      for (const content of response.content) {
        if (content.type === "text") {
          text += content.text;
        }
      }
      let toolCalls = void 0;
      if (response.content.some((content) => content.type === "tool_use")) {
        toolCalls = [];
        for (const content of response.content) {
          if (content.type === "tool_use") {
            toolCalls.push({
              toolCallType: "function",
              toolCallId: content.id,
              toolName: content.name,
              args: JSON.stringify(content.input)
            });
          }
        }
      }
      const reasoning = response.content.filter(
        (content) => content.type === "redacted_thinking" || content.type === "thinking"
      ).map(
        (content) => content.type === "thinking" ? {
          type: "text",
          text: content.thinking,
          signature: content.signature
        } : {
          type: "redacted",
          data: content.data
        }
      );
      return {
        text,
        reasoning: reasoning.length > 0 ? reasoning : void 0,
        toolCalls,
        finishReason: mapAnthropicStopReason(response.stop_reason),
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: {
          headers: responseHeaders,
          body: rawResponse
        },
        response: {
          id: (_a15 = response.id) != null ? _a15 : void 0,
          modelId: (_b = response.model) != null ? _b : void 0
        },
        warnings,
        providerMetadata: {
          anthropic: {
            cacheCreationInputTokens: (_c = response.usage.cache_creation_input_tokens) != null ? _c : null,
            cacheReadInputTokens: (_d = response.usage.cache_read_input_tokens) != null ? _d : null
          }
        },
        request: { body: JSON.stringify(args) }
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      const { args, warnings, betas } = yield this.getArgs(options);
      const body = __spreadProps(__spreadValues({}, args), { stream: true });
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.buildRequestUrl(true),
        headers: yield this.getHeaders({ betas, headers: options.headers }),
        body: this.transformRequestBody(body),
        failedResponseHandler: anthropicFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          anthropicMessagesChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { messages: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["messages"]);
      let finishReason = "unknown";
      const usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      const toolCallContentBlocks = {};
      let providerMetadata = void 0;
      let blockType = void 0;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a16, _b, _c, _d;
              if (!chunk.success) {
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              switch (value.type) {
                case "ping": {
                  return;
                }
                case "content_block_start": {
                  const contentBlockType = value.content_block.type;
                  blockType = contentBlockType;
                  switch (contentBlockType) {
                    case "text":
                    case "thinking": {
                      return;
                    }
                    case "redacted_thinking": {
                      controller.enqueue({
                        type: "redacted-reasoning",
                        data: value.content_block.data
                      });
                      return;
                    }
                    case "tool_use": {
                      toolCallContentBlocks[value.index] = {
                        toolCallId: value.content_block.id,
                        toolName: value.content_block.name,
                        jsonText: ""
                      };
                      return;
                    }
                    default: {
                      const _exhaustiveCheck = contentBlockType;
                      throw new Error(
                        `Unsupported content block type: ${_exhaustiveCheck}`
                      );
                    }
                  }
                }
                case "content_block_stop": {
                  if (toolCallContentBlocks[value.index] != null) {
                    const contentBlock = toolCallContentBlocks[value.index];
                    controller.enqueue({
                      type: "tool-call",
                      toolCallType: "function",
                      toolCallId: contentBlock.toolCallId,
                      toolName: contentBlock.toolName,
                      args: contentBlock.jsonText
                    });
                    delete toolCallContentBlocks[value.index];
                  }
                  blockType = void 0;
                  return;
                }
                case "content_block_delta": {
                  const deltaType = value.delta.type;
                  switch (deltaType) {
                    case "text_delta": {
                      controller.enqueue({
                        type: "text-delta",
                        textDelta: value.delta.text
                      });
                      return;
                    }
                    case "thinking_delta": {
                      controller.enqueue({
                        type: "reasoning",
                        textDelta: value.delta.thinking
                      });
                      return;
                    }
                    case "signature_delta": {
                      if (blockType === "thinking") {
                        controller.enqueue({
                          type: "reasoning-signature",
                          signature: value.delta.signature
                        });
                      }
                      return;
                    }
                    case "input_json_delta": {
                      const contentBlock = toolCallContentBlocks[value.index];
                      controller.enqueue({
                        type: "tool-call-delta",
                        toolCallType: "function",
                        toolCallId: contentBlock.toolCallId,
                        toolName: contentBlock.toolName,
                        argsTextDelta: value.delta.partial_json
                      });
                      contentBlock.jsonText += value.delta.partial_json;
                      return;
                    }
                    default: {
                      const _exhaustiveCheck = deltaType;
                      throw new Error(
                        `Unsupported delta type: ${_exhaustiveCheck}`
                      );
                    }
                  }
                }
                case "message_start": {
                  usage.promptTokens = value.message.usage.input_tokens;
                  usage.completionTokens = value.message.usage.output_tokens;
                  providerMetadata = {
                    anthropic: {
                      cacheCreationInputTokens: (_a16 = value.message.usage.cache_creation_input_tokens) != null ? _a16 : null,
                      cacheReadInputTokens: (_b = value.message.usage.cache_read_input_tokens) != null ? _b : null
                    }
                  };
                  controller.enqueue({
                    type: "response-metadata",
                    id: (_c = value.message.id) != null ? _c : void 0,
                    modelId: (_d = value.message.model) != null ? _d : void 0
                  });
                  return;
                }
                case "message_delta": {
                  usage.completionTokens = value.usage.output_tokens;
                  finishReason = mapAnthropicStopReason(value.delta.stop_reason);
                  return;
                }
                case "message_stop": {
                  controller.enqueue({
                    type: "finish",
                    finishReason,
                    usage,
                    providerMetadata
                  });
                  return;
                }
                case "error": {
                  controller.enqueue({ type: "error", error: value.error });
                  return;
                }
                default: {
                  const _exhaustiveCheck = value;
                  throw new Error(`Unsupported chunk type: ${_exhaustiveCheck}`);
                }
              }
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        warnings,
        request: { body: JSON.stringify(body) }
      };
    });
  }
};
var anthropicMessagesResponseSchema = import_zod11.z.object({
  type: import_zod11.z.literal("message"),
  id: import_zod11.z.string().nullish(),
  model: import_zod11.z.string().nullish(),
  content: import_zod11.z.array(
    import_zod11.z.discriminatedUnion("type", [
      import_zod11.z.object({
        type: import_zod11.z.literal("text"),
        text: import_zod11.z.string()
      }),
      import_zod11.z.object({
        type: import_zod11.z.literal("thinking"),
        thinking: import_zod11.z.string(),
        signature: import_zod11.z.string()
      }),
      import_zod11.z.object({
        type: import_zod11.z.literal("redacted_thinking"),
        data: import_zod11.z.string()
      }),
      import_zod11.z.object({
        type: import_zod11.z.literal("tool_use"),
        id: import_zod11.z.string(),
        name: import_zod11.z.string(),
        input: import_zod11.z.unknown()
      })
    ])
  ),
  stop_reason: import_zod11.z.string().nullish(),
  usage: import_zod11.z.object({
    input_tokens: import_zod11.z.number(),
    output_tokens: import_zod11.z.number(),
    cache_creation_input_tokens: import_zod11.z.number().nullish(),
    cache_read_input_tokens: import_zod11.z.number().nullish()
  })
});
var anthropicMessagesChunkSchema = import_zod11.z.discriminatedUnion("type", [
  import_zod11.z.object({
    type: import_zod11.z.literal("message_start"),
    message: import_zod11.z.object({
      id: import_zod11.z.string().nullish(),
      model: import_zod11.z.string().nullish(),
      usage: import_zod11.z.object({
        input_tokens: import_zod11.z.number(),
        output_tokens: import_zod11.z.number(),
        cache_creation_input_tokens: import_zod11.z.number().nullish(),
        cache_read_input_tokens: import_zod11.z.number().nullish()
      })
    })
  }),
  import_zod11.z.object({
    type: import_zod11.z.literal("content_block_start"),
    index: import_zod11.z.number(),
    content_block: import_zod11.z.discriminatedUnion("type", [
      import_zod11.z.object({
        type: import_zod11.z.literal("text"),
        text: import_zod11.z.string()
      }),
      import_zod11.z.object({
        type: import_zod11.z.literal("thinking"),
        thinking: import_zod11.z.string()
      }),
      import_zod11.z.object({
        type: import_zod11.z.literal("tool_use"),
        id: import_zod11.z.string(),
        name: import_zod11.z.string()
      }),
      import_zod11.z.object({
        type: import_zod11.z.literal("redacted_thinking"),
        data: import_zod11.z.string()
      })
    ])
  }),
  import_zod11.z.object({
    type: import_zod11.z.literal("content_block_delta"),
    index: import_zod11.z.number(),
    delta: import_zod11.z.discriminatedUnion("type", [
      import_zod11.z.object({
        type: import_zod11.z.literal("input_json_delta"),
        partial_json: import_zod11.z.string()
      }),
      import_zod11.z.object({
        type: import_zod11.z.literal("text_delta"),
        text: import_zod11.z.string()
      }),
      import_zod11.z.object({
        type: import_zod11.z.literal("thinking_delta"),
        thinking: import_zod11.z.string()
      }),
      import_zod11.z.object({
        type: import_zod11.z.literal("signature_delta"),
        signature: import_zod11.z.string()
      })
    ])
  }),
  import_zod11.z.object({
    type: import_zod11.z.literal("content_block_stop"),
    index: import_zod11.z.number()
  }),
  import_zod11.z.object({
    type: import_zod11.z.literal("error"),
    error: import_zod11.z.object({
      type: import_zod11.z.string(),
      message: import_zod11.z.string()
    })
  }),
  import_zod11.z.object({
    type: import_zod11.z.literal("message_delta"),
    delta: import_zod11.z.object({ stop_reason: import_zod11.z.string().nullish() }),
    usage: import_zod11.z.object({ output_tokens: import_zod11.z.number() })
  }),
  import_zod11.z.object({
    type: import_zod11.z.literal("message_stop")
  }),
  import_zod11.z.object({
    type: import_zod11.z.literal("ping")
  })
]);
var anthropicProviderOptionsSchema = import_zod11.z.object({
  thinking: import_zod11.z.object({
    type: import_zod11.z.union([import_zod11.z.literal("enabled"), import_zod11.z.literal("disabled")]),
    budgetTokens: import_zod11.z.number().optional()
  }).optional()
});
var Bash20241022Parameters = import_zod13.z.object({
  command: import_zod13.z.string(),
  restart: import_zod13.z.boolean().optional()
});
function bashTool_20241022(options = {}) {
  return {
    type: "provider-defined",
    id: "anthropic.bash_20241022",
    args: {},
    parameters: Bash20241022Parameters,
    execute: options.execute,
    experimental_toToolResultContent: options.experimental_toToolResultContent
  };
}
var Bash20250124Parameters = import_zod13.z.object({
  command: import_zod13.z.string(),
  restart: import_zod13.z.boolean().optional()
});
function bashTool_20250124(options = {}) {
  return {
    type: "provider-defined",
    id: "anthropic.bash_20250124",
    args: {},
    parameters: Bash20250124Parameters,
    execute: options.execute,
    experimental_toToolResultContent: options.experimental_toToolResultContent
  };
}
var TextEditor20241022Parameters = import_zod13.z.object({
  command: import_zod13.z.enum(["view", "create", "str_replace", "insert", "undo_edit"]),
  path: import_zod13.z.string(),
  file_text: import_zod13.z.string().optional(),
  insert_line: import_zod13.z.number().int().optional(),
  new_str: import_zod13.z.string().optional(),
  old_str: import_zod13.z.string().optional(),
  view_range: import_zod13.z.array(import_zod13.z.number().int()).optional()
});
function textEditorTool_20241022(options = {}) {
  return {
    type: "provider-defined",
    id: "anthropic.text_editor_20241022",
    args: {},
    parameters: TextEditor20241022Parameters,
    execute: options.execute,
    experimental_toToolResultContent: options.experimental_toToolResultContent
  };
}
var TextEditor20250124Parameters = import_zod13.z.object({
  command: import_zod13.z.enum(["view", "create", "str_replace", "insert", "undo_edit"]),
  path: import_zod13.z.string(),
  file_text: import_zod13.z.string().optional(),
  insert_line: import_zod13.z.number().int().optional(),
  new_str: import_zod13.z.string().optional(),
  old_str: import_zod13.z.string().optional(),
  view_range: import_zod13.z.array(import_zod13.z.number().int()).optional()
});
function textEditorTool_20250124(options = {}) {
  return {
    type: "provider-defined",
    id: "anthropic.text_editor_20250124",
    args: {},
    parameters: TextEditor20250124Parameters,
    execute: options.execute,
    experimental_toToolResultContent: options.experimental_toToolResultContent
  };
}
var Computer20241022Parameters = import_zod13.z.object({
  action: import_zod13.z.enum([
    "key",
    "type",
    "mouse_move",
    "left_click",
    "left_click_drag",
    "right_click",
    "middle_click",
    "double_click",
    "screenshot",
    "cursor_position"
  ]),
  coordinate: import_zod13.z.array(import_zod13.z.number().int()).optional(),
  text: import_zod13.z.string().optional()
});
function computerTool_20241022(options) {
  return {
    type: "provider-defined",
    id: "anthropic.computer_20241022",
    args: {
      displayWidthPx: options.displayWidthPx,
      displayHeightPx: options.displayHeightPx,
      displayNumber: options.displayNumber
    },
    parameters: Computer20241022Parameters,
    execute: options.execute,
    experimental_toToolResultContent: options.experimental_toToolResultContent
  };
}
var Computer20250124Parameters = import_zod13.z.object({
  action: import_zod13.z.enum([
    "key",
    "hold_key",
    "type",
    "cursor_position",
    "mouse_move",
    "left_mouse_down",
    "left_mouse_up",
    "left_click",
    "left_click_drag",
    "right_click",
    "middle_click",
    "double_click",
    "triple_click",
    "scroll",
    "wait",
    "screenshot"
  ]),
  coordinate: import_zod13.z.tuple([import_zod13.z.number().int(), import_zod13.z.number().int()]).optional(),
  duration: import_zod13.z.number().optional(),
  scroll_amount: import_zod13.z.number().optional(),
  scroll_direction: import_zod13.z.enum(["up", "down", "left", "right"]).optional(),
  start_coordinate: import_zod13.z.tuple([import_zod13.z.number().int(), import_zod13.z.number().int()]).optional(),
  text: import_zod13.z.string().optional()
});
function computerTool_20250124(options) {
  return {
    type: "provider-defined",
    id: "anthropic.computer_20250124",
    args: {
      displayWidthPx: options.displayWidthPx,
      displayHeightPx: options.displayHeightPx,
      displayNumber: options.displayNumber
    },
    parameters: Computer20250124Parameters,
    execute: options.execute,
    experimental_toToolResultContent: options.experimental_toToolResultContent
  };
}
var anthropicTools = {
  bash_20241022: bashTool_20241022,
  bash_20250124: bashTool_20250124,
  textEditor_20241022: textEditorTool_20241022,
  textEditor_20250124: textEditorTool_20250124,
  computer_20241022: computerTool_20241022,
  computer_20250124: computerTool_20250124
};
function createAnthropic(options = {}) {
  var _a15;
  const baseURL = (_a15 = withoutTrailingSlash(options.baseURL)) != null ? _a15 : "https://api.anthropic.com/v1";
  const getHeaders = () => __spreadValues({
    "anthropic-version": "2023-06-01",
    "x-api-key": loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "ANTHROPIC_API_KEY",
      description: "Anthropic"
    })
  }, options.headers);
  const createChatModel = (modelId, settings = {}) => new AnthropicMessagesLanguageModel(modelId, settings, {
    provider: "anthropic.messages",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch,
    supportsImageUrls: true
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Anthropic model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.messages = createChatModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
  };
  provider.tools = anthropicTools;
  return provider;
}
var anthropic = createAnthropic();

// node_modules/.pnpm/@ai-sdk+google@1.2.14_zod@3.25.67/node_modules/@ai-sdk/google/dist/index.mjs
var import_zod14 = require("zod");
var import_zod15 = require("zod");
var import_zod16 = require("zod");
function convertJSONSchemaToOpenAPISchema(jsonSchema) {
  if (isEmptyObjectSchema(jsonSchema)) {
    return void 0;
  }
  if (typeof jsonSchema === "boolean") {
    return { type: "boolean", properties: {} };
  }
  const {
    type,
    description,
    required,
    properties,
    items,
    allOf,
    anyOf,
    oneOf,
    format,
    const: constValue,
    minLength,
    enum: enumValues
  } = jsonSchema;
  const result = {};
  if (description)
    result.description = description;
  if (required)
    result.required = required;
  if (format)
    result.format = format;
  if (constValue !== void 0) {
    result.enum = [constValue];
  }
  if (type) {
    if (Array.isArray(type)) {
      if (type.includes("null")) {
        result.type = type.filter((t) => t !== "null")[0];
        result.nullable = true;
      } else {
        result.type = type;
      }
    } else if (type === "null") {
      result.type = "null";
    } else {
      result.type = type;
    }
  }
  if (enumValues !== void 0) {
    result.enum = enumValues;
  }
  if (properties != null) {
    result.properties = Object.entries(properties).reduce(
      (acc, [key, value]) => {
        acc[key] = convertJSONSchemaToOpenAPISchema(value);
        return acc;
      },
      {}
    );
  }
  if (items) {
    result.items = Array.isArray(items) ? items.map(convertJSONSchemaToOpenAPISchema) : convertJSONSchemaToOpenAPISchema(items);
  }
  if (allOf) {
    result.allOf = allOf.map(convertJSONSchemaToOpenAPISchema);
  }
  if (anyOf) {
    if (anyOf.some(
      (schema) => typeof schema === "object" && (schema == null ? void 0 : schema.type) === "null"
    )) {
      const nonNullSchemas = anyOf.filter(
        (schema) => !(typeof schema === "object" && (schema == null ? void 0 : schema.type) === "null")
      );
      if (nonNullSchemas.length === 1) {
        const converted = convertJSONSchemaToOpenAPISchema(nonNullSchemas[0]);
        if (typeof converted === "object") {
          result.nullable = true;
          Object.assign(result, converted);
        }
      } else {
        result.anyOf = nonNullSchemas.map(convertJSONSchemaToOpenAPISchema);
        result.nullable = true;
      }
    } else {
      result.anyOf = anyOf.map(convertJSONSchemaToOpenAPISchema);
    }
  }
  if (oneOf) {
    result.oneOf = oneOf.map(convertJSONSchemaToOpenAPISchema);
  }
  if (minLength !== void 0) {
    result.minLength = minLength;
  }
  return result;
}
function isEmptyObjectSchema(jsonSchema) {
  return jsonSchema != null && typeof jsonSchema === "object" && jsonSchema.type === "object" && (jsonSchema.properties == null || Object.keys(jsonSchema.properties).length === 0);
}
function convertToGoogleGenerativeAIMessages(prompt) {
  var _a15, _b;
  const systemInstructionParts = [];
  const contents = [];
  let systemMessagesAllowed = true;
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        if (!systemMessagesAllowed) {
          throw new UnsupportedFunctionalityError({
            functionality: "system messages are only supported at the beginning of the conversation"
          });
        }
        systemInstructionParts.push({ text: content });
        break;
      }
      case "user": {
        systemMessagesAllowed = false;
        const parts = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              parts.push({ text: part.text });
              break;
            }
            case "image": {
              parts.push(
                part.image instanceof URL ? {
                  fileData: {
                    mimeType: (_a15 = part.mimeType) != null ? _a15 : "image/jpeg",
                    fileUri: part.image.toString()
                  }
                } : {
                  inlineData: {
                    mimeType: (_b = part.mimeType) != null ? _b : "image/jpeg",
                    data: convertUint8ArrayToBase64(part.image)
                  }
                }
              );
              break;
            }
            case "file": {
              parts.push(
                part.data instanceof URL ? {
                  fileData: {
                    mimeType: part.mimeType,
                    fileUri: part.data.toString()
                  }
                } : {
                  inlineData: {
                    mimeType: part.mimeType,
                    data: part.data
                  }
                }
              );
              break;
            }
          }
        }
        contents.push({ role: "user", parts });
        break;
      }
      case "assistant": {
        systemMessagesAllowed = false;
        contents.push({
          role: "model",
          parts: content.map((part) => {
            switch (part.type) {
              case "text": {
                return part.text.length === 0 ? void 0 : { text: part.text };
              }
              case "file": {
                if (part.mimeType !== "image/png") {
                  throw new UnsupportedFunctionalityError({
                    functionality: "Only PNG images are supported in assistant messages"
                  });
                }
                if (part.data instanceof URL) {
                  throw new UnsupportedFunctionalityError({
                    functionality: "File data URLs in assistant messages are not supported"
                  });
                }
                return {
                  inlineData: {
                    mimeType: part.mimeType,
                    data: part.data
                  }
                };
              }
              case "tool-call": {
                return {
                  functionCall: {
                    name: part.toolName,
                    args: part.args
                  }
                };
              }
            }
          }).filter((part) => part !== void 0)
        });
        break;
      }
      case "tool": {
        systemMessagesAllowed = false;
        contents.push({
          role: "user",
          parts: content.map((part) => ({
            functionResponse: {
              name: part.toolName,
              response: {
                name: part.toolName,
                content: part.result
              }
            }
          }))
        });
        break;
      }
    }
  }
  return {
    systemInstruction: systemInstructionParts.length > 0 ? { parts: systemInstructionParts } : void 0,
    contents
  };
}
function getModelPath(modelId) {
  return modelId.includes("/") ? modelId : `models/${modelId}`;
}
var googleErrorDataSchema = import_zod15.z.object({
  error: import_zod15.z.object({
    code: import_zod15.z.number().nullable(),
    message: import_zod15.z.string(),
    status: import_zod15.z.string()
  })
});
var googleFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: googleErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
function prepareTools3(mode, useSearchGrounding, dynamicRetrievalConfig, modelId) {
  var _a15, _b;
  const tools = ((_a15 = mode.tools) == null ? void 0 : _a15.length) ? mode.tools : void 0;
  const toolWarnings = [];
  const isGemini2 = modelId.includes("gemini-2");
  const supportsDynamicRetrieval = modelId.includes("gemini-1.5-flash") && !modelId.includes("-8b");
  if (useSearchGrounding) {
    return {
      tools: isGemini2 ? { googleSearch: {} } : {
        googleSearchRetrieval: !supportsDynamicRetrieval || !dynamicRetrievalConfig ? {} : { dynamicRetrievalConfig }
      },
      toolConfig: void 0,
      toolWarnings
    };
  }
  if (tools == null) {
    return { tools: void 0, toolConfig: void 0, toolWarnings };
  }
  const functionDeclarations = [];
  for (const tool of tools) {
    if (tool.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool });
    } else {
      functionDeclarations.push({
        name: tool.name,
        description: (_b = tool.description) != null ? _b : "",
        parameters: convertJSONSchemaToOpenAPISchema(tool.parameters)
      });
    }
  }
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return {
      tools: { functionDeclarations },
      toolConfig: void 0,
      toolWarnings
    };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
      return {
        tools: { functionDeclarations },
        toolConfig: { functionCallingConfig: { mode: "AUTO" } },
        toolWarnings
      };
    case "none":
      return {
        tools: { functionDeclarations },
        toolConfig: { functionCallingConfig: { mode: "NONE" } },
        toolWarnings
      };
    case "required":
      return {
        tools: { functionDeclarations },
        toolConfig: { functionCallingConfig: { mode: "ANY" } },
        toolWarnings
      };
    case "tool":
      return {
        tools: { functionDeclarations },
        toolConfig: {
          functionCallingConfig: {
            mode: "ANY",
            allowedFunctionNames: [toolChoice.toolName]
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
function mapGoogleGenerativeAIFinishReason({
  finishReason,
  hasToolCalls
}) {
  switch (finishReason) {
    case "STOP":
      return hasToolCalls ? "tool-calls" : "stop";
    case "MAX_TOKENS":
      return "length";
    case "IMAGE_SAFETY":
    case "RECITATION":
    case "SAFETY":
    case "BLOCKLIST":
    case "PROHIBITED_CONTENT":
    case "SPII":
      return "content-filter";
    case "FINISH_REASON_UNSPECIFIED":
    case "OTHER":
      return "other";
    case "MALFORMED_FUNCTION_CALL":
      return "error";
    default:
      return "unknown";
  }
}
var GoogleGenerativeAILanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "json";
    this.supportsImageUrls = false;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get supportsStructuredOutputs() {
    var _a15;
    return (_a15 = this.settings.structuredOutputs) != null ? _a15 : true;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs(_0) {
    return __async(this, arguments, function* ({
      mode,
      prompt,
      maxTokens,
      temperature,
      topP,
      topK,
      frequencyPenalty,
      presencePenalty,
      stopSequences,
      responseFormat,
      seed,
      providerMetadata
    }) {
      var _a15, _b;
      const type = mode.type;
      const warnings = [];
      const googleOptions = parseProviderOptions({
        provider: "google",
        providerOptions: providerMetadata,
        schema: googleGenerativeAIProviderOptionsSchema
      });
      const generationConfig = __spreadProps(__spreadValues({
        // standardized settings:
        maxOutputTokens: maxTokens,
        temperature,
        topK,
        topP,
        frequencyPenalty,
        presencePenalty,
        stopSequences,
        seed,
        // response format:
        responseMimeType: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? "application/json" : void 0,
        responseSchema: (responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && // Google GenAI does not support all OpenAPI Schema features,
        // so this is needed as an escape hatch:
        this.supportsStructuredOutputs ? convertJSONSchemaToOpenAPISchema(responseFormat.schema) : void 0
      }, this.settings.audioTimestamp && {
        audioTimestamp: this.settings.audioTimestamp
      }), {
        // provider options:
        responseModalities: googleOptions == null ? void 0 : googleOptions.responseModalities,
        thinkingConfig: googleOptions == null ? void 0 : googleOptions.thinkingConfig
      });
      const { contents, systemInstruction } = convertToGoogleGenerativeAIMessages(prompt);
      switch (type) {
        case "regular": {
          const { tools, toolConfig, toolWarnings } = prepareTools3(
            mode,
            (_a15 = this.settings.useSearchGrounding) != null ? _a15 : false,
            this.settings.dynamicRetrievalConfig,
            this.modelId
          );
          return {
            args: {
              generationConfig,
              contents,
              systemInstruction,
              safetySettings: this.settings.safetySettings,
              tools,
              toolConfig,
              cachedContent: this.settings.cachedContent
            },
            warnings: [...warnings, ...toolWarnings]
          };
        }
        case "object-json": {
          return {
            args: {
              generationConfig: __spreadProps(__spreadValues({}, generationConfig), {
                responseMimeType: "application/json",
                responseSchema: mode.schema != null && // Google GenAI does not support all OpenAPI Schema features,
                // so this is needed as an escape hatch:
                this.supportsStructuredOutputs ? convertJSONSchemaToOpenAPISchema(mode.schema) : void 0
              }),
              contents,
              systemInstruction,
              safetySettings: this.settings.safetySettings,
              cachedContent: this.settings.cachedContent
            },
            warnings
          };
        }
        case "object-tool": {
          return {
            args: {
              generationConfig,
              contents,
              tools: {
                functionDeclarations: [
                  {
                    name: mode.tool.name,
                    description: (_b = mode.tool.description) != null ? _b : "",
                    parameters: convertJSONSchemaToOpenAPISchema(
                      mode.tool.parameters
                    )
                  }
                ]
              },
              toolConfig: { functionCallingConfig: { mode: "ANY" } },
              safetySettings: this.settings.safetySettings,
              cachedContent: this.settings.cachedContent
            },
            warnings
          };
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    });
  }
  supportsUrl(url) {
    return this.config.isSupportedUrl(url);
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d, _e;
      const { args, warnings } = yield this.getArgs(options);
      const body = JSON.stringify(args);
      const mergedHeaders = combineHeaders(
        yield resolve(this.config.headers),
        options.headers
      );
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: `${this.config.baseURL}/${getModelPath(
          this.modelId
        )}:generateContent`,
        headers: mergedHeaders,
        body: args,
        failedResponseHandler: googleFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(responseSchema),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a16 = args, { contents: rawPrompt } = _a16, rawSettings = __objRest(_a16, ["contents"]);
      const candidate = response.candidates[0];
      const parts = candidate.content == null || typeof candidate.content !== "object" || !("parts" in candidate.content) ? [] : candidate.content.parts;
      const toolCalls = getToolCallsFromParts({
        parts,
        generateId: this.config.generateId
      });
      const usageMetadata = response.usageMetadata;
      return {
        text: getTextFromParts(parts),
        files: (_a15 = getInlineDataParts(parts)) == null ? void 0 : _a15.map((part) => ({
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType
        })),
        toolCalls,
        finishReason: mapGoogleGenerativeAIFinishReason({
          finishReason: candidate.finishReason,
          hasToolCalls: toolCalls != null && toolCalls.length > 0
        }),
        usage: {
          promptTokens: (_b = usageMetadata == null ? void 0 : usageMetadata.promptTokenCount) != null ? _b : NaN,
          completionTokens: (_c = usageMetadata == null ? void 0 : usageMetadata.candidatesTokenCount) != null ? _c : NaN
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        warnings,
        providerMetadata: {
          google: {
            groundingMetadata: (_d = candidate.groundingMetadata) != null ? _d : null,
            safetyRatings: (_e = candidate.safetyRatings) != null ? _e : null
          }
        },
        sources: extractSources({
          groundingMetadata: candidate.groundingMetadata,
          generateId: this.config.generateId
        }),
        request: { body }
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      const { args, warnings } = yield this.getArgs(options);
      const body = JSON.stringify(args);
      const headers = combineHeaders(
        yield resolve(this.config.headers),
        options.headers
      );
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: `${this.config.baseURL}/${getModelPath(
          this.modelId
        )}:streamGenerateContent?alt=sse`,
        headers,
        body: args,
        failedResponseHandler: googleFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(chunkSchema),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { contents: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["contents"]);
      let finishReason = "unknown";
      let usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      let providerMetadata = void 0;
      const generateId2 = this.config.generateId;
      let hasToolCalls = false;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a16, _b, _c, _d, _e, _f;
              if (!chunk.success) {
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              const usageMetadata = value.usageMetadata;
              if (usageMetadata != null) {
                usage = {
                  promptTokens: (_a16 = usageMetadata.promptTokenCount) != null ? _a16 : NaN,
                  completionTokens: (_b = usageMetadata.candidatesTokenCount) != null ? _b : NaN
                };
              }
              const candidate = (_c = value.candidates) == null ? void 0 : _c[0];
              if (candidate == null) {
                return;
              }
              const content = candidate.content;
              if (content != null) {
                const deltaText = getTextFromParts(content.parts);
                if (deltaText != null) {
                  controller.enqueue({
                    type: "text-delta",
                    textDelta: deltaText
                  });
                }
                const inlineDataParts = getInlineDataParts(content.parts);
                if (inlineDataParts != null) {
                  for (const part of inlineDataParts) {
                    controller.enqueue({
                      type: "file",
                      mimeType: part.inlineData.mimeType,
                      data: part.inlineData.data
                    });
                  }
                }
                const toolCallDeltas = getToolCallsFromParts({
                  parts: content.parts,
                  generateId: generateId2
                });
                if (toolCallDeltas != null) {
                  for (const toolCall of toolCallDeltas) {
                    controller.enqueue({
                      type: "tool-call-delta",
                      toolCallType: "function",
                      toolCallId: toolCall.toolCallId,
                      toolName: toolCall.toolName,
                      argsTextDelta: toolCall.args
                    });
                    controller.enqueue({
                      type: "tool-call",
                      toolCallType: "function",
                      toolCallId: toolCall.toolCallId,
                      toolName: toolCall.toolName,
                      args: toolCall.args
                    });
                    hasToolCalls = true;
                  }
                }
              }
              if (candidate.finishReason != null) {
                finishReason = mapGoogleGenerativeAIFinishReason({
                  finishReason: candidate.finishReason,
                  hasToolCalls
                });
                const sources = (_d = extractSources({
                  groundingMetadata: candidate.groundingMetadata,
                  generateId: generateId2
                })) != null ? _d : [];
                for (const source of sources) {
                  controller.enqueue({ type: "source", source });
                }
                providerMetadata = {
                  google: {
                    groundingMetadata: (_e = candidate.groundingMetadata) != null ? _e : null,
                    safetyRatings: (_f = candidate.safetyRatings) != null ? _f : null
                  }
                };
              }
            },
            flush(controller) {
              controller.enqueue({
                type: "finish",
                finishReason,
                usage,
                providerMetadata
              });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        warnings,
        request: { body }
      };
    });
  }
};
function getToolCallsFromParts({
  parts,
  generateId: generateId2
}) {
  const functionCallParts = parts == null ? void 0 : parts.filter(
    (part) => "functionCall" in part
  );
  return functionCallParts == null || functionCallParts.length === 0 ? void 0 : functionCallParts.map((part) => ({
    toolCallType: "function",
    toolCallId: generateId2(),
    toolName: part.functionCall.name,
    args: JSON.stringify(part.functionCall.args)
  }));
}
function getTextFromParts(parts) {
  const textParts = parts == null ? void 0 : parts.filter((part) => "text" in part);
  return textParts == null || textParts.length === 0 ? void 0 : textParts.map((part) => part.text).join("");
}
function getInlineDataParts(parts) {
  return parts == null ? void 0 : parts.filter(
    (part) => "inlineData" in part
  );
}
function extractSources({
  groundingMetadata,
  generateId: generateId2
}) {
  var _a15;
  return (_a15 = groundingMetadata == null ? void 0 : groundingMetadata.groundingChunks) == null ? void 0 : _a15.filter(
    (chunk) => chunk.web != null
  ).map((chunk) => ({
    sourceType: "url",
    id: generateId2(),
    url: chunk.web.uri,
    title: chunk.web.title
  }));
}
var contentSchema = import_zod14.z.object({
  role: import_zod14.z.string(),
  parts: import_zod14.z.array(
    import_zod14.z.union([
      import_zod14.z.object({
        text: import_zod14.z.string()
      }),
      import_zod14.z.object({
        functionCall: import_zod14.z.object({
          name: import_zod14.z.string(),
          args: import_zod14.z.unknown()
        })
      }),
      import_zod14.z.object({
        inlineData: import_zod14.z.object({
          mimeType: import_zod14.z.string(),
          data: import_zod14.z.string()
        })
      })
    ])
  ).nullish()
});
var groundingChunkSchema = import_zod14.z.object({
  web: import_zod14.z.object({ uri: import_zod14.z.string(), title: import_zod14.z.string() }).nullish(),
  retrievedContext: import_zod14.z.object({ uri: import_zod14.z.string(), title: import_zod14.z.string() }).nullish()
});
var groundingMetadataSchema = import_zod14.z.object({
  webSearchQueries: import_zod14.z.array(import_zod14.z.string()).nullish(),
  retrievalQueries: import_zod14.z.array(import_zod14.z.string()).nullish(),
  searchEntryPoint: import_zod14.z.object({ renderedContent: import_zod14.z.string() }).nullish(),
  groundingChunks: import_zod14.z.array(groundingChunkSchema).nullish(),
  groundingSupports: import_zod14.z.array(
    import_zod14.z.object({
      segment: import_zod14.z.object({
        startIndex: import_zod14.z.number().nullish(),
        endIndex: import_zod14.z.number().nullish(),
        text: import_zod14.z.string().nullish()
      }),
      segment_text: import_zod14.z.string().nullish(),
      groundingChunkIndices: import_zod14.z.array(import_zod14.z.number()).nullish(),
      supportChunkIndices: import_zod14.z.array(import_zod14.z.number()).nullish(),
      confidenceScores: import_zod14.z.array(import_zod14.z.number()).nullish(),
      confidenceScore: import_zod14.z.array(import_zod14.z.number()).nullish()
    })
  ).nullish(),
  retrievalMetadata: import_zod14.z.union([
    import_zod14.z.object({
      webDynamicRetrievalScore: import_zod14.z.number()
    }),
    import_zod14.z.object({})
  ]).nullish()
});
var safetyRatingSchema = import_zod14.z.object({
  category: import_zod14.z.string(),
  probability: import_zod14.z.string(),
  probabilityScore: import_zod14.z.number().nullish(),
  severity: import_zod14.z.string().nullish(),
  severityScore: import_zod14.z.number().nullish(),
  blocked: import_zod14.z.boolean().nullish()
});
var responseSchema = import_zod14.z.object({
  candidates: import_zod14.z.array(
    import_zod14.z.object({
      content: contentSchema.nullish().or(import_zod14.z.object({}).strict()),
      finishReason: import_zod14.z.string().nullish(),
      safetyRatings: import_zod14.z.array(safetyRatingSchema).nullish(),
      groundingMetadata: groundingMetadataSchema.nullish()
    })
  ),
  usageMetadata: import_zod14.z.object({
    promptTokenCount: import_zod14.z.number().nullish(),
    candidatesTokenCount: import_zod14.z.number().nullish(),
    totalTokenCount: import_zod14.z.number().nullish()
  }).nullish()
});
var chunkSchema = import_zod14.z.object({
  candidates: import_zod14.z.array(
    import_zod14.z.object({
      content: contentSchema.nullish(),
      finishReason: import_zod14.z.string().nullish(),
      safetyRatings: import_zod14.z.array(safetyRatingSchema).nullish(),
      groundingMetadata: groundingMetadataSchema.nullish()
    })
  ).nullish(),
  usageMetadata: import_zod14.z.object({
    promptTokenCount: import_zod14.z.number().nullish(),
    candidatesTokenCount: import_zod14.z.number().nullish(),
    totalTokenCount: import_zod14.z.number().nullish()
  }).nullish()
});
var googleGenerativeAIProviderOptionsSchema = import_zod14.z.object({
  responseModalities: import_zod14.z.array(import_zod14.z.enum(["TEXT", "IMAGE"])).nullish(),
  thinkingConfig: import_zod14.z.object({
    thinkingBudget: import_zod14.z.number().nullish()
  }).nullish()
});
var GoogleGenerativeAIEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    return 2048;
  }
  get supportsParallelCalls() {
    return true;
  }
  doEmbed(_0) {
    return __async(this, arguments, function* ({
      values,
      headers,
      abortSignal
    }) {
      if (values.length > this.maxEmbeddingsPerCall) {
        throw new TooManyEmbeddingValuesForCallError({
          provider: this.provider,
          modelId: this.modelId,
          maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
          values
        });
      }
      const mergedHeaders = combineHeaders(
        yield resolve(this.config.headers),
        headers
      );
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: `${this.config.baseURL}/models/${this.modelId}:batchEmbedContents`,
        headers: mergedHeaders,
        body: {
          requests: values.map((value) => ({
            model: `models/${this.modelId}`,
            content: { role: "user", parts: [{ text: value }] },
            outputDimensionality: this.settings.outputDimensionality,
            taskType: this.settings.taskType
          }))
        },
        failedResponseHandler: googleFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          googleGenerativeAITextEmbeddingResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        embeddings: response.embeddings.map((item) => item.values),
        usage: void 0,
        rawResponse: { headers: responseHeaders }
      };
    });
  }
};
var googleGenerativeAITextEmbeddingResponseSchema = import_zod16.z.object({
  embeddings: import_zod16.z.array(import_zod16.z.object({ values: import_zod16.z.array(import_zod16.z.number()) }))
});
function isSupportedFileUrl(url) {
  return url.toString().startsWith("https://generativelanguage.googleapis.com/v1beta/files/");
}
function createGoogleGenerativeAI(options = {}) {
  var _a15;
  const baseURL = (_a15 = withoutTrailingSlash(options.baseURL)) != null ? _a15 : "https://generativelanguage.googleapis.com/v1beta";
  const getHeaders = () => __spreadValues({
    "x-goog-api-key": loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "GOOGLE_GENERATIVE_AI_API_KEY",
      description: "Google Generative AI"
    })
  }, options.headers);
  const createChatModel = (modelId, settings = {}) => {
    var _a22;
    return new GoogleGenerativeAILanguageModel(modelId, settings, {
      provider: "google.generative-ai",
      baseURL,
      headers: getHeaders,
      generateId: (_a22 = options.generateId) != null ? _a22 : generateId,
      isSupportedUrl: isSupportedFileUrl,
      fetch: options.fetch
    });
  };
  const createEmbeddingModel = (modelId, settings = {}) => new GoogleGenerativeAIEmbeddingModel(modelId, settings, {
    provider: "google.generative-ai",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Google Generative AI model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.generativeAI = createChatModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  return provider;
}
var google = createGoogleGenerativeAI();

// node_modules/.pnpm/@ai-sdk+openai-compatible@0.2.13_zod@3.25.67/node_modules/@ai-sdk/openai-compatible/dist/index.mjs
var import_zod17 = require("zod");
var import_zod18 = require("zod");
var import_zod19 = require("zod");
var import_zod20 = require("zod");
var import_zod21 = require("zod");
function getOpenAIMetadata(message) {
  var _a15, _b;
  return (_b = (_a15 = message == null ? void 0 : message.providerMetadata) == null ? void 0 : _a15.openaiCompatible) != null ? _b : {};
}
function convertToOpenAICompatibleChatMessages(prompt) {
  const messages = [];
  for (const _a15 of prompt) {
    const _b = _a15, { role, content } = _b, message = __objRest(_b, ["role", "content"]);
    const metadata = getOpenAIMetadata(__spreadValues({}, message));
    switch (role) {
      case "system": {
        messages.push(__spreadValues({ role: "system", content }, metadata));
        break;
      }
      case "user": {
        if (content.length === 1 && content[0].type === "text") {
          messages.push(__spreadValues({
            role: "user",
            content: content[0].text
          }, getOpenAIMetadata(content[0])));
          break;
        }
        messages.push(__spreadValues({
          role: "user",
          content: content.map((part) => {
            var _a16;
            const partMetadata = getOpenAIMetadata(part);
            switch (part.type) {
              case "text": {
                return __spreadValues({ type: "text", text: part.text }, partMetadata);
              }
              case "image": {
                return __spreadValues({
                  type: "image_url",
                  image_url: {
                    url: part.image instanceof URL ? part.image.toString() : `data:${(_a16 = part.mimeType) != null ? _a16 : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`
                  }
                }, partMetadata);
              }
              case "file": {
                throw new UnsupportedFunctionalityError({
                  functionality: "File content parts in user messages"
                });
              }
            }
          })
        }, metadata));
        break;
      }
      case "assistant": {
        let text = "";
        const toolCalls = [];
        for (const part of content) {
          const partMetadata = getOpenAIMetadata(part);
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push(__spreadValues({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                }
              }, partMetadata));
              break;
            }
          }
        }
        messages.push(__spreadValues({
          role: "assistant",
          content: text,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0
        }, metadata));
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          const toolResponseMetadata = getOpenAIMetadata(toolResponse);
          messages.push(__spreadValues({
            role: "tool",
            tool_call_id: toolResponse.toolCallId,
            content: JSON.stringify(toolResponse.result)
          }, toolResponseMetadata));
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}
function getResponseMetadata2({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}
function mapOpenAICompatibleFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var openaiCompatibleErrorDataSchema = import_zod18.z.object({
  error: import_zod18.z.object({
    message: import_zod18.z.string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: import_zod18.z.string().nullish(),
    param: import_zod18.z.any().nullish(),
    code: import_zod18.z.union([import_zod18.z.string(), import_zod18.z.number()]).nullish()
  })
});
var defaultOpenAICompatibleErrorStructure = {
  errorSchema: openaiCompatibleErrorDataSchema,
  errorToMessage: (data) => data.error.message
};
function prepareTools4({
  mode,
  structuredOutputs
}) {
  var _a15;
  const tools = ((_a15 = mode.tools) == null ? void 0 : _a15.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const toolChoice = mode.toolChoice;
  const openaiCompatTools = [];
  for (const tool of tools) {
    if (tool.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool });
    } else {
      openaiCompatTools.push({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        }
      });
    }
  }
  if (toolChoice == null) {
    return { tools: openaiCompatTools, tool_choice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiCompatTools, tool_choice: type, toolWarnings };
    case "tool":
      return {
        tools: openaiCompatTools,
        tool_choice: {
          type: "function",
          function: {
            name: toolChoice.toolName
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var OpenAICompatibleChatLanguageModel = class {
  // type inferred via constructor
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    var _a15, _b;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    const errorStructure = (_a15 = config.errorStructure) != null ? _a15 : defaultOpenAICompatibleErrorStructure;
    this.chunkSchema = createOpenAICompatibleChatChunkSchema(
      errorStructure.errorSchema
    );
    this.failedResponseHandler = createJsonErrorResponseHandler(errorStructure);
    this.supportsStructuredOutputs = (_b = config.supportsStructuredOutputs) != null ? _b : false;
  }
  get defaultObjectGenerationMode() {
    return this.config.defaultObjectGenerationMode;
  }
  get provider() {
    return this.config.provider;
  }
  get providerOptionsName() {
    return this.config.provider.split(".")[0].trim();
  }
  getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    providerMetadata,
    stopSequences,
    responseFormat,
    seed
  }) {
    var _a15, _b, _c, _d, _e;
    const type = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if ((responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && !this.supportsStructuredOutputs) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is only supported with structuredOutputs"
      });
    }
    const baseArgs = __spreadProps(__spreadValues({
      // model id:
      model: this.modelId,
      // model specific settings:
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? this.supportsStructuredOutputs === true && responseFormat.schema != null ? {
        type: "json_schema",
        json_schema: {
          schema: responseFormat.schema,
          name: (_a15 = responseFormat.name) != null ? _a15 : "response",
          description: responseFormat.description
        }
      } : { type: "json_object" } : void 0,
      stop: stopSequences,
      seed
    }, providerMetadata == null ? void 0 : providerMetadata[this.providerOptionsName]), {
      reasoning_effort: (_d = (_b = providerMetadata == null ? void 0 : providerMetadata[this.providerOptionsName]) == null ? void 0 : _b.reasoningEffort) != null ? _d : (_c = providerMetadata == null ? void 0 : providerMetadata["openai-compatible"]) == null ? void 0 : _c.reasoningEffort,
      // messages:
      messages: convertToOpenAICompatibleChatMessages(prompt)
    });
    switch (type) {
      case "regular": {
        const { tools, tool_choice, toolWarnings } = prepareTools4({
          mode,
          structuredOutputs: this.supportsStructuredOutputs
        });
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), { tools, tool_choice }),
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            response_format: this.supportsStructuredOutputs === true && mode.schema != null ? {
              type: "json_schema",
              json_schema: {
                schema: mode.schema,
                name: (_e = mode.name) != null ? _e : "response",
                description: mode.description
              }
            } : { type: "json_object" }
          }),
          warnings
        };
      }
      case "object-tool": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            tool_choice: {
              type: "function",
              function: { name: mode.tool.name }
            },
            tools: [
              {
                type: "function",
                function: {
                  name: mode.tool.name,
                  description: mode.tool.description,
                  parameters: mode.tool.parameters
                }
              }
            ]
          }),
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      const { args, warnings } = this.getArgs(__spreadValues({}, options));
      const body = JSON.stringify(args);
      const {
        responseHeaders,
        value: responseBody,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: args,
        failedResponseHandler: this.failedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          OpenAICompatibleChatResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a16 = args, { messages: rawPrompt } = _a16, rawSettings = __objRest(_a16, ["messages"]);
      const choice = responseBody.choices[0];
      const providerMetadata = __spreadValues({
        [this.providerOptionsName]: {}
      }, (_b = (_a15 = this.config.metadataExtractor) == null ? void 0 : _a15.extractMetadata) == null ? void 0 : _b.call(_a15, {
        parsedBody: rawResponse
      }));
      const completionTokenDetails = (_c = responseBody.usage) == null ? void 0 : _c.completion_tokens_details;
      const promptTokenDetails = (_d = responseBody.usage) == null ? void 0 : _d.prompt_tokens_details;
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens) != null) {
        providerMetadata[this.providerOptionsName].reasoningTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens;
      }
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens) != null) {
        providerMetadata[this.providerOptionsName].acceptedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens;
      }
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens) != null) {
        providerMetadata[this.providerOptionsName].rejectedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens;
      }
      if ((promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens) != null) {
        providerMetadata[this.providerOptionsName].cachedPromptTokens = promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens;
      }
      return {
        text: (_e = choice.message.content) != null ? _e : void 0,
        reasoning: (_f = choice.message.reasoning_content) != null ? _f : void 0,
        toolCalls: (_g = choice.message.tool_calls) == null ? void 0 : _g.map((toolCall) => {
          var _a22;
          return {
            toolCallType: "function",
            toolCallId: (_a22 = toolCall.id) != null ? _a22 : generateId(),
            toolName: toolCall.function.name,
            args: toolCall.function.arguments
          };
        }),
        finishReason: mapOpenAICompatibleFinishReason(choice.finish_reason),
        usage: {
          promptTokens: (_i = (_h = responseBody.usage) == null ? void 0 : _h.prompt_tokens) != null ? _i : NaN,
          completionTokens: (_k = (_j = responseBody.usage) == null ? void 0 : _j.completion_tokens) != null ? _k : NaN
        },
        providerMetadata,
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        response: getResponseMetadata2(responseBody),
        warnings,
        request: { body }
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      var _a15;
      if (this.settings.simulateStreaming) {
        const result = yield this.doGenerate(options);
        const simulatedStream = new ReadableStream({
          start(controller) {
            controller.enqueue(__spreadValues({ type: "response-metadata" }, result.response));
            if (result.reasoning) {
              if (Array.isArray(result.reasoning)) {
                for (const part of result.reasoning) {
                  if (part.type === "text") {
                    controller.enqueue({
                      type: "reasoning",
                      textDelta: part.text
                    });
                  }
                }
              } else {
                controller.enqueue({
                  type: "reasoning",
                  textDelta: result.reasoning
                });
              }
            }
            if (result.text) {
              controller.enqueue({
                type: "text-delta",
                textDelta: result.text
              });
            }
            if (result.toolCalls) {
              for (const toolCall of result.toolCalls) {
                controller.enqueue(__spreadValues({
                  type: "tool-call"
                }, toolCall));
              }
            }
            controller.enqueue({
              type: "finish",
              finishReason: result.finishReason,
              usage: result.usage,
              logprobs: result.logprobs,
              providerMetadata: result.providerMetadata
            });
            controller.close();
          }
        });
        return {
          stream: simulatedStream,
          rawCall: result.rawCall,
          rawResponse: result.rawResponse,
          warnings: result.warnings
        };
      }
      const { args, warnings } = this.getArgs(__spreadValues({}, options));
      const body = __spreadProps(__spreadValues({}, args), {
        stream: true,
        // only include stream_options when in strict compatibility mode:
        stream_options: this.config.includeUsage ? { include_usage: true } : void 0
      });
      const metadataExtractor = (_a15 = this.config.metadataExtractor) == null ? void 0 : _a15.createStreamExtractor();
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: this.failedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          this.chunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a16 = args, { messages: rawPrompt } = _a16, rawSettings = __objRest(_a16, ["messages"]);
      const toolCalls = [];
      let finishReason = "unknown";
      let usage = {
        completionTokens: void 0,
        completionTokensDetails: {
          reasoningTokens: void 0,
          acceptedPredictionTokens: void 0,
          rejectedPredictionTokens: void 0
        },
        promptTokens: void 0,
        promptTokensDetails: {
          cachedTokens: void 0
        }
      };
      let isFirstChunk = true;
      let providerOptionsName = this.providerOptionsName;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            // TODO we lost type safety on Chunk, most likely due to the error schema. MUST FIX
            transform(chunk, controller) {
              var _a22, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              metadataExtractor == null ? void 0 : metadataExtractor.processChunk(chunk.rawValue);
              if ("error" in value) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: value.error.message });
                return;
              }
              if (isFirstChunk) {
                isFirstChunk = false;
                controller.enqueue(__spreadValues({
                  type: "response-metadata"
                }, getResponseMetadata2(value)));
              }
              if (value.usage != null) {
                const {
                  prompt_tokens,
                  completion_tokens,
                  prompt_tokens_details,
                  completion_tokens_details
                } = value.usage;
                usage.promptTokens = prompt_tokens != null ? prompt_tokens : void 0;
                usage.completionTokens = completion_tokens != null ? completion_tokens : void 0;
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens) != null) {
                  usage.completionTokensDetails.reasoningTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens;
                }
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens) != null) {
                  usage.completionTokensDetails.acceptedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens;
                }
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens) != null) {
                  usage.completionTokensDetails.rejectedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens;
                }
                if ((prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens) != null) {
                  usage.promptTokensDetails.cachedTokens = prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens;
                }
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapOpenAICompatibleFinishReason(
                  choice.finish_reason
                );
              }
              if ((choice == null ? void 0 : choice.delta) == null) {
                return;
              }
              const delta = choice.delta;
              if (delta.reasoning_content != null) {
                controller.enqueue({
                  type: "reasoning",
                  textDelta: delta.reasoning_content
                });
              }
              if (delta.content != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: delta.content
                });
              }
              if (delta.tool_calls != null) {
                for (const toolCallDelta of delta.tool_calls) {
                  const index = toolCallDelta.index;
                  if (toolCalls[index] == null) {
                    if (toolCallDelta.type !== "function") {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function' type.`
                      });
                    }
                    if (toolCallDelta.id == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'id' to be a string.`
                      });
                    }
                    if (((_a22 = toolCallDelta.function) == null ? void 0 : _a22.name) == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function.name' to be a string.`
                      });
                    }
                    toolCalls[index] = {
                      id: toolCallDelta.id,
                      type: "function",
                      function: {
                        name: toolCallDelta.function.name,
                        arguments: (_b = toolCallDelta.function.arguments) != null ? _b : ""
                      },
                      hasFinished: false
                    };
                    const toolCall2 = toolCalls[index];
                    if (((_c = toolCall2.function) == null ? void 0 : _c.name) != null && ((_d = toolCall2.function) == null ? void 0 : _d.arguments) != null) {
                      if (toolCall2.function.arguments.length > 0) {
                        controller.enqueue({
                          type: "tool-call-delta",
                          toolCallType: "function",
                          toolCallId: toolCall2.id,
                          toolName: toolCall2.function.name,
                          argsTextDelta: toolCall2.function.arguments
                        });
                      }
                      if (isParsableJson(toolCall2.function.arguments)) {
                        controller.enqueue({
                          type: "tool-call",
                          toolCallType: "function",
                          toolCallId: (_e = toolCall2.id) != null ? _e : generateId(),
                          toolName: toolCall2.function.name,
                          args: toolCall2.function.arguments
                        });
                        toolCall2.hasFinished = true;
                      }
                    }
                    continue;
                  }
                  const toolCall = toolCalls[index];
                  if (toolCall.hasFinished) {
                    continue;
                  }
                  if (((_f = toolCallDelta.function) == null ? void 0 : _f.arguments) != null) {
                    toolCall.function.arguments += (_h = (_g = toolCallDelta.function) == null ? void 0 : _g.arguments) != null ? _h : "";
                  }
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    argsTextDelta: (_i = toolCallDelta.function.arguments) != null ? _i : ""
                  });
                  if (((_j = toolCall.function) == null ? void 0 : _j.name) != null && ((_k = toolCall.function) == null ? void 0 : _k.arguments) != null && isParsableJson(toolCall.function.arguments)) {
                    controller.enqueue({
                      type: "tool-call",
                      toolCallType: "function",
                      toolCallId: (_l = toolCall.id) != null ? _l : generateId(),
                      toolName: toolCall.function.name,
                      args: toolCall.function.arguments
                    });
                    toolCall.hasFinished = true;
                  }
                }
              }
            },
            flush(controller) {
              var _a22, _b;
              const providerMetadata = __spreadValues({
                [providerOptionsName]: {}
              }, metadataExtractor == null ? void 0 : metadataExtractor.buildMetadata());
              if (usage.completionTokensDetails.reasoningTokens != null) {
                providerMetadata[providerOptionsName].reasoningTokens = usage.completionTokensDetails.reasoningTokens;
              }
              if (usage.completionTokensDetails.acceptedPredictionTokens != null) {
                providerMetadata[providerOptionsName].acceptedPredictionTokens = usage.completionTokensDetails.acceptedPredictionTokens;
              }
              if (usage.completionTokensDetails.rejectedPredictionTokens != null) {
                providerMetadata[providerOptionsName].rejectedPredictionTokens = usage.completionTokensDetails.rejectedPredictionTokens;
              }
              if (usage.promptTokensDetails.cachedTokens != null) {
                providerMetadata[providerOptionsName].cachedPromptTokens = usage.promptTokensDetails.cachedTokens;
              }
              controller.enqueue({
                type: "finish",
                finishReason,
                usage: {
                  promptTokens: (_a22 = usage.promptTokens) != null ? _a22 : NaN,
                  completionTokens: (_b = usage.completionTokens) != null ? _b : NaN
                },
                providerMetadata
              });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        warnings,
        request: { body: JSON.stringify(body) }
      };
    });
  }
};
var openaiCompatibleTokenUsageSchema = import_zod17.z.object({
  prompt_tokens: import_zod17.z.number().nullish(),
  completion_tokens: import_zod17.z.number().nullish(),
  prompt_tokens_details: import_zod17.z.object({
    cached_tokens: import_zod17.z.number().nullish()
  }).nullish(),
  completion_tokens_details: import_zod17.z.object({
    reasoning_tokens: import_zod17.z.number().nullish(),
    accepted_prediction_tokens: import_zod17.z.number().nullish(),
    rejected_prediction_tokens: import_zod17.z.number().nullish()
  }).nullish()
}).nullish();
var OpenAICompatibleChatResponseSchema = import_zod17.z.object({
  id: import_zod17.z.string().nullish(),
  created: import_zod17.z.number().nullish(),
  model: import_zod17.z.string().nullish(),
  choices: import_zod17.z.array(
    import_zod17.z.object({
      message: import_zod17.z.object({
        role: import_zod17.z.literal("assistant").nullish(),
        content: import_zod17.z.string().nullish(),
        reasoning_content: import_zod17.z.string().nullish(),
        tool_calls: import_zod17.z.array(
          import_zod17.z.object({
            id: import_zod17.z.string().nullish(),
            type: import_zod17.z.literal("function"),
            function: import_zod17.z.object({
              name: import_zod17.z.string(),
              arguments: import_zod17.z.string()
            })
          })
        ).nullish()
      }),
      finish_reason: import_zod17.z.string().nullish()
    })
  ),
  usage: openaiCompatibleTokenUsageSchema
});
var createOpenAICompatibleChatChunkSchema = (errorSchema) => import_zod17.z.union([
  import_zod17.z.object({
    id: import_zod17.z.string().nullish(),
    created: import_zod17.z.number().nullish(),
    model: import_zod17.z.string().nullish(),
    choices: import_zod17.z.array(
      import_zod17.z.object({
        delta: import_zod17.z.object({
          role: import_zod17.z.enum(["assistant"]).nullish(),
          content: import_zod17.z.string().nullish(),
          reasoning_content: import_zod17.z.string().nullish(),
          tool_calls: import_zod17.z.array(
            import_zod17.z.object({
              index: import_zod17.z.number(),
              id: import_zod17.z.string().nullish(),
              type: import_zod17.z.literal("function").nullish(),
              function: import_zod17.z.object({
                name: import_zod17.z.string().nullish(),
                arguments: import_zod17.z.string().nullish()
              })
            })
          ).nullish()
        }).nullish(),
        finish_reason: import_zod17.z.string().nullish()
      })
    ),
    usage: openaiCompatibleTokenUsageSchema
  }),
  errorSchema
]);
function convertToOpenAICompatibleCompletionPrompt({
  prompt,
  inputFormat,
  user = "user",
  assistant = "assistant"
}) {
  if (inputFormat === "prompt" && prompt.length === 1 && prompt[0].role === "user" && prompt[0].content.length === 1 && prompt[0].content[0].type === "text") {
    return { prompt: prompt[0].content[0].text };
  }
  let text = "";
  if (prompt[0].role === "system") {
    text += `${prompt[0].content}

`;
    prompt = prompt.slice(1);
  }
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        throw new InvalidPromptError({
          message: "Unexpected system message in prompt: ${content}",
          prompt
        });
      }
      case "user": {
        const userMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "image": {
              throw new UnsupportedFunctionalityError({
                functionality: "images"
              });
            }
          }
        }).join("");
        text += `${user}:
${userMessage}

`;
        break;
      }
      case "assistant": {
        const assistantMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "tool-call": {
              throw new UnsupportedFunctionalityError({
                functionality: "tool-call messages"
              });
            }
          }
        }).join("");
        text += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case "tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "tool messages"
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  text += `${assistant}:
`;
  return {
    prompt: text,
    stopSequences: [`
${user}:`]
  };
}
var OpenAICompatibleCompletionLanguageModel = class {
  // type inferred via constructor
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = void 0;
    var _a15;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    const errorStructure = (_a15 = config.errorStructure) != null ? _a15 : defaultOpenAICompatibleErrorStructure;
    this.chunkSchema = createOpenAICompatibleCompletionChunkSchema(
      errorStructure.errorSchema
    );
    this.failedResponseHandler = createJsonErrorResponseHandler(errorStructure);
  }
  get provider() {
    return this.config.provider;
  }
  get providerOptionsName() {
    return this.config.provider.split(".")[0].trim();
  }
  getArgs({
    mode,
    inputFormat,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences: userStopSequences,
    responseFormat,
    seed,
    providerMetadata
  }) {
    var _a15;
    const type = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const { prompt: completionPrompt, stopSequences } = convertToOpenAICompatibleCompletionPrompt({ prompt, inputFormat });
    const stop = [...stopSequences != null ? stopSequences : [], ...userStopSequences != null ? userStopSequences : []];
    const baseArgs = __spreadProps(__spreadValues({
      // model id:
      model: this.modelId,
      // model specific settings:
      echo: this.settings.echo,
      logit_bias: this.settings.logitBias,
      suffix: this.settings.suffix,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      seed
    }, providerMetadata == null ? void 0 : providerMetadata[this.providerOptionsName]), {
      // prompt:
      prompt: completionPrompt,
      // stop sequences:
      stop: stop.length > 0 ? stop : void 0
    });
    switch (type) {
      case "regular": {
        if ((_a15 = mode.tools) == null ? void 0 : _a15.length) {
          throw new UnsupportedFunctionalityError({
            functionality: "tools"
          });
        }
        if (mode.toolChoice) {
          throw new UnsupportedFunctionalityError({
            functionality: "toolChoice"
          });
        }
        return { args: baseArgs, warnings };
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-tool mode"
        });
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d;
      const { args, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: this.config.url({
          path: "/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: args,
        failedResponseHandler: this.failedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiCompatibleCompletionResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a16 = args, { prompt: rawPrompt } = _a16, rawSettings = __objRest(_a16, ["prompt"]);
      const choice = response.choices[0];
      return {
        text: choice.text,
        usage: {
          promptTokens: (_b = (_a15 = response.usage) == null ? void 0 : _a15.prompt_tokens) != null ? _b : NaN,
          completionTokens: (_d = (_c = response.usage) == null ? void 0 : _c.completion_tokens) != null ? _d : NaN
        },
        finishReason: mapOpenAICompatibleFinishReason(choice.finish_reason),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        response: getResponseMetadata2(response),
        warnings,
        request: { body: JSON.stringify(args) }
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      const { args, warnings } = this.getArgs(options);
      const body = __spreadProps(__spreadValues({}, args), {
        stream: true,
        // only include stream_options when in strict compatibility mode:
        stream_options: this.config.includeUsage ? { include_usage: true } : void 0
      });
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: this.failedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          this.chunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { prompt: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["prompt"]);
      let finishReason = "unknown";
      let usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      let isFirstChunk = true;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if ("error" in value) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: value.error });
                return;
              }
              if (isFirstChunk) {
                isFirstChunk = false;
                controller.enqueue(__spreadValues({
                  type: "response-metadata"
                }, getResponseMetadata2(value)));
              }
              if (value.usage != null) {
                usage = {
                  promptTokens: value.usage.prompt_tokens,
                  completionTokens: value.usage.completion_tokens
                };
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapOpenAICompatibleFinishReason(
                  choice.finish_reason
                );
              }
              if ((choice == null ? void 0 : choice.text) != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: choice.text
                });
              }
            },
            flush(controller) {
              controller.enqueue({
                type: "finish",
                finishReason,
                usage
              });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        warnings,
        request: { body: JSON.stringify(body) }
      };
    });
  }
};
var openaiCompatibleCompletionResponseSchema = import_zod19.z.object({
  id: import_zod19.z.string().nullish(),
  created: import_zod19.z.number().nullish(),
  model: import_zod19.z.string().nullish(),
  choices: import_zod19.z.array(
    import_zod19.z.object({
      text: import_zod19.z.string(),
      finish_reason: import_zod19.z.string()
    })
  ),
  usage: import_zod19.z.object({
    prompt_tokens: import_zod19.z.number(),
    completion_tokens: import_zod19.z.number()
  }).nullish()
});
var createOpenAICompatibleCompletionChunkSchema = (errorSchema) => import_zod19.z.union([
  import_zod19.z.object({
    id: import_zod19.z.string().nullish(),
    created: import_zod19.z.number().nullish(),
    model: import_zod19.z.string().nullish(),
    choices: import_zod19.z.array(
      import_zod19.z.object({
        text: import_zod19.z.string(),
        finish_reason: import_zod19.z.string().nullish(),
        index: import_zod19.z.number()
      })
    ),
    usage: import_zod19.z.object({
      prompt_tokens: import_zod19.z.number(),
      completion_tokens: import_zod19.z.number()
    }).nullish()
  }),
  errorSchema
]);
var OpenAICompatibleEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    var _a15;
    return (_a15 = this.config.maxEmbeddingsPerCall) != null ? _a15 : 2048;
  }
  get supportsParallelCalls() {
    var _a15;
    return (_a15 = this.config.supportsParallelCalls) != null ? _a15 : true;
  }
  doEmbed(_0) {
    return __async(this, arguments, function* ({
      values,
      headers,
      abortSignal
    }) {
      var _a15;
      if (values.length > this.maxEmbeddingsPerCall) {
        throw new TooManyEmbeddingValuesForCallError({
          provider: this.provider,
          modelId: this.modelId,
          maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
          values
        });
      }
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/embeddings",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), headers),
        body: {
          model: this.modelId,
          input: values,
          encoding_format: "float",
          dimensions: this.settings.dimensions,
          user: this.settings.user
        },
        failedResponseHandler: createJsonErrorResponseHandler(
          (_a15 = this.config.errorStructure) != null ? _a15 : defaultOpenAICompatibleErrorStructure
        ),
        successfulResponseHandler: createJsonResponseHandler(
          openaiTextEmbeddingResponseSchema2
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        embeddings: response.data.map((item) => item.embedding),
        usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
        rawResponse: { headers: responseHeaders }
      };
    });
  }
};
var openaiTextEmbeddingResponseSchema2 = import_zod20.z.object({
  data: import_zod20.z.array(import_zod20.z.object({ embedding: import_zod20.z.array(import_zod20.z.number()) })),
  usage: import_zod20.z.object({ prompt_tokens: import_zod20.z.number() }).nullish()
});
var OpenAICompatibleImageModel = class {
  constructor(modelId, settings, config) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    this.specificationVersion = "v1";
  }
  get maxImagesPerCall() {
    var _a15;
    return (_a15 = this.settings.maxImagesPerCall) != null ? _a15 : 10;
  }
  get provider() {
    return this.config.provider;
  }
  doGenerate(_0) {
    return __async(this, arguments, function* ({
      prompt,
      n,
      size,
      aspectRatio,
      seed,
      providerOptions,
      headers,
      abortSignal
    }) {
      var _a15, _b, _c, _d, _e;
      const warnings = [];
      if (aspectRatio != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "aspectRatio",
          details: "This model does not support aspect ratio. Use `size` instead."
        });
      }
      if (seed != null) {
        warnings.push({ type: "unsupported-setting", setting: "seed" });
      }
      const currentDate = (_c = (_b = (_a15 = this.config._internal) == null ? void 0 : _a15.currentDate) == null ? void 0 : _b.call(_a15)) != null ? _c : /* @__PURE__ */ new Date();
      const { value: response, responseHeaders } = yield postJsonToApi({
        url: this.config.url({
          path: "/images/generations",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), headers),
        body: __spreadValues(__spreadProps(__spreadValues({
          model: this.modelId,
          prompt,
          n,
          size
        }, (_d = providerOptions.openai) != null ? _d : {}), {
          response_format: "b64_json"
        }), this.settings.user ? { user: this.settings.user } : {}),
        failedResponseHandler: createJsonErrorResponseHandler(
          (_e = this.config.errorStructure) != null ? _e : defaultOpenAICompatibleErrorStructure
        ),
        successfulResponseHandler: createJsonResponseHandler(
          openaiCompatibleImageResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        images: response.data.map((item) => item.b64_json),
        warnings,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders
        }
      };
    });
  }
};
var openaiCompatibleImageResponseSchema = import_zod21.z.object({
  data: import_zod21.z.array(import_zod21.z.object({ b64_json: import_zod21.z.string() }))
});

// node_modules/.pnpm/@ai-sdk+xai@1.2.15_zod@3.25.67/node_modules/@ai-sdk/xai/dist/index.mjs
var import_zod22 = require("zod");
function supportsStructuredOutputs(modelId) {
  return [
    "grok-3",
    "grok-3-beta",
    "grok-3-latest",
    "grok-3-fast",
    "grok-3-fast-beta",
    "grok-3-fast-latest",
    "grok-3-mini",
    "grok-3-mini-beta",
    "grok-3-mini-latest",
    "grok-3-mini-fast",
    "grok-3-mini-fast-beta",
    "grok-3-mini-fast-latest",
    "grok-2-1212",
    "grok-2-vision-1212"
  ].includes(modelId);
}
var xaiErrorSchema = import_zod22.z.object({
  code: import_zod22.z.string(),
  error: import_zod22.z.string()
});
var xaiErrorStructure = {
  errorSchema: xaiErrorSchema,
  errorToMessage: (data) => data.error
};
function createXai(options = {}) {
  var _a15;
  const baseURL = withoutTrailingSlash(
    (_a15 = options.baseURL) != null ? _a15 : "https://api.x.ai/v1"
  );
  const getHeaders = () => __spreadValues({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "XAI_API_KEY",
      description: "xAI API key"
    })}`
  }, options.headers);
  const createLanguageModel = (modelId, settings = {}) => {
    const structuredOutputs = supportsStructuredOutputs(modelId);
    return new OpenAICompatibleChatLanguageModel(modelId, settings, {
      provider: "xai.chat",
      url: ({ path: path4 }) => `${baseURL}${path4}`,
      headers: getHeaders,
      fetch: options.fetch,
      defaultObjectGenerationMode: structuredOutputs ? "json" : "tool",
      errorStructure: xaiErrorStructure,
      supportsStructuredOutputs: structuredOutputs,
      includeUsage: true
    });
  };
  const createImageModel = (modelId, settings = {}) => {
    return new OpenAICompatibleImageModel(modelId, settings, {
      provider: "xai.image",
      url: ({ path: path4 }) => `${baseURL}${path4}`,
      headers: getHeaders,
      fetch: options.fetch,
      errorStructure: xaiErrorStructure
    });
  };
  const provider = (modelId, settings) => createLanguageModel(modelId, settings);
  provider.languageModel = createLanguageModel;
  provider.chat = createLanguageModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
  };
  provider.imageModel = createImageModel;
  provider.image = createImageModel;
  return provider;
}
var xai = createXai();

// node_modules/.pnpm/@ai-sdk+openai@1.3.21_zod@3.25.67/node_modules/@ai-sdk/openai/internal/dist/index.mjs
var import_zod23 = require("zod");
var import_zod24 = require("zod");
var import_zod25 = require("zod");
var import_zod26 = require("zod");
var import_zod27 = require("zod");
var import_zod28 = require("zod");
var import_zod29 = require("zod");
var import_zod30 = require("zod");
function convertToOpenAIChatMessages2({
  prompt,
  useLegacyFunctionCalling = false,
  systemMessageMode = "system"
}) {
  const messages = [];
  const warnings = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        switch (systemMessageMode) {
          case "system": {
            messages.push({ role: "system", content });
            break;
          }
          case "developer": {
            messages.push({ role: "developer", content });
            break;
          }
          case "remove": {
            warnings.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            const _exhaustiveCheck = systemMessageMode;
            throw new Error(
              `Unsupported system message mode: ${_exhaustiveCheck}`
            );
          }
        }
        break;
      }
      case "user": {
        if (content.length === 1 && content[0].type === "text") {
          messages.push({ role: "user", content: content[0].text });
          break;
        }
        messages.push({
          role: "user",
          content: content.map((part, index) => {
            var _a15, _b, _c, _d;
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text };
              }
              case "image": {
                return {
                  type: "image_url",
                  image_url: {
                    url: part.image instanceof URL ? part.image.toString() : `data:${(_a15 = part.mimeType) != null ? _a15 : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`,
                    // OpenAI specific extension: image detail
                    detail: (_c = (_b = part.providerMetadata) == null ? void 0 : _b.openai) == null ? void 0 : _c.imageDetail
                  }
                };
              }
              case "file": {
                if (part.data instanceof URL) {
                  throw new UnsupportedFunctionalityError({
                    functionality: "'File content parts with URL data' functionality not supported."
                  });
                }
                switch (part.mimeType) {
                  case "audio/wav": {
                    return {
                      type: "input_audio",
                      input_audio: { data: part.data, format: "wav" }
                    };
                  }
                  case "audio/mp3":
                  case "audio/mpeg": {
                    return {
                      type: "input_audio",
                      input_audio: { data: part.data, format: "mp3" }
                    };
                  }
                  case "application/pdf": {
                    return {
                      type: "file",
                      file: {
                        filename: (_d = part.filename) != null ? _d : `part-${index}.pdf`,
                        file_data: `data:application/pdf;base64,${part.data}`
                      }
                    };
                  }
                  default: {
                    throw new UnsupportedFunctionalityError({
                      functionality: `File content part type ${part.mimeType} in user messages`
                    });
                  }
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        let text = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                }
              });
              break;
            }
          }
        }
        if (useLegacyFunctionCalling) {
          if (toolCalls.length > 1) {
            throw new UnsupportedFunctionalityError({
              functionality: "useLegacyFunctionCalling with multiple tool calls in one message"
            });
          }
          messages.push({
            role: "assistant",
            content: text,
            function_call: toolCalls.length > 0 ? toolCalls[0].function : void 0
          });
        } else {
          messages.push({
            role: "assistant",
            content: text,
            tool_calls: toolCalls.length > 0 ? toolCalls : void 0
          });
        }
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          if (useLegacyFunctionCalling) {
            messages.push({
              role: "function",
              name: toolResponse.toolName,
              content: JSON.stringify(toolResponse.result)
            });
          } else {
            messages.push({
              role: "tool",
              tool_call_id: toolResponse.toolCallId,
              content: JSON.stringify(toolResponse.result)
            });
          }
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return { messages, warnings };
}
function mapOpenAIChatLogProbsOutput2(logprobs) {
  var _a15, _b;
  return (_b = (_a15 = logprobs == null ? void 0 : logprobs.content) == null ? void 0 : _a15.map(({ token, logprob, top_logprobs }) => ({
    token,
    logprob,
    topLogprobs: top_logprobs ? top_logprobs.map(({ token: token2, logprob: logprob2 }) => ({
      token: token2,
      logprob: logprob2
    })) : []
  }))) != null ? _b : void 0;
}
function mapOpenAIFinishReason2(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var openaiErrorDataSchema2 = import_zod24.z.object({
  error: import_zod24.z.object({
    message: import_zod24.z.string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: import_zod24.z.string().nullish(),
    param: import_zod24.z.any().nullish(),
    code: import_zod24.z.union([import_zod24.z.string(), import_zod24.z.number()]).nullish()
  })
});
var openaiFailedResponseHandler2 = createJsonErrorResponseHandler({
  errorSchema: openaiErrorDataSchema2,
  errorToMessage: (data) => data.error.message
});
function getResponseMetadata3({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}
function prepareTools5({
  mode,
  useLegacyFunctionCalling = false,
  structuredOutputs
}) {
  var _a15;
  const tools = ((_a15 = mode.tools) == null ? void 0 : _a15.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const toolChoice = mode.toolChoice;
  if (useLegacyFunctionCalling) {
    const openaiFunctions = [];
    for (const tool of tools) {
      if (tool.type === "provider-defined") {
        toolWarnings.push({ type: "unsupported-tool", tool });
      } else {
        openaiFunctions.push({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        });
      }
    }
    if (toolChoice == null) {
      return {
        functions: openaiFunctions,
        function_call: void 0,
        toolWarnings
      };
    }
    const type2 = toolChoice.type;
    switch (type2) {
      case "auto":
      case "none":
      case void 0:
        return {
          functions: openaiFunctions,
          function_call: void 0,
          toolWarnings
        };
      case "required":
        throw new UnsupportedFunctionalityError({
          functionality: "useLegacyFunctionCalling and toolChoice: required"
        });
      default:
        return {
          functions: openaiFunctions,
          function_call: { name: toolChoice.toolName },
          toolWarnings
        };
    }
  }
  const openaiTools2 = [];
  for (const tool of tools) {
    if (tool.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool });
    } else {
      openaiTools2.push({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
          strict: structuredOutputs ? true : void 0
        }
      });
    }
  }
  if (toolChoice == null) {
    return { tools: openaiTools2, tool_choice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiTools2, tool_choice: type, toolWarnings };
    case "tool":
      return {
        tools: openaiTools2,
        tool_choice: {
          type: "function",
          function: {
            name: toolChoice.toolName
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var OpenAIChatLanguageModel2 = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get supportsStructuredOutputs() {
    var _a15;
    return (_a15 = this.settings.structuredOutputs) != null ? _a15 : isReasoningModel2(this.modelId);
  }
  get defaultObjectGenerationMode() {
    if (isAudioModel2(this.modelId)) {
      return "tool";
    }
    return this.supportsStructuredOutputs ? "json" : "tool";
  }
  get provider() {
    return this.config.provider;
  }
  get supportsImageUrls() {
    return !this.settings.downloadImages;
  }
  getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    providerMetadata
  }) {
    var _a15, _b, _c, _d, _e, _f, _g, _h;
    const type = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if ((responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && !this.supportsStructuredOutputs) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is only supported with structuredOutputs"
      });
    }
    const useLegacyFunctionCalling = this.settings.useLegacyFunctionCalling;
    if (useLegacyFunctionCalling && this.settings.parallelToolCalls === true) {
      throw new UnsupportedFunctionalityError({
        functionality: "useLegacyFunctionCalling with parallelToolCalls"
      });
    }
    if (useLegacyFunctionCalling && this.supportsStructuredOutputs) {
      throw new UnsupportedFunctionalityError({
        functionality: "structuredOutputs with useLegacyFunctionCalling"
      });
    }
    const { messages, warnings: messageWarnings } = convertToOpenAIChatMessages2(
      {
        prompt,
        useLegacyFunctionCalling,
        systemMessageMode: getSystemMessageMode2(this.modelId)
      }
    );
    warnings.push(...messageWarnings);
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      logit_bias: this.settings.logitBias,
      logprobs: this.settings.logprobs === true || typeof this.settings.logprobs === "number" ? true : void 0,
      top_logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      user: this.settings.user,
      parallel_tool_calls: this.settings.parallelToolCalls,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? this.supportsStructuredOutputs && responseFormat.schema != null ? {
        type: "json_schema",
        json_schema: {
          schema: responseFormat.schema,
          strict: true,
          name: (_a15 = responseFormat.name) != null ? _a15 : "response",
          description: responseFormat.description
        }
      } : { type: "json_object" } : void 0,
      stop: stopSequences,
      seed,
      // openai specific settings:
      // TODO remove in next major version; we auto-map maxTokens now
      max_completion_tokens: (_b = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _b.maxCompletionTokens,
      store: (_c = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _c.store,
      metadata: (_d = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _d.metadata,
      prediction: (_e = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _e.prediction,
      reasoning_effort: (_g = (_f = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _f.reasoningEffort) != null ? _g : this.settings.reasoningEffort,
      // messages:
      messages
    };
    if (isReasoningModel2(this.modelId)) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported for reasoning models"
        });
      }
      if (baseArgs.top_p != null) {
        baseArgs.top_p = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "topP",
          details: "topP is not supported for reasoning models"
        });
      }
      if (baseArgs.frequency_penalty != null) {
        baseArgs.frequency_penalty = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "frequencyPenalty",
          details: "frequencyPenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.presence_penalty != null) {
        baseArgs.presence_penalty = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "presencePenalty",
          details: "presencePenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.logit_bias != null) {
        baseArgs.logit_bias = void 0;
        warnings.push({
          type: "other",
          message: "logitBias is not supported for reasoning models"
        });
      }
      if (baseArgs.logprobs != null) {
        baseArgs.logprobs = void 0;
        warnings.push({
          type: "other",
          message: "logprobs is not supported for reasoning models"
        });
      }
      if (baseArgs.top_logprobs != null) {
        baseArgs.top_logprobs = void 0;
        warnings.push({
          type: "other",
          message: "topLogprobs is not supported for reasoning models"
        });
      }
      if (baseArgs.max_tokens != null) {
        if (baseArgs.max_completion_tokens == null) {
          baseArgs.max_completion_tokens = baseArgs.max_tokens;
        }
        baseArgs.max_tokens = void 0;
      }
    } else if (this.modelId.startsWith("gpt-4o-search-preview") || this.modelId.startsWith("gpt-4o-mini-search-preview")) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported for the search preview models and has been removed."
        });
      }
    }
    switch (type) {
      case "regular": {
        const { tools, tool_choice, functions, function_call, toolWarnings } = prepareTools5({
          mode,
          useLegacyFunctionCalling,
          structuredOutputs: this.supportsStructuredOutputs
        });
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            tools,
            tool_choice,
            functions,
            function_call
          }),
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            response_format: this.supportsStructuredOutputs && mode.schema != null ? {
              type: "json_schema",
              json_schema: {
                schema: mode.schema,
                strict: true,
                name: (_h = mode.name) != null ? _h : "response",
                description: mode.description
              }
            } : { type: "json_object" }
          }),
          warnings
        };
      }
      case "object-tool": {
        return {
          args: useLegacyFunctionCalling ? __spreadProps(__spreadValues({}, baseArgs), {
            function_call: {
              name: mode.tool.name
            },
            functions: [
              {
                name: mode.tool.name,
                description: mode.tool.description,
                parameters: mode.tool.parameters
              }
            ]
          }) : __spreadProps(__spreadValues({}, baseArgs), {
            tool_choice: {
              type: "function",
              function: { name: mode.tool.name }
            },
            tools: [
              {
                type: "function",
                function: {
                  name: mode.tool.name,
                  description: mode.tool.description,
                  parameters: mode.tool.parameters,
                  strict: this.supportsStructuredOutputs ? true : void 0
                }
              }
            ]
          }),
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d, _e, _f, _g, _h;
      const { args: body, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler2,
        successfulResponseHandler: createJsonResponseHandler(
          openaiChatResponseSchema2
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a16 = body, { messages: rawPrompt } = _a16, rawSettings = __objRest(_a16, ["messages"]);
      const choice = response.choices[0];
      const completionTokenDetails = (_a15 = response.usage) == null ? void 0 : _a15.completion_tokens_details;
      const promptTokenDetails = (_b = response.usage) == null ? void 0 : _b.prompt_tokens_details;
      const providerMetadata = { openai: {} };
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens) != null) {
        providerMetadata.openai.reasoningTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens;
      }
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens) != null) {
        providerMetadata.openai.acceptedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens;
      }
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens) != null) {
        providerMetadata.openai.rejectedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens;
      }
      if ((promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens) != null) {
        providerMetadata.openai.cachedPromptTokens = promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens;
      }
      return {
        text: (_c = choice.message.content) != null ? _c : void 0,
        toolCalls: this.settings.useLegacyFunctionCalling && choice.message.function_call ? [
          {
            toolCallType: "function",
            toolCallId: generateId(),
            toolName: choice.message.function_call.name,
            args: choice.message.function_call.arguments
          }
        ] : (_d = choice.message.tool_calls) == null ? void 0 : _d.map((toolCall) => {
          var _a22;
          return {
            toolCallType: "function",
            toolCallId: (_a22 = toolCall.id) != null ? _a22 : generateId(),
            toolName: toolCall.function.name,
            args: toolCall.function.arguments
          };
        }),
        finishReason: mapOpenAIFinishReason2(choice.finish_reason),
        usage: {
          promptTokens: (_f = (_e = response.usage) == null ? void 0 : _e.prompt_tokens) != null ? _f : NaN,
          completionTokens: (_h = (_g = response.usage) == null ? void 0 : _g.completion_tokens) != null ? _h : NaN
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        request: { body: JSON.stringify(body) },
        response: getResponseMetadata3(response),
        warnings,
        logprobs: mapOpenAIChatLogProbsOutput2(choice.logprobs),
        providerMetadata
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      if (this.settings.simulateStreaming) {
        const result = yield this.doGenerate(options);
        const simulatedStream = new ReadableStream({
          start(controller) {
            controller.enqueue(__spreadValues({ type: "response-metadata" }, result.response));
            if (result.text) {
              controller.enqueue({
                type: "text-delta",
                textDelta: result.text
              });
            }
            if (result.toolCalls) {
              for (const toolCall of result.toolCalls) {
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  argsTextDelta: toolCall.args
                });
                controller.enqueue(__spreadValues({
                  type: "tool-call"
                }, toolCall));
              }
            }
            controller.enqueue({
              type: "finish",
              finishReason: result.finishReason,
              usage: result.usage,
              logprobs: result.logprobs,
              providerMetadata: result.providerMetadata
            });
            controller.close();
          }
        });
        return {
          stream: simulatedStream,
          rawCall: result.rawCall,
          rawResponse: result.rawResponse,
          warnings: result.warnings
        };
      }
      const { args, warnings } = this.getArgs(options);
      const body = __spreadProps(__spreadValues({}, args), {
        stream: true,
        // only include stream_options when in strict compatibility mode:
        stream_options: this.config.compatibility === "strict" ? { include_usage: true } : void 0
      });
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler2,
        successfulResponseHandler: createEventSourceResponseHandler(
          openaiChatChunkSchema2
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { messages: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["messages"]);
      const toolCalls = [];
      let finishReason = "unknown";
      let usage = {
        promptTokens: void 0,
        completionTokens: void 0
      };
      let logprobs;
      let isFirstChunk = true;
      const { useLegacyFunctionCalling } = this.settings;
      const providerMetadata = { openai: {} };
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a16, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if ("error" in value) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: value.error });
                return;
              }
              if (isFirstChunk) {
                isFirstChunk = false;
                controller.enqueue(__spreadValues({
                  type: "response-metadata"
                }, getResponseMetadata3(value)));
              }
              if (value.usage != null) {
                const {
                  prompt_tokens,
                  completion_tokens,
                  prompt_tokens_details,
                  completion_tokens_details
                } = value.usage;
                usage = {
                  promptTokens: prompt_tokens != null ? prompt_tokens : void 0,
                  completionTokens: completion_tokens != null ? completion_tokens : void 0
                };
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens) != null) {
                  providerMetadata.openai.reasoningTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens;
                }
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens) != null) {
                  providerMetadata.openai.acceptedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens;
                }
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens) != null) {
                  providerMetadata.openai.rejectedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens;
                }
                if ((prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens) != null) {
                  providerMetadata.openai.cachedPromptTokens = prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens;
                }
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapOpenAIFinishReason2(choice.finish_reason);
              }
              if ((choice == null ? void 0 : choice.delta) == null) {
                return;
              }
              const delta = choice.delta;
              if (delta.content != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: delta.content
                });
              }
              const mappedLogprobs = mapOpenAIChatLogProbsOutput2(
                choice == null ? void 0 : choice.logprobs
              );
              if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
                if (logprobs === void 0) logprobs = [];
                logprobs.push(...mappedLogprobs);
              }
              const mappedToolCalls = useLegacyFunctionCalling && delta.function_call != null ? [
                {
                  type: "function",
                  id: generateId(),
                  function: delta.function_call,
                  index: 0
                }
              ] : delta.tool_calls;
              if (mappedToolCalls != null) {
                for (const toolCallDelta of mappedToolCalls) {
                  const index = toolCallDelta.index;
                  if (toolCalls[index] == null) {
                    if (toolCallDelta.type !== "function") {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function' type.`
                      });
                    }
                    if (toolCallDelta.id == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'id' to be a string.`
                      });
                    }
                    if (((_a16 = toolCallDelta.function) == null ? void 0 : _a16.name) == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function.name' to be a string.`
                      });
                    }
                    toolCalls[index] = {
                      id: toolCallDelta.id,
                      type: "function",
                      function: {
                        name: toolCallDelta.function.name,
                        arguments: (_b = toolCallDelta.function.arguments) != null ? _b : ""
                      },
                      hasFinished: false
                    };
                    const toolCall2 = toolCalls[index];
                    if (((_c = toolCall2.function) == null ? void 0 : _c.name) != null && ((_d = toolCall2.function) == null ? void 0 : _d.arguments) != null) {
                      if (toolCall2.function.arguments.length > 0) {
                        controller.enqueue({
                          type: "tool-call-delta",
                          toolCallType: "function",
                          toolCallId: toolCall2.id,
                          toolName: toolCall2.function.name,
                          argsTextDelta: toolCall2.function.arguments
                        });
                      }
                      if (isParsableJson(toolCall2.function.arguments)) {
                        controller.enqueue({
                          type: "tool-call",
                          toolCallType: "function",
                          toolCallId: (_e = toolCall2.id) != null ? _e : generateId(),
                          toolName: toolCall2.function.name,
                          args: toolCall2.function.arguments
                        });
                        toolCall2.hasFinished = true;
                      }
                    }
                    continue;
                  }
                  const toolCall = toolCalls[index];
                  if (toolCall.hasFinished) {
                    continue;
                  }
                  if (((_f = toolCallDelta.function) == null ? void 0 : _f.arguments) != null) {
                    toolCall.function.arguments += (_h = (_g = toolCallDelta.function) == null ? void 0 : _g.arguments) != null ? _h : "";
                  }
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    argsTextDelta: (_i = toolCallDelta.function.arguments) != null ? _i : ""
                  });
                  if (((_j = toolCall.function) == null ? void 0 : _j.name) != null && ((_k = toolCall.function) == null ? void 0 : _k.arguments) != null && isParsableJson(toolCall.function.arguments)) {
                    controller.enqueue({
                      type: "tool-call",
                      toolCallType: "function",
                      toolCallId: (_l = toolCall.id) != null ? _l : generateId(),
                      toolName: toolCall.function.name,
                      args: toolCall.function.arguments
                    });
                    toolCall.hasFinished = true;
                  }
                }
              }
            },
            flush(controller) {
              var _a16, _b;
              controller.enqueue(__spreadValues({
                type: "finish",
                finishReason,
                logprobs,
                usage: {
                  promptTokens: (_a16 = usage.promptTokens) != null ? _a16 : NaN,
                  completionTokens: (_b = usage.completionTokens) != null ? _b : NaN
                }
              }, providerMetadata != null ? { providerMetadata } : {}));
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        warnings
      };
    });
  }
};
var openaiTokenUsageSchema2 = import_zod23.z.object({
  prompt_tokens: import_zod23.z.number().nullish(),
  completion_tokens: import_zod23.z.number().nullish(),
  prompt_tokens_details: import_zod23.z.object({
    cached_tokens: import_zod23.z.number().nullish()
  }).nullish(),
  completion_tokens_details: import_zod23.z.object({
    reasoning_tokens: import_zod23.z.number().nullish(),
    accepted_prediction_tokens: import_zod23.z.number().nullish(),
    rejected_prediction_tokens: import_zod23.z.number().nullish()
  }).nullish()
}).nullish();
var openaiChatResponseSchema2 = import_zod23.z.object({
  id: import_zod23.z.string().nullish(),
  created: import_zod23.z.number().nullish(),
  model: import_zod23.z.string().nullish(),
  choices: import_zod23.z.array(
    import_zod23.z.object({
      message: import_zod23.z.object({
        role: import_zod23.z.literal("assistant").nullish(),
        content: import_zod23.z.string().nullish(),
        function_call: import_zod23.z.object({
          arguments: import_zod23.z.string(),
          name: import_zod23.z.string()
        }).nullish(),
        tool_calls: import_zod23.z.array(
          import_zod23.z.object({
            id: import_zod23.z.string().nullish(),
            type: import_zod23.z.literal("function"),
            function: import_zod23.z.object({
              name: import_zod23.z.string(),
              arguments: import_zod23.z.string()
            })
          })
        ).nullish()
      }),
      index: import_zod23.z.number(),
      logprobs: import_zod23.z.object({
        content: import_zod23.z.array(
          import_zod23.z.object({
            token: import_zod23.z.string(),
            logprob: import_zod23.z.number(),
            top_logprobs: import_zod23.z.array(
              import_zod23.z.object({
                token: import_zod23.z.string(),
                logprob: import_zod23.z.number()
              })
            )
          })
        ).nullable()
      }).nullish(),
      finish_reason: import_zod23.z.string().nullish()
    })
  ),
  usage: openaiTokenUsageSchema2
});
var openaiChatChunkSchema2 = import_zod23.z.union([
  import_zod23.z.object({
    id: import_zod23.z.string().nullish(),
    created: import_zod23.z.number().nullish(),
    model: import_zod23.z.string().nullish(),
    choices: import_zod23.z.array(
      import_zod23.z.object({
        delta: import_zod23.z.object({
          role: import_zod23.z.enum(["assistant"]).nullish(),
          content: import_zod23.z.string().nullish(),
          function_call: import_zod23.z.object({
            name: import_zod23.z.string().optional(),
            arguments: import_zod23.z.string().optional()
          }).nullish(),
          tool_calls: import_zod23.z.array(
            import_zod23.z.object({
              index: import_zod23.z.number(),
              id: import_zod23.z.string().nullish(),
              type: import_zod23.z.literal("function").nullish(),
              function: import_zod23.z.object({
                name: import_zod23.z.string().nullish(),
                arguments: import_zod23.z.string().nullish()
              })
            })
          ).nullish()
        }).nullish(),
        logprobs: import_zod23.z.object({
          content: import_zod23.z.array(
            import_zod23.z.object({
              token: import_zod23.z.string(),
              logprob: import_zod23.z.number(),
              top_logprobs: import_zod23.z.array(
                import_zod23.z.object({
                  token: import_zod23.z.string(),
                  logprob: import_zod23.z.number()
                })
              )
            })
          ).nullable()
        }).nullish(),
        finish_reason: import_zod23.z.string().nullish(),
        index: import_zod23.z.number()
      })
    ),
    usage: openaiTokenUsageSchema2
  }),
  openaiErrorDataSchema2
]);
function isReasoningModel2(modelId) {
  return modelId.startsWith("o");
}
function isAudioModel2(modelId) {
  return modelId.startsWith("gpt-4o-audio-preview");
}
function getSystemMessageMode2(modelId) {
  var _a15, _b;
  if (!isReasoningModel2(modelId)) {
    return "system";
  }
  return (_b = (_a15 = reasoningModels2[modelId]) == null ? void 0 : _a15.systemMessageMode) != null ? _b : "developer";
}
var reasoningModels2 = {
  "o1-mini": {
    systemMessageMode: "remove"
  },
  "o1-mini-2024-09-12": {
    systemMessageMode: "remove"
  },
  "o1-preview": {
    systemMessageMode: "remove"
  },
  "o1-preview-2024-09-12": {
    systemMessageMode: "remove"
  },
  o3: {
    systemMessageMode: "developer"
  },
  "o3-2025-04-16": {
    systemMessageMode: "developer"
  },
  "o3-mini": {
    systemMessageMode: "developer"
  },
  "o3-mini-2025-01-31": {
    systemMessageMode: "developer"
  },
  "o4-mini": {
    systemMessageMode: "developer"
  },
  "o4-mini-2025-04-16": {
    systemMessageMode: "developer"
  }
};
function convertToOpenAICompletionPrompt2({
  prompt,
  inputFormat,
  user = "user",
  assistant = "assistant"
}) {
  if (inputFormat === "prompt" && prompt.length === 1 && prompt[0].role === "user" && prompt[0].content.length === 1 && prompt[0].content[0].type === "text") {
    return { prompt: prompt[0].content[0].text };
  }
  let text = "";
  if (prompt[0].role === "system") {
    text += `${prompt[0].content}

`;
    prompt = prompt.slice(1);
  }
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        throw new InvalidPromptError({
          message: "Unexpected system message in prompt: ${content}",
          prompt
        });
      }
      case "user": {
        const userMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "image": {
              throw new UnsupportedFunctionalityError({
                functionality: "images"
              });
            }
          }
        }).join("");
        text += `${user}:
${userMessage}

`;
        break;
      }
      case "assistant": {
        const assistantMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "tool-call": {
              throw new UnsupportedFunctionalityError({
                functionality: "tool-call messages"
              });
            }
          }
        }).join("");
        text += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case "tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "tool messages"
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  text += `${assistant}:
`;
  return {
    prompt: text,
    stopSequences: [`
${user}:`]
  };
}
function mapOpenAICompletionLogProbs2(logprobs) {
  return logprobs == null ? void 0 : logprobs.tokens.map((token, index) => ({
    token,
    logprob: logprobs.token_logprobs[index],
    topLogprobs: logprobs.top_logprobs ? Object.entries(logprobs.top_logprobs[index]).map(
      ([token2, logprob]) => ({
        token: token2,
        logprob
      })
    ) : []
  }));
}
var OpenAICompletionLanguageModel2 = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = void 0;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    mode,
    inputFormat,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences: userStopSequences,
    responseFormat,
    seed
  }) {
    var _a15;
    const type = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const { prompt: completionPrompt, stopSequences } = convertToOpenAICompletionPrompt2({ prompt, inputFormat });
    const stop = [...stopSequences != null ? stopSequences : [], ...userStopSequences != null ? userStopSequences : []];
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      echo: this.settings.echo,
      logit_bias: this.settings.logitBias,
      logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      suffix: this.settings.suffix,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      seed,
      // prompt:
      prompt: completionPrompt,
      // stop sequences:
      stop: stop.length > 0 ? stop : void 0
    };
    switch (type) {
      case "regular": {
        if ((_a15 = mode.tools) == null ? void 0 : _a15.length) {
          throw new UnsupportedFunctionalityError({
            functionality: "tools"
          });
        }
        if (mode.toolChoice) {
          throw new UnsupportedFunctionalityError({
            functionality: "toolChoice"
          });
        }
        return { args: baseArgs, warnings };
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-tool mode"
        });
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      const { args, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: this.config.url({
          path: "/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: args,
        failedResponseHandler: openaiFailedResponseHandler2,
        successfulResponseHandler: createJsonResponseHandler(
          openaiCompletionResponseSchema2
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { prompt: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["prompt"]);
      const choice = response.choices[0];
      return {
        text: choice.text,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens
        },
        finishReason: mapOpenAIFinishReason2(choice.finish_reason),
        logprobs: mapOpenAICompletionLogProbs2(choice.logprobs),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        response: getResponseMetadata3(response),
        warnings,
        request: { body: JSON.stringify(args) }
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      const { args, warnings } = this.getArgs(options);
      const body = __spreadProps(__spreadValues({}, args), {
        stream: true,
        // only include stream_options when in strict compatibility mode:
        stream_options: this.config.compatibility === "strict" ? { include_usage: true } : void 0
      });
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler2,
        successfulResponseHandler: createEventSourceResponseHandler(
          openaiCompletionChunkSchema2
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { prompt: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["prompt"]);
      let finishReason = "unknown";
      let usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      let logprobs;
      let isFirstChunk = true;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if ("error" in value) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: value.error });
                return;
              }
              if (isFirstChunk) {
                isFirstChunk = false;
                controller.enqueue(__spreadValues({
                  type: "response-metadata"
                }, getResponseMetadata3(value)));
              }
              if (value.usage != null) {
                usage = {
                  promptTokens: value.usage.prompt_tokens,
                  completionTokens: value.usage.completion_tokens
                };
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapOpenAIFinishReason2(choice.finish_reason);
              }
              if ((choice == null ? void 0 : choice.text) != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: choice.text
                });
              }
              const mappedLogprobs = mapOpenAICompletionLogProbs2(
                choice == null ? void 0 : choice.logprobs
              );
              if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
                if (logprobs === void 0) logprobs = [];
                logprobs.push(...mappedLogprobs);
              }
            },
            flush(controller) {
              controller.enqueue({
                type: "finish",
                finishReason,
                logprobs,
                usage
              });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        warnings,
        request: { body: JSON.stringify(body) }
      };
    });
  }
};
var openaiCompletionResponseSchema2 = import_zod25.z.object({
  id: import_zod25.z.string().nullish(),
  created: import_zod25.z.number().nullish(),
  model: import_zod25.z.string().nullish(),
  choices: import_zod25.z.array(
    import_zod25.z.object({
      text: import_zod25.z.string(),
      finish_reason: import_zod25.z.string(),
      logprobs: import_zod25.z.object({
        tokens: import_zod25.z.array(import_zod25.z.string()),
        token_logprobs: import_zod25.z.array(import_zod25.z.number()),
        top_logprobs: import_zod25.z.array(import_zod25.z.record(import_zod25.z.string(), import_zod25.z.number())).nullable()
      }).nullish()
    })
  ),
  usage: import_zod25.z.object({
    prompt_tokens: import_zod25.z.number(),
    completion_tokens: import_zod25.z.number()
  })
});
var openaiCompletionChunkSchema2 = import_zod25.z.union([
  import_zod25.z.object({
    id: import_zod25.z.string().nullish(),
    created: import_zod25.z.number().nullish(),
    model: import_zod25.z.string().nullish(),
    choices: import_zod25.z.array(
      import_zod25.z.object({
        text: import_zod25.z.string(),
        finish_reason: import_zod25.z.string().nullish(),
        index: import_zod25.z.number(),
        logprobs: import_zod25.z.object({
          tokens: import_zod25.z.array(import_zod25.z.string()),
          token_logprobs: import_zod25.z.array(import_zod25.z.number()),
          top_logprobs: import_zod25.z.array(import_zod25.z.record(import_zod25.z.string(), import_zod25.z.number())).nullable()
        }).nullish()
      })
    ),
    usage: import_zod25.z.object({
      prompt_tokens: import_zod25.z.number(),
      completion_tokens: import_zod25.z.number()
    }).nullish()
  }),
  openaiErrorDataSchema2
]);
var OpenAIEmbeddingModel2 = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    var _a15;
    return (_a15 = this.settings.maxEmbeddingsPerCall) != null ? _a15 : 2048;
  }
  get supportsParallelCalls() {
    var _a15;
    return (_a15 = this.settings.supportsParallelCalls) != null ? _a15 : true;
  }
  doEmbed(_0) {
    return __async(this, arguments, function* ({
      values,
      headers,
      abortSignal
    }) {
      if (values.length > this.maxEmbeddingsPerCall) {
        throw new TooManyEmbeddingValuesForCallError({
          provider: this.provider,
          modelId: this.modelId,
          maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
          values
        });
      }
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/embeddings",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), headers),
        body: {
          model: this.modelId,
          input: values,
          encoding_format: "float",
          dimensions: this.settings.dimensions,
          user: this.settings.user
        },
        failedResponseHandler: openaiFailedResponseHandler2,
        successfulResponseHandler: createJsonResponseHandler(
          openaiTextEmbeddingResponseSchema3
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        embeddings: response.data.map((item) => item.embedding),
        usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
        rawResponse: { headers: responseHeaders }
      };
    });
  }
};
var openaiTextEmbeddingResponseSchema3 = import_zod26.z.object({
  data: import_zod26.z.array(import_zod26.z.object({ embedding: import_zod26.z.array(import_zod26.z.number()) })),
  usage: import_zod26.z.object({ prompt_tokens: import_zod26.z.number() }).nullish()
});
var modelMaxImagesPerCall2 = {
  "dall-e-3": 1,
  "dall-e-2": 10,
  "gpt-image-1": 10
};
var hasDefaultResponseFormat2 = /* @__PURE__ */ new Set(["gpt-image-1"]);
var OpenAIImageModel2 = class {
  constructor(modelId, settings, config) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    this.specificationVersion = "v1";
  }
  get maxImagesPerCall() {
    var _a15, _b;
    return (_b = (_a15 = this.settings.maxImagesPerCall) != null ? _a15 : modelMaxImagesPerCall2[this.modelId]) != null ? _b : 1;
  }
  get provider() {
    return this.config.provider;
  }
  doGenerate(_0) {
    return __async(this, arguments, function* ({
      prompt,
      n,
      size,
      aspectRatio,
      seed,
      providerOptions,
      headers,
      abortSignal
    }) {
      var _a15, _b, _c, _d;
      const warnings = [];
      if (aspectRatio != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "aspectRatio",
          details: "This model does not support aspect ratio. Use `size` instead."
        });
      }
      if (seed != null) {
        warnings.push({ type: "unsupported-setting", setting: "seed" });
      }
      const currentDate = (_c = (_b = (_a15 = this.config._internal) == null ? void 0 : _a15.currentDate) == null ? void 0 : _b.call(_a15)) != null ? _c : /* @__PURE__ */ new Date();
      const { value: response, responseHeaders } = yield postJsonToApi({
        url: this.config.url({
          path: "/images/generations",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), headers),
        body: __spreadValues(__spreadValues({
          model: this.modelId,
          prompt,
          n,
          size
        }, (_d = providerOptions.openai) != null ? _d : {}), !hasDefaultResponseFormat2.has(this.modelId) ? { response_format: "b64_json" } : {}),
        failedResponseHandler: openaiFailedResponseHandler2,
        successfulResponseHandler: createJsonResponseHandler(
          openaiImageResponseSchema2
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        images: response.data.map((item) => item.b64_json),
        warnings,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders
        }
      };
    });
  }
};
var openaiImageResponseSchema2 = import_zod27.z.object({
  data: import_zod27.z.array(import_zod27.z.object({ b64_json: import_zod27.z.string() }))
});
var openAIProviderOptionsSchema2 = import_zod28.z.object({
  include: import_zod28.z.array(import_zod28.z.string()).nullish(),
  language: import_zod28.z.string().nullish(),
  prompt: import_zod28.z.string().nullish(),
  temperature: import_zod28.z.number().min(0).max(1).nullish().default(0),
  timestampGranularities: import_zod28.z.array(import_zod28.z.enum(["word", "segment"])).nullish().default(["segment"])
});
var languageMap2 = {
  afrikaans: "af",
  arabic: "ar",
  armenian: "hy",
  azerbaijani: "az",
  belarusian: "be",
  bosnian: "bs",
  bulgarian: "bg",
  catalan: "ca",
  chinese: "zh",
  croatian: "hr",
  czech: "cs",
  danish: "da",
  dutch: "nl",
  english: "en",
  estonian: "et",
  finnish: "fi",
  french: "fr",
  galician: "gl",
  german: "de",
  greek: "el",
  hebrew: "he",
  hindi: "hi",
  hungarian: "hu",
  icelandic: "is",
  indonesian: "id",
  italian: "it",
  japanese: "ja",
  kannada: "kn",
  kazakh: "kk",
  korean: "ko",
  latvian: "lv",
  lithuanian: "lt",
  macedonian: "mk",
  malay: "ms",
  marathi: "mr",
  maori: "mi",
  nepali: "ne",
  norwegian: "no",
  persian: "fa",
  polish: "pl",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  serbian: "sr",
  slovak: "sk",
  slovenian: "sl",
  spanish: "es",
  swahili: "sw",
  swedish: "sv",
  tagalog: "tl",
  tamil: "ta",
  thai: "th",
  turkish: "tr",
  ukrainian: "uk",
  urdu: "ur",
  vietnamese: "vi",
  welsh: "cy"
};
var OpenAITranscriptionModel2 = class {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v1";
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    audio,
    mediaType,
    providerOptions
  }) {
    var _a15, _b, _c, _d, _e;
    const warnings = [];
    const openAIOptions = parseProviderOptions({
      provider: "openai",
      providerOptions,
      schema: openAIProviderOptionsSchema2
    });
    const formData = new FormData();
    const blob = audio instanceof Uint8Array ? new Blob([audio]) : new Blob([convertBase64ToUint8Array(audio)]);
    formData.append("model", this.modelId);
    formData.append("file", new File([blob], "audio", { type: mediaType }));
    if (openAIOptions) {
      const transcriptionModelOptions = {
        include: (_a15 = openAIOptions.include) != null ? _a15 : void 0,
        language: (_b = openAIOptions.language) != null ? _b : void 0,
        prompt: (_c = openAIOptions.prompt) != null ? _c : void 0,
        temperature: (_d = openAIOptions.temperature) != null ? _d : void 0,
        timestamp_granularities: (_e = openAIOptions.timestampGranularities) != null ? _e : void 0
      };
      for (const key in transcriptionModelOptions) {
        const value = transcriptionModelOptions[key];
        if (value !== void 0) {
          formData.append(key, String(value));
        }
      }
    }
    return {
      formData,
      warnings
    };
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d, _e, _f;
      const currentDate = (_c = (_b = (_a15 = this.config._internal) == null ? void 0 : _a15.currentDate) == null ? void 0 : _b.call(_a15)) != null ? _c : /* @__PURE__ */ new Date();
      const { formData, warnings } = this.getArgs(options);
      const {
        value: response,
        responseHeaders,
        rawValue: rawResponse
      } = yield postFormDataToApi({
        url: this.config.url({
          path: "/audio/transcriptions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        formData,
        failedResponseHandler: openaiFailedResponseHandler2,
        successfulResponseHandler: createJsonResponseHandler(
          openaiTranscriptionResponseSchema2
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const language = response.language != null && response.language in languageMap2 ? languageMap2[response.language] : void 0;
      return {
        text: response.text,
        segments: (_e = (_d = response.words) == null ? void 0 : _d.map((word) => ({
          text: word.word,
          startSecond: word.start,
          endSecond: word.end
        }))) != null ? _e : [],
        language,
        durationInSeconds: (_f = response.duration) != null ? _f : void 0,
        warnings,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders,
          body: rawResponse
        }
      };
    });
  }
};
var openaiTranscriptionResponseSchema2 = import_zod28.z.object({
  text: import_zod28.z.string(),
  language: import_zod28.z.string().nullish(),
  duration: import_zod28.z.number().nullish(),
  words: import_zod28.z.array(
    import_zod28.z.object({
      word: import_zod28.z.string(),
      start: import_zod28.z.number(),
      end: import_zod28.z.number()
    })
  ).nullish()
});
var OpenAIProviderOptionsSchema2 = import_zod29.z.object({
  instructions: import_zod29.z.string().nullish(),
  speed: import_zod29.z.number().min(0.25).max(4).default(1).nullish()
});
function convertToOpenAIResponsesMessages2({
  prompt,
  systemMessageMode
}) {
  const messages = [];
  const warnings = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        switch (systemMessageMode) {
          case "system": {
            messages.push({ role: "system", content });
            break;
          }
          case "developer": {
            messages.push({ role: "developer", content });
            break;
          }
          case "remove": {
            warnings.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            const _exhaustiveCheck = systemMessageMode;
            throw new Error(
              `Unsupported system message mode: ${_exhaustiveCheck}`
            );
          }
        }
        break;
      }
      case "user": {
        messages.push({
          role: "user",
          content: content.map((part, index) => {
            var _a15, _b, _c, _d;
            switch (part.type) {
              case "text": {
                return { type: "input_text", text: part.text };
              }
              case "image": {
                return {
                  type: "input_image",
                  image_url: part.image instanceof URL ? part.image.toString() : `data:${(_a15 = part.mimeType) != null ? _a15 : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`,
                  // OpenAI specific extension: image detail
                  detail: (_c = (_b = part.providerMetadata) == null ? void 0 : _b.openai) == null ? void 0 : _c.imageDetail
                };
              }
              case "file": {
                if (part.data instanceof URL) {
                  throw new UnsupportedFunctionalityError({
                    functionality: "File URLs in user messages"
                  });
                }
                switch (part.mimeType) {
                  case "application/pdf": {
                    return {
                      type: "input_file",
                      filename: (_d = part.filename) != null ? _d : `part-${index}.pdf`,
                      file_data: `data:application/pdf;base64,${part.data}`
                    };
                  }
                  default: {
                    throw new UnsupportedFunctionalityError({
                      functionality: "Only PDF files are supported in user messages"
                    });
                  }
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        for (const part of content) {
          switch (part.type) {
            case "text": {
              messages.push({
                role: "assistant",
                content: [{ type: "output_text", text: part.text }]
              });
              break;
            }
            case "tool-call": {
              messages.push({
                type: "function_call",
                call_id: part.toolCallId,
                name: part.toolName,
                arguments: JSON.stringify(part.args)
              });
              break;
            }
          }
        }
        break;
      }
      case "tool": {
        for (const part of content) {
          messages.push({
            type: "function_call_output",
            call_id: part.toolCallId,
            output: JSON.stringify(part.result)
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return { messages, warnings };
}
function mapOpenAIResponseFinishReason2({
  finishReason,
  hasToolCalls
}) {
  switch (finishReason) {
    case void 0:
    case null:
      return hasToolCalls ? "tool-calls" : "stop";
    case "max_output_tokens":
      return "length";
    case "content_filter":
      return "content-filter";
    default:
      return hasToolCalls ? "tool-calls" : "unknown";
  }
}
function prepareResponsesTools2({
  mode,
  strict
}) {
  var _a15;
  const tools = ((_a15 = mode.tools) == null ? void 0 : _a15.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const toolChoice = mode.toolChoice;
  const openaiTools2 = [];
  for (const tool of tools) {
    switch (tool.type) {
      case "function":
        openaiTools2.push({
          type: "function",
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
          strict: strict ? true : void 0
        });
        break;
      case "provider-defined":
        switch (tool.id) {
          case "openai.web_search_preview":
            openaiTools2.push({
              type: "web_search_preview",
              search_context_size: tool.args.searchContextSize,
              user_location: tool.args.userLocation
            });
            break;
          default:
            toolWarnings.push({ type: "unsupported-tool", tool });
            break;
        }
        break;
      default:
        toolWarnings.push({ type: "unsupported-tool", tool });
        break;
    }
  }
  if (toolChoice == null) {
    return { tools: openaiTools2, tool_choice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiTools2, tool_choice: type, toolWarnings };
    case "tool": {
      if (toolChoice.toolName === "web_search_preview") {
        return {
          tools: openaiTools2,
          tool_choice: {
            type: "web_search_preview"
          },
          toolWarnings
        };
      }
      return {
        tools: openaiTools2,
        tool_choice: {
          type: "function",
          name: toolChoice.toolName
        },
        toolWarnings
      };
    }
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var OpenAIResponsesLanguageModel2 = class {
  constructor(modelId, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "json";
    this.supportsStructuredOutputs = true;
    this.modelId = modelId;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    mode,
    maxTokens,
    temperature,
    stopSequences,
    topP,
    topK,
    presencePenalty,
    frequencyPenalty,
    seed,
    prompt,
    providerMetadata,
    responseFormat
  }) {
    var _a15, _b, _c;
    const warnings = [];
    const modelConfig = getResponsesModelConfig2(this.modelId);
    const type = mode.type;
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (seed != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "seed"
      });
    }
    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty"
      });
    }
    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty"
      });
    }
    if (stopSequences != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "stopSequences"
      });
    }
    const { messages, warnings: messageWarnings } = convertToOpenAIResponsesMessages2({
      prompt,
      systemMessageMode: modelConfig.systemMessageMode
    });
    warnings.push(...messageWarnings);
    const openaiOptions = parseProviderOptions({
      provider: "openai",
      providerOptions: providerMetadata,
      schema: openaiResponsesProviderOptionsSchema2
    });
    const isStrict = (_a15 = openaiOptions == null ? void 0 : openaiOptions.strictSchemas) != null ? _a15 : true;
    const baseArgs = __spreadValues(__spreadValues(__spreadProps(__spreadValues({
      model: this.modelId,
      input: messages,
      temperature,
      top_p: topP,
      max_output_tokens: maxTokens
    }, (responseFormat == null ? void 0 : responseFormat.type) === "json" && {
      text: {
        format: responseFormat.schema != null ? {
          type: "json_schema",
          strict: isStrict,
          name: (_b = responseFormat.name) != null ? _b : "response",
          description: responseFormat.description,
          schema: responseFormat.schema
        } : { type: "json_object" }
      }
    }), {
      // provider options:
      metadata: openaiOptions == null ? void 0 : openaiOptions.metadata,
      parallel_tool_calls: openaiOptions == null ? void 0 : openaiOptions.parallelToolCalls,
      previous_response_id: openaiOptions == null ? void 0 : openaiOptions.previousResponseId,
      store: openaiOptions == null ? void 0 : openaiOptions.store,
      user: openaiOptions == null ? void 0 : openaiOptions.user,
      instructions: openaiOptions == null ? void 0 : openaiOptions.instructions
    }), modelConfig.isReasoningModel && ((openaiOptions == null ? void 0 : openaiOptions.reasoningEffort) != null || (openaiOptions == null ? void 0 : openaiOptions.reasoningSummary) != null) && {
      reasoning: __spreadValues(__spreadValues({}, (openaiOptions == null ? void 0 : openaiOptions.reasoningEffort) != null && {
        effort: openaiOptions.reasoningEffort
      }), (openaiOptions == null ? void 0 : openaiOptions.reasoningSummary) != null && {
        summary: openaiOptions.reasoningSummary
      })
    }), modelConfig.requiredAutoTruncation && {
      truncation: "auto"
    });
    if (modelConfig.isReasoningModel) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported for reasoning models"
        });
      }
      if (baseArgs.top_p != null) {
        baseArgs.top_p = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "topP",
          details: "topP is not supported for reasoning models"
        });
      }
    }
    switch (type) {
      case "regular": {
        const { tools, tool_choice, toolWarnings } = prepareResponsesTools2({
          mode,
          strict: isStrict
          // TODO support provider options on tools
        });
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            tools,
            tool_choice
          }),
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            text: {
              format: mode.schema != null ? {
                type: "json_schema",
                strict: isStrict,
                name: (_c = mode.name) != null ? _c : "response",
                description: mode.description,
                schema: mode.schema
              } : { type: "json_object" }
            }
          }),
          warnings
        };
      }
      case "object-tool": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            tool_choice: { type: "function", name: mode.tool.name },
            tools: [
              {
                type: "function",
                name: mode.tool.name,
                description: mode.tool.description,
                parameters: mode.tool.parameters,
                strict: isStrict
              }
            ]
          }),
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d, _e, _f, _g;
      const { args: body, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: this.config.url({
          path: "/responses",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler2,
        successfulResponseHandler: createJsonResponseHandler(
          import_zod30.z.object({
            id: import_zod30.z.string(),
            created_at: import_zod30.z.number(),
            model: import_zod30.z.string(),
            output: import_zod30.z.array(
              import_zod30.z.discriminatedUnion("type", [
                import_zod30.z.object({
                  type: import_zod30.z.literal("message"),
                  role: import_zod30.z.literal("assistant"),
                  content: import_zod30.z.array(
                    import_zod30.z.object({
                      type: import_zod30.z.literal("output_text"),
                      text: import_zod30.z.string(),
                      annotations: import_zod30.z.array(
                        import_zod30.z.object({
                          type: import_zod30.z.literal("url_citation"),
                          start_index: import_zod30.z.number(),
                          end_index: import_zod30.z.number(),
                          url: import_zod30.z.string(),
                          title: import_zod30.z.string()
                        })
                      )
                    })
                  )
                }),
                import_zod30.z.object({
                  type: import_zod30.z.literal("function_call"),
                  call_id: import_zod30.z.string(),
                  name: import_zod30.z.string(),
                  arguments: import_zod30.z.string()
                }),
                import_zod30.z.object({
                  type: import_zod30.z.literal("web_search_call")
                }),
                import_zod30.z.object({
                  type: import_zod30.z.literal("computer_call")
                }),
                import_zod30.z.object({
                  type: import_zod30.z.literal("reasoning"),
                  summary: import_zod30.z.array(
                    import_zod30.z.object({
                      type: import_zod30.z.literal("summary_text"),
                      text: import_zod30.z.string()
                    })
                  )
                })
              ])
            ),
            incomplete_details: import_zod30.z.object({ reason: import_zod30.z.string() }).nullable(),
            usage: usageSchema2
          })
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const outputTextElements = response.output.filter((output) => output.type === "message").flatMap((output) => output.content).filter((content) => content.type === "output_text");
      const toolCalls = response.output.filter((output) => output.type === "function_call").map((output) => ({
        toolCallType: "function",
        toolCallId: output.call_id,
        toolName: output.name,
        args: output.arguments
      }));
      const reasoningSummary = (_b = (_a15 = response.output.find((item) => item.type === "reasoning")) == null ? void 0 : _a15.summary) != null ? _b : null;
      return {
        text: outputTextElements.map((content) => content.text).join("\n"),
        sources: outputTextElements.flatMap(
          (content) => content.annotations.map((annotation) => {
            var _a22, _b2, _c2;
            return {
              sourceType: "url",
              id: (_c2 = (_b2 = (_a22 = this.config).generateId) == null ? void 0 : _b2.call(_a22)) != null ? _c2 : generateId(),
              url: annotation.url,
              title: annotation.title
            };
          })
        ),
        finishReason: mapOpenAIResponseFinishReason2({
          finishReason: (_c = response.incomplete_details) == null ? void 0 : _c.reason,
          hasToolCalls: toolCalls.length > 0
        }),
        toolCalls: toolCalls.length > 0 ? toolCalls : void 0,
        reasoning: reasoningSummary ? reasoningSummary.map((summary) => ({
          type: "text",
          text: summary.text
        })) : void 0,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens
        },
        rawCall: {
          rawPrompt: void 0,
          rawSettings: {}
        },
        rawResponse: {
          headers: responseHeaders,
          body: rawResponse
        },
        request: {
          body: JSON.stringify(body)
        },
        response: {
          id: response.id,
          timestamp: new Date(response.created_at * 1e3),
          modelId: response.model
        },
        providerMetadata: {
          openai: {
            responseId: response.id,
            cachedPromptTokens: (_e = (_d = response.usage.input_tokens_details) == null ? void 0 : _d.cached_tokens) != null ? _e : null,
            reasoningTokens: (_g = (_f = response.usage.output_tokens_details) == null ? void 0 : _f.reasoning_tokens) != null ? _g : null
          }
        },
        warnings
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      const { args: body, warnings } = this.getArgs(options);
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/responses",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: __spreadProps(__spreadValues({}, body), {
          stream: true
        }),
        failedResponseHandler: openaiFailedResponseHandler2,
        successfulResponseHandler: createEventSourceResponseHandler(
          openaiResponsesChunkSchema2
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const self = this;
      let finishReason = "unknown";
      let promptTokens = NaN;
      let completionTokens = NaN;
      let cachedPromptTokens = null;
      let reasoningTokens = null;
      let responseId = null;
      const ongoingToolCalls = {};
      let hasToolCalls = false;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a15, _b, _c, _d, _e, _f, _g, _h;
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if (isResponseOutputItemAddedChunk2(value)) {
                if (value.item.type === "function_call") {
                  ongoingToolCalls[value.output_index] = {
                    toolName: value.item.name,
                    toolCallId: value.item.call_id
                  };
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: value.item.call_id,
                    toolName: value.item.name,
                    argsTextDelta: value.item.arguments
                  });
                }
              } else if (isResponseFunctionCallArgumentsDeltaChunk2(value)) {
                const toolCall = ongoingToolCalls[value.output_index];
                if (toolCall != null) {
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: toolCall.toolCallId,
                    toolName: toolCall.toolName,
                    argsTextDelta: value.delta
                  });
                }
              } else if (isResponseCreatedChunk2(value)) {
                responseId = value.response.id;
                controller.enqueue({
                  type: "response-metadata",
                  id: value.response.id,
                  timestamp: new Date(value.response.created_at * 1e3),
                  modelId: value.response.model
                });
              } else if (isTextDeltaChunk2(value)) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: value.delta
                });
              } else if (isResponseReasoningSummaryTextDeltaChunk2(value)) {
                controller.enqueue({
                  type: "reasoning",
                  textDelta: value.delta
                });
              } else if (isResponseOutputItemDoneChunk2(value) && value.item.type === "function_call") {
                ongoingToolCalls[value.output_index] = void 0;
                hasToolCalls = true;
                controller.enqueue({
                  type: "tool-call",
                  toolCallType: "function",
                  toolCallId: value.item.call_id,
                  toolName: value.item.name,
                  args: value.item.arguments
                });
              } else if (isResponseFinishedChunk2(value)) {
                finishReason = mapOpenAIResponseFinishReason2({
                  finishReason: (_a15 = value.response.incomplete_details) == null ? void 0 : _a15.reason,
                  hasToolCalls
                });
                promptTokens = value.response.usage.input_tokens;
                completionTokens = value.response.usage.output_tokens;
                cachedPromptTokens = (_c = (_b = value.response.usage.input_tokens_details) == null ? void 0 : _b.cached_tokens) != null ? _c : cachedPromptTokens;
                reasoningTokens = (_e = (_d = value.response.usage.output_tokens_details) == null ? void 0 : _d.reasoning_tokens) != null ? _e : reasoningTokens;
              } else if (isResponseAnnotationAddedChunk2(value)) {
                controller.enqueue({
                  type: "source",
                  source: {
                    sourceType: "url",
                    id: (_h = (_g = (_f = self.config).generateId) == null ? void 0 : _g.call(_f)) != null ? _h : generateId(),
                    url: value.annotation.url,
                    title: value.annotation.title
                  }
                });
              }
            },
            flush(controller) {
              controller.enqueue(__spreadValues({
                type: "finish",
                finishReason,
                usage: { promptTokens, completionTokens }
              }, (cachedPromptTokens != null || reasoningTokens != null) && {
                providerMetadata: {
                  openai: {
                    responseId,
                    cachedPromptTokens,
                    reasoningTokens
                  }
                }
              }));
            }
          })
        ),
        rawCall: {
          rawPrompt: void 0,
          rawSettings: {}
        },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        warnings
      };
    });
  }
};
var usageSchema2 = import_zod30.z.object({
  input_tokens: import_zod30.z.number(),
  input_tokens_details: import_zod30.z.object({ cached_tokens: import_zod30.z.number().nullish() }).nullish(),
  output_tokens: import_zod30.z.number(),
  output_tokens_details: import_zod30.z.object({ reasoning_tokens: import_zod30.z.number().nullish() }).nullish()
});
var textDeltaChunkSchema2 = import_zod30.z.object({
  type: import_zod30.z.literal("response.output_text.delta"),
  delta: import_zod30.z.string()
});
var responseFinishedChunkSchema2 = import_zod30.z.object({
  type: import_zod30.z.enum(["response.completed", "response.incomplete"]),
  response: import_zod30.z.object({
    incomplete_details: import_zod30.z.object({ reason: import_zod30.z.string() }).nullish(),
    usage: usageSchema2
  })
});
var responseCreatedChunkSchema2 = import_zod30.z.object({
  type: import_zod30.z.literal("response.created"),
  response: import_zod30.z.object({
    id: import_zod30.z.string(),
    created_at: import_zod30.z.number(),
    model: import_zod30.z.string()
  })
});
var responseOutputItemDoneSchema2 = import_zod30.z.object({
  type: import_zod30.z.literal("response.output_item.done"),
  output_index: import_zod30.z.number(),
  item: import_zod30.z.discriminatedUnion("type", [
    import_zod30.z.object({
      type: import_zod30.z.literal("message")
    }),
    import_zod30.z.object({
      type: import_zod30.z.literal("function_call"),
      id: import_zod30.z.string(),
      call_id: import_zod30.z.string(),
      name: import_zod30.z.string(),
      arguments: import_zod30.z.string(),
      status: import_zod30.z.literal("completed")
    })
  ])
});
var responseFunctionCallArgumentsDeltaSchema2 = import_zod30.z.object({
  type: import_zod30.z.literal("response.function_call_arguments.delta"),
  item_id: import_zod30.z.string(),
  output_index: import_zod30.z.number(),
  delta: import_zod30.z.string()
});
var responseOutputItemAddedSchema2 = import_zod30.z.object({
  type: import_zod30.z.literal("response.output_item.added"),
  output_index: import_zod30.z.number(),
  item: import_zod30.z.discriminatedUnion("type", [
    import_zod30.z.object({
      type: import_zod30.z.literal("message")
    }),
    import_zod30.z.object({
      type: import_zod30.z.literal("function_call"),
      id: import_zod30.z.string(),
      call_id: import_zod30.z.string(),
      name: import_zod30.z.string(),
      arguments: import_zod30.z.string()
    })
  ])
});
var responseAnnotationAddedSchema2 = import_zod30.z.object({
  type: import_zod30.z.literal("response.output_text.annotation.added"),
  annotation: import_zod30.z.object({
    type: import_zod30.z.literal("url_citation"),
    url: import_zod30.z.string(),
    title: import_zod30.z.string()
  })
});
var responseReasoningSummaryTextDeltaSchema2 = import_zod30.z.object({
  type: import_zod30.z.literal("response.reasoning_summary_text.delta"),
  item_id: import_zod30.z.string(),
  output_index: import_zod30.z.number(),
  summary_index: import_zod30.z.number(),
  delta: import_zod30.z.string()
});
var openaiResponsesChunkSchema2 = import_zod30.z.union([
  textDeltaChunkSchema2,
  responseFinishedChunkSchema2,
  responseCreatedChunkSchema2,
  responseOutputItemDoneSchema2,
  responseFunctionCallArgumentsDeltaSchema2,
  responseOutputItemAddedSchema2,
  responseAnnotationAddedSchema2,
  responseReasoningSummaryTextDeltaSchema2,
  import_zod30.z.object({ type: import_zod30.z.string() }).passthrough()
  // fallback for unknown chunks
]);
function isTextDeltaChunk2(chunk) {
  return chunk.type === "response.output_text.delta";
}
function isResponseOutputItemDoneChunk2(chunk) {
  return chunk.type === "response.output_item.done";
}
function isResponseFinishedChunk2(chunk) {
  return chunk.type === "response.completed" || chunk.type === "response.incomplete";
}
function isResponseCreatedChunk2(chunk) {
  return chunk.type === "response.created";
}
function isResponseFunctionCallArgumentsDeltaChunk2(chunk) {
  return chunk.type === "response.function_call_arguments.delta";
}
function isResponseOutputItemAddedChunk2(chunk) {
  return chunk.type === "response.output_item.added";
}
function isResponseAnnotationAddedChunk2(chunk) {
  return chunk.type === "response.output_text.annotation.added";
}
function isResponseReasoningSummaryTextDeltaChunk2(chunk) {
  return chunk.type === "response.reasoning_summary_text.delta";
}
function getResponsesModelConfig2(modelId) {
  if (modelId.startsWith("o")) {
    if (modelId.startsWith("o1-mini") || modelId.startsWith("o1-preview")) {
      return {
        isReasoningModel: true,
        systemMessageMode: "remove",
        requiredAutoTruncation: false
      };
    }
    return {
      isReasoningModel: true,
      systemMessageMode: "developer",
      requiredAutoTruncation: false
    };
  }
  return {
    isReasoningModel: false,
    systemMessageMode: "system",
    requiredAutoTruncation: false
  };
}
var openaiResponsesProviderOptionsSchema2 = import_zod30.z.object({
  metadata: import_zod30.z.any().nullish(),
  parallelToolCalls: import_zod30.z.boolean().nullish(),
  previousResponseId: import_zod30.z.string().nullish(),
  store: import_zod30.z.boolean().nullish(),
  user: import_zod30.z.string().nullish(),
  reasoningEffort: import_zod30.z.string().nullish(),
  strictSchemas: import_zod30.z.boolean().nullish(),
  instructions: import_zod30.z.string().nullish(),
  reasoningSummary: import_zod30.z.string().nullish()
});

// node_modules/.pnpm/@ai-sdk+azure@1.3.22_zod@3.25.67/node_modules/@ai-sdk/azure/dist/index.mjs
function createAzure(options = {}) {
  var _a15;
  const getHeaders = () => __spreadValues({
    "api-key": loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "AZURE_API_KEY",
      description: "Azure OpenAI"
    })
  }, options.headers);
  const getResourceName = () => loadSetting({
    settingValue: options.resourceName,
    settingName: "resourceName",
    environmentVariableName: "AZURE_RESOURCE_NAME",
    description: "Azure OpenAI resource name"
  });
  const apiVersion = (_a15 = options.apiVersion) != null ? _a15 : "2025-03-01-preview";
  const url = ({ path: path4, modelId }) => {
    if (path4 === "/responses") {
      return options.baseURL ? `${options.baseURL}${path4}?api-version=${apiVersion}` : `https://${getResourceName()}.openai.azure.com/openai/responses?api-version=${apiVersion}`;
    }
    return options.baseURL ? `${options.baseURL}/${modelId}${path4}?api-version=${apiVersion}` : `https://${getResourceName()}.openai.azure.com/openai/deployments/${modelId}${path4}?api-version=${apiVersion}`;
  };
  const createChatModel = (deploymentName, settings = {}) => new OpenAIChatLanguageModel2(deploymentName, settings, {
    provider: "azure-openai.chat",
    url,
    headers: getHeaders,
    compatibility: "strict",
    fetch: options.fetch
  });
  const createCompletionModel = (modelId, settings = {}) => new OpenAICompletionLanguageModel2(modelId, settings, {
    provider: "azure-openai.completion",
    url,
    compatibility: "strict",
    headers: getHeaders,
    fetch: options.fetch
  });
  const createEmbeddingModel = (modelId, settings = {}) => new OpenAIEmbeddingModel2(modelId, settings, {
    provider: "azure-openai.embeddings",
    headers: getHeaders,
    url,
    fetch: options.fetch
  });
  const createResponsesModel = (modelId) => new OpenAIResponsesLanguageModel2(modelId, {
    provider: "azure-openai.responses",
    url,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createImageModel = (modelId, settings = {}) => new OpenAIImageModel2(modelId, settings, {
    provider: "azure-openai.image",
    url,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createTranscriptionModel = (modelId) => new OpenAITranscriptionModel2(modelId, {
    provider: "azure-openai.transcription",
    url,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(deploymentId, settings) {
    if (new.target) {
      throw new Error(
        "The Azure OpenAI model function cannot be called with the new keyword."
      );
    }
    return createChatModel(deploymentId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.completion = createCompletionModel;
  provider.embedding = createEmbeddingModel;
  provider.image = createImageModel;
  provider.imageModel = createImageModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  provider.responses = createResponsesModel;
  provider.transcription = createTranscriptionModel;
  return provider;
}
var azure = createAzure();

// node_modules/.pnpm/@ai-sdk+groq@1.2.8_zod@3.25.67/node_modules/@ai-sdk/groq/dist/index.mjs
var import_zod31 = require("zod");
var import_zod32 = require("zod");
var import_zod33 = require("zod");
function convertToGroqChatMessages(prompt) {
  const messages = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        messages.push({ role: "system", content });
        break;
      }
      case "user": {
        if (content.length === 1 && content[0].type === "text") {
          messages.push({ role: "user", content: content[0].text });
          break;
        }
        messages.push({
          role: "user",
          content: content.map((part) => {
            var _a15;
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text };
              }
              case "image": {
                return {
                  type: "image_url",
                  image_url: {
                    url: part.image instanceof URL ? part.image.toString() : `data:${(_a15 = part.mimeType) != null ? _a15 : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`
                  }
                };
              }
              case "file": {
                throw new UnsupportedFunctionalityError({
                  functionality: "File content parts in user messages"
                });
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        let text = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                }
              });
              break;
            }
          }
        }
        messages.push({
          role: "assistant",
          content: text,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0
        });
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          messages.push({
            role: "tool",
            tool_call_id: toolResponse.toolCallId,
            content: JSON.stringify(toolResponse.result)
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}
function getResponseMetadata4({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}
var groqErrorDataSchema = import_zod32.z.object({
  error: import_zod32.z.object({
    message: import_zod32.z.string(),
    type: import_zod32.z.string()
  })
});
var groqFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: groqErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
function prepareTools6({
  mode
}) {
  var _a15;
  const tools = ((_a15 = mode.tools) == null ? void 0 : _a15.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const toolChoice = mode.toolChoice;
  const groqTools = [];
  for (const tool of tools) {
    if (tool.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool });
    } else {
      groqTools.push({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        }
      });
    }
  }
  if (toolChoice == null) {
    return { tools: groqTools, tool_choice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
    case "required":
      return { tools: groqTools, tool_choice: type, toolWarnings };
    case "tool":
      return {
        tools: groqTools,
        tool_choice: {
          type: "function",
          function: {
            name: toolChoice.toolName
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
function mapGroqFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var GroqChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.supportsStructuredOutputs = false;
    this.defaultObjectGenerationMode = "json";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get supportsImageUrls() {
    return !this.settings.downloadImages;
  }
  getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    stream,
    providerMetadata
  }) {
    const type = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (responseFormat != null && responseFormat.type === "json" && responseFormat.schema != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is not supported"
      });
    }
    const groqOptions = parseProviderOptions({
      provider: "groq",
      providerOptions: providerMetadata,
      schema: import_zod31.z.object({
        reasoningFormat: import_zod31.z.enum(["parsed", "raw", "hidden"]).nullish()
      })
    });
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      user: this.settings.user,
      parallel_tool_calls: this.settings.parallelToolCalls,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      stop: stopSequences,
      seed,
      // response format:
      response_format: (
        // json object response format is not supported for streaming:
        stream === false && (responseFormat == null ? void 0 : responseFormat.type) === "json" ? { type: "json_object" } : void 0
      ),
      // provider options:
      reasoning_format: groqOptions == null ? void 0 : groqOptions.reasoningFormat,
      // messages:
      messages: convertToGroqChatMessages(prompt)
    };
    switch (type) {
      case "regular": {
        const { tools, tool_choice, toolWarnings } = prepareTools6({ mode });
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            tools,
            tool_choice
          }),
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            response_format: (
              // json object response format is not supported for streaming:
              stream === false ? { type: "json_object" } : void 0
            )
          }),
          warnings
        };
      }
      case "object-tool": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            tool_choice: {
              type: "function",
              function: { name: mode.tool.name }
            },
            tools: [
              {
                type: "function",
                function: {
                  name: mode.tool.name,
                  description: mode.tool.description,
                  parameters: mode.tool.parameters
                }
              }
            ]
          }),
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d, _e, _f, _g;
      const { args, warnings } = this.getArgs(__spreadProps(__spreadValues({}, options), { stream: false }));
      const body = JSON.stringify(args);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: args,
        failedResponseHandler: groqFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          groqChatResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a16 = args, { messages: rawPrompt } = _a16, rawSettings = __objRest(_a16, ["messages"]);
      const choice = response.choices[0];
      return {
        text: (_a15 = choice.message.content) != null ? _a15 : void 0,
        reasoning: (_b = choice.message.reasoning) != null ? _b : void 0,
        toolCalls: (_c = choice.message.tool_calls) == null ? void 0 : _c.map((toolCall) => {
          var _a22;
          return {
            toolCallType: "function",
            toolCallId: (_a22 = toolCall.id) != null ? _a22 : generateId(),
            toolName: toolCall.function.name,
            args: toolCall.function.arguments
          };
        }),
        finishReason: mapGroqFinishReason(choice.finish_reason),
        usage: {
          promptTokens: (_e = (_d = response.usage) == null ? void 0 : _d.prompt_tokens) != null ? _e : NaN,
          completionTokens: (_g = (_f = response.usage) == null ? void 0 : _f.completion_tokens) != null ? _g : NaN
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        response: getResponseMetadata4(response),
        warnings,
        request: { body }
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      const { args, warnings } = this.getArgs(__spreadProps(__spreadValues({}, options), { stream: true }));
      const body = JSON.stringify(__spreadProps(__spreadValues({}, args), { stream: true }));
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: __spreadProps(__spreadValues({}, args), {
          stream: true
        }),
        failedResponseHandler: groqFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(groqChatChunkSchema),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { messages: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["messages"]);
      const toolCalls = [];
      let finishReason = "unknown";
      let usage = {
        promptTokens: void 0,
        completionTokens: void 0
      };
      let isFirstChunk = true;
      let providerMetadata;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a16, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if ("error" in value) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: value.error });
                return;
              }
              if (isFirstChunk) {
                isFirstChunk = false;
                controller.enqueue(__spreadValues({
                  type: "response-metadata"
                }, getResponseMetadata4(value)));
              }
              if (((_a16 = value.x_groq) == null ? void 0 : _a16.usage) != null) {
                usage = {
                  promptTokens: (_b = value.x_groq.usage.prompt_tokens) != null ? _b : void 0,
                  completionTokens: (_c = value.x_groq.usage.completion_tokens) != null ? _c : void 0
                };
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapGroqFinishReason(choice.finish_reason);
              }
              if ((choice == null ? void 0 : choice.delta) == null) {
                return;
              }
              const delta = choice.delta;
              if (delta.reasoning != null && delta.reasoning.length > 0) {
                controller.enqueue({
                  type: "reasoning",
                  textDelta: delta.reasoning
                });
              }
              if (delta.content != null && delta.content.length > 0) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: delta.content
                });
              }
              if (delta.tool_calls != null) {
                for (const toolCallDelta of delta.tool_calls) {
                  const index = toolCallDelta.index;
                  if (toolCalls[index] == null) {
                    if (toolCallDelta.type !== "function") {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function' type.`
                      });
                    }
                    if (toolCallDelta.id == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'id' to be a string.`
                      });
                    }
                    if (((_d = toolCallDelta.function) == null ? void 0 : _d.name) == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function.name' to be a string.`
                      });
                    }
                    toolCalls[index] = {
                      id: toolCallDelta.id,
                      type: "function",
                      function: {
                        name: toolCallDelta.function.name,
                        arguments: (_e = toolCallDelta.function.arguments) != null ? _e : ""
                      },
                      hasFinished: false
                    };
                    const toolCall2 = toolCalls[index];
                    if (((_f = toolCall2.function) == null ? void 0 : _f.name) != null && ((_g = toolCall2.function) == null ? void 0 : _g.arguments) != null) {
                      if (toolCall2.function.arguments.length > 0) {
                        controller.enqueue({
                          type: "tool-call-delta",
                          toolCallType: "function",
                          toolCallId: toolCall2.id,
                          toolName: toolCall2.function.name,
                          argsTextDelta: toolCall2.function.arguments
                        });
                      }
                      if (isParsableJson(toolCall2.function.arguments)) {
                        controller.enqueue({
                          type: "tool-call",
                          toolCallType: "function",
                          toolCallId: (_h = toolCall2.id) != null ? _h : generateId(),
                          toolName: toolCall2.function.name,
                          args: toolCall2.function.arguments
                        });
                        toolCall2.hasFinished = true;
                      }
                    }
                    continue;
                  }
                  const toolCall = toolCalls[index];
                  if (toolCall.hasFinished) {
                    continue;
                  }
                  if (((_i = toolCallDelta.function) == null ? void 0 : _i.arguments) != null) {
                    toolCall.function.arguments += (_k = (_j = toolCallDelta.function) == null ? void 0 : _j.arguments) != null ? _k : "";
                  }
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    argsTextDelta: (_l = toolCallDelta.function.arguments) != null ? _l : ""
                  });
                  if (((_m = toolCall.function) == null ? void 0 : _m.name) != null && ((_n = toolCall.function) == null ? void 0 : _n.arguments) != null && isParsableJson(toolCall.function.arguments)) {
                    controller.enqueue({
                      type: "tool-call",
                      toolCallType: "function",
                      toolCallId: (_o = toolCall.id) != null ? _o : generateId(),
                      toolName: toolCall.function.name,
                      args: toolCall.function.arguments
                    });
                    toolCall.hasFinished = true;
                  }
                }
              }
            },
            flush(controller) {
              var _a16, _b;
              controller.enqueue(__spreadValues({
                type: "finish",
                finishReason,
                usage: {
                  promptTokens: (_a16 = usage.promptTokens) != null ? _a16 : NaN,
                  completionTokens: (_b = usage.completionTokens) != null ? _b : NaN
                }
              }, providerMetadata != null ? { providerMetadata } : {}));
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        warnings,
        request: { body }
      };
    });
  }
};
var groqChatResponseSchema = import_zod31.z.object({
  id: import_zod31.z.string().nullish(),
  created: import_zod31.z.number().nullish(),
  model: import_zod31.z.string().nullish(),
  choices: import_zod31.z.array(
    import_zod31.z.object({
      message: import_zod31.z.object({
        content: import_zod31.z.string().nullish(),
        reasoning: import_zod31.z.string().nullish(),
        tool_calls: import_zod31.z.array(
          import_zod31.z.object({
            id: import_zod31.z.string().nullish(),
            type: import_zod31.z.literal("function"),
            function: import_zod31.z.object({
              name: import_zod31.z.string(),
              arguments: import_zod31.z.string()
            })
          })
        ).nullish()
      }),
      index: import_zod31.z.number(),
      finish_reason: import_zod31.z.string().nullish()
    })
  ),
  usage: import_zod31.z.object({
    prompt_tokens: import_zod31.z.number().nullish(),
    completion_tokens: import_zod31.z.number().nullish()
  }).nullish()
});
var groqChatChunkSchema = import_zod31.z.union([
  import_zod31.z.object({
    id: import_zod31.z.string().nullish(),
    created: import_zod31.z.number().nullish(),
    model: import_zod31.z.string().nullish(),
    choices: import_zod31.z.array(
      import_zod31.z.object({
        delta: import_zod31.z.object({
          content: import_zod31.z.string().nullish(),
          reasoning: import_zod31.z.string().nullish(),
          tool_calls: import_zod31.z.array(
            import_zod31.z.object({
              index: import_zod31.z.number(),
              id: import_zod31.z.string().nullish(),
              type: import_zod31.z.literal("function").optional(),
              function: import_zod31.z.object({
                name: import_zod31.z.string().nullish(),
                arguments: import_zod31.z.string().nullish()
              })
            })
          ).nullish()
        }).nullish(),
        finish_reason: import_zod31.z.string().nullable().optional(),
        index: import_zod31.z.number()
      })
    ),
    x_groq: import_zod31.z.object({
      usage: import_zod31.z.object({
        prompt_tokens: import_zod31.z.number().nullish(),
        completion_tokens: import_zod31.z.number().nullish()
      }).nullish()
    }).nullish()
  }),
  groqErrorDataSchema
]);
var groqProviderOptionsSchema = import_zod33.z.object({
  language: import_zod33.z.string().nullish(),
  prompt: import_zod33.z.string().nullish(),
  responseFormat: import_zod33.z.string().nullish(),
  temperature: import_zod33.z.number().min(0).max(1).nullish(),
  timestampGranularities: import_zod33.z.array(import_zod33.z.string()).nullish()
});
var GroqTranscriptionModel = class {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v1";
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    audio,
    mediaType,
    providerOptions
  }) {
    var _a15, _b, _c, _d, _e;
    const warnings = [];
    const groqOptions = parseProviderOptions({
      provider: "groq",
      providerOptions,
      schema: groqProviderOptionsSchema
    });
    const formData = new FormData();
    const blob = audio instanceof Uint8Array ? new Blob([audio]) : new Blob([convertBase64ToUint8Array(audio)]);
    formData.append("model", this.modelId);
    formData.append("file", new File([blob], "audio", { type: mediaType }));
    if (groqOptions) {
      const transcriptionModelOptions = {
        language: (_a15 = groqOptions.language) != null ? _a15 : void 0,
        prompt: (_b = groqOptions.prompt) != null ? _b : void 0,
        response_format: (_c = groqOptions.responseFormat) != null ? _c : void 0,
        temperature: (_d = groqOptions.temperature) != null ? _d : void 0,
        timestamp_granularities: (_e = groqOptions.timestampGranularities) != null ? _e : void 0
      };
      for (const key in transcriptionModelOptions) {
        const value = transcriptionModelOptions[key];
        if (value !== void 0) {
          formData.append(key, String(value));
        }
      }
    }
    return {
      formData,
      warnings
    };
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d, _e;
      const currentDate = (_c = (_b = (_a15 = this.config._internal) == null ? void 0 : _a15.currentDate) == null ? void 0 : _b.call(_a15)) != null ? _c : /* @__PURE__ */ new Date();
      const { formData, warnings } = this.getArgs(options);
      const {
        value: response,
        responseHeaders,
        rawValue: rawResponse
      } = yield postFormDataToApi({
        url: this.config.url({
          path: "/audio/transcriptions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        formData,
        failedResponseHandler: groqFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          groqTranscriptionResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      return {
        text: response.text,
        segments: (_e = (_d = response.segments) == null ? void 0 : _d.map((segment) => ({
          text: segment.text,
          startSecond: segment.start,
          endSecond: segment.end
        }))) != null ? _e : [],
        language: response.language,
        durationInSeconds: response.duration,
        warnings,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders,
          body: rawResponse
        }
      };
    });
  }
};
var groqTranscriptionResponseSchema = import_zod33.z.object({
  task: import_zod33.z.string(),
  language: import_zod33.z.string(),
  duration: import_zod33.z.number(),
  text: import_zod33.z.string(),
  segments: import_zod33.z.array(
    import_zod33.z.object({
      id: import_zod33.z.number(),
      seek: import_zod33.z.number(),
      start: import_zod33.z.number(),
      end: import_zod33.z.number(),
      text: import_zod33.z.string(),
      tokens: import_zod33.z.array(import_zod33.z.number()),
      temperature: import_zod33.z.number(),
      avg_logprob: import_zod33.z.number(),
      compression_ratio: import_zod33.z.number(),
      no_speech_prob: import_zod33.z.number()
    })
  ),
  x_groq: import_zod33.z.object({
    id: import_zod33.z.string()
  })
});
function createGroq(options = {}) {
  var _a15;
  const baseURL = (_a15 = withoutTrailingSlash(options.baseURL)) != null ? _a15 : "https://api.groq.com/openai/v1";
  const getHeaders = () => __spreadValues({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "GROQ_API_KEY",
      description: "Groq"
    })}`
  }, options.headers);
  const createChatModel = (modelId, settings = {}) => new GroqChatLanguageModel(modelId, settings, {
    provider: "groq.chat",
    url: ({ path: path4 }) => `${baseURL}${path4}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createLanguageModel = (modelId, settings) => {
    if (new.target) {
      throw new Error(
        "The Groq model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  const createTranscriptionModel = (modelId) => {
    return new GroqTranscriptionModel(modelId, {
      provider: "groq.transcription",
      url: ({ path: path4 }) => `${baseURL}${path4}`,
      headers: getHeaders,
      fetch: options.fetch
    });
  };
  const provider = function(modelId, settings) {
    return createLanguageModel(modelId, settings);
  };
  provider.languageModel = createLanguageModel;
  provider.chat = createChatModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
  };
  provider.transcription = createTranscriptionModel;
  return provider;
}
var groq = createGroq();

// node_modules/.pnpm/@ai-sdk+cerebras@0.2.13_zod@3.25.67/node_modules/@ai-sdk/cerebras/dist/index.mjs
var import_zod34 = require("zod");
var cerebrasErrorSchema = import_zod34.z.object({
  message: import_zod34.z.string(),
  type: import_zod34.z.string(),
  param: import_zod34.z.string(),
  code: import_zod34.z.string()
});
var cerebrasErrorStructure = {
  errorSchema: cerebrasErrorSchema,
  errorToMessage: (data) => data.message
};
function createCerebras(options = {}) {
  var _a15;
  const baseURL = withoutTrailingSlash(
    (_a15 = options.baseURL) != null ? _a15 : "https://api.cerebras.ai/v1"
  );
  const getHeaders = () => __spreadValues({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "CEREBRAS_API_KEY",
      description: "Cerebras API key"
    })}`
  }, options.headers);
  const createLanguageModel = (modelId, settings = {}) => {
    return new OpenAICompatibleChatLanguageModel(modelId, settings, {
      provider: `cerebras.chat`,
      url: ({ path: path4 }) => `${baseURL}${path4}`,
      headers: getHeaders,
      fetch: options.fetch,
      defaultObjectGenerationMode: "tool",
      errorStructure: cerebrasErrorStructure
    });
  };
  const provider = (modelId, settings) => createLanguageModel(modelId, settings);
  provider.languageModel = createLanguageModel;
  provider.chat = createLanguageModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
  };
  return provider;
}
var cerebras = createCerebras();

// node_modules/.pnpm/@ai-sdk+togetherai@0.2.13_zod@3.25.67/node_modules/@ai-sdk/togetherai/dist/index.mjs
var import_zod35 = require("zod");
var TogetherAIImageModel = class {
  constructor(modelId, settings, config) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    this.specificationVersion = "v1";
  }
  get provider() {
    return this.config.provider;
  }
  get maxImagesPerCall() {
    var _a15;
    return (_a15 = this.settings.maxImagesPerCall) != null ? _a15 : 1;
  }
  doGenerate(_0) {
    return __async(this, arguments, function* ({
      prompt,
      n,
      size,
      seed,
      providerOptions,
      headers,
      abortSignal
    }) {
      var _a15, _b, _c, _d;
      const warnings = [];
      if (size != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "aspectRatio",
          details: "This model does not support the `aspectRatio` option. Use `size` instead."
        });
      }
      const currentDate = (_c = (_b = (_a15 = this.config._internal) == null ? void 0 : _a15.currentDate) == null ? void 0 : _b.call(_a15)) != null ? _c : /* @__PURE__ */ new Date();
      const splitSize = size == null ? void 0 : size.split("x");
      const { value: response, responseHeaders } = yield postJsonToApi({
        url: `${this.config.baseURL}/images/generations`,
        headers: combineHeaders(this.config.headers(), headers),
        body: __spreadValues(__spreadProps(__spreadValues({
          model: this.modelId,
          prompt,
          seed,
          n
        }, splitSize && {
          width: parseInt(splitSize[0]),
          height: parseInt(splitSize[1])
        }), {
          response_format: "base64"
        }), (_d = providerOptions.togetherai) != null ? _d : {}),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: togetheraiErrorSchema,
          errorToMessage: (data) => data.error.message
        }),
        successfulResponseHandler: createJsonResponseHandler(
          togetheraiImageResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        images: response.data.map((item) => item.b64_json),
        warnings,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders
        }
      };
    });
  }
};
var togetheraiImageResponseSchema = import_zod35.z.object({
  data: import_zod35.z.array(
    import_zod35.z.object({
      b64_json: import_zod35.z.string()
    })
  )
});
var togetheraiErrorSchema = import_zod35.z.object({
  error: import_zod35.z.object({
    message: import_zod35.z.string()
  })
});
function createTogetherAI(options = {}) {
  var _a15;
  const baseURL = withoutTrailingSlash(
    (_a15 = options.baseURL) != null ? _a15 : "https://api.together.xyz/v1/"
  );
  const getHeaders = () => __spreadValues({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "TOGETHER_AI_API_KEY",
      description: "TogetherAI"
    })}`
  }, options.headers);
  const getCommonModelConfig = (modelType) => ({
    provider: `togetherai.${modelType}`,
    url: ({ path: path4 }) => `${baseURL}${path4}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createChatModel = (modelId, settings = {}) => {
    return new OpenAICompatibleChatLanguageModel(modelId, settings, __spreadProps(__spreadValues({}, getCommonModelConfig("chat")), {
      defaultObjectGenerationMode: "tool"
    }));
  };
  const createCompletionModel = (modelId, settings = {}) => new OpenAICompatibleCompletionLanguageModel(
    modelId,
    settings,
    getCommonModelConfig("completion")
  );
  const createTextEmbeddingModel = (modelId, settings = {}) => new OpenAICompatibleEmbeddingModel(
    modelId,
    settings,
    getCommonModelConfig("embedding")
  );
  const createImageModel = (modelId, settings = {}) => new TogetherAIImageModel(modelId, settings, __spreadProps(__spreadValues({}, getCommonModelConfig("image")), {
    baseURL: baseURL != null ? baseURL : "https://api.together.xyz/v1/"
  }));
  const provider = (modelId, settings) => createChatModel(modelId, settings);
  provider.completionModel = createCompletionModel;
  provider.languageModel = createChatModel;
  provider.chatModel = createChatModel;
  provider.textEmbeddingModel = createTextEmbeddingModel;
  provider.image = createImageModel;
  provider.imageModel = createImageModel;
  return provider;
}
var togetherai = createTogetherAI();

// node_modules/.pnpm/@ai-sdk+mistral@1.2.7_zod@3.25.67/node_modules/@ai-sdk/mistral/dist/index.mjs
var import_zod36 = require("zod");
var import_zod37 = require("zod");
var import_zod38 = require("zod");
function convertToMistralChatMessages(prompt) {
  const messages = [];
  for (let i = 0; i < prompt.length; i++) {
    const { role, content } = prompt[i];
    const isLastMessage = i === prompt.length - 1;
    switch (role) {
      case "system": {
        messages.push({ role: "system", content });
        break;
      }
      case "user": {
        messages.push({
          role: "user",
          content: content.map((part) => {
            var _a15;
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text };
              }
              case "image": {
                return {
                  type: "image_url",
                  image_url: part.image instanceof URL ? part.image.toString() : `data:${(_a15 = part.mimeType) != null ? _a15 : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`
                };
              }
              case "file": {
                if (!(part.data instanceof URL)) {
                  throw new UnsupportedFunctionalityError({
                    functionality: "File content parts in user messages"
                  });
                }
                switch (part.mimeType) {
                  case "application/pdf": {
                    return {
                      type: "document_url",
                      document_url: part.data.toString()
                    };
                  }
                  default: {
                    throw new UnsupportedFunctionalityError({
                      functionality: "Only PDF files are supported in user messages"
                    });
                  }
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        let text = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                }
              });
              break;
            }
          }
        }
        messages.push({
          role: "assistant",
          content: text,
          prefix: isLastMessage ? true : void 0,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0
        });
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          messages.push({
            role: "tool",
            name: toolResponse.toolName,
            content: JSON.stringify(toolResponse.result),
            tool_call_id: toolResponse.toolCallId
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}
function mapMistralFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
    case "model_length":
      return "length";
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var mistralErrorDataSchema = import_zod37.z.object({
  object: import_zod37.z.literal("error"),
  message: import_zod37.z.string(),
  type: import_zod37.z.string(),
  param: import_zod37.z.string().nullable(),
  code: import_zod37.z.string().nullable()
});
var mistralFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: mistralErrorDataSchema,
  errorToMessage: (data) => data.message
});
function getResponseMetadata5({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}
function prepareTools7(mode) {
  var _a15;
  const tools = ((_a15 = mode.tools) == null ? void 0 : _a15.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const mistralTools = [];
  for (const tool of tools) {
    if (tool.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool });
    } else {
      mistralTools.push({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        }
      });
    }
  }
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return { tools: mistralTools, tool_choice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
      return { tools: mistralTools, tool_choice: type, toolWarnings };
    case "required":
      return { tools: mistralTools, tool_choice: "any", toolWarnings };
    case "tool":
      return {
        tools: mistralTools.filter(
          (tool) => tool.function.name === toolChoice.toolName
        ),
        tool_choice: "any",
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var MistralChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "json";
    this.supportsImageUrls = false;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  supportsUrl(url) {
    return url.protocol === "https:";
  }
  getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    providerMetadata
  }) {
    var _a15, _b;
    const type = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty"
      });
    }
    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty"
      });
    }
    if (stopSequences != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "stopSequences"
      });
    }
    if (responseFormat != null && responseFormat.type === "json" && responseFormat.schema != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is not supported"
      });
    }
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      safe_prompt: this.settings.safePrompt,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      random_seed: seed,
      // response format:
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? { type: "json_object" } : void 0,
      // mistral-specific provider options:
      document_image_limit: (_a15 = providerMetadata == null ? void 0 : providerMetadata.mistral) == null ? void 0 : _a15.documentImageLimit,
      document_page_limit: (_b = providerMetadata == null ? void 0 : providerMetadata.mistral) == null ? void 0 : _b.documentPageLimit,
      // messages:
      messages: convertToMistralChatMessages(prompt)
    };
    switch (type) {
      case "regular": {
        const { tools, tool_choice, toolWarnings } = prepareTools7(mode);
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), { tools, tool_choice }),
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            response_format: { type: "json_object" }
          }),
          warnings
        };
      }
      case "object-tool": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            tool_choice: "any",
            tools: [{ type: "function", function: mode.tool }]
          }),
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15;
      const { args, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: `${this.config.baseURL}/chat/completions`,
        headers: combineHeaders(this.config.headers(), options.headers),
        body: args,
        failedResponseHandler: mistralFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          mistralChatResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a16 = args, { messages: rawPrompt } = _a16, rawSettings = __objRest(_a16, ["messages"]);
      const choice = response.choices[0];
      let text = extractTextContent(choice.message.content);
      const lastMessage = rawPrompt[rawPrompt.length - 1];
      if (lastMessage.role === "assistant" && (text == null ? void 0 : text.startsWith(lastMessage.content))) {
        text = text.slice(lastMessage.content.length);
      }
      return {
        text,
        toolCalls: (_a15 = choice.message.tool_calls) == null ? void 0 : _a15.map((toolCall) => ({
          toolCallType: "function",
          toolCallId: toolCall.id,
          toolName: toolCall.function.name,
          args: toolCall.function.arguments
        })),
        finishReason: mapMistralFinishReason(choice.finish_reason),
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: {
          headers: responseHeaders,
          body: rawResponse
        },
        request: { body: JSON.stringify(args) },
        response: getResponseMetadata5(response),
        warnings
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      const { args, warnings } = this.getArgs(options);
      const body = __spreadProps(__spreadValues({}, args), { stream: true });
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: `${this.config.baseURL}/chat/completions`,
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: mistralFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          mistralChatChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { messages: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["messages"]);
      let finishReason = "unknown";
      let usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      let chunkNumber = 0;
      let trimLeadingSpace = false;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              if (!chunk.success) {
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              chunkNumber++;
              const value = chunk.value;
              if (chunkNumber === 1) {
                controller.enqueue(__spreadValues({
                  type: "response-metadata"
                }, getResponseMetadata5(value)));
              }
              if (value.usage != null) {
                usage = {
                  promptTokens: value.usage.prompt_tokens,
                  completionTokens: value.usage.completion_tokens
                };
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapMistralFinishReason(choice.finish_reason);
              }
              if ((choice == null ? void 0 : choice.delta) == null) {
                return;
              }
              const delta = choice.delta;
              const textContent = extractTextContent(delta.content);
              if (chunkNumber <= 2) {
                const lastMessage = rawPrompt[rawPrompt.length - 1];
                if (lastMessage.role === "assistant" && textContent === lastMessage.content.trimEnd()) {
                  if (textContent.length < lastMessage.content.length) {
                    trimLeadingSpace = true;
                  }
                  return;
                }
              }
              if (textContent != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: trimLeadingSpace ? textContent.trimStart() : textContent
                });
                trimLeadingSpace = false;
              }
              if (delta.tool_calls != null) {
                for (const toolCall of delta.tool_calls) {
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    argsTextDelta: toolCall.function.arguments
                  });
                  controller.enqueue({
                    type: "tool-call",
                    toolCallType: "function",
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    args: toolCall.function.arguments
                  });
                }
              }
            },
            flush(controller) {
              controller.enqueue({ type: "finish", finishReason, usage });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        warnings
      };
    });
  }
};
function extractTextContent(content) {
  if (typeof content === "string") {
    return content;
  }
  if (content == null) {
    return void 0;
  }
  const textContent = [];
  for (const chunk of content) {
    const { type } = chunk;
    switch (type) {
      case "text":
        textContent.push(chunk.text);
        break;
      case "image_url":
      case "reference":
        break;
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  return textContent.length ? textContent.join("") : void 0;
}
var mistralContentSchema = import_zod36.z.union([
  import_zod36.z.string(),
  import_zod36.z.array(
    import_zod36.z.discriminatedUnion("type", [
      import_zod36.z.object({
        type: import_zod36.z.literal("text"),
        text: import_zod36.z.string()
      }),
      import_zod36.z.object({
        type: import_zod36.z.literal("image_url"),
        image_url: import_zod36.z.union([
          import_zod36.z.string(),
          import_zod36.z.object({
            url: import_zod36.z.string(),
            detail: import_zod36.z.string().nullable()
          })
        ])
      }),
      import_zod36.z.object({
        type: import_zod36.z.literal("reference"),
        reference_ids: import_zod36.z.array(import_zod36.z.number())
      })
    ])
  )
]).nullish();
var mistralChatResponseSchema = import_zod36.z.object({
  id: import_zod36.z.string().nullish(),
  created: import_zod36.z.number().nullish(),
  model: import_zod36.z.string().nullish(),
  choices: import_zod36.z.array(
    import_zod36.z.object({
      message: import_zod36.z.object({
        role: import_zod36.z.literal("assistant"),
        content: mistralContentSchema,
        tool_calls: import_zod36.z.array(
          import_zod36.z.object({
            id: import_zod36.z.string(),
            function: import_zod36.z.object({ name: import_zod36.z.string(), arguments: import_zod36.z.string() })
          })
        ).nullish()
      }),
      index: import_zod36.z.number(),
      finish_reason: import_zod36.z.string().nullish()
    })
  ),
  object: import_zod36.z.literal("chat.completion"),
  usage: import_zod36.z.object({
    prompt_tokens: import_zod36.z.number(),
    completion_tokens: import_zod36.z.number()
  })
});
var mistralChatChunkSchema = import_zod36.z.object({
  id: import_zod36.z.string().nullish(),
  created: import_zod36.z.number().nullish(),
  model: import_zod36.z.string().nullish(),
  choices: import_zod36.z.array(
    import_zod36.z.object({
      delta: import_zod36.z.object({
        role: import_zod36.z.enum(["assistant"]).optional(),
        content: mistralContentSchema,
        tool_calls: import_zod36.z.array(
          import_zod36.z.object({
            id: import_zod36.z.string(),
            function: import_zod36.z.object({ name: import_zod36.z.string(), arguments: import_zod36.z.string() })
          })
        ).nullish()
      }),
      finish_reason: import_zod36.z.string().nullish(),
      index: import_zod36.z.number()
    })
  ),
  usage: import_zod36.z.object({
    prompt_tokens: import_zod36.z.number(),
    completion_tokens: import_zod36.z.number()
  }).nullish()
});
var MistralEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    var _a15;
    return (_a15 = this.settings.maxEmbeddingsPerCall) != null ? _a15 : 32;
  }
  get supportsParallelCalls() {
    var _a15;
    return (_a15 = this.settings.supportsParallelCalls) != null ? _a15 : false;
  }
  doEmbed(_0) {
    return __async(this, arguments, function* ({
      values,
      abortSignal,
      headers
    }) {
      if (values.length > this.maxEmbeddingsPerCall) {
        throw new TooManyEmbeddingValuesForCallError({
          provider: this.provider,
          modelId: this.modelId,
          maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
          values
        });
      }
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: `${this.config.baseURL}/embeddings`,
        headers: combineHeaders(this.config.headers(), headers),
        body: {
          model: this.modelId,
          input: values,
          encoding_format: "float"
        },
        failedResponseHandler: mistralFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          MistralTextEmbeddingResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        embeddings: response.data.map((item) => item.embedding),
        usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
        rawResponse: { headers: responseHeaders }
      };
    });
  }
};
var MistralTextEmbeddingResponseSchema = import_zod38.z.object({
  data: import_zod38.z.array(import_zod38.z.object({ embedding: import_zod38.z.array(import_zod38.z.number()) })),
  usage: import_zod38.z.object({ prompt_tokens: import_zod38.z.number() }).nullish()
});
function createMistral(options = {}) {
  var _a15;
  const baseURL = (_a15 = withoutTrailingSlash(options.baseURL)) != null ? _a15 : "https://api.mistral.ai/v1";
  const getHeaders = () => __spreadValues({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "MISTRAL_API_KEY",
      description: "Mistral"
    })}`
  }, options.headers);
  const createChatModel = (modelId, settings = {}) => new MistralChatLanguageModel(modelId, settings, {
    provider: "mistral.chat",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createEmbeddingModel = (modelId, settings = {}) => new MistralEmbeddingModel(modelId, settings, {
    provider: "mistral.embedding",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Mistral model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  return provider;
}
var mistral = createMistral();

// node_modules/.pnpm/@ai-sdk+deepseek@0.2.13_zod@3.25.67/node_modules/@ai-sdk/deepseek/dist/index.mjs
var import_zod39 = require("zod");
var buildDeepseekMetadata = (usage) => {
  var _a15, _b;
  return usage == null ? void 0 : {
    deepseek: {
      promptCacheHitTokens: (_a15 = usage.prompt_cache_hit_tokens) != null ? _a15 : NaN,
      promptCacheMissTokens: (_b = usage.prompt_cache_miss_tokens) != null ? _b : NaN
    }
  };
};
var deepSeekMetadataExtractor = {
  extractMetadata: ({ parsedBody }) => {
    const parsed = safeValidateTypes({
      value: parsedBody,
      schema: deepSeekResponseSchema
    });
    return !parsed.success || parsed.value.usage == null ? void 0 : buildDeepseekMetadata(parsed.value.usage);
  },
  createStreamExtractor: () => {
    let usage;
    return {
      processChunk: (chunk) => {
        var _a15, _b;
        const parsed = safeValidateTypes({
          value: chunk,
          schema: deepSeekStreamChunkSchema
        });
        if (parsed.success && ((_b = (_a15 = parsed.value.choices) == null ? void 0 : _a15[0]) == null ? void 0 : _b.finish_reason) === "stop" && parsed.value.usage) {
          usage = parsed.value.usage;
        }
      },
      buildMetadata: () => buildDeepseekMetadata(usage)
    };
  }
};
var deepSeekUsageSchema = import_zod39.z.object({
  prompt_cache_hit_tokens: import_zod39.z.number().nullish(),
  prompt_cache_miss_tokens: import_zod39.z.number().nullish()
});
var deepSeekResponseSchema = import_zod39.z.object({
  usage: deepSeekUsageSchema.nullish()
});
var deepSeekStreamChunkSchema = import_zod39.z.object({
  choices: import_zod39.z.array(
    import_zod39.z.object({
      finish_reason: import_zod39.z.string().nullish()
    })
  ).nullish(),
  usage: deepSeekUsageSchema.nullish()
});
function createDeepSeek(options = {}) {
  var _a15;
  const baseURL = withoutTrailingSlash(
    (_a15 = options.baseURL) != null ? _a15 : "https://api.deepseek.com/v1"
  );
  const getHeaders = () => __spreadValues({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "DEEPSEEK_API_KEY",
      description: "DeepSeek API key"
    })}`
  }, options.headers);
  const createLanguageModel = (modelId, settings = {}) => {
    return new OpenAICompatibleChatLanguageModel(modelId, settings, {
      provider: `deepseek.chat`,
      url: ({ path: path4 }) => `${baseURL}${path4}`,
      headers: getHeaders,
      fetch: options.fetch,
      defaultObjectGenerationMode: "json",
      metadataExtractor: deepSeekMetadataExtractor
    });
  };
  const provider = (modelId, settings) => createLanguageModel(modelId, settings);
  provider.languageModel = createLanguageModel;
  provider.chat = createLanguageModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
  };
  return provider;
}
var deepseek = createDeepSeek();

// node_modules/.pnpm/@ai-sdk+perplexity@1.1.8_zod@3.25.67/node_modules/@ai-sdk/perplexity/dist/index.mjs
var import_zod40 = require("zod");
function convertToPerplexityMessages(prompt) {
  const messages = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        messages.push({ role: "system", content });
        break;
      }
      case "user":
      case "assistant": {
        messages.push({
          role,
          content: content.filter(
            (part) => part.type !== "reasoning" && part.type !== "redacted-reasoning"
          ).map((part) => {
            switch (part.type) {
              case "text": {
                return part.text;
              }
              case "image": {
                throw new UnsupportedFunctionalityError({
                  functionality: "Image content parts in user messages"
                });
              }
              case "file": {
                throw new UnsupportedFunctionalityError({
                  functionality: "File content parts in user messages"
                });
              }
              case "tool-call": {
                throw new UnsupportedFunctionalityError({
                  functionality: "Tool calls in assistant messages"
                });
              }
              default: {
                const _exhaustiveCheck = part;
                throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
              }
            }
          }).join("")
        });
        break;
      }
      case "tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "Tool messages"
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}
function mapPerplexityFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
    case "length":
      return finishReason;
    default:
      return "unknown";
  }
}
var PerplexityLanguageModel = class {
  constructor(modelId, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "json";
    this.supportsStructuredOutputs = true;
    this.supportsImageUrls = false;
    this.provider = "perplexity";
    this.modelId = modelId;
    this.config = config;
  }
  getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    providerMetadata
  }) {
    var _a15;
    const type = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (stopSequences != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "stopSequences"
      });
    }
    if (seed != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "seed"
      });
    }
    const baseArgs = __spreadProps(__spreadValues({
      // model id:
      model: this.modelId,
      // standardized settings:
      frequency_penalty: frequencyPenalty,
      max_tokens: maxTokens,
      presence_penalty: presencePenalty,
      temperature,
      top_k: topK,
      top_p: topP,
      // response format:
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? {
        type: "json_schema",
        json_schema: { schema: responseFormat.schema }
      } : void 0
    }, (_a15 = providerMetadata == null ? void 0 : providerMetadata.perplexity) != null ? _a15 : {}), {
      // messages:
      messages: convertToPerplexityMessages(prompt)
    });
    switch (type) {
      case "regular": {
        return { args: baseArgs, warnings };
      }
      case "object-json": {
        return {
          args: __spreadProps(__spreadValues({}, baseArgs), {
            response_format: {
              type: "json_schema",
              json_schema: { schema: mode.schema }
            }
          }),
          warnings
        };
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "tool-mode object generation"
        });
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      const { args, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = yield postJsonToApi({
        url: `${this.config.baseURL}/chat/completions`,
        headers: combineHeaders(this.config.headers(), options.headers),
        body: args,
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: perplexityErrorSchema,
          errorToMessage
        }),
        successfulResponseHandler: createJsonResponseHandler(
          perplexityResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a16 = args, { messages: rawPrompt } = _a16, rawSettings = __objRest(_a16, ["messages"]);
      const choice = response.choices[0];
      const text = choice.message.content;
      return {
        text,
        toolCalls: [],
        finishReason: mapPerplexityFinishReason(choice.finish_reason),
        usage: {
          promptTokens: (_b = (_a15 = response.usage) == null ? void 0 : _a15.prompt_tokens) != null ? _b : Number.NaN,
          completionTokens: (_d = (_c = response.usage) == null ? void 0 : _c.completion_tokens) != null ? _d : Number.NaN
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        request: { body: JSON.stringify(args) },
        response: getResponseMetadata6(response),
        warnings,
        sources: (_e = response.citations) == null ? void 0 : _e.map((url) => ({
          sourceType: "url",
          id: this.config.generateId(),
          url
        })),
        providerMetadata: {
          perplexity: {
            images: (_g = (_f = response.images) == null ? void 0 : _f.map((image) => ({
              imageUrl: image.image_url,
              originUrl: image.origin_url,
              height: image.height,
              width: image.width
            }))) != null ? _g : null,
            usage: {
              citationTokens: (_i = (_h = response.usage) == null ? void 0 : _h.citation_tokens) != null ? _i : null,
              numSearchQueries: (_k = (_j = response.usage) == null ? void 0 : _j.num_search_queries) != null ? _k : null
            }
          }
        }
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      const { args, warnings } = this.getArgs(options);
      const body = __spreadProps(__spreadValues({}, args), { stream: true });
      const { responseHeaders, value: response } = yield postJsonToApi({
        url: `${this.config.baseURL}/chat/completions`,
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: perplexityErrorSchema,
          errorToMessage
        }),
        successfulResponseHandler: createEventSourceResponseHandler(
          perplexityChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const _a15 = args, { messages: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["messages"]);
      let finishReason = "unknown";
      let usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      const providerMetadata = {
        perplexity: {
          usage: {
            citationTokens: null,
            numSearchQueries: null
          },
          images: null
        }
      };
      let isFirstChunk = true;
      const self = this;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a16, _b, _c;
              if (!chunk.success) {
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if (isFirstChunk) {
                controller.enqueue(__spreadValues({
                  type: "response-metadata"
                }, getResponseMetadata6(value)));
                (_a16 = value.citations) == null ? void 0 : _a16.forEach((url) => {
                  controller.enqueue({
                    type: "source",
                    source: {
                      sourceType: "url",
                      id: self.config.generateId(),
                      url
                    }
                  });
                });
                isFirstChunk = false;
              }
              if (value.usage != null) {
                usage = {
                  promptTokens: value.usage.prompt_tokens,
                  completionTokens: value.usage.completion_tokens
                };
                providerMetadata.perplexity.usage = {
                  citationTokens: (_b = value.usage.citation_tokens) != null ? _b : null,
                  numSearchQueries: (_c = value.usage.num_search_queries) != null ? _c : null
                };
              }
              if (value.images != null) {
                providerMetadata.perplexity.images = value.images.map((image) => ({
                  imageUrl: image.image_url,
                  originUrl: image.origin_url,
                  height: image.height,
                  width: image.width
                }));
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapPerplexityFinishReason(choice.finish_reason);
              }
              if ((choice == null ? void 0 : choice.delta) == null) {
                return;
              }
              const delta = choice.delta;
              const textContent = delta.content;
              if (textContent != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: textContent
                });
              }
            },
            flush(controller) {
              controller.enqueue({
                type: "finish",
                finishReason,
                usage,
                providerMetadata
              });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        warnings
      };
    });
  }
};
function getResponseMetadata6({
  id,
  model,
  created
}) {
  return {
    id,
    modelId: model,
    timestamp: new Date(created * 1e3)
  };
}
var perplexityUsageSchema = import_zod40.z.object({
  prompt_tokens: import_zod40.z.number(),
  completion_tokens: import_zod40.z.number(),
  citation_tokens: import_zod40.z.number().nullish(),
  num_search_queries: import_zod40.z.number().nullish()
});
var perplexityImageSchema = import_zod40.z.object({
  image_url: import_zod40.z.string(),
  origin_url: import_zod40.z.string(),
  height: import_zod40.z.number(),
  width: import_zod40.z.number()
});
var perplexityResponseSchema = import_zod40.z.object({
  id: import_zod40.z.string(),
  created: import_zod40.z.number(),
  model: import_zod40.z.string(),
  choices: import_zod40.z.array(
    import_zod40.z.object({
      message: import_zod40.z.object({
        role: import_zod40.z.literal("assistant"),
        content: import_zod40.z.string()
      }),
      finish_reason: import_zod40.z.string().nullish()
    })
  ),
  citations: import_zod40.z.array(import_zod40.z.string()).nullish(),
  images: import_zod40.z.array(perplexityImageSchema).nullish(),
  usage: perplexityUsageSchema.nullish()
});
var perplexityChunkSchema = import_zod40.z.object({
  id: import_zod40.z.string(),
  created: import_zod40.z.number(),
  model: import_zod40.z.string(),
  choices: import_zod40.z.array(
    import_zod40.z.object({
      delta: import_zod40.z.object({
        role: import_zod40.z.literal("assistant"),
        content: import_zod40.z.string()
      }),
      finish_reason: import_zod40.z.string().nullish()
    })
  ),
  citations: import_zod40.z.array(import_zod40.z.string()).nullish(),
  images: import_zod40.z.array(perplexityImageSchema).nullish(),
  usage: perplexityUsageSchema.nullish()
});
var perplexityErrorSchema = import_zod40.z.object({
  error: import_zod40.z.object({
    code: import_zod40.z.number(),
    message: import_zod40.z.string().nullish(),
    type: import_zod40.z.string().nullish()
  })
});
var errorToMessage = (data) => {
  var _a15, _b;
  return (_b = (_a15 = data.error.message) != null ? _a15 : data.error.type) != null ? _b : "unknown error";
};
function createPerplexity(options = {}) {
  const getHeaders = () => __spreadValues({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "PERPLEXITY_API_KEY",
      description: "Perplexity"
    })}`
  }, options.headers);
  const createLanguageModel = (modelId) => {
    var _a15;
    return new PerplexityLanguageModel(modelId, {
      baseURL: withoutTrailingSlash(
        (_a15 = options.baseURL) != null ? _a15 : "https://api.perplexity.ai"
      ),
      headers: getHeaders,
      generateId,
      fetch: options.fetch
    });
  };
  const provider = (modelId) => createLanguageModel(modelId);
  provider.languageModel = createLanguageModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
  };
  return provider;
}
var perplexity = createPerplexity();

// node_modules/.pnpm/ollama-ai-provider@1.2.0_zod@3.25.67/node_modules/ollama-ai-provider/dist/index.mjs
var import_zod41 = require("zod");
var import_partial_json = __toESM(require_dist(), 1);
var import_zod42 = require("zod");
var import_zod43 = require("zod");
function convertToOllamaChatMessages(prompt) {
  const messages = [];
  for (const { content, role } of prompt) {
    switch (role) {
      case "system": {
        messages.push({ content, role: "system" });
        break;
      }
      case "user": {
        messages.push(__spreadProps(__spreadValues({}, content.reduce(
          (previous, current) => {
            if (current.type === "text") {
              previous.content += current.text;
            } else if (current.type === "image" && current.image instanceof URL) {
              throw new UnsupportedFunctionalityError({
                functionality: "Image URLs in user messages"
              });
            } else if (current.type === "image" && current.image instanceof Uint8Array) {
              previous.images = previous.images || [];
              previous.images.push(convertUint8ArrayToBase64(current.image));
            }
            return previous;
          },
          { content: "" }
        )), {
          role: "user"
        }));
        break;
      }
      case "assistant": {
        const text = [];
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text.push(part.text);
              break;
            }
            case "tool-call": {
              toolCalls.push({
                function: {
                  arguments: part.args,
                  name: part.toolName
                },
                id: part.toolCallId,
                type: "function"
              });
              break;
            }
            default: {
              const _exhaustiveCheck = part;
              throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
            }
          }
        }
        messages.push({
          content: text.join(","),
          role: "assistant",
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0
        });
        break;
      }
      case "tool": {
        messages.push(
          ...content.map((part) => ({
            // Non serialized contents are not accepted by ollama, triggering the following error:
            // "json: cannot unmarshal array into Go struct field ChatRequest.messages of type string"
            content: typeof part.result === "object" ? JSON.stringify(part.result) : `${part.result}`,
            role: "tool",
            tool_call_id: part.toolCallId
          }))
        );
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}
var InferToolCallsFromStream = class {
  constructor({
    tools,
    type
  }) {
    this._firstMessage = true;
    this._tools = tools;
    this._toolPartial = "";
    this._toolCalls = [];
    this._type = type;
    this._detectedToolCall = false;
  }
  get toolCalls() {
    return this._toolCalls;
  }
  get detectedToolCall() {
    return this._detectedToolCall;
  }
  parse({
    controller,
    delta
  }) {
    var _a15;
    this.detectToolCall(delta);
    if (!this._detectedToolCall) {
      return false;
    }
    this._toolPartial += delta;
    let parsedFunctions = (0, import_partial_json.parse)(this._toolPartial);
    if (!Array.isArray(parsedFunctions)) {
      parsedFunctions = [parsedFunctions];
    }
    for (const [index, parsedFunction] of parsedFunctions.entries()) {
      const parsedArguments = (_a15 = JSON.stringify(parsedFunction == null ? void 0 : parsedFunction.parameters)) != null ? _a15 : "";
      if (parsedArguments === "") {
        continue;
      }
      if (!this._toolCalls[index]) {
        this._toolCalls[index] = {
          function: {
            arguments: "",
            name: parsedFunction.name
          },
          id: generateId(),
          type: "function"
        };
      }
      const toolCall = this._toolCalls[index];
      toolCall.function.arguments = parsedArguments;
      controller.enqueue({
        argsTextDelta: delta,
        toolCallId: toolCall.id,
        toolCallType: "function",
        toolName: toolCall.function.name,
        type: "tool-call-delta"
      });
    }
    return true;
  }
  finish({
    controller
  }) {
    for (const toolCall of this.toolCalls) {
      controller.enqueue({
        args: toolCall.function.arguments,
        toolCallId: toolCall.id,
        toolCallType: "function",
        toolName: toolCall.function.name,
        type: "tool-call"
      });
    }
    return this.finishReason();
  }
  detectToolCall(delta) {
    if (!this._tools || this._tools.length === 0) {
      return;
    }
    if (this._firstMessage) {
      if (this._type === "object-tool") {
        this._detectedToolCall = true;
      } else if (this._type === "regular" && (delta.trim().startsWith("{") || delta.trim().startsWith("["))) {
        this._detectedToolCall = true;
      }
      this._firstMessage = false;
    }
  }
  finishReason() {
    if (!this.detectedToolCall) {
      return "stop";
    }
    return this._type === "object-tool" ? "stop" : "tool-calls";
  }
};
function mapOllamaFinishReason({
  finishReason,
  hasToolCalls
}) {
  switch (finishReason) {
    case "stop": {
      return hasToolCalls ? "tool-calls" : "stop";
    }
    default: {
      return "other";
    }
  }
}
var ollamaErrorDataSchema = import_zod42.z.object({
  error: import_zod42.z.object({
    code: import_zod42.z.string().nullable(),
    message: import_zod42.z.string(),
    param: import_zod42.z.any().nullable(),
    type: import_zod42.z.string()
  })
});
var ollamaFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: ollamaErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
function prepareTools8({
  mode
}) {
  var _a15;
  const tools = ((_a15 = mode.tools) == null ? void 0 : _a15.length) ? mode.tools : void 0;
  const toolWarnings = [];
  const toolChoice = mode.toolChoice;
  if (tools === void 0) {
    return {
      tools: void 0,
      toolWarnings
    };
  }
  const ollamaTools = [];
  for (const tool of tools) {
    if (tool.type === "provider-defined") {
      toolWarnings.push({ tool, type: "unsupported-tool" });
    } else {
      ollamaTools.push({
        function: {
          description: tool.description,
          name: tool.name,
          parameters: tool.parameters
        },
        type: "function"
      });
    }
  }
  if (toolChoice === void 0) {
    return {
      tools: ollamaTools,
      toolWarnings
    };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto": {
      return {
        tools: ollamaTools,
        toolWarnings
      };
    }
    case "none": {
      return {
        tools: void 0,
        toolWarnings
      };
    }
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
function removeUndefined(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, v]) => v !== void 0)
  );
}
var TextLineStream = class extends TransformStream {
  constructor() {
    super({
      flush: (controller) => {
        if (this.buffer.length === 0) return;
        controller.enqueue(this.buffer);
      },
      transform: (chunkText, controller) => {
        chunkText = this.buffer + chunkText;
        while (true) {
          const EOL = chunkText.indexOf("\n");
          if (EOL === -1) break;
          controller.enqueue(chunkText.slice(0, EOL));
          chunkText = chunkText.slice(EOL + 1);
        }
        this.buffer = chunkText;
      }
    });
    this.buffer = "";
  }
};
var createJsonStreamResponseHandler = (chunkSchema2) => (_0) => __async(null, [_0], function* ({ response }) {
  const responseHeaders = extractResponseHeaders(response);
  if (response.body === null) {
    throw new EmptyResponseBodyError({});
  }
  return {
    responseHeaders,
    value: response.body.pipeThrough(new TextDecoderStream()).pipeThrough(new TextLineStream()).pipeThrough(
      new TransformStream({
        transform(chunkText, controller) {
          controller.enqueue(
            safeParseJSON({
              schema: chunkSchema2,
              text: chunkText
            })
          );
        }
      })
    )
  };
});
var OllamaChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "json";
    this.supportsImageUrls = false;
  }
  get supportsStructuredOutputs() {
    var _a15;
    return (_a15 = this.settings.structuredOutputs) != null ? _a15 : false;
  }
  get provider() {
    return this.config.provider;
  }
  getArguments({
    frequencyPenalty,
    maxTokens,
    mode,
    presencePenalty,
    prompt,
    responseFormat,
    seed,
    stopSequences,
    temperature,
    topK,
    topP
  }) {
    const type = mode.type;
    const warnings = [];
    if (responseFormat !== void 0 && responseFormat.type === "json" && responseFormat.schema !== void 0 && !this.supportsStructuredOutputs) {
      warnings.push({
        details: "JSON response format schema is only supported with structuredOutputs",
        setting: "responseFormat",
        type: "unsupported-setting"
      });
    }
    const baseArguments = {
      format: responseFormat == null ? void 0 : responseFormat.type,
      model: this.modelId,
      options: removeUndefined({
        f16_kv: this.settings.f16Kv,
        frequency_penalty: frequencyPenalty,
        low_vram: this.settings.lowVram,
        main_gpu: this.settings.mainGpu,
        min_p: this.settings.minP,
        mirostat: this.settings.mirostat,
        mirostat_eta: this.settings.mirostatEta,
        mirostat_tau: this.settings.mirostatTau,
        num_batch: this.settings.numBatch,
        num_ctx: this.settings.numCtx,
        num_gpu: this.settings.numGpu,
        num_keep: this.settings.numKeep,
        num_predict: maxTokens,
        num_thread: this.settings.numThread,
        numa: this.settings.numa,
        penalize_newline: this.settings.penalizeNewline,
        presence_penalty: presencePenalty,
        repeat_last_n: this.settings.repeatLastN,
        repeat_penalty: this.settings.repeatPenalty,
        seed,
        stop: stopSequences,
        temperature,
        tfs_z: this.settings.tfsZ,
        top_k: topK,
        top_p: topP,
        typical_p: this.settings.typicalP,
        use_mlock: this.settings.useMlock,
        use_mmap: this.settings.useMmap,
        vocab_only: this.settings.vocabOnly
      })
    };
    switch (type) {
      case "regular": {
        const { tools, toolWarnings } = prepareTools8({
          mode
        });
        return {
          args: __spreadProps(__spreadValues({}, baseArguments), {
            messages: convertToOllamaChatMessages(prompt),
            tools
          }),
          type,
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: __spreadProps(__spreadValues({}, baseArguments), {
            format: this.supportsStructuredOutputs && mode.schema !== void 0 ? mode.schema : "json",
            messages: convertToOllamaChatMessages(prompt)
          }),
          type,
          warnings
        };
      }
      case "object-tool": {
        return {
          args: __spreadProps(__spreadValues({}, baseArguments), {
            messages: convertToOllamaChatMessages(prompt),
            tool_choice: {
              function: { name: mode.tool.name },
              type: "function"
            },
            tools: [
              {
                function: {
                  description: mode.tool.description,
                  name: mode.tool.name,
                  parameters: mode.tool.parameters
                },
                type: "function"
              }
            ]
          }),
          type,
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  doGenerate(options) {
    return __async(this, null, function* () {
      var _a15, _b;
      const { args, warnings } = this.getArguments(options);
      const body = __spreadProps(__spreadValues({}, args), {
        stream: false
      });
      const { responseHeaders, value: response } = yield postJsonToApi({
        abortSignal: options.abortSignal,
        body,
        failedResponseHandler: ollamaFailedResponseHandler,
        fetch: this.config.fetch,
        headers: combineHeaders(this.config.headers(), options.headers),
        successfulResponseHandler: createJsonResponseHandler(
          ollamaChatResponseSchema
        ),
        url: `${this.config.baseURL}/chat`
      });
      const _a16 = body, { messages: rawPrompt } = _a16, rawSettings = __objRest(_a16, ["messages"]);
      const toolCalls = (_a15 = response.message.tool_calls) == null ? void 0 : _a15.map((toolCall) => {
        var _a22;
        return {
          args: JSON.stringify(toolCall.function.arguments),
          toolCallId: (_a22 = toolCall.id) != null ? _a22 : generateId(),
          toolCallType: "function",
          toolName: toolCall.function.name
        };
      });
      return {
        finishReason: mapOllamaFinishReason({
          finishReason: response.done_reason,
          hasToolCalls: toolCalls !== void 0 && toolCalls.length > 0
        }),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        text: (_b = response.message.content) != null ? _b : void 0,
        toolCalls,
        usage: {
          completionTokens: response.eval_count || 0,
          promptTokens: response.prompt_eval_count || 0
        },
        warnings
      };
    });
  }
  doStream(options) {
    return __async(this, null, function* () {
      if (this.settings.simulateStreaming) {
        const result = yield this.doGenerate(options);
        const simulatedStream = new ReadableStream({
          start(controller) {
            controller.enqueue(__spreadValues({ type: "response-metadata" }, result.response));
            if (result.text) {
              controller.enqueue({
                textDelta: result.text,
                type: "text-delta"
              });
            }
            if (result.toolCalls) {
              for (const toolCall of result.toolCalls) {
                controller.enqueue({
                  argsTextDelta: toolCall.args,
                  toolCallId: toolCall.toolCallId,
                  toolCallType: "function",
                  toolName: toolCall.toolName,
                  type: "tool-call-delta"
                });
                controller.enqueue(__spreadValues({
                  type: "tool-call"
                }, toolCall));
              }
            }
            controller.enqueue({
              finishReason: result.finishReason,
              logprobs: result.logprobs,
              providerMetadata: result.providerMetadata,
              type: "finish",
              usage: result.usage
            });
            controller.close();
          }
        });
        return {
          rawCall: result.rawCall,
          rawResponse: result.rawResponse,
          stream: simulatedStream,
          warnings: result.warnings
        };
      }
      const { args: body, type, warnings } = this.getArguments(options);
      const { responseHeaders, value: response } = yield postJsonToApi({
        abortSignal: options.abortSignal,
        body,
        failedResponseHandler: ollamaFailedResponseHandler,
        fetch: this.config.fetch,
        headers: combineHeaders(this.config.headers(), options.headers),
        successfulResponseHandler: createJsonStreamResponseHandler(
          ollamaChatStreamChunkSchema
        ),
        url: `${this.config.baseURL}/chat`
      });
      const _a15 = body, { messages: rawPrompt } = _a15, rawSettings = __objRest(_a15, ["messages"]);
      const tools = options.mode.type === "regular" ? options.mode.tools : options.mode.type === "object-tool" ? [options.mode.tool] : void 0;
      const inferToolCallsFromStream = new InferToolCallsFromStream({
        tools,
        type
      });
      let finishReason = "other";
      let usage = {
        completionTokens: Number.NaN,
        promptTokens: Number.NaN
      };
      const { experimentalStreamTools = true } = this.settings;
      return {
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        stream: response.pipeThrough(
          new TransformStream({
            flush(controller) {
              return __async(this, null, function* () {
                controller.enqueue({
                  finishReason,
                  type: "finish",
                  usage
                });
              });
            },
            transform(chunk, controller) {
              return __async(this, null, function* () {
                if (!chunk.success) {
                  controller.enqueue({ error: chunk.error, type: "error" });
                  return;
                }
                const value = chunk.value;
                if (value.done) {
                  finishReason = inferToolCallsFromStream.finish({ controller });
                  usage = {
                    completionTokens: value.eval_count,
                    promptTokens: value.prompt_eval_count || 0
                  };
                  return;
                }
                if (experimentalStreamTools) {
                  const isToolCallStream = inferToolCallsFromStream.parse({
                    controller,
                    delta: value.message.content
                  });
                  if (isToolCallStream) {
                    return;
                  }
                }
                if (value.message.content !== null) {
                  controller.enqueue({
                    textDelta: value.message.content,
                    type: "text-delta"
                  });
                }
              });
            }
          })
        ),
        warnings
      };
    });
  }
};
var ollamaChatResponseSchema = import_zod41.z.object({
  created_at: import_zod41.z.string(),
  done: import_zod41.z.literal(true),
  done_reason: import_zod41.z.string().optional().nullable(),
  eval_count: import_zod41.z.number(),
  eval_duration: import_zod41.z.number(),
  load_duration: import_zod41.z.number().optional(),
  message: import_zod41.z.object({
    content: import_zod41.z.string(),
    role: import_zod41.z.string(),
    tool_calls: import_zod41.z.array(
      import_zod41.z.object({
        function: import_zod41.z.object({
          arguments: import_zod41.z.record(import_zod41.z.any()),
          name: import_zod41.z.string()
        }),
        id: import_zod41.z.string().optional()
      })
    ).optional().nullable()
  }),
  model: import_zod41.z.string(),
  prompt_eval_count: import_zod41.z.number().optional(),
  prompt_eval_duration: import_zod41.z.number().optional(),
  total_duration: import_zod41.z.number()
});
var ollamaChatStreamChunkSchema = import_zod41.z.discriminatedUnion("done", [
  import_zod41.z.object({
    created_at: import_zod41.z.string(),
    done: import_zod41.z.literal(false),
    message: import_zod41.z.object({
      content: import_zod41.z.string(),
      role: import_zod41.z.string()
    }),
    model: import_zod41.z.string()
  }),
  import_zod41.z.object({
    created_at: import_zod41.z.string(),
    done: import_zod41.z.literal(true),
    eval_count: import_zod41.z.number(),
    eval_duration: import_zod41.z.number(),
    load_duration: import_zod41.z.number().optional(),
    model: import_zod41.z.string(),
    prompt_eval_count: import_zod41.z.number().optional(),
    prompt_eval_duration: import_zod41.z.number().optional(),
    total_duration: import_zod41.z.number()
  })
]);
var OllamaEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    var _a15;
    return (_a15 = this.settings.maxEmbeddingsPerCall) != null ? _a15 : 2048;
  }
  get supportsParallelCalls() {
    return false;
  }
  doEmbed(_0) {
    return __async(this, arguments, function* ({
      abortSignal,
      values
    }) {
      if (values.length > this.maxEmbeddingsPerCall) {
        throw new TooManyEmbeddingValuesForCallError({
          maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
          modelId: this.modelId,
          provider: this.provider,
          values
        });
      }
      const { responseHeaders, value: response } = yield postJsonToApi({
        abortSignal,
        body: {
          input: values,
          model: this.modelId
        },
        failedResponseHandler: ollamaFailedResponseHandler,
        fetch: this.config.fetch,
        headers: this.config.headers(),
        successfulResponseHandler: createJsonResponseHandler(
          ollamaTextEmbeddingResponseSchema
        ),
        url: `${this.config.baseURL}/embed`
      });
      return {
        embeddings: response.embeddings,
        rawResponse: { headers: responseHeaders },
        usage: response.prompt_eval_count ? { tokens: response.prompt_eval_count } : void 0
      };
    });
  }
};
var ollamaTextEmbeddingResponseSchema = import_zod43.z.object({
  embeddings: import_zod43.z.array(import_zod43.z.array(import_zod43.z.number())),
  prompt_eval_count: import_zod43.z.number().nullable()
});
function createOllama(options = {}) {
  var _a15;
  const baseURL = (_a15 = withoutTrailingSlash(options.baseURL)) != null ? _a15 : "http://127.0.0.1:11434/api";
  const getHeaders = () => __spreadValues({}, options.headers);
  const createChatModel = (modelId, settings = {}) => new OllamaChatLanguageModel(modelId, settings, {
    baseURL,
    fetch: options.fetch,
    headers: getHeaders,
    provider: "ollama.chat"
  });
  const createEmbeddingModel = (modelId, settings = {}) => new OllamaEmbeddingModel(modelId, settings, {
    baseURL,
    fetch: options.fetch,
    headers: getHeaders,
    provider: "ollama.embedding"
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Ollama model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.chat = createChatModel;
  provider.embedding = createEmbeddingModel;
  provider.languageModel = createChatModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  return provider;
}
var ollama = createOllama();

// lib/llm/LLMProvider.ts
var AISDKProviders = {
  openai,
  anthropic,
  google,
  xai,
  azure,
  groq,
  cerebras,
  togetherai,
  mistral,
  deepseek,
  perplexity,
  ollama
};
var AISDKProvidersWithAPIKey = {
  openai: createOpenAI,
  anthropic: createAnthropic,
  google: createGoogleGenerativeAI,
  xai: createXai,
  azure: createAzure,
  groq: createGroq,
  cerebras: createCerebras,
  togetherai: createTogetherAI,
  mistral: createMistral,
  deepseek: createDeepSeek,
  perplexity: createPerplexity
};
var modelToProviderMap = {
  "gpt-4.1": "openai",
  "gpt-4.1-mini": "openai",
  "gpt-4.1-nano": "openai",
  "o4-mini": "openai",
  //prettier-ignore
  "o3": "openai",
  "o3-mini": "openai",
  //prettier-ignore
  "o1": "openai",
  "o1-mini": "openai",
  "gpt-4o": "openai",
  "gpt-4o-mini": "openai",
  "gpt-4o-2024-08-06": "openai",
  "gpt-4.5-preview": "openai",
  "o1-preview": "openai",
  "claude-3-5-sonnet-latest": "anthropic",
  "claude-3-5-sonnet-20240620": "anthropic",
  "claude-3-5-sonnet-20241022": "anthropic",
  "claude-3-7-sonnet-20250219": "anthropic",
  "claude-3-7-sonnet-latest": "anthropic",
  "cerebras-llama-3.3-70b": "cerebras",
  "cerebras-llama-3.1-8b": "cerebras",
  "groq-llama-3.3-70b-versatile": "groq",
  "groq-llama-3.3-70b-specdec": "groq",
  "moonshotai/kimi-k2-instruct": "groq",
  "gemini-1.5-flash": "google",
  "gemini-1.5-pro": "google",
  "gemini-1.5-flash-8b": "google",
  "gemini-2.0-flash-lite": "google",
  "gemini-2.0-flash": "google",
  "gemini-2.5-flash-preview-04-17": "google",
  "gemini-2.5-pro-preview-03-25": "google"
};
function getAISDKLanguageModel(subProvider, subModelName, apiKey) {
  if (apiKey) {
    const creator = AISDKProvidersWithAPIKey[subProvider];
    if (!creator) {
      throw new UnsupportedAISDKModelProviderError(
        subProvider,
        Object.keys(AISDKProvidersWithAPIKey)
      );
    }
    const provider = creator({ apiKey });
    return provider(subModelName);
  } else {
    const provider = AISDKProviders[subProvider];
    if (!provider) {
      throw new UnsupportedAISDKModelProviderError(
        subProvider,
        Object.keys(AISDKProviders)
      );
    }
    return provider(subModelName);
  }
}
var LLMProvider = class {
  constructor(logger, enableCaching) {
    this.logger = logger;
    this.enableCaching = enableCaching;
    this.cache = enableCaching ? new LLMCache(logger) : void 0;
  }
  cleanRequestCache(requestId) {
    if (!this.enableCaching) {
      return;
    }
    this.logger({
      category: "llm_cache",
      message: "cleaning up cache",
      level: 1,
      auxiliary: {
        requestId: {
          value: requestId,
          type: "string"
        }
      }
    });
    this.cache.deleteCacheForRequestId(requestId);
  }
  getClient(modelName, clientOptions) {
    if (modelName.includes("/")) {
      const firstSlashIndex = modelName.indexOf("/");
      const subProvider = modelName.substring(0, firstSlashIndex);
      const subModelName = modelName.substring(firstSlashIndex + 1);
      const languageModel = getAISDKLanguageModel(
        subProvider,
        subModelName,
        clientOptions == null ? void 0 : clientOptions.apiKey
      );
      return new AISdkClient({
        model: languageModel,
        logger: this.logger,
        enableCaching: this.enableCaching,
        cache: this.cache
      });
    }
    const provider = modelToProviderMap[modelName];
    if (!provider) {
      throw new UnsupportedModelError(Object.keys(modelToProviderMap));
    }
    const availableModel = modelName;
    switch (provider) {
      case "openai":
        return new OpenAIClient({
          logger: this.logger,
          enableCaching: this.enableCaching,
          cache: this.cache,
          modelName: availableModel,
          clientOptions
        });
      case "anthropic":
        return new AnthropicClient({
          logger: this.logger,
          enableCaching: this.enableCaching,
          cache: this.cache,
          modelName: availableModel,
          clientOptions
        });
      case "cerebras":
        return new CerebrasClient({
          logger: this.logger,
          enableCaching: this.enableCaching,
          cache: this.cache,
          modelName: availableModel,
          clientOptions
        });
      case "groq":
        return new GroqClient({
          logger: this.logger,
          enableCaching: this.enableCaching,
          cache: this.cache,
          modelName: availableModel,
          clientOptions
        });
      case "google":
        return new GoogleClient({
          logger: this.logger,
          enableCaching: this.enableCaching,
          cache: this.cache,
          modelName: availableModel,
          clientOptions
        });
      default:
        throw new UnsupportedModelProviderError([
          ...new Set(Object.values(modelToProviderMap))
        ]);
    }
  }
  static getModelProvider(modelName) {
    if (modelName.includes("/")) {
      const firstSlashIndex = modelName.indexOf("/");
      const subProvider = modelName.substring(0, firstSlashIndex);
      if (AISDKProviders[subProvider]) {
        return "aisdk";
      }
    }
    const provider = modelToProviderMap[modelName];
    return provider;
  }
};

// lib/agent/OpenAICUAClient.ts
var import_openai5 = __toESM(require("openai"));

// lib/agent/AgentClient.ts
var AgentClient = class {
  constructor(type, modelName, userProvidedInstructions) {
    this.type = type;
    this.modelName = modelName;
    this.userProvidedInstructions = userProvidedInstructions;
    this.clientOptions = {};
  }
};

// lib/agent/utils/imageCompression.ts
function findAnthropicItemsWithImages(items) {
  const itemsWithImages = [];
  items.forEach((item, index) => {
    let hasImage = false;
    if (Array.isArray(item.content)) {
      hasImage = item.content.some(
        (contentItem) => contentItem.type === "tool_result" && "content" in contentItem && Array.isArray(contentItem.content) && contentItem.content.some(
          (nestedItem) => nestedItem.type === "image"
        )
      );
    }
    if (hasImage) {
      itemsWithImages.push(index);
    }
  });
  return itemsWithImages;
}
function findOpenAIItemsWithImages(items) {
  const itemsWithImages = [];
  items.forEach((item, index) => {
    let hasImage = false;
    if ("type" in item && item.type === "computer_call_output" && "output" in item) {
      const output = item.output;
      hasImage = (output == null ? void 0 : output.type) === "input_image" && !!(output == null ? void 0 : output.image_url);
    }
    if (hasImage) {
      itemsWithImages.push(index);
    }
  });
  return itemsWithImages;
}
function findGoogleItemsWithImages(items) {
  const itemsWithImages = [];
  items.forEach((item, index) => {
    let hasImage = false;
    if (item.parts && Array.isArray(item.parts)) {
      hasImage = item.parts.some((part) => {
        var _a15, _b, _c, _d;
        if ((_b = (_a15 = part.functionResponse) == null ? void 0 : _a15.response) == null ? void 0 : _b.data) {
          const data = part.functionResponse.response.data;
          return data.some(
            (dataItem) => {
              var _a16, _b2;
              return (_b2 = (_a16 = dataItem.inlineData) == null ? void 0 : _a16.mimeType) == null ? void 0 : _b2.startsWith("image/");
            }
          );
        }
        return (_d = (_c = part.inlineData) == null ? void 0 : _c.mimeType) == null ? void 0 : _d.startsWith("image/");
      });
    }
    if (hasImage) {
      itemsWithImages.push(index);
    }
  });
  return itemsWithImages;
}
function compressAnthropicConversationImages(items, keepMostRecentCount = 2) {
  const itemsWithImages = findAnthropicItemsWithImages(items);
  items.forEach((item, index) => {
    const imageIndex = itemsWithImages.indexOf(index);
    const shouldCompress = imageIndex >= 0 && imageIndex < itemsWithImages.length - keepMostRecentCount;
    if (shouldCompress) {
      if (Array.isArray(item.content)) {
        item.content = item.content.map(
          (contentItem) => {
            if (contentItem.type === "tool_result" && "content" in contentItem && Array.isArray(contentItem.content) && contentItem.content.some(
              (nestedItem) => nestedItem.type === "image"
            )) {
              return __spreadProps(__spreadValues({}, contentItem), {
                content: "screenshot taken"
              });
            }
            return contentItem;
          }
        );
      }
    }
  });
  return {
    items
  };
}
function compressOpenAIConversationImages(items, keepMostRecentCount = 2) {
  const itemsWithImages = findOpenAIItemsWithImages(items);
  items.forEach((item, index) => {
    const imageIndex = itemsWithImages.indexOf(index);
    const shouldCompress = imageIndex >= 0 && imageIndex < itemsWithImages.length - keepMostRecentCount;
    if (shouldCompress) {
      if ("type" in item && item.type === "computer_call_output" && "output" in item) {
        const output = item.output;
        if ((output == null ? void 0 : output.type) === "input_image") {
          item.output = "screenshot taken";
        }
      }
    }
  });
  return {
    items
  };
}
function compressGoogleConversationImages(items, keepMostRecentCount = 2) {
  const itemsWithImages = findGoogleItemsWithImages(items);
  items.forEach((item, index) => {
    const imageIndex = itemsWithImages.indexOf(index);
    const shouldCompress = imageIndex >= 0 && imageIndex < itemsWithImages.length - keepMostRecentCount;
    if (shouldCompress && item.parts && Array.isArray(item.parts)) {
      item.parts = item.parts.map((part) => {
        var _a15, _b, _c, _d;
        if ((_b = (_a15 = part.functionResponse) == null ? void 0 : _a15.response) == null ? void 0 : _b.data) {
          const data = part.functionResponse.response.data;
          const hasImage = data.some(
            (dataItem) => {
              var _a16, _b2;
              return (_b2 = (_a16 = dataItem.inlineData) == null ? void 0 : _a16.mimeType) == null ? void 0 : _b2.startsWith("image/");
            }
          );
          if (hasImage) {
            return __spreadProps(__spreadValues({}, part), {
              functionResponse: __spreadProps(__spreadValues({}, part.functionResponse), {
                data: [],
                response: __spreadProps(__spreadValues({}, part.functionResponse.response), {
                  compressed: "screenshot taken"
                })
              })
            });
          }
        }
        if ((_d = (_c = part.inlineData) == null ? void 0 : _c.mimeType) == null ? void 0 : _d.startsWith("image/")) {
          return {
            text: "screenshot taken"
          };
        }
        return part;
      });
    }
  });
  return {
    items
  };
}

// lib/agent/utils/cuaKeyMapping.ts
var KEY_MAP = {
  ENTER: "Enter",
  RETURN: "Enter",
  ESCAPE: "Escape",
  ESC: "Escape",
  BACKSPACE: "Backspace",
  TAB: "Tab",
  SPACE: " ",
  DELETE: "Delete",
  DEL: "Delete",
  ARROWUP: "ArrowUp",
  ARROWDOWN: "ArrowDown",
  ARROWLEFT: "ArrowLeft",
  ARROWRIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  SHIFT: "Shift",
  CONTROL: "Control",
  CTRL: "Control",
  ALT: "Alt",
  OPTION: "Alt",
  // macOS alternative name
  META: "Meta",
  COMMAND: "Meta",
  // macOS
  CMD: "Meta",
  // macOS shorthand
  SUPER: "Meta",
  // Linux
  WINDOWS: "Meta",
  // Windows
  WIN: "Meta",
  // Windows shorthand
  HOME: "Home",
  END: "End",
  PAGEUP: "PageUp",
  PAGEDOWN: "PageDown",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
  PGUP: "PageUp",
  PGDN: "PageDown"
};
function mapKeyToPlaywright(key) {
  if (!key) return key;
  const upperKey = key.toUpperCase();
  return KEY_MAP[upperKey] || key;
}

// lib/agent/OpenAICUAClient.ts
var OpenAICUAClient = class extends AgentClient {
  // "browser", "mac", "windows", or "ubuntu"
  constructor(type, modelName, userProvidedInstructions, clientOptions) {
    super(type, modelName, userProvidedInstructions);
    this.currentViewport = { width: 1288, height: 711 };
    this.reasoningItems = /* @__PURE__ */ new Map();
    this.environment = "browser";
    this.apiKey = (clientOptions == null ? void 0 : clientOptions.apiKey) || process.env.OPENAI_API_KEY || "";
    this.organization = (clientOptions == null ? void 0 : clientOptions.organization) || process.env.OPENAI_ORG;
    if ((clientOptions == null ? void 0 : clientOptions.environment) && typeof clientOptions.environment === "string") {
      this.environment = clientOptions.environment;
    }
    this.clientOptions = {
      apiKey: this.apiKey
    };
    this.client = new import_openai5.default(this.clientOptions);
  }
  setViewport(width, height) {
    this.currentViewport = { width, height };
  }
  setCurrentUrl(url) {
    this.currentUrl = url;
  }
  setScreenshotProvider(provider) {
    this.screenshotProvider = provider;
  }
  setActionHandler(handler) {
    this.actionHandler = handler;
  }
  /**
   * Execute a task with the OpenAI CUA
   * This is the main entry point for the agent
   * @implements AgentClient.execute
   */
  execute(executionOptions) {
    return __async(this, null, function* () {
      const { options, logger } = executionOptions;
      const { instruction } = options;
      const maxSteps = options.maxSteps || 10;
      let currentStep = 0;
      let completed = false;
      const actions = [];
      const messageList = [];
      let finalMessage = "";
      this.reasoningItems.clear();
      let inputItems = this.createInitialInputItems(instruction);
      let previousResponseId = void 0;
      let totalInputTokens = 0;
      let totalOutputTokens = 0;
      let totalInferenceTime = 0;
      try {
        while (!completed && currentStep < maxSteps) {
          logger({
            category: "agent",
            message: `Executing step ${currentStep + 1}/${maxSteps}`,
            level: 2
          });
          const result = yield this.executeStep(
            inputItems,
            previousResponseId,
            logger
          );
          totalInputTokens += result.usage.input_tokens;
          totalOutputTokens += result.usage.output_tokens;
          totalInferenceTime += result.usage.inference_time_ms;
          actions.push(...result.actions);
          completed = result.completed;
          previousResponseId = result.responseId;
          if (!completed) {
            inputItems = result.nextInputItems;
          }
          if (result.message) {
            messageList.push(result.message);
            finalMessage = result.message;
          }
          currentStep++;
        }
        return {
          success: completed,
          actions,
          message: finalMessage,
          completed,
          usage: {
            input_tokens: totalInputTokens,
            output_tokens: totalOutputTokens,
            inference_time_ms: totalInferenceTime
          }
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger({
          category: "agent",
          message: `Error executing agent task: ${errorMessage}`,
          level: 0
        });
        return {
          success: false,
          actions,
          message: `Failed to execute task: ${errorMessage}`,
          completed: false,
          usage: {
            input_tokens: totalInputTokens,
            output_tokens: totalOutputTokens,
            inference_time_ms: totalInferenceTime
          }
        };
      }
    });
  }
  /**
   * Execute a single step of the agent
   * This coordinates the flow: Request → Get Action → Execute Action
   */
  executeStep(inputItems, previousResponseId, logger) {
    return __async(this, null, function* () {
      try {
        const compressedResult = compressOpenAIConversationImages(inputItems, 2);
        const compressedInputItems = compressedResult.items;
        const result = yield this.getAction(
          compressedInputItems,
          previousResponseId
        );
        const output = result.output;
        const responseId = result.responseId;
        const usage = {
          input_tokens: result.usage.input_tokens,
          output_tokens: result.usage.output_tokens,
          inference_time_ms: result.usage.inference_time_ms
        };
        for (const item of output) {
          if (item.type === "reasoning") {
            this.reasoningItems.set(item.id, item);
            logger({
              category: "agent",
              message: `Reasoning: ${String(item.content || "")}`,
              level: 1
            });
          }
        }
        const stepActions = [];
        for (const item of output) {
          if (item.type === "computer_call" && this.isComputerCallItem(item)) {
            logger({
              category: "agent",
              message: `Found computer_call: ${item.action.type}, call_id: ${item.call_id}`,
              level: 2
            });
            const action = this.convertComputerCallToAction(item);
            if (action) {
              stepActions.push(action);
              logger({
                category: "agent",
                message: `Converted computer_call to action: ${action.type}`,
                level: 2
              });
            }
          } else if (item.type === "function_call" && this.isFunctionCallItem(item)) {
            logger({
              category: "agent",
              message: `Found function_call: ${item.name}, call_id: ${item.call_id}`,
              level: 2
            });
            const action = this.convertFunctionCallToAction(item);
            if (action) {
              stepActions.push(action);
              logger({
                category: "agent",
                message: `Converted function_call to action: ${action.type}`,
                level: 2
              });
            }
          }
        }
        let message = "";
        for (const item of output) {
          if (item.type === "message") {
            logger({
              category: "agent",
              message: `Found message block`,
              level: 2
            });
            if (item.content && Array.isArray(item.content)) {
              for (const content of item.content) {
                if (content.type === "output_text" && content.text) {
                  message += content.text + "\n";
                  logger({
                    category: "agent",
                    message: `Message text: ${String(content.text || "")}`,
                    level: 1
                  });
                }
              }
            }
          }
        }
        const nextInputItems = yield this.takeAction(output, logger);
        const completed = output.length === 0 || output.every(
          (item) => item.type === "message" || item.type === "reasoning"
        );
        return {
          actions: stepActions,
          message: message.trim(),
          completed,
          nextInputItems,
          responseId,
          usage
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger({
          category: "agent",
          message: `Error executing step: ${errorMessage}`,
          level: 0
        });
        throw error;
      }
    });
  }
  isComputerCallItem(item) {
    return item.type === "computer_call" && "call_id" in item && "action" in item && typeof item.action === "object";
  }
  isFunctionCallItem(item) {
    return item.type === "function_call" && "call_id" in item && "name" in item && "arguments" in item;
  }
  createInitialInputItems(instruction) {
    return [
      {
        role: "system",
        content: this.userProvidedInstructions
      },
      {
        role: "user",
        content: instruction
      }
    ];
  }
  getAction(inputItems, previousResponseId) {
    return __async(this, null, function* () {
      try {
        const requestParams = {
          model: this.modelName,
          tools: [
            {
              type: "computer_use_preview",
              display_width: this.currentViewport.width,
              display_height: this.currentViewport.height,
              environment: this.environment
            }
          ],
          input: inputItems,
          truncation: "auto"
        };
        if (previousResponseId) {
          requestParams.previous_response_id = previousResponseId;
        }
        const startTime = Date.now();
        const response = yield this.client.responses.create(requestParams);
        const endTime = Date.now();
        const elapsedMs = endTime - startTime;
        const usage = {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
          inference_time_ms: elapsedMs
        };
        this.lastResponseId = response.id;
        return {
          output: response.output,
          responseId: response.id,
          usage
        };
      } catch (error) {
        console.error("Error getting action from OpenAI:", error);
        throw error;
      }
    });
  }
  takeAction(output, logger) {
    return __async(this, null, function* () {
      const nextInputItems = [];
      for (const item of output) {
        if (item.type === "computer_call" && this.isComputerCallItem(item)) {
          try {
            const action = this.convertComputerCallToAction(item);
            if (action && this.actionHandler) {
              logger({
                category: "agent",
                message: `Executing computer action: ${action.type}`,
                level: 1
              });
              yield this.actionHandler(action);
            }
            const screenshot = yield this.captureScreenshot();
            const outputItem = {
              type: "computer_call_output",
              call_id: item.call_id,
              output: {
                type: "input_image",
                image_url: screenshot
              }
            };
            logger({
              category: "agent",
              message: `Added computer_call_output for call_id: ${item.call_id}`,
              level: 2
            });
            if (this.currentUrl) {
              const computerCallOutput = outputItem;
              computerCallOutput.output.current_url = this.currentUrl;
            }
            if (item.pending_safety_checks && item.pending_safety_checks.length > 0) {
              const computerCallOutput = outputItem;
              computerCallOutput.acknowledged_safety_checks = item.pending_safety_checks;
            }
            nextInputItems.push(outputItem);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger({
              category: "agent",
              message: `Error executing computer call: ${errorMessage}`,
              level: 0
            });
            try {
              const screenshot = yield this.captureScreenshot();
              const errorOutputItem = {
                type: "computer_call_output",
                call_id: item.call_id,
                output: {
                  type: "input_image",
                  image_url: screenshot,
                  error: errorMessage
                }
              };
              if (this.currentUrl) {
                const computerCallOutput = errorOutputItem;
                computerCallOutput.output.current_url = this.currentUrl;
              }
              if (item.pending_safety_checks && item.pending_safety_checks.length > 0) {
                const computerCallOutput = errorOutputItem;
                computerCallOutput.acknowledged_safety_checks = item.pending_safety_checks;
              }
              nextInputItems.push(errorOutputItem);
            } catch (screenshotError) {
              logger({
                category: "agent",
                message: `Error capturing screenshot: ${String(screenshotError)}`,
                level: 0
              });
              nextInputItems.push({
                type: "computer_call_output",
                call_id: item.call_id,
                output: `Error: ${errorMessage}`
              });
            }
          }
        } else if (item.type === "function_call" && this.isFunctionCallItem(item)) {
          try {
            const action = this.convertFunctionCallToAction(item);
            if (action && this.actionHandler) {
              yield this.actionHandler(action);
            }
            nextInputItems.push({
              type: "function_call_output",
              call_id: item.call_id,
              output: "success"
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger({
              category: "agent",
              message: `Error executing function call: ${errorMessage}`,
              level: 0
            });
            nextInputItems.push({
              type: "function_call_output",
              call_id: item.call_id,
              output: `Error: ${errorMessage}`
            });
          }
        }
      }
      return nextInputItems;
    });
  }
  convertComputerCallToAction(call) {
    const { action } = call;
    if (action.type === "keypress") {
      action.keys = action.keys.map(
        (key) => mapKeyToPlaywright(key)
      );
    }
    return __spreadValues({
      type: action.type
    }, action);
  }
  convertFunctionCallToAction(call) {
    try {
      const args = JSON.parse(call.arguments);
      return {
        type: call.name,
        params: args
      };
    } catch (error) {
      console.error("Error parsing function call arguments:", error);
      return null;
    }
  }
  captureScreenshot(options) {
    return __async(this, null, function* () {
      if (options == null ? void 0 : options.base64Image) {
        return `data:image/png;base64,${options.base64Image}`;
      }
      if (this.screenshotProvider) {
        try {
          const base64Image = yield this.screenshotProvider();
          return `data:image/png;base64,${base64Image}`;
        } catch (error) {
          console.error("Error capturing screenshot:", error);
          throw error;
        }
      }
      throw new AgentScreenshotProviderError(
        "`screenshotProvider` has not been set. Please call `setScreenshotProvider()` with a valid function that returns a base64-encoded image"
      );
    });
  }
};

// lib/agent/AnthropicCUAClient.ts
var import_sdk2 = __toESM(require("@anthropic-ai/sdk"));
var AnthropicCUAClient = class extends AgentClient {
  constructor(type, modelName, userProvidedInstructions, clientOptions, experimental) {
    super(type, modelName, userProvidedInstructions);
    this.currentViewport = { width: 1288, height: 711 };
    this.thinkingBudget = null;
    this.experimental = false;
    this.apiKey = (clientOptions == null ? void 0 : clientOptions.apiKey) || process.env.ANTHROPIC_API_KEY || "";
    this.baseURL = (clientOptions == null ? void 0 : clientOptions.baseURL) || void 0;
    if ((clientOptions == null ? void 0 : clientOptions.thinkingBudget) && typeof clientOptions.thinkingBudget === "number") {
      this.thinkingBudget = clientOptions.thinkingBudget;
    }
    this.experimental = experimental || false;
    this.clientOptions = {
      apiKey: this.apiKey
    };
    if (this.baseURL) {
      this.clientOptions.baseUrl = this.baseURL;
    }
    this.client = new import_sdk2.default(this.clientOptions);
  }
  setViewport(width, height) {
    this.currentViewport = { width, height };
  }
  setCurrentUrl(url) {
    this.currentUrl = url;
  }
  setScreenshotProvider(provider) {
    this.screenshotProvider = provider;
  }
  setActionHandler(handler) {
    this.actionHandler = handler;
  }
  /**
   * Execute a task with the Anthropic CUA
   * This is the main entry point for the agent
   * @implements AgentClient.execute
   */
  execute(executionOptions) {
    return __async(this, null, function* () {
      const { options, logger } = executionOptions;
      const { instruction } = options;
      const maxSteps = options.maxSteps || 10;
      let currentStep = 0;
      let completed = false;
      const actions = [];
      const messageList = [];
      let finalMessage = "";
      let inputItems = this.createInitialInputItems(instruction);
      logger({
        category: "agent",
        message: `Starting Anthropic agent execution with instruction: ${instruction}`,
        level: 1
      });
      let totalInputTokens = 0;
      let totalOutputTokens = 0;
      let totalInferenceTime = 0;
      try {
        while (!completed && currentStep < maxSteps) {
          logger({
            category: "agent",
            message: `Executing step ${currentStep + 1}/${maxSteps}`,
            level: 2
          });
          const result = yield this.executeStep(inputItems, logger);
          totalInputTokens += result.usage.input_tokens;
          totalOutputTokens += result.usage.output_tokens;
          totalInferenceTime += result.usage.inference_time_ms;
          if (result.actions.length > 0) {
            logger({
              category: "agent",
              message: `Step ${currentStep + 1} performed ${result.actions.length} actions`,
              level: 2
            });
            actions.push(...result.actions);
          }
          completed = result.completed;
          if (!completed) {
            inputItems = result.nextInputItems;
          }
          if (result.message) {
            messageList.push(result.message);
            finalMessage = result.message;
          }
          currentStep++;
        }
        logger({
          category: "agent",
          message: `Anthropic agent execution completed: ${completed}, with ${actions.length} total actions performed`,
          level: 1
        });
        return {
          success: completed,
          actions,
          message: finalMessage,
          completed,
          usage: {
            input_tokens: totalInputTokens,
            output_tokens: totalOutputTokens,
            inference_time_ms: totalInferenceTime
          }
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger({
          category: "agent",
          message: `Error executing agent task: ${errorMessage}`,
          level: 0
        });
        return {
          success: false,
          actions,
          message: `Failed to execute task: ${errorMessage}`,
          completed: false,
          usage: {
            input_tokens: totalInputTokens,
            output_tokens: totalOutputTokens,
            inference_time_ms: totalInferenceTime
          }
        };
      }
    });
  }
  executeStep(inputItems, logger) {
    return __async(this, null, function* () {
      try {
        const result = yield this.getAction(inputItems);
        const content = result.content;
        const usage = {
          input_tokens: result.usage.input_tokens,
          output_tokens: result.usage.output_tokens,
          inference_time_ms: result.usage.inference_time_ms
        };
        logger({
          category: "agent",
          message: `Received response with ${content.length} content blocks`,
          level: 2
        });
        const stepActions = [];
        const toolUseItems = [];
        let message = "";
        for (const block of content) {
          console.log("Processing block:", JSON.stringify(block, null, 2));
          logger({
            category: "agent",
            message: `Processing block type: ${block.type}, id: ${block.id || "unknown"}`,
            level: 2
          });
          if (block.type === "tool_use") {
            logger({
              category: "agent",
              message: `Found tool_use block: ${JSON.stringify(block)}`,
              level: 2
            });
            const toolUseItem = block;
            toolUseItems.push(toolUseItem);
            logger({
              category: "agent",
              message: `Added tool_use item: ${toolUseItem.name}, action: ${JSON.stringify(toolUseItem.input)}`,
              level: 2
            });
            const action = this.convertToolUseToAction(toolUseItem);
            if (action) {
              logger({
                category: "agent",
                message: `Created action from tool_use: ${toolUseItem.name}, action: ${action.type}`,
                level: 2
              });
              stepActions.push(action);
            }
          } else if (block.type === "text") {
            const textBlock = block;
            message += textBlock.text + "\n";
            logger({
              category: "agent",
              message: `Found text block: ${textBlock.text}`,
              level: 2
            });
          } else {
            logger({
              category: "agent",
              message: `Found unknown block type: ${block.type}`,
              level: 2
            });
          }
        }
        if (this.actionHandler && stepActions.length > 0) {
          for (const action of stepActions) {
            try {
              logger({
                category: "agent",
                message: `Executing action: ${action.type}`,
                level: 1
              });
              yield this.actionHandler(action);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : String(error);
              logger({
                category: "agent",
                message: `Error executing action ${action.type}: ${errorMessage}`,
                level: 0
              });
            }
          }
        }
        const assistantMessage = {
          role: "assistant",
          content
        };
        const nextInputItems = [...inputItems];
        if (this.experimental) {
          compressAnthropicConversationImages(nextInputItems);
        }
        nextInputItems.push(assistantMessage);
        if (toolUseItems.length > 0) {
          const toolResults = yield this.takeAction(toolUseItems, logger);
          if (toolResults.length > 0) {
            const userToolResultsMessage = {
              role: "user",
              content: toolResults
            };
            nextInputItems.push(userToolResultsMessage);
          }
        }
        const completed = toolUseItems.length === 0;
        logger({
          category: "agent",
          message: `Step processed ${toolUseItems.length} tool use items, completed: ${completed}`,
          level: 2
        });
        return {
          actions: stepActions,
          message: message.trim(),
          completed,
          nextInputItems,
          usage
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger({
          category: "agent",
          message: `Error executing step: ${errorMessage}`,
          level: 0
        });
        throw error;
      }
    });
  }
  createInitialInputItems(instruction) {
    return [
      {
        role: "system",
        content: this.userProvidedInstructions
      },
      {
        role: "user",
        content: instruction
      }
    ];
  }
  getAction(inputItems) {
    return __async(this, null, function* () {
      try {
        const messages = [];
        for (const item of inputItems) {
          if ("role" in item) {
            if (item.role !== "system") {
              messages.push(item);
            }
          }
        }
        const thinking = this.thinkingBudget ? { type: "enabled", budget_tokens: this.thinkingBudget } : void 0;
        const requestParams = {
          model: this.modelName,
          max_tokens: 4096,
          messages,
          tools: [
            {
              type: "computer_20250124",
              // Use the latest version for Claude 3.7 Sonnet
              name: "computer",
              display_width_px: this.currentViewport.width,
              display_height_px: this.currentViewport.height,
              display_number: 1
            }
          ],
          betas: ["computer-use-2025-01-24"]
        };
        if (this.userProvidedInstructions) {
          requestParams.system = this.userProvidedInstructions;
        }
        if (thinking) {
          requestParams.thinking = thinking;
        }
        if (messages.length > 0) {
          const firstMessage = messages[0];
          const contentPreview = typeof firstMessage.content === "string" ? firstMessage.content.substring(0, 50) : "complex content";
          console.log(
            `Sending request to Anthropic with ${messages.length} messages and ${messages.length > 0 ? `first message role: ${messages[0].role}, content: ${contentPreview}...` : "no messages"}`
          );
        }
        const startTime = Date.now();
        const response = yield this.client.beta.messages.create(requestParams);
        const endTime = Date.now();
        const elapsedMs = endTime - startTime;
        const usage = {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
          inference_time_ms: elapsedMs
        };
        this.lastMessageId = response.id;
        return {
          // Cast the response content to our internal type
          content: response.content,
          id: response.id,
          usage
        };
      } catch (error) {
        console.error("Error getting action from Anthropic:", error);
        throw error;
      }
    });
  }
  takeAction(toolUseItems, logger) {
    return __async(this, null, function* () {
      const nextInputItems = [];
      logger({
        category: "agent",
        message: `Taking action on ${toolUseItems.length} tool use items`,
        level: 2
      });
      for (const item of toolUseItems) {
        try {
          logger({
            category: "agent",
            message: `Processing tool use: ${item.name}, id: ${item.id}, action: ${JSON.stringify(item.input)}`,
            level: 2
          });
          if (item.name === "computer") {
            const action = item.input.action;
            logger({
              category: "agent",
              message: `Computer action type: ${action}`,
              level: 2
            });
            const screenshot = yield this.captureScreenshot();
            logger({
              category: "agent",
              message: `Screenshot captured, length: ${screenshot.length}`,
              level: 2
            });
            const imageContent = [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/png",
                  data: screenshot.replace(/^data:image\/png;base64,/, "")
                }
              }
            ];
            if (this.currentUrl) {
              nextInputItems.push({
                type: "tool_result",
                tool_use_id: item.id,
                content: [
                  ...imageContent,
                  {
                    type: "text",
                    text: `Current URL: ${this.currentUrl}`
                  }
                ]
              });
            } else {
              nextInputItems.push({
                type: "tool_result",
                tool_use_id: item.id,
                content: imageContent
              });
            }
            logger({
              category: "agent",
              message: `Added computer tool result for tool_use_id: ${item.id}`,
              level: 2
            });
          } else {
            nextInputItems.push({
              type: "tool_result",
              tool_use_id: item.id,
              content: "Tool executed successfully"
            });
            logger({
              category: "agent",
              message: `Added generic tool result for tool ${item.name}, tool_use_id: ${item.id}`,
              level: 2
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger({
            category: "agent",
            message: `Error executing tool use: ${errorMessage}`,
            level: 0
          });
          try {
            if (item.name === "computer") {
              const screenshot = yield this.captureScreenshot();
              nextInputItems.push({
                type: "tool_result",
                tool_use_id: item.id,
                content: [
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: "image/png",
                      data: screenshot.replace(/^data:image\/png;base64,/, "")
                    }
                  },
                  {
                    type: "text",
                    text: `Error: ${errorMessage}`
                  }
                ]
              });
              logger({
                category: "agent",
                message: `Added error tool result with screenshot for tool_use_id: ${item.id}`,
                level: 1
              });
            } else {
              nextInputItems.push({
                type: "tool_result",
                tool_use_id: item.id,
                content: `Error: ${errorMessage}`
              });
              logger({
                category: "agent",
                message: `Added error tool result for tool_use_id: ${item.id}`,
                level: 1
              });
            }
          } catch (screenshotError) {
            logger({
              category: "agent",
              message: `Error capturing screenshot: ${String(screenshotError)}`,
              level: 0
            });
            nextInputItems.push({
              type: "tool_result",
              tool_use_id: item.id,
              content: `Error: ${errorMessage}`
            });
            logger({
              category: "agent",
              message: `Added text error tool result for tool_use_id: ${item.id}`,
              level: 1
            });
          }
        }
      }
      logger({
        category: "agent",
        message: `Prepared ${nextInputItems.length} input items for next request`,
        level: 2
      });
      return nextInputItems;
    });
  }
  convertToolUseToAction(item) {
    try {
      const { name: name14, input } = item;
      if (name14 === "computer") {
        const action = input.action;
        if (!action) {
          console.warn("Missing action in tool use item:", item);
          return null;
        }
        if (action === "screenshot") {
          return __spreadValues({
            type: "screenshot"
          }, input);
        } else if (action === "click") {
          return __spreadValues({
            type: "click",
            x: input.x,
            y: input.y,
            button: input.button || "left"
          }, input);
        } else if (action === "type") {
          return __spreadValues({
            type: "type",
            text: input.text
          }, input);
        } else if (action === "keypress" || action === "key") {
          const key = action === "key" ? input.text : input.keys;
          const keys = key.split("+");
          return __spreadValues({
            type: "keypress",
            keys: keys.map((key2) => mapKeyToPlaywright(key2))
          }, input);
        } else if (action === "double_click" || action === "doubleClick") {
          return __spreadValues({
            type: action,
            x: input.x,
            y: input.y
          }, input);
        } else if (action === "triple_click" || action === "tripleClick") {
          return __spreadValues({
            type: action,
            x: input.x,
            y: input.y
          }, input);
        } else if (action === "scroll") {
          const x = input.x || (input.coordinate ? input.coordinate[0] : 0);
          const y = input.y || (input.coordinate ? input.coordinate[1] : 0);
          let scroll_x = 0;
          let scroll_y = 0;
          const scrollAmount = input.scroll_amount || 5;
          const scrollMultiplier = 100;
          if (input.scroll_direction) {
            const direction = input.scroll_direction;
            if (direction === "down") {
              scroll_y = scrollAmount * scrollMultiplier;
            } else if (direction === "up") {
              scroll_y = -scrollAmount * scrollMultiplier;
            } else if (direction === "right") {
              scroll_x = scrollAmount * scrollMultiplier;
            } else if (direction === "left") {
              scroll_x = -scrollAmount * scrollMultiplier;
            }
          } else {
            scroll_x = input.scroll_x || 0;
            scroll_y = input.scroll_y || 0;
          }
          return __spreadValues({
            type: "scroll",
            x,
            y,
            scroll_x,
            scroll_y
          }, input);
        } else if (action === "move") {
          const coordinates = input.coordinate;
          const x = coordinates ? coordinates[0] : input.x || 0;
          const y = coordinates ? coordinates[1] : input.y || 0;
          return __spreadValues({
            type: "move",
            x,
            y
          }, input);
        } else if (action === "drag" || action === "left_click_drag") {
          const path4 = input.path || (input.coordinate ? [
            {
              x: input.start_coordinate[0],
              y: input.start_coordinate[1]
            },
            {
              x: input.coordinate[0],
              y: input.coordinate[1]
            }
          ] : []);
          return __spreadValues({
            type: "drag",
            path: path4
          }, input);
        } else if (action === "wait") {
          return __spreadValues({
            type: "wait"
          }, input);
        } else if (action === "left_click") {
          const coordinates = input.coordinate;
          const x = coordinates ? coordinates[0] : input.x || 0;
          const y = coordinates ? coordinates[1] : input.y || 0;
          return __spreadValues({
            type: "click",
            x,
            y,
            button: "left"
          }, input);
        } else {
          console.log(`Using default action mapping for ${action}`);
          return __spreadValues({
            type: action
          }, input);
        }
      } else if (name14 === "str_replace_editor" || name14 === "bash") {
        return {
          type: name14,
          params: input
        };
      }
      console.warn(`Unknown tool name: ${name14}`);
      return null;
    } catch (error) {
      console.error("Error converting tool use to action:", error);
      return null;
    }
  }
  captureScreenshot(options) {
    return __async(this, null, function* () {
      if (options == null ? void 0 : options.base64Image) {
        return `data:image/png;base64,${options.base64Image}`;
      }
      if (this.screenshotProvider) {
        try {
          const base64Image = yield this.screenshotProvider();
          return `data:image/png;base64,${base64Image}`;
        } catch (error) {
          console.error("Error capturing screenshot:", error);
          throw error;
        }
      }
      throw new AgentScreenshotProviderError(
        "`screenshotProvider` has not been set. Please call `setScreenshotProvider()` with a valid function that returns a base64-encoded image"
      );
    });
  }
};

// lib/agent/GoogleCUAClient.ts
var import_genai3 = require("@google/genai");
var GoogleCUAClient = class extends AgentClient {
  constructor(type, modelName, userProvidedInstructions, clientOptions) {
    super(type, modelName, userProvidedInstructions);
    this.currentViewport = { width: 1288, height: 711 };
    this.history = [];
    this.environment = "ENVIRONMENT_BROWSER";
    this.apiKey = (clientOptions == null ? void 0 : clientOptions.apiKey) || process.env.GEMINI_API_KEY || "";
    this.client = new import_genai3.GoogleGenAI({
      apiKey: this.apiKey
    });
    if ((clientOptions == null ? void 0 : clientOptions.environment) && typeof clientOptions.environment === "string") {
      this.environment = clientOptions.environment;
    }
    this.generateContentConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      // systemInstruction: this.userProvidedInstructions
      //   ? { parts: [{ text: this.userProvidedInstructions }] }
      //   : { parts: [{ text: buildGoogleCUASystemPrompt() }] },
      tools: [
        {
          computerUse: {
            environment: this.environment
          }
        }
      ]
    };
    this.clientOptions = {
      apiKey: this.apiKey
    };
  }
  setViewport(width, height) {
    this.currentViewport = { width, height };
  }
  setCurrentUrl(url) {
    this.currentUrl = url;
  }
  setScreenshotProvider(provider) {
    this.screenshotProvider = provider;
  }
  setActionHandler(handler) {
    this.actionHandler = handler;
  }
  /**
   * Execute a task with the Google CUA
   * This is the main entry point for the agent
   * @implements AgentClient.execute
   */
  execute(executionOptions) {
    return __async(this, null, function* () {
      const { options, logger } = executionOptions;
      const { instruction } = options;
      const maxSteps = options.maxSteps || 10;
      let currentStep = 0;
      let completed = false;
      const actions = [];
      const messageList = [];
      let finalMessage = "";
      this.history = [];
      yield this.initializeHistory(instruction);
      let totalInputTokens = 0;
      let totalOutputTokens = 0;
      let totalInferenceTime = 0;
      try {
        while (!completed && currentStep < maxSteps) {
          logger({
            category: "agent",
            message: `Executing step ${currentStep + 1}/${maxSteps}`,
            level: 2
          });
          const result = yield this.executeStep(logger);
          totalInputTokens += result.usage.input_tokens;
          totalOutputTokens += result.usage.output_tokens;
          totalInferenceTime += result.usage.inference_time_ms;
          actions.push(...result.actions);
          completed = result.completed;
          if (result.message) {
            messageList.push(result.message);
            finalMessage = result.message;
          }
          currentStep++;
        }
        return {
          success: completed,
          actions,
          message: finalMessage,
          completed,
          usage: {
            input_tokens: totalInputTokens,
            output_tokens: totalOutputTokens,
            inference_time_ms: totalInferenceTime
          }
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger({
          category: "agent",
          message: `Error executing agent task: ${errorMessage}`,
          level: 0
        });
        return {
          success: false,
          actions,
          message: `Failed to execute task: ${errorMessage}`,
          completed: false,
          usage: {
            input_tokens: totalInputTokens,
            output_tokens: totalOutputTokens,
            inference_time_ms: totalInferenceTime
          }
        };
      }
    });
  }
  /**
   * Initialize conversation history with the initial instruction
   */
  initializeHistory(instruction) {
    return __async(this, null, function* () {
      const parts = [{ text: instruction }];
      this.history = [
        {
          role: "user",
          parts: [
            {
              text: "System prompt: " + buildGoogleCUASystemPrompt().content
            }
          ]
        },
        {
          role: "user",
          parts
        }
      ];
    });
  }
  /**
   * Execute a single step of the agent
   */
  executeStep(logger) {
    return __async(this, null, function* () {
      var _a15, _b;
      try {
        const startTime = Date.now();
        const compressedResult = compressGoogleConversationImages(
          this.history,
          2
        );
        const compressedHistory = compressedResult.items;
        const maxRetries = 5;
        const baseDelayS = 1;
        let lastError = null;
        let response = null;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            if (attempt > 0) {
              const delay = baseDelayS * Math.pow(2, attempt) * 1e3;
              logger({
                category: "agent",
                message: `Generating content failed on attempt ${attempt + 1}. Retrying in ${delay / 1e3} seconds...`,
                level: 2
              });
              yield new Promise((resolve2) => setTimeout(resolve2, delay));
            }
            response = yield this.client.models.generateContent({
              model: this.modelName,
              contents: compressedHistory,
              config: this.generateContentConfig
            });
            if (!response.candidates || response.candidates.length === 0) {
              throw new Error("Response has no candidates!");
            }
            break;
          } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            logger({
              category: "agent",
              message: `API call error: ${lastError.message}`,
              level: 2
            });
            if (attempt === maxRetries - 1) {
              logger({
                category: "agent",
                message: `Generating content failed after ${maxRetries} attempts.`,
                level: 0
              });
              throw lastError;
            }
          }
        }
        if (!response) {
          throw lastError || new Error("Failed to get response after all retries");
        }
        const endTime = Date.now();
        const elapsedMs = endTime - startTime;
        const { usageMetadata } = response;
        const result = yield this.processResponse(response, logger);
        if (response.candidates && response.candidates[0]) {
          const sanitizedContent = JSON.parse(
            JSON.stringify(response.candidates[0].content)
          );
          if (sanitizedContent.parts) {
            for (const part of sanitizedContent.parts) {
              if ((_a15 = part.functionCall) == null ? void 0 : _a15.args) {
                if (typeof part.functionCall.args.x === "number" && part.functionCall.args.x > 999) {
                  part.functionCall.args.x = 999;
                }
                if (typeof part.functionCall.args.y === "number" && part.functionCall.args.y > 999) {
                  part.functionCall.args.y = 999;
                }
              }
            }
          }
          this.history.push(sanitizedContent);
        }
        const functionResponses = [];
        if (result.actions.length > 0) {
          let hasError = false;
          for (let i = 0; i < result.actions.length; i++) {
            const action = result.actions[i];
            logger({
              category: "agent",
              message: `Executing action ${i + 1}/${result.actions.length}: ${action.type}`,
              level: 2
            });
            if (action.type === "function" && action.name === "open_web_browser") {
              logger({
                category: "agent",
                message: "Skipping open_web_browser action",
                level: 2
              });
            } else if (this.actionHandler) {
              try {
                yield this.actionHandler(action);
                if (i < result.actions.length - 1) {
                  const nextAction = result.actions[i + 1];
                  const isTypingAction = action.type === "type" || nextAction.type === "type";
                  const delay = isTypingAction ? 500 : 200;
                  yield new Promise((resolve2) => setTimeout(resolve2, delay));
                }
              } catch (actionError) {
                logger({
                  category: "agent",
                  message: `Error executing action ${action.type}: ${actionError}`,
                  level: 0
                });
                hasError = true;
              }
            }
          }
          if (result.functionCalls.length > 0 || hasError) {
            try {
              logger({
                category: "agent",
                message: `Taking screenshot after executing ${result.actions.length} actions${hasError ? " (with errors)" : ""}`,
                level: 2
              });
              const screenshot = yield this.captureScreenshot();
              const base64Data = screenshot.replace(
                /^data:image\/png;base64,/,
                ""
              );
              for (const functionCall of result.functionCalls) {
                const functionResponsePart = {
                  functionResponse: {
                    name: functionCall.name,
                    response: __spreadValues({
                      url: this.currentUrl || ""
                    }, ((_b = functionCall.args) == null ? void 0 : _b.safety_decision) ? {
                      safety_acknowledgement: "true"
                    } : {}),
                    parts: [
                      {
                        inlineData: {
                          mimeType: "image/png",
                          data: base64Data
                        }
                      }
                    ]
                  }
                };
                functionResponses.push(functionResponsePart);
              }
            } catch (error) {
              logger({
                category: "agent",
                message: `Error capturing screenshot: ${error}`,
                level: 0
              });
            }
          }
          if (functionResponses.length > 0) {
            logger({
              category: "agent",
              message: `Adding ${functionResponses.length} function responses to history`,
              level: 2
            });
            this.history.push({
              role: "user",
              parts: functionResponses
            });
          }
        }
        return {
          actions: result.actions,
          message: result.message,
          completed: result.completed,
          usage: {
            input_tokens: (usageMetadata == null ? void 0 : usageMetadata.promptTokenCount) || 0,
            output_tokens: (usageMetadata == null ? void 0 : usageMetadata.candidatesTokenCount) || 0,
            inference_time_ms: elapsedMs
          }
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger({
          category: "agent",
          message: `Error executing step: ${errorMessage}`,
          level: 0
        });
        throw error;
      }
    });
  }
  /**
   * Process the response from Google's API
   */
  processResponse(response, logger) {
    return __async(this, null, function* () {
      const actions = [];
      let message = "";
      const functionCalls = [];
      if (!response.candidates || response.candidates.length === 0) {
        return {
          actions: [],
          message: "No candidates in response",
          completed: true,
          functionCalls: []
        };
      }
      const candidate = response.candidates[0];
      logger({
        category: "agent",
        message: `Raw response from Google: ${JSON.stringify(candidate.content, null, 2)}`,
        level: 2
      });
      for (const part of candidate.content.parts) {
        if (part.text) {
          message += part.text + "\n";
          logger({
            category: "agent",
            message: `Reasoning: ${part.text}`,
            level: 1
          });
        }
        if (part.functionCall) {
          functionCalls.push(part.functionCall);
          logger({
            category: "agent",
            message: `Found function call: ${part.functionCall.name} with args: ${JSON.stringify(part.functionCall.args)}`,
            level: 2
          });
          const action = this.convertFunctionCallToAction(part.functionCall);
          if (action) {
            if (part.functionCall.name === "type_text_at" && action.type === "type") {
              logger({
                category: "agent",
                message: `Adding action: ${JSON.stringify(action)}`,
                level: 2
              });
              actions.push({
                type: "click",
                x: action.x,
                y: action.y,
                button: "left"
              });
              if (action.clearBeforeTyping) {
                actions.push({
                  type: "keypress",
                  keys: ["ControlOrMeta+A"]
                });
                actions.push({
                  type: "keypress",
                  keys: ["Backspace"]
                });
              }
              actions.push(action);
              if (action.pressEnter) {
                actions.push({
                  type: "keypress",
                  keys: ["Enter"]
                });
              }
            } else {
              actions.push(action);
            }
          } else {
            logger({
              category: "agent",
              message: `Warning: Could not convert function call ${part.functionCall.name} to action`,
              level: 1
            });
          }
        }
      }
      logger({
        category: "agent",
        message: `Found ${functionCalls.length} function calls, converted to ${actions.length} actions`,
        level: 2
      });
      const completed = functionCalls.length === 0 || candidate.finishReason && candidate.finishReason !== "STOP";
      return {
        actions,
        message: message.trim(),
        completed,
        functionCalls
      };
    });
  }
  /**
   * Convert Google function call to Stagehand action
   */
  convertFunctionCallToAction(functionCall) {
    var _a15, _b;
    const { name: name14, args } = functionCall;
    if (!name14 || !args) {
      return null;
    }
    switch (name14) {
      case "open_web_browser":
        return {
          type: "function",
          name: "open_web_browser",
          arguments: null
        };
      case "click_at": {
        const { x, y } = this.normalizeCoordinates(
          args.x,
          args.y
        );
        return {
          type: "click",
          x,
          y,
          button: args.button || "left"
        };
      }
      case "type_text_at": {
        const { x, y } = this.normalizeCoordinates(
          args.x,
          args.y
        );
        const pressEnter = (_a15 = args.press_enter) != null ? _a15 : false;
        const clearBeforeTyping = (_b = args.clear_before_typing) != null ? _b : true;
        return {
          type: "type",
          text: args.text,
          x,
          y,
          pressEnter,
          clearBeforeTyping
        };
      }
      case "key_combination": {
        const keys = args.keys.split("+").map((key) => key.trim()).map((key) => mapKeyToPlaywright(key));
        return {
          type: "keypress",
          keys
        };
      }
      case "scroll_document": {
        const direction = args.direction.toLowerCase();
        return {
          type: "keypress",
          keys: [direction === "up" ? "PageUp" : "PageDown"]
        };
      }
      case "scroll_at": {
        const { x, y } = this.normalizeCoordinates(
          args.x,
          args.y
        );
        const direction = (args.direction || "down").toLowerCase();
        const magnitude = typeof args.magnitude === "number" ? args.magnitude : 800;
        let scroll_x = 0;
        let scroll_y = 0;
        if (direction === "up") {
          scroll_y = -magnitude;
        } else if (direction === "down") {
          scroll_y = magnitude;
        } else if (direction === "left") {
          scroll_x = -magnitude;
        } else if (direction === "right") {
          scroll_x = magnitude;
        } else {
          scroll_y = magnitude;
        }
        return {
          type: "scroll",
          x,
          y,
          scroll_x,
          scroll_y
        };
      }
      case "navigate":
        return {
          type: "function",
          name: "goto",
          arguments: { url: args.url }
        };
      case "go_back":
        return {
          type: "function",
          name: "back",
          arguments: null
        };
      case "go_forward":
        return {
          type: "function",
          name: "forward",
          arguments: null
        };
      case "wait_5_seconds":
        return {
          type: "wait",
          milliseconds: 5e3
          // Google CUA waits for 5 seconds
        };
      case "hover_at": {
        const { x, y } = this.normalizeCoordinates(
          args.x,
          args.y
        );
        return {
          type: "move",
          x,
          y
        };
      }
      case "search":
        return {
          type: "function",
          name: "goto",
          arguments: { url: "https://www.google.com" }
        };
      case "drag_and_drop": {
        const startPoint = this.normalizeCoordinates(
          args.x,
          args.y
        );
        const endPoint = this.normalizeCoordinates(
          args.destination_x,
          args.destination_y
        );
        return {
          type: "drag",
          path: [
            { x: startPoint.x, y: startPoint.y },
            { x: endPoint.x, y: endPoint.y }
          ]
        };
      }
      default:
        console.warn(`Unsupported Google CUA function: ${name14}`);
        return null;
    }
  }
  /**
   * Normalize coordinates from Google's 0-1000 range to actual viewport dimensions
   */
  normalizeCoordinates(x, y) {
    x = Math.min(999, Math.max(0, x));
    y = Math.min(999, Math.max(0, y));
    return {
      x: Math.floor(x / 1e3 * this.currentViewport.width),
      y: Math.floor(y / 1e3 * this.currentViewport.height)
    };
  }
  captureScreenshot(options) {
    return __async(this, null, function* () {
      if (options == null ? void 0 : options.base64Image) {
        return `data:image/png;base64,${options.base64Image}`;
      }
      if (this.screenshotProvider) {
        try {
          const base64Image = yield this.screenshotProvider();
          return `data:image/png;base64,${base64Image}`;
        } catch (error) {
          console.error("Error capturing screenshot:", error);
          throw error;
        }
      }
      throw new AgentScreenshotProviderError(
        "`screenshotProvider` has not been set. Please call `setScreenshotProvider()` with a valid function that returns a base64-encoded image"
      );
    });
  }
};

// lib/agent/AgentProvider.ts
var modelToAgentProviderMap = {
  "computer-use-preview": "openai",
  "computer-use-preview-2025-03-11": "openai",
  "claude-3-7-sonnet-latest": "anthropic",
  "claude-sonnet-4-20250514": "anthropic",
  "claude-opus-4-1-20250805": "anthropic",
  "claude-sonnet-4-5-20250929": "anthropic",
  "computer-use-exp-07-16": "google",
  "computer-use-preview-10-2025": "google"
};
var AgentProvider = class _AgentProvider {
  /**
   * Create a new agent provider
   */
  constructor(logger) {
    this.logger = logger;
  }
  getClient(modelName, clientOptions, userProvidedInstructions, experimental) {
    const type = _AgentProvider.getAgentProvider(modelName);
    this.logger({
      category: "agent",
      message: `Getting agent client for type: ${type}, model: ${modelName}`,
      level: 2
    });
    try {
      switch (type) {
        case "openai":
          return new OpenAICUAClient(
            type,
            modelName,
            userProvidedInstructions,
            clientOptions
          );
        case "anthropic":
          return new AnthropicCUAClient(
            type,
            modelName,
            userProvidedInstructions,
            clientOptions,
            experimental
          );
        case "google":
          return new GoogleCUAClient(
            type,
            modelName,
            userProvidedInstructions,
            clientOptions
          );
        default:
          throw new UnsupportedModelProviderError(
            ["openai", "anthropic", "google"],
            "Computer Use Agent"
          );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger({
        category: "agent",
        message: `Error creating agent client: ${errorMessage}`,
        level: 0
      });
      throw error;
    }
  }
  static getAgentProvider(modelName) {
    if (modelName in modelToAgentProviderMap) {
      return modelToAgentProviderMap[modelName];
    }
    throw new UnsupportedModelError(
      Object.keys(modelToAgentProviderMap),
      "Computer Use Agent"
    );
  }
};

// lib/agent/StagehandAgent.ts
var StagehandAgent = class {
  constructor(client, logger) {
    this.client = client;
    this.logger = logger;
  }
  execute(optionsOrInstruction) {
    return __async(this, null, function* () {
      const options = typeof optionsOrInstruction === "string" ? { instruction: optionsOrInstruction } : optionsOrInstruction;
      this.logger({
        category: "agent",
        message: `Executing agent task: ${options.instruction}`,
        level: 1
      });
      const executionOptions = {
        options,
        logger: this.logger,
        retries: 3
      };
      return yield this.client.execute(executionOptions);
    });
  }
  getModelName() {
    return this.client.modelName;
  }
  getAgentType() {
    return this.client.type;
  }
};

// lib/handlers/agentHandler.ts
var StagehandAgentHandler = class {
  constructor(stagehand, stagehandPage, logger, options) {
    this.stagehand = stagehand;
    this.stagehandPage = stagehandPage;
    this.logger = logger;
    this.options = options;
    this.provider = new AgentProvider(logger);
    const client = this.provider.getClient(
      options.modelName,
      options.clientOptions || {},
      options.userProvidedInstructions,
      options.experimental
    );
    this.agentClient = client;
    this.setupAgentClient();
    this.agent = new StagehandAgent(client, logger);
  }
  setupAgentClient() {
    this.agentClient.setScreenshotProvider(() => __async(this, null, function* () {
      const screenshot = yield this.page.screenshot({
        fullPage: false
      });
      return screenshot.toString("base64");
    }));
    this.agentClient.setActionHandler((action) => __async(this, null, function* () {
      var _a15;
      const defaultDelay = 1e3;
      const waitBetweenActions = ((_a15 = this.options.clientOptions) == null ? void 0 : _a15.waitBetweenActions) || defaultDelay;
      try {
        try {
          yield this.injectCursor();
        } catch (e) {
        }
        yield new Promise((resolve2) => setTimeout(resolve2, 500));
        yield this.executeAction(action);
        yield new Promise((resolve2) => setTimeout(resolve2, waitBetweenActions));
        try {
          yield this.captureAndSendScreenshot();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger({
            category: "agent",
            message: `Warning: Failed to take screenshot after action: ${errorMessage}. Continuing execution.`,
            level: 1
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger({
          category: "agent",
          message: `Error executing action ${action.type}: ${errorMessage}`,
          level: 0
        });
        throw error;
      }
    }));
    this.updateClientViewport();
    this.updateClientUrl();
  }
  /**
   * Execute a task with the agent
   */
  execute(optionsOrInstruction) {
    return __async(this, null, function* () {
      const options = typeof optionsOrInstruction === "string" ? { instruction: optionsOrInstruction } : optionsOrInstruction;
      const currentUrl = this.page.url();
      if (!currentUrl || currentUrl === "about:blank") {
        this.logger({
          category: "agent",
          message: `Page URL is empty or about:blank. Redirecting to www.google.com...`,
          level: 0
        });
        yield this.page.goto("https://www.google.com");
      }
      this.logger({
        category: "agent",
        message: `Executing agent task: ${options.instruction}`,
        level: 1
      });
      try {
        yield this.injectCursor();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger({
          category: "agent",
          message: `Warning: Failed to inject cursor: ${errorMessage}. Continuing with execution.`,
          level: 1
        });
      }
      if (options.autoScreenshot !== false) {
        try {
          yield this.captureAndSendScreenshot();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger({
            category: "agent",
            message: `Warning: Failed to take initial screenshot: ${errorMessage}. Continuing with execution.`,
            level: 1
          });
        }
      }
      const result = yield this.agent.execute(optionsOrInstruction);
      if (result.usage) {
        this.stagehand.updateMetrics(
          "AGENT" /* AGENT */,
          result.usage.input_tokens,
          result.usage.output_tokens,
          result.usage.inference_time_ms
        );
      }
      return result;
    });
  }
  /**
   * Execute a single action on the page
   */
  executeAction(action) {
    return __async(this, null, function* () {
      try {
        switch (action.type) {
          case "click": {
            const { x, y, button = "left" } = action;
            yield new Promise((resolve2) => setTimeout(resolve2, 200));
            yield this.page.mouse.click(x, y, {
              button
            });
            return { success: true };
          }
          // Handle the case for "doubleClick" as well for backward compatibility
          case "doubleClick": {
            const { x, y } = action;
            yield this.updateCursorPosition(x, y);
            yield this.animateClick(x, y);
            yield new Promise((resolve2) => setTimeout(resolve2, 200));
            yield this.animateClick(x, y);
            yield new Promise((resolve2) => setTimeout(resolve2, 200));
            yield this.page.mouse.dblclick(x, y);
            return { success: true };
          }
          case "tripleClick": {
            const { x, y } = action;
            yield this.updateCursorPosition(x, y);
            yield this.animateClick(x, y);
            yield new Promise((resolve2) => setTimeout(resolve2, 200));
            yield this.page.mouse.click(x, y, {
              clickCount: 3
            });
            return { success: true };
          }
          case "type": {
            const { text } = action;
            yield this.page.keyboard.type(text);
            return { success: true };
          }
          case "keypress": {
            const { keys } = action;
            if (Array.isArray(keys)) {
              yield this.page.keyboard.press(keys.join("+"));
            }
            return { success: true };
          }
          case "scroll": {
            const { x, y, scroll_x = 0, scroll_y = 0 } = action;
            yield this.page.mouse.move(x, y);
            yield this.page.mouse.wheel(scroll_x, scroll_y);
            return { success: true };
          }
          case "drag": {
            const { path: path4 } = action;
            if (Array.isArray(path4) && path4.length >= 2) {
              const start = path4[0];
              yield this.updateCursorPosition(start.x, start.y);
              yield this.page.mouse.move(start.x, start.y);
              yield this.page.mouse.down();
              for (let i = 1; i < path4.length; i++) {
                yield this.updateCursorPosition(path4[i].x, path4[i].y);
                yield this.page.mouse.move(path4[i].x, path4[i].y);
              }
              yield this.page.mouse.up();
            }
            return { success: true };
          }
          case "move": {
            const { x, y } = action;
            yield this.updateCursorPosition(x, y);
            yield this.page.mouse.move(x, y);
            return { success: true };
          }
          case "wait": {
            yield new Promise((resolve2) => setTimeout(resolve2, 1e3));
            return { success: true };
          }
          case "screenshot": {
            return { success: true };
          }
          case "function": {
            const { name: name14, arguments: args = {} } = action;
            if (name14 === "goto" && typeof args === "object" && args !== null && "url" in args) {
              yield this.page.goto(args.url);
              this.updateClientUrl();
              return { success: true };
            } else if (name14 === "back") {
              yield this.page.goBack();
              this.updateClientUrl();
              return { success: true };
            } else if (name14 === "forward") {
              yield this.page.goForward();
              this.updateClientUrl();
              return { success: true };
            } else if (name14 === "reload") {
              yield this.page.reload();
              this.updateClientUrl();
              return { success: true };
            }
            return {
              success: false,
              error: `Unsupported function: ${name14}`
            };
          }
          case "key": {
            const { text } = action;
            const playwrightKey = mapKeyToPlaywright(text);
            yield this.page.keyboard.press(playwrightKey);
            return { success: true };
          }
          default:
            return {
              success: false,
              error: `Unsupported action type: ${action.type}`
            };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger({
          category: "agent",
          message: `Error executing action ${action.type}: ${errorMessage}`,
          level: 0
        });
        return {
          success: false,
          error: errorMessage
        };
      }
    });
  }
  updateClientViewport() {
  }
  updateClientUrl() {
    const url = this.page.url();
    this.agentClient.setCurrentUrl(url);
  }
  getAgent() {
    return this.agent;
  }
  getClient() {
    return this.agentClient;
  }
  captureAndSendScreenshot() {
    return __async(this, null, function* () {
      this.logger({
        category: "agent",
        message: "Taking screenshot and sending to agent",
        level: 1
      });
      try {
        const screenshot = yield this.page.screenshot({
          type: "png",
          fullPage: false
        });
        if (this.screenshotCollector) {
          yield this.screenshotCollector.addScreenshot(screenshot);
        }
        const base64Image = screenshot.toString("base64");
        return yield this.agentClient.captureScreenshot({
          base64Image,
          currentUrl: this.page.url()
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger({
          category: "agent",
          message: `Error capturing screenshot: ${errorMessage}`,
          level: 0
        });
        return null;
      }
    });
  }
  /**
   * Inject a cursor element into the page for visual feedback
   */
  injectCursor() {
    return __async(this, null, function* () {
      try {
        this.logger({
          category: "agent",
          message: "Cursor injected for visual feedback",
          level: 1
        });
      } catch (error) {
        this.logger({
          category: "agent",
          message: `Failed to inject cursor: ${error}`,
          level: 0
        });
      }
    });
  }
  /**
   * Update the cursor position on the page
   */
  updateCursorPosition(x, y) {
    return __async(this, null, function* () {
      try {
        this.logger({
          category: "agent",
          message: `Updating cursor position to ${x}, ${y}`,
          level: 2
        });
      } catch (e) {
      }
    });
  }
  /**
   * Animate a click at the given position
   */
  animateClick(_x, _y) {
    return __async(this, null, function* () {
      try {
        this.logger({
          category: "agent",
          message: `Animating click at ${_x}, ${_y}`,
          level: 2
        });
      } catch (e) {
      }
    });
  }
  get page() {
    return this.stagehand.page;
  }
  /**
   * Set the screenshot collector for this agent handler
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setScreenshotCollector(collector) {
    this.screenshotCollector = collector;
  }
  /**
   * Get the screenshot collector
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getScreenshotCollector() {
    return this.screenshotCollector;
  }
};

// types/operator.ts
var import_v35 = require("zod/v3");
var operatorResponseSchema = import_v35.z.object({
  reasoning: import_v35.z.string().describe(
    "The reasoning for the step taken. If this step's method is `close`, the goal was to extract data, and the task was successful, state the data that was extracted."
  ),
  method: import_v35.z.enum([
    "act",
    "extract",
    "goto",
    "close",
    "wait",
    "navback",
    "refresh"
  ]).describe(`The action to perform on the page based off of the goal and the current state of the page.
      goto: Navigate to a specific URL.
      act: Perform an action on the page.  
      extract: Extract data from the page.
      close: The task is complete, close the browser.
      wait: Wait for a period of time.
      navback: Navigate back to the previous page. Do not navigate back if you are already on the first page.
      refresh: Refresh the page.`),
  parameters: import_v35.z.string().describe(
    `The parameter for the action. Only pass in a parameter for the following methods:
        - act: The action to perform. e.g. "click on the submit button" or "type [email] into the email input field and press enter"
        - extract: The data to extract. e.g. "the title of the article". If you want to extract all of the text on the page, leave this undefined.
        - wait: The amount of time to wait in milliseconds.
        - goto: The URL to navigate to. e.g. "https://www.google.com"
        The other methods do not require a parameter.`
  ).nullable(),
  taskComplete: import_v35.z.boolean().describe(
    "Whether the task is complete. If true, the task is complete and no more steps are needed. If you chose to close the task because the goal is not achievable, set this to false."
  )
});
var operatorSummarySchema = import_v35.z.object({
  answer: import_v35.z.string().describe("The final answer to the original instruction.")
});

// lib/handlers/operatorHandler.ts
var StagehandOperatorHandler = class {
  constructor(stagehandPage, logger, llmClient) {
    this.stagehandPage = stagehandPage;
    this.logger = logger;
    this.llmClient = llmClient;
  }
  execute(instructionOrOptions) {
    return __async(this, null, function* () {
      const options = typeof instructionOrOptions === "string" ? { instruction: instructionOrOptions } : instructionOrOptions;
      this.messages = [buildOperatorSystemPrompt(options.instruction)];
      let completed = false;
      let currentStep = 0;
      const maxSteps = options.maxSteps || 10;
      const actions = [];
      while (!completed && currentStep < maxSteps) {
        const url = this.stagehandPage.page.url();
        if (!url || url === "about:blank") {
          this.messages.push({
            role: "user",
            content: [
              {
                type: "text",
                text: "No page is currently loaded. The first step should be a 'goto' action to navigate to a URL."
              }
            ]
          });
        } else {
          const screenshot = yield this.stagehandPage.page.screenshot({
            type: "png",
            fullPage: false
          });
          const base64Image = screenshot.toString("base64");
          let messageText = `Here is a screenshot of the current page (URL: ${url}):`;
          messageText = `Previous actions were: ${actions.map((action) => {
            let result2 = "";
            if (action.type === "act") {
              const args = action.playwrightArguments;
              result2 = `Performed a "${args.method}" action ${args.arguments.length > 0 ? `with arguments: ${args.arguments.map((arg) => `"${arg}"`).join(", ")}` : ""} on "${args.description}"`;
            } else if (action.type === "extract") {
              result2 = `Extracted data: ${action.extractionResult}`;
            }
            return `[${action.type}] ${action.reasoning}. Result: ${result2}`;
          }).join("\n")}

${messageText}`;
          this.messages.push({
            role: "user",
            content: [
              {
                type: "text",
                text: messageText
              },
              this.llmClient.type === "anthropic" ? {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/png",
                  data: base64Image
                },
                text: "the screenshot of the current page"
              } : {
                type: "image_url",
                image_url: { url: `data:image/png;base64,${base64Image}` }
              }
            ]
          });
        }
        const result = yield this.getNextStep(currentStep);
        if (result.method === "close") {
          completed = true;
        }
        let playwrightArguments;
        if (result.method === "act") {
          [playwrightArguments] = yield this.stagehandPage.page.observe(
            result.parameters
          );
        }
        let extractionResult;
        if (result.method === "extract") {
          if (result.parameters === null || result.parameters === void 0) {
            const extractionResultObj = yield this.stagehandPage.page.extract();
            extractionResult = extractionResultObj.page_text;
          } else {
            extractionResult = yield this.stagehandPage.page.extract(
              result.parameters
            );
          }
        }
        yield this.executeAction(result, playwrightArguments, extractionResult);
        actions.push({
          type: result.method,
          reasoning: result.reasoning,
          taskCompleted: result.taskComplete,
          parameters: result.parameters,
          playwrightArguments,
          extractionResult
        });
        currentStep++;
      }
      return {
        success: true,
        message: yield this.getSummary(options.instruction),
        actions,
        completed: actions[actions.length - 1].taskCompleted
      };
    });
  }
  getNextStep(currentStep) {
    return __async(this, null, function* () {
      const { data: response } = yield this.llmClient.createChatCompletion({
        options: {
          messages: this.messages,
          response_model: {
            name: "operatorResponseSchema",
            schema: operatorResponseSchema
          },
          requestId: `operator-step-${currentStep}`
        },
        logger: this.logger
      });
      return response;
    });
  }
  getSummary(goal) {
    return __async(this, null, function* () {
      const { data: response } = yield this.llmClient.createChatCompletion({
        options: {
          messages: [
            ...this.messages,
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Now use the steps taken to answer the original instruction of ${goal}.`
                }
              ]
            }
          ],
          response_model: {
            name: "operatorSummarySchema",
            schema: operatorSummarySchema
          },
          requestId: "operator-summary"
        },
        logger: this.logger
      });
      return response.answer;
    });
  }
  executeAction(action, playwrightArguments, extractionResult) {
    return __async(this, null, function* () {
      const { method, parameters } = action;
      const page = this.stagehandPage.page;
      if (method === "close") {
        return;
      }
      switch (method) {
        case "act":
          if (!playwrightArguments) {
            throw new StagehandMissingArgumentError(
              "No arguments provided to `act()`. Please ensure that all required arguments are passed in."
            );
          }
          yield page.act(playwrightArguments);
          break;
        case "extract":
          if (!extractionResult) {
            throw new StagehandError(
              "Error in OperatorHandler: Cannot complete extraction. No extractionResult provided."
            );
          }
          return extractionResult;
        case "goto":
          yield page.goto(parameters, { waitUntil: "load" });
          break;
        case "wait":
          yield page.waitForTimeout(parseInt(parameters));
          break;
        case "navback":
          yield page.goBack();
          break;
        case "refresh":
          yield page.reload();
          break;
        default:
          throw new StagehandError(
            `Error in OperatorHandler: Cannot execute unknown action: ${method}`
          );
      }
    });
  }
};

// lib/logger.ts
var import_pino = __toESM(require("pino"));
var levelMapping = {
  0: "error",
  // Critical/important messages
  1: "info",
  // Standard information
  2: "debug"
  // Detailed debugging information
};
function createLogger(options = {}) {
  const loggerConfig = {
    level: options.level || "info",
    base: void 0,
    // Don't include pid and hostname
    browser: {
      asObject: true
    },
    // Disable worker threads to avoid issues in tests
    transport: void 0
  };
  if (options.pretty && !isTestEnvironment()) {
    try {
      const transport = {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname"
          }
        }
      };
      Object.assign(loggerConfig, transport);
    } catch (e) {
      console.warn(
        "pino-pretty not available, falling back to standard logging"
      );
    }
  }
  return (0, import_pino.default)(loggerConfig, options.destination);
}
function isTestEnvironment() {
  return process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID !== void 0 || process.env.PLAYWRIGHT_TEST_BASE_DIR !== void 0 || // Check if we're in a CI environment
  process.env.CI === "true";
}
var _StagehandLogger = class _StagehandLogger {
  constructor(options = {}, externalLogger) {
    this.isTest = isTestEnvironment();
    this.usePino = this.isTest ? false : options.usePino !== false;
    if (this.usePino) {
      if (!_StagehandLogger.sharedPinoLogger) {
        _StagehandLogger.sharedPinoLogger = createLogger(options);
      }
      this.logger = _StagehandLogger.sharedPinoLogger;
    }
    this.verbose = 1;
    this.externalLogger = externalLogger;
  }
  /**
   * Set the verbosity level
   */
  setVerbosity(level) {
    this.verbose = level;
    if (this.usePino && this.logger) {
      switch (level) {
        case 0:
          this.logger.level = "error";
          break;
        case 1:
          this.logger.level = "info";
          break;
        case 2:
          this.logger.level = "debug";
          break;
      }
    }
  }
  /**
   * Log a message using our LogLine format
   */
  log(logLine) {
    var _a15, _b, _c;
    if (((_a15 = logLine.level) != null ? _a15 : 1) > this.verbose) {
      return;
    }
    const shouldFallbackToConsole = !this.usePino && !this.externalLogger || this.isTest && !this.externalLogger;
    if (shouldFallbackToConsole) {
      const level = (_b = logLine.level) != null ? _b : 1;
      const prefix = `[${logLine.category || "log"}] `;
      switch (level) {
        case 0:
          console.error(prefix + logLine.message);
          break;
        case 1:
          console.log(prefix + logLine.message);
          break;
        case 2:
          console.debug(prefix + logLine.message);
          break;
      }
      return;
    }
    if (this.usePino && this.logger) {
      const pinoLevel = levelMapping[(_c = logLine.level) != null ? _c : 1] || "info";
      const logData = __spreadValues({
        category: logLine.category,
        timestamp: logLine.timestamp || (/* @__PURE__ */ new Date()).toISOString()
      }, this.formatAuxiliaryData(logLine.auxiliary));
      if (pinoLevel === "error") {
        this.logger.error(logData, logLine.message);
      } else if (pinoLevel === "info") {
        this.logger.info(logData, logLine.message);
      } else if (pinoLevel === "debug") {
        this.logger.debug(logData, logLine.message);
      } else if (pinoLevel === "warn") {
        this.logger.warn(logData, logLine.message);
      } else if (pinoLevel === "trace") {
        this.logger.trace(logData, logLine.message);
      } else {
        this.logger.info(logData, logLine.message);
      }
    }
    if (this.externalLogger && (!this.usePino || this.isTest)) {
      this.externalLogger(logLine);
    }
  }
  /**
   * Helper to format auxiliary data for structured logging
   */
  formatAuxiliaryData(auxiliary) {
    if (!auxiliary) return {};
    const formattedData = {};
    for (const [key, { value, type }] of Object.entries(auxiliary)) {
      switch (type) {
        case "integer":
          formattedData[key] = parseInt(value, 10);
          break;
        case "float":
          formattedData[key] = parseFloat(value);
          break;
        case "boolean":
          formattedData[key] = value === "true";
          break;
        case "object":
          try {
            formattedData[key] = JSON.parse(value);
          } catch (e) {
            formattedData[key] = value;
          }
          break;
        default:
          formattedData[key] = value;
      }
    }
    return formattedData;
  }
  /**
   * Convenience methods for different log levels
   */
  error(message, data) {
    this.log({
      message,
      level: 0,
      auxiliary: this.convertToAuxiliary(data)
    });
  }
  warn(message, data) {
    this.log({
      message,
      level: 1,
      category: "warning",
      auxiliary: this.convertToAuxiliary(data)
    });
  }
  info(message, data) {
    this.log({
      message,
      level: 1,
      auxiliary: this.convertToAuxiliary(data)
    });
  }
  debug(message, data) {
    this.log({
      message,
      level: 2,
      auxiliary: this.convertToAuxiliary(data)
    });
  }
  /**
   * Convert a plain object to our auxiliary format
   */
  convertToAuxiliary(data) {
    if (!data) return void 0;
    const auxiliary = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === void 0) continue;
      const type = typeof value;
      auxiliary[key] = {
        value: type === "object" ? JSON.stringify(value) : String(value),
        type: type === "number" ? Number.isInteger(value) ? "integer" : "float" : type === "boolean" ? "boolean" : type === "object" ? "object" : "string"
      };
    }
    return auxiliary;
  }
};
/**
 * We maintain a single shared Pino instance when `usePino` is enabled.
 * This prevents spawning a new worker thread for every Stagehand instance
 * (which happens when `pino-pretty` transport is used), eliminating the
 * memory/RSS growth observed when many Stagehand objects are created and
 * disposed within the same process (e.g. a request-per-instance API).
 */
_StagehandLogger.sharedPinoLogger = null;
var StagehandLogger = _StagehandLogger;

// types/log.ts
var LOG_LEVEL_NAMES = {
  0: "error",
  1: "info",
  2: "debug"
};

// types/model.ts
var import_v36 = require("zod/v3");
var AvailableModelSchema = import_v36.z.enum([
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "o4-mini",
  "o3",
  "o3-mini",
  "o1",
  "o1-mini",
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4o-2024-08-06",
  "gpt-4.5-preview",
  "o1-preview",
  "claude-3-5-sonnet-latest",
  "claude-3-5-sonnet-20241022",
  "claude-3-5-sonnet-20240620",
  "claude-3-7-sonnet-latest",
  "claude-3-7-sonnet-20250219",
  "cerebras-llama-3.3-70b",
  "cerebras-llama-3.1-8b",
  "groq-llama-3.3-70b-versatile",
  "groq-llama-3.3-70b-specdec",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash-8b",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash-preview-04-17",
  "gemini-2.5-pro-preview-03-25"
]);

// lib/index.ts
import_dotenv.default.config({ path: ".env" });
var DEFAULT_MODEL_NAME = "openai/gpt-4.1-mini";
var globalLogger;
var defaultLogger = (logLine, disablePino) => __async(null, null, function* () {
  if (!globalLogger) {
    globalLogger = new StagehandLogger(
      {
        pretty: true,
        usePino: !disablePino
      },
      void 0
    );
  }
  globalLogger.log(logLine);
});
function getBrowser(apiKey, projectId, env = "LOCAL", headless = false, logger, browserbaseSessionCreateParams, browserbaseSessionID, localBrowserLaunchOptions) {
  return __async(this, null, function* () {
    var _a15, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
    if (env === "BROWSERBASE") {
      if (!apiKey) {
        throw new MissingEnvironmentVariableError(
          "BROWSERBASE_API_KEY",
          "Browserbase"
        );
      }
      if (!projectId) {
        throw new MissingEnvironmentVariableError(
          "BROWSERBASE_PROJECT_ID",
          "Browserbase"
        );
      }
      let debugUrl = void 0;
      let sessionUrl = void 0;
      let sessionId;
      let connectUrl;
      const browserbase = new import_sdk3.Browserbase({
        apiKey
      });
      if (browserbaseSessionID) {
        try {
          const session = yield browserbase.sessions.retrieve(browserbaseSessionID);
          if (session.status !== "RUNNING") {
            throw new StagehandError(
              `Session ${browserbaseSessionID} is not running (status: ${session.status})`
            );
          }
          sessionId = browserbaseSessionID;
          connectUrl = session.connectUrl;
          logger({
            category: "init",
            message: "resuming existing browserbase session...",
            level: 1,
            auxiliary: {
              sessionId: {
                value: sessionId,
                type: "string"
              }
            }
          });
        } catch (error) {
          logger({
            category: "init",
            message: "failed to resume session",
            level: 0,
            auxiliary: {
              error: {
                value: error.message,
                type: "string"
              },
              trace: {
                value: error.stack,
                type: "string"
              }
            }
          });
          throw error;
        }
      } else {
        logger({
          category: "init",
          message: "creating new browserbase session...",
          level: 1
        });
        if (!projectId) {
          throw new StagehandError(
            "BROWSERBASE_PROJECT_ID is required for new Browserbase sessions."
          );
        }
        const session = yield browserbase.sessions.create(__spreadProps(__spreadValues({
          projectId
        }, browserbaseSessionCreateParams), {
          userMetadata: __spreadProps(__spreadValues({}, (browserbaseSessionCreateParams == null ? void 0 : browserbaseSessionCreateParams.userMetadata) || {}), {
            stagehand: "true"
          })
        }));
        sessionId = session.id;
        connectUrl = session.connectUrl;
        logger({
          category: "init",
          message: "created new browserbase session",
          level: 1,
          auxiliary: {
            sessionId: {
              value: sessionId,
              type: "string"
            }
          }
        });
      }
      if (!connectUrl.includes("connect.connect")) {
        logger({
          category: "init",
          message: "connecting to browserbase session",
          level: 1,
          auxiliary: {
            connectUrl: {
              value: connectUrl,
              type: "string"
            }
          }
        });
      }
      const browser = yield import_playwright3.chromium.connectOverCDP(connectUrl);
      const { debuggerUrl } = yield browserbase.sessions.debug(sessionId);
      debugUrl = debuggerUrl;
      sessionUrl = `https://www.browserbase.com/sessions/${sessionId}`;
      logger({
        category: "init",
        message: browserbaseSessionID ? "browserbase session resumed" : "browserbase session started",
        auxiliary: {
          sessionUrl: {
            value: sessionUrl,
            type: "string"
          },
          debugUrl: {
            value: debugUrl,
            type: "string"
          },
          sessionId: {
            value: sessionId,
            type: "string"
          }
        }
      });
      const context = browser.contexts()[0];
      return { browser, context, debugUrl, sessionUrl, sessionId, env };
    } else {
      if (localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.cdpUrl) {
        if (!localBrowserLaunchOptions.cdpUrl.includes("connect.connect")) {
          logger({
            category: "init",
            message: "connecting to local browser via CDP URL",
            level: 1,
            auxiliary: {
              cdpUrl: {
                value: localBrowserLaunchOptions.cdpUrl,
                type: "string"
              }
            }
          });
        }
        const browser2 = yield import_playwright3.chromium.connectOverCDP(
          localBrowserLaunchOptions.cdpUrl
        );
        const context2 = browser2.contexts()[0];
        return { browser: browser2, context: context2, env: "LOCAL" };
      }
      let userDataDir = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.userDataDir;
      if (!userDataDir) {
        const tmpDirPath = import_path2.default.join(import_os.default.tmpdir(), "stagehand");
        if (!import_fs2.default.existsSync(tmpDirPath)) {
          import_fs2.default.mkdirSync(tmpDirPath, { recursive: true });
        }
        const tmpDir = import_fs2.default.mkdtempSync(import_path2.default.join(tmpDirPath, "ctx_"));
        import_fs2.default.mkdirSync(import_path2.default.join(tmpDir, "userdir/Default"), { recursive: true });
        const defaultPreferences = {
          plugins: {
            always_open_pdf_externally: true
          }
        };
        import_fs2.default.writeFileSync(
          import_path2.default.join(tmpDir, "userdir/Default/Preferences"),
          JSON.stringify(defaultPreferences)
        );
        userDataDir = import_path2.default.join(tmpDir, "userdir");
      }
      let downloadsPath = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.downloadsPath;
      if (!downloadsPath) {
        downloadsPath = import_path2.default.join(process.cwd(), "downloads");
        import_fs2.default.mkdirSync(downloadsPath, { recursive: true });
      }
      const context = yield import_playwright3.chromium.launchPersistentContext(userDataDir, {
        acceptDownloads: (_a15 = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.acceptDownloads) != null ? _a15 : true,
        headless: (_b = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.headless) != null ? _b : headless,
        viewport: {
          width: (_d = (_c = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.viewport) == null ? void 0 : _c.width) != null ? _d : 1288,
          height: (_f = (_e = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.viewport) == null ? void 0 : _e.height) != null ? _f : 711
        },
        locale: (_g = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.locale) != null ? _g : "en-US",
        timezoneId: (_h = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.timezoneId) != null ? _h : "America/New_York",
        deviceScaleFactor: (_i = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.deviceScaleFactor) != null ? _i : 1,
        args: (_j = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.args) != null ? _j : [
          "--disable-blink-features=AutomationControlled"
        ],
        bypassCSP: (_k = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.bypassCSP) != null ? _k : true,
        proxy: localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.proxy,
        geolocation: localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.geolocation,
        hasTouch: (_l = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.hasTouch) != null ? _l : true,
        ignoreHTTPSErrors: (_m = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.ignoreHTTPSErrors) != null ? _m : true,
        permissions: localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.permissions,
        recordHar: localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.recordHar,
        recordVideo: localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.recordVideo,
        tracesDir: localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.tracesDir,
        extraHTTPHeaders: localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.extraHTTPHeaders,
        chromiumSandbox: (_n = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.chromiumSandbox) != null ? _n : false,
        devtools: (_o = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.devtools) != null ? _o : false,
        env: localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.env,
        executablePath: localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.executablePath,
        handleSIGHUP: (_p = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.handleSIGHUP) != null ? _p : true,
        handleSIGINT: (_q = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.handleSIGINT) != null ? _q : true,
        handleSIGTERM: (_r = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.handleSIGTERM) != null ? _r : true,
        ignoreDefaultArgs: localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.ignoreDefaultArgs
      });
      if (localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.cookies) {
        context.addCookies(localBrowserLaunchOptions.cookies);
      }
      const browser = context.browser();
      logger({
        category: "init",
        message: "local browser started successfully."
      });
      yield applyStealthScripts(context);
      return { browser, context, contextPath: userDataDir, env: "LOCAL" };
    }
  });
}
function applyStealthScripts(context) {
  return __async(this, null, function* () {
    yield context.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => void 0
      });
      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"]
      });
      Object.defineProperty(navigator, "plugins", {
        get: () => [1, 2, 3, 4, 5]
      });
      delete window.__playwright;
      delete window.__pw_manual;
      delete window.__PW_inspect;
      Object.defineProperty(navigator, "headless", {
        get: () => false
      });
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => parameters.name === "notifications" ? Promise.resolve({
        state: Notification.permission
      }) : originalQuery(parameters);
    });
  });
}
var Stagehand3 = class {
  constructor({
    env,
    apiKey,
    projectId,
    verbose,
    llmProvider,
    llmClient,
    logger,
    browserbaseSessionCreateParams,
    domSettleTimeoutMs,
    enableCaching,
    browserbaseSessionID,
    modelName,
    modelClientOptions,
    systemPrompt,
    useAPI = true,
    localBrowserLaunchOptions,
    waitForCaptchaSolves = false,
    logInferenceToFile = false,
    selfHeal = false,
    disablePino,
    experimental = false
  } = {
    env: "BROWSERBASE"
  }) {
    this.cleanupCalled = false;
    this._isClosed = false;
    this._history = [];
    this.stagehandMetrics = {
      actPromptTokens: 0,
      actCompletionTokens: 0,
      actInferenceTimeMs: 0,
      extractPromptTokens: 0,
      extractCompletionTokens: 0,
      extractInferenceTimeMs: 0,
      observePromptTokens: 0,
      observeCompletionTokens: 0,
      observeInferenceTimeMs: 0,
      agentPromptTokens: 0,
      agentCompletionTokens: 0,
      agentInferenceTimeMs: 0,
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalInferenceTimeMs: 0
    };
    var _a15, _b, _c, _d, _e, _f, _g;
    this.externalLogger = logger || ((logLine) => defaultLogger(logLine, disablePino));
    this.stagehandLogger = new StagehandLogger(
      {
        pretty: true,
        // use pino if pino is enabled, and there is no custom logger
        usePino: !logger && !disablePino
      },
      this.externalLogger
    );
    this.enableCaching = enableCaching != null ? enableCaching : process.env.ENABLE_CACHING && process.env.ENABLE_CACHING === "true";
    this.llmProvider = llmProvider || new LLMProvider(this.logger, this.enableCaching);
    this.apiKey = apiKey != null ? apiKey : process.env.BROWSERBASE_API_KEY;
    this.projectId = projectId != null ? projectId : process.env.BROWSERBASE_PROJECT_ID;
    this._env = env != null ? env : "BROWSERBASE";
    if (this._env === "BROWSERBASE") {
      if (!this.apiKey) {
        throw new MissingEnvironmentVariableError(
          "BROWSERBASE_API_KEY",
          "Browserbase"
        );
      } else if (!this.projectId) {
        throw new MissingEnvironmentVariableError(
          "BROWSERBASE_PROJECT_ID",
          "Browserbase"
        );
      }
    }
    this.verbose = verbose != null ? verbose : 0;
    this.stagehandLogger.setVerbosity(this.verbose);
    this.modelName = modelName != null ? modelName : DEFAULT_MODEL_NAME;
    let modelApiKey;
    if (!(modelClientOptions == null ? void 0 : modelClientOptions.apiKey)) {
      if (LLMProvider.getModelProvider(this.modelName) === "aisdk") {
        modelApiKey = loadApiKeyFromEnv(
          this.modelName.split("/")[0],
          this.logger
        );
      } else {
        modelApiKey = LLMProvider.getModelProvider(this.modelName) === "openai" ? process.env.OPENAI_API_KEY || ((_b = (_a15 = this.llmClient) == null ? void 0 : _a15.clientOptions) == null ? void 0 : _b.apiKey) : LLMProvider.getModelProvider(this.modelName) === "anthropic" ? process.env.ANTHROPIC_API_KEY || ((_d = (_c = this.llmClient) == null ? void 0 : _c.clientOptions) == null ? void 0 : _d.apiKey) : LLMProvider.getModelProvider(this.modelName) === "google" ? process.env.GOOGLE_API_KEY || ((_f = (_e = this.llmClient) == null ? void 0 : _e.clientOptions) == null ? void 0 : _f.apiKey) : void 0;
      }
      this.modelClientOptions = __spreadProps(__spreadValues({}, modelClientOptions), {
        apiKey: modelApiKey
      });
    } else {
      this.modelClientOptions = modelClientOptions;
    }
    if (llmClient) {
      this.llmClient = llmClient;
      this.logger({
        category: "init",
        message: "Custom LLM clients are currently not supported in API mode",
        level: 1
      });
      this.usingAPI = false;
    } else {
      try {
        this.llmClient = this.llmProvider.getClient(
          this.modelName,
          this.modelClientOptions
        );
      } catch (error) {
        if (error instanceof UnsupportedAISDKModelProviderError || error instanceof InvalidAISDKModelFormatError) {
          throw error;
        }
        this.llmClient = void 0;
      }
    }
    this.domSettleTimeoutMs = domSettleTimeoutMs != null ? domSettleTimeoutMs : 3e4;
    this.headless = (_g = localBrowserLaunchOptions == null ? void 0 : localBrowserLaunchOptions.headless) != null ? _g : false;
    this.browserbaseSessionCreateParams = browserbaseSessionCreateParams;
    this.browserbaseSessionID = browserbaseSessionID;
    this.userProvidedInstructions = systemPrompt;
    this.usingAPI = useAPI;
    if (this.usingAPI && env === "LOCAL") {
      this.usingAPI = false;
    } else if (this.usingAPI && this.llmClient && !["openai", "anthropic", "google", "aisdk"].includes(this.llmClient.type)) {
      throw new UnsupportedModelError(
        ["openai", "anthropic", "google", "aisdk"],
        "API mode"
      );
    }
    this.waitForCaptchaSolves = waitForCaptchaSolves;
    this.localBrowserLaunchOptions = localBrowserLaunchOptions;
    if (this.usingAPI) {
      this.registerSignalHandlers();
    }
    this.logInferenceToFile = logInferenceToFile;
    this.selfHeal = selfHeal;
    this.disablePino = disablePino;
    this.experimental = experimental;
    if (this.experimental) {
      this.stagehandLogger.warn(
        "Experimental mode is enabled. This is a beta feature and may break at any time. Enabling experimental mode will disable the API"
      );
      this.usingAPI = false;
    }
  }
  createLivePageProxy() {
    const proto = Object.getPrototypeOf(this.stagehandPage.page);
    const target = Object.create(proto);
    const handler = {
      get: (_t, prop, receiver) => {
        const real = this.stagehandPage.page;
        const value = Reflect.get(real, prop, receiver);
        return typeof value === "function" ? value.bind(real) : value;
      },
      set: (_t, prop, value) => {
        const real = this.stagehandPage.page;
        Reflect.set(real, prop, value);
        return true;
      },
      has: (_t, prop) => prop in this.stagehandPage.page,
      getPrototypeOf: () => proto
    };
    return new Proxy(target, handler);
  }
  get history() {
    return Object.freeze([...this._history]);
  }
  setActivePage(page) {
    this.stagehandPage = page;
  }
  get page() {
    if (!this.stagehandContext) {
      throw new StagehandNotInitializedError("page");
    }
    if (!this._livePageProxy) {
      this._livePageProxy = this.createLivePageProxy();
    }
    return this._livePageProxy;
  }
  get metrics() {
    return this.stagehandMetrics;
  }
  get isClosed() {
    return this._isClosed;
  }
  updateMetrics(functionName, promptTokens, completionTokens, inferenceTimeMs) {
    switch (functionName) {
      case "ACT" /* ACT */:
        this.stagehandMetrics.actPromptTokens += promptTokens;
        this.stagehandMetrics.actCompletionTokens += completionTokens;
        this.stagehandMetrics.actInferenceTimeMs += inferenceTimeMs;
        break;
      case "EXTRACT" /* EXTRACT */:
        this.stagehandMetrics.extractPromptTokens += promptTokens;
        this.stagehandMetrics.extractCompletionTokens += completionTokens;
        this.stagehandMetrics.extractInferenceTimeMs += inferenceTimeMs;
        break;
      case "OBSERVE" /* OBSERVE */:
        this.stagehandMetrics.observePromptTokens += promptTokens;
        this.stagehandMetrics.observeCompletionTokens += completionTokens;
        this.stagehandMetrics.observeInferenceTimeMs += inferenceTimeMs;
        break;
      case "AGENT" /* AGENT */:
        this.stagehandMetrics.agentPromptTokens += promptTokens;
        this.stagehandMetrics.agentCompletionTokens += completionTokens;
        this.stagehandMetrics.agentInferenceTimeMs += inferenceTimeMs;
        break;
    }
    this.updateTotalMetrics(promptTokens, completionTokens, inferenceTimeMs);
  }
  updateTotalMetrics(promptTokens, completionTokens, inferenceTimeMs) {
    this.stagehandMetrics.totalPromptTokens += promptTokens;
    this.stagehandMetrics.totalCompletionTokens += completionTokens;
    this.stagehandMetrics.totalInferenceTimeMs += inferenceTimeMs;
  }
  registerSignalHandlers() {
    const cleanup = (signal) => __async(this, null, function* () {
      if (this.cleanupCalled) return;
      this.cleanupCalled = true;
      this.stagehandLogger.info(
        `[${signal}] received. Ending Browserbase session...`
      );
      try {
        yield this.close();
      } catch (err) {
        this.stagehandLogger.error("Error ending Browserbase session:", {
          error: String(err)
        });
      } finally {
        process.exit(0);
      }
    });
    process.once("SIGINT", () => void cleanup("SIGINT"));
    process.once("SIGTERM", () => void cleanup("SIGTERM"));
  }
  get logger() {
    return (logLine) => {
      this.log(logLine);
    };
  }
  get env() {
    if (this._env === "BROWSERBASE") {
      if (!this.apiKey) {
        throw new MissingEnvironmentVariableError(
          "BROWSERBASE_API_KEY",
          "Browserbase"
        );
      } else if (!this.projectId) {
        throw new MissingEnvironmentVariableError(
          "BROWSERBASE_PROJECT_ID",
          "Browserbase"
        );
      }
      return "BROWSERBASE";
    } else {
      return "LOCAL";
    }
  }
  get downloadsPath() {
    var _a15, _b;
    return this.env === "BROWSERBASE" ? "downloads" : (_b = (_a15 = this.localBrowserLaunchOptions) == null ? void 0 : _a15.downloadsPath) != null ? _b : import_path2.default.resolve(process.cwd(), "downloads");
  }
  get context() {
    if (!this.stagehandContext) {
      throw new StagehandNotInitializedError("context");
    }
    return this.stagehandContext.context;
  }
  init() {
    return __async(this, null, function* () {
      var _a15;
      if (isRunningInBun()) {
        throw new StagehandError(
          "Playwright does not currently support the Bun runtime environment. Please use Node.js instead. For more information, see: https://github.com/microsoft/playwright/issues/27139"
        );
      }
      if (this.usingAPI) {
        this.apiClient = new StagehandAPI({
          apiKey: this.apiKey,
          projectId: this.projectId,
          logger: this.logger
        });
        const modelApiKey = (_a15 = this.modelClientOptions) == null ? void 0 : _a15.apiKey;
        const { sessionId: sessionId2, available } = yield this.apiClient.init({
          modelName: this.modelName,
          modelApiKey,
          domSettleTimeoutMs: this.domSettleTimeoutMs,
          verbose: this.verbose,
          debugDom: this.debugDom,
          systemPrompt: this.userProvidedInstructions,
          selfHeal: this.selfHeal,
          waitForCaptchaSolves: this.waitForCaptchaSolves,
          actionTimeoutMs: this.actTimeoutMs,
          browserbaseSessionCreateParams: this.browserbaseSessionCreateParams,
          browserbaseSessionID: this.browserbaseSessionID
        });
        if (!available) {
          this.apiClient = null;
        }
        this.browserbaseSessionID = sessionId2;
      }
      const { browser, context, debugUrl, sessionUrl, contextPath, sessionId } = yield getBrowser(
        this.apiKey,
        this.projectId,
        this.env,
        this.headless,
        this.logger,
        this.browserbaseSessionCreateParams,
        this.browserbaseSessionID,
        this.localBrowserLaunchOptions
      ).catch((e) => {
        this.stagehandLogger.error("Error in init:", { error: String(e) });
        const br = {
          context: void 0,
          debugUrl: void 0,
          sessionUrl: void 0,
          sessionId: void 0,
          env: this.env
        };
        return br;
      });
      this.contextPath = contextPath;
      this._browser = browser;
      if (!context) {
        const errorMessage = "The browser context is undefined. This means the CDP connection to the browser failed";
        this.stagehandLogger.error(
          this.env === "LOCAL" ? `${errorMessage}. If running locally, please check if the browser is running and the port is open.` : errorMessage
        );
        throw new StagehandInitError(errorMessage);
      }
      this.stagehandContext = yield StagehandContext.init(context, this);
      const defaultPage = (yield this.stagehandContext.getStagehandPages())[0];
      this.stagehandPage = defaultPage;
      if (this.headless) {
        yield this.page.setViewportSize({ width: 2560, height: 1440 });
      }
      const guardedScript = `
  if (!window.__stagehandInjected) {
    window.__stagehandInjected = true;
    ${scriptContent}
  }
`;
      yield this.context.addInitScript({
        content: guardedScript
      });
      try {
        const session = yield this.context.newCDPSession(this.page);
        yield session.send("Browser.setDownloadBehavior", {
          behavior: "allow",
          downloadPath: this.downloadsPath,
          eventsEnabled: true
        });
      } catch (error) {
        this.stagehandLogger.error("Error setting download behavior:", {
          error: String(error)
        });
      }
      this.browserbaseSessionID = sessionId;
      return { debugUrl, sessionUrl, sessionId };
    });
  }
  log(logObj) {
    var _a15;
    logObj.level = (_a15 = logObj.level) != null ? _a15 : 1;
    this.stagehandLogger.log(logObj);
  }
  close() {
    return __async(this, null, function* () {
      var _a15;
      this._isClosed = true;
      if (this.apiClient) {
        const response = yield this.apiClient.end();
        const body = yield response.json();
        if (!body.success) {
          if (response.status == 409) {
            this.log({
              category: "close",
              message: "Warning: attempted to end a session that is not currently active",
              level: 0
            });
          } else {
            throw new StagehandError(body.message);
          }
        }
        this.apiClient = null;
        return;
      } else {
        yield this.context.close();
        if (this._browser) {
          yield this._browser.close();
        }
      }
      if (this.contextPath && !((_a15 = this.localBrowserLaunchOptions) == null ? void 0 : _a15.preserveUserDataDir)) {
        try {
          import_fs2.default.rmSync(this.contextPath, { recursive: true, force: true });
        } catch (e) {
          console.error("Error deleting context directory:", e);
        }
      }
    });
  }
  addToHistory(method, parameters, result) {
    this._history.push({
      method,
      parameters,
      result: result != null ? result : null,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  /**
   * Create an agent instance that can be executed with different instructions
   * @returns An agent instance with execute() and setViewport() methods
   */
  agent(options) {
    var _a15;
    if (!options || !options.provider) {
      return {
        execute: (instructionOrOptions) => __async(this, null, function* () {
          return new StagehandOperatorHandler(
            this.stagehandPage,
            this.logger,
            this.llmClient
          ).execute(instructionOrOptions);
        })
      };
    }
    const agentHandler = new StagehandAgentHandler(
      this,
      this.stagehandPage,
      this.logger,
      {
        modelName: options.model,
        clientOptions: options.options,
        userProvidedInstructions: (_a15 = options.instructions) != null ? _a15 : `You are a helpful assistant that can use a web browser.
      You are currently on the following page: ${this.stagehandPage.page.url()}.
      Do not ask follow up questions, the user will trust your judgement.`,
        agentType: options.provider,
        experimental: this.experimental
      }
    );
    this.log({
      category: "agent",
      message: "Creating agent instance",
      level: 1
    });
    return {
      execute: (instructionOrOptions) => __async(this, null, function* () {
        const executeOptions = typeof instructionOrOptions === "string" ? { instruction: instructionOrOptions } : instructionOrOptions;
        if (!executeOptions.instruction) {
          throw new StagehandError(
            "Instruction is required for agent execution"
          );
        }
        if (this.usingAPI) {
          if (!this.apiClient) {
            throw new StagehandNotInitializedError("API client");
          }
          if (!options.options) {
            options.options = {};
          }
          if (options.provider === "anthropic") {
            options.options.apiKey = process.env.ANTHROPIC_API_KEY;
          } else if (options.provider === "openai") {
            options.options.apiKey = process.env.OPENAI_API_KEY;
          } else if (options.provider === "google") {
            options.options.apiKey = process.env.GOOGLE_API_KEY;
          }
          if (!options.options.apiKey) {
            throw new StagehandError(
              `API key not found for \`${options.provider}\` provider. Please set the ${options.provider === "anthropic" ? "ANTHROPIC_API_KEY" : "OPENAI_API_KEY"} environment variable or pass an apiKey in the options object.`
            );
          }
          return yield this.apiClient.agentExecute(options, executeOptions);
        }
        return yield agentHandler.execute(executeOptions);
      }),
      setScreenshotCollector: (collector) => {
        agentHandler.setScreenshotCollector(collector);
      }
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AgentScreenshotProviderError,
  AnnotatedScreenshotText,
  AvailableModelSchema,
  BrowserbaseSessionNotFoundError,
  CaptchaTimeoutError,
  ContentFrameNotFoundError,
  CreateChatCompletionResponseError,
  ExperimentalApiConflictError,
  ExperimentalNotConfiguredError,
  HandlerNotInitializedError,
  InvalidAISDKModelFormatError,
  LLMClient,
  LLMResponseError,
  LOG_LEVEL_NAMES,
  MissingEnvironmentVariableError,
  MissingLLMConfigurationError,
  PlaywrightCommandException,
  PlaywrightCommandMethodNotSupportedException,
  Stagehand,
  StagehandAPIError,
  StagehandAPIUnauthorizedError,
  StagehandClickError,
  StagehandDefaultError,
  StagehandDomProcessError,
  StagehandElementNotFoundError,
  StagehandEnvironmentError,
  StagehandError,
  StagehandEvalError,
  StagehandFunctionName,
  StagehandHttpError,
  StagehandIframeError,
  StagehandInitError,
  StagehandInvalidArgumentError,
  StagehandMissingArgumentError,
  StagehandNotInitializedError,
  StagehandResponseBodyError,
  StagehandResponseParseError,
  StagehandServerError,
  StagehandShadowRootMissingError,
  StagehandShadowSegmentEmptyError,
  StagehandShadowSegmentNotFoundError,
  UnsupportedAISDKModelProviderError,
  UnsupportedModelError,
  UnsupportedModelProviderError,
  XPathResolutionError,
  ZodSchemaValidationError,
  defaultExtractSchema,
  operatorResponseSchema,
  operatorSummarySchema,
  pageTextSchema
});
