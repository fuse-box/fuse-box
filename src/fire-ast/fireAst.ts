const TOKENS = {
  ds: /"(?:\\["\\]|[^\n"\\])*"/,
  ss: /'(?:\\['\\]|[^\n'\\])*'/,
  comment: /\/\/.*?$/,
  commentStart: /\/\*/,
  commentEnd: /\*\//,
  lparen: /\(/,
  rparen: /\)/,
  objectIdentifier: /\./,
  declarator: /var|const|let/,
  es5: /require/,
  es6: /import|export|from/,
  sys: /__dirname|__filename|stream|process|Buffer|http|https/,
};
const TOKEN_KEYS = Object.keys(TOKENS);

// Compile a single long RegEx
const data = [];
for (const name in TOKENS) {
  data.push(`(${TOKENS[name].source})`);
}

const REGEX = new RegExp(`${data.join(`|`)}`, 'gim');
const RULES = {
  ds: value => ({ type: 'string', value }),
  ss: value => ({ type: 'string', value }),
  comment: value => ({ type: 'sl-comment' }),
  commentStart: value => ({ type: 'comment-start' }),
  commentEnd: value => ({ type: 'comment-end' }),
  lparen: value => ({ type: 'lparen' }),
  rparen: value => ({ type: 'rparen' }),
  objectIdentifier: value => ({ type: 'identifier' }),
  declarator: value => ({ type: 'declarator', value }),
  es6: value => ({ type: value }),
  es5: value => ({ type: value }),
  sys: value => ({ type: 'sys', value }),
};

export function fireAst(contents: string) {
  let matches;
  const tokens = [];
  let skip = false;

  while ((matches = REGEX.exec(contents))) {
    TOKEN_KEYS.forEach((key, index) => {
      const pointer = index + 1;
      if (matches[pointer] !== undefined) {
        if (RULES[key]) {
          const node = RULES[key](matches[pointer]);
          if (node.type === 'comment-start') {
            skip = true;
          }
          if (node.type === 'comment-end') {
            skip = false;
          }
          if (!skip) {
            tokens.push(node);
          }
        }
      }
    });
  }
  return tokens;
}
