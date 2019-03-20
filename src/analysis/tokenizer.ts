export interface ITokenizerGroup {
  requireStatement?: string;
  importModule?: string;
  importFrom?: string;
  dynamicImport?: string;
  singleLineComment?: string;
  commentStart?: string;
  commentEnd?: string;
  systemVariable?: string;
  exportsKeyword?: boolean;
  jsxToken?: boolean;
}

/** A list of token with simplified replacable aliases
 *
 * @group : ?<${name}>
 * Compiles down to one RegEx
 */
const TOKENS = {
  requireStatement: /(?:[^\.\w]|^)(require|import)\((\s*\/\*.*\*\/\s*)?["']([^"']+)/,
  importModule: /import\s+['"]([^"']+)/,
  importFrom: /\s+from\s+['"]([^"']+)/,
  singleLineComment: /(\/\/)/,
  commentStart: /(\/\*)/,
  commentEnd: /(\*\/)/,
  systemVariables: /(?:[^\.\w]|^)(stream|process|Buffer|http|https|__dirname|__filename)/,
  exportsKeyword: /(?:[^\.\w]|^)(export)\s/,
  jsx: /<[^\>]+/,
};

// Compile a single long RegEx
const data = [];
for (const name in TOKENS) {
  data.push(`(${TOKENS[name].source})`);
}

const REGEX = new RegExp(`(${data.join(`|`)})`, 'gm');
//console.log(REGEX);
export function tokenize(input: string, onToken: (group: ITokenizerGroup) => void) {
  let matches;
  while ((matches = REGEX.exec(input))) {
    const kw = matches[3];
    onToken({
      requireStatement: kw === 'require' && matches[5],
      dynamicImport: kw === 'import' && matches[5],
      importModule: matches[7],
      importFrom: matches[9],
      singleLineComment: matches[11],
      commentStart: matches[13],
      commentEnd: matches[14],
      systemVariable: matches[17],
      exportsKeyword: matches[19],
      jsxToken: matches[20],
    });
  }
}
