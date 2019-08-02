const TOKENS = {
  selectorOpen: /([\.#][^\{]+)/,
  selectorClose: /\}/,
  property: /([a-zA-Z0-9-]+\s?\:\s([^$]+))/,
  singleLineComment: /(\/\/.*$)/,
  commentStart: /(\/\*)/,
  commentEnd: /(\*\/)/,
};

// Compile a single long RegEx
const data = [];
for (const name in TOKENS) {
  data.push(`(${TOKENS[name].source})`);
}

const REGEX = new RegExp(`(${data.join(`|`)})`, 'igm');

export function fastCssParser() {}
