function findReplace(str: string, re: RegExp, fn: (args) => string) {
  return str.replace(re, (...args) => {
    return fn(args);
  });
}

export const COLOR_CODES = {
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
};

const SYMBOLS = {
  warning: '⚠️ ',
  error: '❌',
  checkmark: `✔`,
  clock: `⏲`,
  success: `${wrapCodeString('✔', COLOR_CODES.green)} `,
};

function wrapCodeString(str, codes) {
  return `\u001b[${codes[0]}m${str}\u001b[${codes[1]}m`;
}

export function codeLog(input: string, vars?: { [key: string]: any }) {
  return findReplace(input, /(<(\/)?([a-z]+)>)|(([@\$])([a-z0-9_]+))/gi, args => {
    const [, , closing, name, , type, variable] = args;
    if (type) {
      if (type === '$' && vars && vars[variable]) return vars[variable];
      if (type === '@') {
      }
      if (type === '@' && SYMBOLS[variable]) return SYMBOLS[variable];
    }

    if (COLOR_CODES[name]) {
      if (closing) {
        return `\u001b[${COLOR_CODES[name][1]}m`;
      }
      return `\u001b[${COLOR_CODES[name][0]}m`;
    }
    return name;
  });
}
