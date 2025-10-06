#!/usr/bin/env node
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
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, "default", { value: mod, enumerable: true })
      : target,
    mod,
  )
);

// evals/cli.ts
var import_process = __toESM(require("process"));

// node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 =
  (offset = 0) =>
  (code) =>
    `\x1B[${code + offset}m`;
var wrapAnsi256 =
  (offset = 0) =>
  (code) =>
    `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m =
  (offset = 0) =>
  (red, green, blue) =>
    `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39],
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49],
  },
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`,
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false,
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false,
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round(((red - 8) / 247) * 24) + 232;
        }
        return (
          16 +
          36 * Math.round((red / 255) * 5) +
          6 * Math.round((green / 255) * 5) +
          Math.round((blue / 255) * 5)
        );
      },
      enumerable: false,
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString]
            .map((character) => character + character)
            .join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          (integer >> 16) & 255,
          (integer >> 8) & 255,
          integer & 255,
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false,
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false,
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = (remainder % 6) / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result =
          30 +
          ((Math.round(blue) << 2) |
            (Math.round(green) << 1) |
            Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false,
    },
    rgbToAnsi: {
      value: (red, green, blue) =>
        styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false,
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false,
    },
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/vendor/supports-color/index.js
var import_node_process = __toESM(require("process"), 1);
var import_node_os = __toESM(require("os"), 1);
var import_node_tty = __toESM(require("tty"), 1);
function hasFlag(
  flag,
  argv = globalThis.Deno
    ? globalThis.Deno.args
    : import_node_process.default.argv,
) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return (
    position !== -1 &&
    (terminatorPosition === -1 || position < terminatorPosition)
  );
}
var { env } = import_node_process.default;
var flagForceColor;
if (
  hasFlag("no-color") ||
  hasFlag("no-colors") ||
  hasFlag("color=false") ||
  hasFlag("color=never")
) {
  flagForceColor = 0;
} else if (
  hasFlag("color") ||
  hasFlag("colors") ||
  hasFlag("color=true") ||
  hasFlag("color=always")
) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0
      ? 1
      : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (
      hasFlag("color=16m") ||
      hasFlag("color=full") ||
      hasFlag("color=truecolor")
    ) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (import_node_process.default.platform === "win32") {
    const osRelease = import_node_os.default.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (
      ["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => key in env)
    ) {
      return 3;
    }
    if (
      ["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some(
        (sign) => sign in env,
      ) ||
      env.CI_NAME === "codeship"
    ) {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt(
      (env.TERM_PROGRAM_VERSION || "").split(".")[0],
      10,
    );
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (
    /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)
  ) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(
    stream,
    __spreadValues(
      {
        streamIsTTY: stream && stream.isTTY,
      },
      options,
    ),
  );
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: import_node_tty.default.isatty(1) }),
  stderr: createSupportsColor({ isTTY: import_node_tty.default.isatty(2) }),
};
var supports_color_default = supportsColor;

// node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue +=
      string.slice(endIndex, gotCR ? index - 1 : index) +
      prefix +
      (gotCR ? "\r\n" : "\n") +
      postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = ["ansi", "ansi", "ansi256", "ansi16m"];
var styles2 = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (
    options.level &&
    !(
      Number.isInteger(options.level) &&
      options.level >= 0 &&
      options.level <= 3
    )
  ) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(
        this,
        createStyler(style.open, style.close, this[STYLER]),
        this[IS_EMPTY],
      );
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    },
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  },
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(
        ansi_styles_default.rgbToAnsi256(...arguments_),
      );
    }
    return ansi_styles_default[type].ansi(
      ansi_styles_default.rgbToAnsi(...arguments_),
    );
  }
  if (model === "hex") {
    return getModelAnsi(
      "rgb",
      level,
      type,
      ...ansi_styles_default.hexToRgb(...arguments_),
    );
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function (...arguments_) {
        const styler = createStyler(
          getModelAnsi(model, levelMapping[level], "color", ...arguments_),
          ansi_styles_default.color.close,
          this[STYLER],
        );
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    },
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function (...arguments_) {
        const styler = createStyler(
          getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_),
          ansi_styles_default.bgColor.close,
          this[STYLER],
        );
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    },
  };
}
var proto = Object.defineProperties(
  () => {},
  __spreadProps(__spreadValues({}, styles2), {
    level: {
      enumerable: true,
      get() {
        return this[GENERATOR].level;
      },
      set(level) {
        this[GENERATOR].level = level;
      },
    },
  }),
);
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent,
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) =>
    applyStyle(
      builder,
      arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "),
    );
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// evals/cli.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_child_process = require("child_process");
var CONFIG_PATH = import_path.default.join(__dirname, "evals.config.json");
function loadConfig() {
  return JSON.parse(import_fs.default.readFileSync(CONFIG_PATH, "utf-8"));
}
function saveConfig(config) {
  import_fs.default.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}
function printHelp() {
  console.log(
    source_default.yellow(`\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800
\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28A0\u287E\u283B\u28F6\u2840\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800
\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28A0\u2876\u281B\u28B3\u2846\u2800\u2800\u2800\u2800\u28B8\u2847\u2800\u28B8\u2847\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800
\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28B8\u2847\u2800\u28B8\u28F7\u2836\u28E6\u28F4\u2836\u28FE\u2847\u2800\u28B8\u2847\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800
\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28B8\u2847\u2800\u28B8\u2847\u2800\u28B8\u2847\u2800\u28B8\u2847\u2800\u28B8\u2847\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800
\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28B8\u2847\u2800\u2818\u2837\u28E4\u28BE\u284F\u2809\u2809\u2809\u2819\u28FE\u2847\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800
\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28B8\u2847\u2800\u2800\u2800\u2800\u2808\u28FB\u287F\u281F\u2802\u2800\u28FF\u2803\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800
\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2808\u28F7\u2800\u2800\u2800\u2800\u28B0\u284F\u2800\u2800\u2800\u2880\u28FF\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800
\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2819\u28F7\u2840\u2800\u2800\u2800\u2800\u2800\u2800\u2880\u287E\u2801\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800
\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2808\u2819\u2837\u28E6\u28E4\u28E4\u28F4\u283E\u280B\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800
\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800`),
  );
  console.log(source_default.yellow.bold("\nStagehand Evals CLI"));
  console.log(source_default.cyan("\nevals <command> <target> [options]\n"));
  console.log(source_default.magenta.underline("Commands"));
  console.log("  run       Execute evals or benchmarks");
  console.log("  list      List available evals/benchmarks");
  console.log("  config    Get/set default configuration");
  console.log("  help      Show this help message\n");
  console.log(source_default.magenta.underline("Examples"));
  console.log(source_default.dim("  # Run all custom evals"));
  console.log(source_default.green("  evals run all\n"));
  console.log(source_default.dim("  # Run specific category"));
  console.log(
    source_default.green("  evals run act") +
      source_default.cyan(" -e browserbase -t 5\n"),
  );
  console.log(source_default.dim("  # Run specific eval"));
  console.log(source_default.green("  evals run login\n"));
  console.log(source_default.dim("  # Run benchmark"));
  console.log(
    source_default.green("  evals run benchmark:onlineMind2Web") +
      source_default.cyan(" -l 10 -f difficulty=easy\n"),
  );
  console.log(source_default.dim("  # Configure defaults"));
  console.log(source_default.green("  evals config set env browserbase"));
  console.log(source_default.green("  evals config set trials 5\n"));
  console.log(source_default.magenta.underline("Options"));
  console.log(
    source_default.cyan("  -e, --env".padEnd(20)) +
      "Environment: local|browserbase",
  );
  console.log(
    source_default.cyan("  -t, --trials".padEnd(20)) +
      "Number of trials per eval",
  );
  console.log(
    source_default.cyan("  -c, --concurrency".padEnd(20)) +
      "Max parallel sessions",
  );
  console.log(
    source_default.cyan("  -m, --model".padEnd(20)) + "Model override",
  );
  console.log(
    source_default.cyan("  -p, --provider".padEnd(20)) + "Provider override",
  );
  console.log(
    source_default.cyan("  --api".padEnd(20)) + "Use Stagehand API\n",
  );
  console.log(source_default.dim("  Benchmark-specific:"));
  console.log(
    source_default.cyan("  -l, --limit".padEnd(20)) + "Max tasks to run",
  );
  console.log(
    source_default.cyan("  -s, --sample".padEnd(20)) +
      "Random sample before limit",
  );
  console.log(
    source_default.cyan("  -f, --filter".padEnd(20)) +
      "Benchmark filters (key=value)\n",
  );
}
function handleConfig(args) {
  const config = loadConfig();
  if (args.length === 0) {
    console.log(source_default.blue.bold("\nCurrent Configuration"));
    console.log(source_default.cyan("\nDefaults:"));
    Object.entries(config.defaults).forEach(([key, value]) => {
      console.log(
        `  ${key}: ${source_default.yellow(value != null ? value : "not set")}`,
      );
    });
    return;
  }
  if (args[0] === "set" && args.length >= 3) {
    const [, key, ...valueParts] = args;
    const value = valueParts.join(" ");
    if (!(key in config.defaults)) {
      console.error(source_default.red(`Error: Unknown config key "${key}"`));
      console.log(
        source_default.dim(
          `Valid keys: ${Object.keys(config.defaults).join(", ")}`,
        ),
      );
      import_process.default.exit(1);
    }
    let parsedValue = value;
    if (key === "trials" || key === "concurrency") {
      parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        console.error(source_default.red(`Error: ${key} must be a number`));
        import_process.default.exit(1);
      }
    } else if (key === "api") {
      parsedValue = value === "true";
    } else if (value === "null" || value === "none") {
      parsedValue = null;
    }
    if (key === "env") {
      config.defaults.env = parsedValue;
    } else if (key === "trials") {
      config.defaults.trials = parsedValue;
    } else if (key === "concurrency") {
      config.defaults.concurrency = parsedValue;
    } else if (key === "provider") {
      config.defaults.provider = parsedValue;
    } else if (key === "model") {
      config.defaults.model = parsedValue;
    } else if (key === "api") {
      config.defaults.api = parsedValue;
    }
    saveConfig(config);
    console.log(source_default.green(`\u2713 Set ${key} to ${parsedValue}`));
  } else if (args[0] === "reset") {
    const defaultConfig = {
      env: "local",
      trials: 3,
      concurrency: 3,
      provider: null,
      model: null,
      api: false,
    };
    if (args[1] && args[1] in config.defaults) {
      const key = args[1];
      if (key === "env") {
        config.defaults.env = defaultConfig.env;
      } else if (key === "trials") {
        config.defaults.trials = defaultConfig.trials;
      } else if (key === "concurrency") {
        config.defaults.concurrency = defaultConfig.concurrency;
      } else if (key === "provider") {
        config.defaults.provider = defaultConfig.provider;
      } else if (key === "model") {
        config.defaults.model = defaultConfig.model;
      } else if (key === "api") {
        config.defaults.api = defaultConfig.api;
      }
      saveConfig(config);
      console.log(source_default.green(`\u2713 Reset ${args[1]} to default`));
    } else if (!args[1]) {
      config.defaults = defaultConfig;
      saveConfig(config);
      console.log(
        source_default.green("\u2713 Reset all settings to defaults"),
      );
    } else {
      console.error(
        source_default.red(`Error: Unknown config key "${args[1]}"`),
      );
      import_process.default.exit(1);
    }
  } else if (args[0] === "path") {
    console.log(CONFIG_PATH);
  } else {
    console.error(source_default.red("Error: Invalid config command"));
    console.log(
      source_default.dim(
        "Usage: evals config [set <key> <value> | reset [key] | path]",
      ),
    );
    import_process.default.exit(1);
  }
}
function handleList(args) {
  const config = loadConfig();
  console.log(source_default.blue.bold("\nAvailable Evals\n"));
  const categories = /* @__PURE__ */ new Map();
  config.tasks.forEach((task) => {
    task.categories.forEach((cat) => {
      if (!categories.has(cat)) {
        categories.set(cat, []);
      }
      categories.get(cat).push(task.name);
    });
  });
  console.log(source_default.magenta.underline("Custom Eval Categories"));
  Array.from(categories.entries())
    .filter(([cat]) => !cat.includes("external_agent_benchmarks"))
    .forEach(([category, tasks]) => {
      console.log(
        `  ${source_default.cyan(category)} ${source_default.dim(`(${tasks.length} evals)`)}`,
      );
    });
  console.log(source_default.magenta.underline("\nBenchmarks"));
  Object.keys(config.benchmarks).forEach((name) => {
    const shorthand = `b:${name}`;
    console.log(
      `  ${source_default.cyan(shorthand.padEnd(20))} ${source_default.dim(`benchmark:${name}`)}`,
    );
  });
  if (args.includes("--detailed") || args.includes("-d")) {
    console.log(source_default.magenta.underline("\n\nDetailed Task List"));
    categories.forEach((tasks, category) => {
      if (!category.includes("external_agent_benchmarks")) {
        console.log(
          source_default.cyan(`
${category}:`),
        );
        tasks.forEach((task) => {
          console.log(`  - ${task}`);
        });
      }
    });
  } else {
    console.log(
      source_default.yellow(
        "\n\u{1F4A1} Tip: Use 'evals list --detailed' to see all individual tasks",
      ),
    );
  }
}
function parseArgs(rawArgs) {
  const options = {};
  const filters = [];
  let target;
  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg.startsWith("-")) {
      const flagName = arg.replace(/^--?/, "");
      const flagMap = {
        e: "env",
        t: "trials",
        c: "concurrency",
        m: "model",
        p: "provider",
        l: "limit",
        s: "sample",
        f: "filter",
      };
      const optionName = flagMap[flagName] || flagName;
      if (optionName === "api") {
        options.api = true;
      } else if (optionName === "filter") {
        const filterValue = rawArgs[++i];
        if (filterValue && filterValue.includes("=")) {
          const [key, value] = filterValue.split("=");
          filters.push([key, value]);
        }
      } else {
        const value = rawArgs[++i];
        if (value && !value.startsWith("-")) {
          if (
            ["trials", "concurrency", "limit", "sample"].includes(optionName)
          ) {
            options[optionName] = parseInt(value, 10);
          } else {
            options[optionName] = value;
          }
        }
      }
    } else if (!target) {
      target = arg;
    }
  }
  return { options, target, filters };
}
function handleRun(args) {
  const config = loadConfig();
  const { options, target, filters } = parseArgs(args);
  const finalOptions = __spreadValues(
    __spreadValues({}, config.defaults),
    options,
  );
  const env2 = __spreadValues({}, import_process.default.env);
  if (finalOptions.env === "browserbase") {
    env2.EVAL_ENV = "BROWSERBASE";
  } else {
    env2.EVAL_ENV = "LOCAL";
  }
  if (finalOptions.api) {
    env2.USE_API = "true";
  }
  if (finalOptions.trials) {
    env2.EVAL_TRIAL_COUNT = String(finalOptions.trials);
  }
  if (finalOptions.concurrency) {
    env2.EVAL_MAX_CONCURRENCY = String(finalOptions.concurrency);
  }
  if (finalOptions.provider) {
    env2.EVAL_PROVIDER = finalOptions.provider;
  }
  if (finalOptions.model) {
    env2.EVAL_MODEL_OVERRIDE = finalOptions.model;
  }
  let evalName;
  let categoryFilter;
  if (target) {
    if (target.startsWith("b:") || target.startsWith("benchmark:")) {
      const benchmarkName = target.replace(/^(b:|benchmark:)/, "");
      if (!config.benchmarks[benchmarkName]) {
        console.error(
          source_default.red(`Error: Unknown benchmark "${benchmarkName}"`),
        );
        console.log(
          source_default.dim(
            `Available benchmarks: ${Object.keys(config.benchmarks).join(", ")}`,
          ),
        );
        import_process.default.exit(1);
      }
      const benchmarkMap = {
        webbench: "agent/webbench",
        gaia: "agent/gaia",
        webvoyager: "agent/webvoyager",
        osworld: "agent/osworld",
        onlineMind2Web: "agent/onlineMind2Web",
      };
      evalName = benchmarkMap[benchmarkName];
      env2.EVAL_DATASET = benchmarkName;
      if (options.limit) {
        env2.EVAL_MAX_K = String(options.limit);
        env2[`EVAL_${benchmarkName.toUpperCase()}_LIMIT`] = String(
          options.limit,
        );
      }
      if (options.sample) {
        env2[`EVAL_${benchmarkName.toUpperCase()}_SAMPLE`] = String(
          options.sample,
        );
      }
      filters.forEach(([key, value]) => {
        const envKey = `EVAL_${benchmarkName.toUpperCase()}_${key.toUpperCase()}`;
        env2[envKey] = value;
      });
    } else if (target === "all") {
    } else if (target.includes("/") || target.includes("*")) {
      evalName = target;
    } else {
      const categories = /* @__PURE__ */ new Set();
      config.tasks.forEach((task) => {
        task.categories.forEach((cat) => categories.add(cat));
      });
      if (categories.has(target)) {
        categoryFilter = target;
      } else {
        evalName = target;
      }
    }
  }
  const legacyArgs = [];
  if (evalName) {
    legacyArgs.push(`name=${evalName}`);
  } else if (categoryFilter) {
    legacyArgs.push("category", categoryFilter);
  }
  console.log(source_default.blue.bold("\nRunning evals...\n"));
  const buildChild = (0, import_child_process.spawn)("pnpm", ["run", "build"], {
    stdio: "inherit",
    shell: true,
  });
  buildChild.on("exit", (buildCode) => {
    if (buildCode !== 0) {
      import_process.default.exit(buildCode || 1);
    }
    const compiledEvalPath = import_path.default.join(
      __dirname,
      "index.eval.js",
    );
    const sourceEvalPath = import_path.default.resolve(
      __dirname,
      "..",
      "..",
      "evals",
      "index.eval.ts",
    );
    let child;
    if (import_fs.default.existsSync(compiledEvalPath)) {
      child = (0, import_child_process.spawn)(
        import_process.default.execPath,
        [compiledEvalPath, ...legacyArgs],
        {
          env: env2,
          stdio: "inherit",
          shell: true,
        },
      );
    } else {
      let tsxCliPath;
      try {
        tsxCliPath = require.resolve("tsx/dist/cli.js");
      } catch (e) {}
      const tsxArgs = [sourceEvalPath, ...legacyArgs];
      if (tsxCliPath) {
        child = (0, import_child_process.spawn)(
          import_process.default.execPath,
          [tsxCliPath, ...tsxArgs],
          {
            env: env2,
            stdio: "inherit",
            shell: true,
          },
        );
      } else {
        child = (0, import_child_process.spawn)("tsx", tsxArgs, {
          env: env2,
          stdio: "inherit",
          shell: true,
        });
      }
    }
    child.on("exit", (code) => {
      import_process.default.exit(code || 0);
    });
  });
}
function main() {
  const args = import_process.default.argv.slice(2);
  const command = args[0];
  const commandArgs = args.slice(1);
  switch (command) {
    case "run":
      handleRun(commandArgs);
      break;
    case "list":
      handleList(commandArgs);
      break;
    case "config":
      handleConfig(commandArgs);
      break;
    case "help":
    case "--help":
    case "-h":
      printHelp();
      break;
    case void 0:
      console.error(source_default.red("Error: No command specified"));
      printHelp();
      import_process.default.exit(1);
      break;
    default:
      if (!command.startsWith("-")) {
        handleRun(args);
      } else {
        console.error(
          source_default.red(`Error: Unknown command "${command}"`),
        );
        printHelp();
        import_process.default.exit(1);
      }
  }
}
main();
