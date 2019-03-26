export interface ITokenizerGroup {
  requireStatement?: string;
  importModule?: string;
  importFrom?: string;
  dynamicImport?: string;
  singleLineComment?: string;
  commentStart?: string;
  commentEnd?: string;
  systemVariable?: { declaration?: string; name: string };
  exportsKeyword?: boolean;
  jsxToken?: boolean;
}

/** A list of token with simplified replacable aliases
 *
 * @group : ?<${name}>
 * Compiles down to one RegEx
 */

const TOKENS = {
  requireStatement: /(?:[^\.\w]|^)(require|import)\((\s*\/\*.*\*\/\s*)?("(?:\\["\\]|[^\n"\\])*"|'(?:\\['\\]|[^\n'\\])*')/,
  importModule: /import\s+['"]([^"']+)/,
  importFrom: /\s+from\s+['"]([^"']+)/,
  singleLineComment: /(\/\/.*$)/,
  commentStart: /(\/\*)/,
  commentEnd: /(\*\/)/,
  systemVariables: /(?:^|[\s=:\[,\(])((var|const|let)\s*)?(stream|process|Buffer|http|https|__dirname|__filename)(?:$|[\).\s:\],])/,
  exportsKeyword: /(export)\s/,
  jsx: /(\/>|<\/)/,
  str: /".*?"|'.*?'/,
};

// Compile a single long RegEx
const data = [];
for (const name in TOKENS) {
  data.push(`(${TOKENS[name].source})`);
}

const REGEX = new RegExp(`(${data.join(`|`)})`, 'igm');

export function tokenize(input: string, onToken: (group: ITokenizerGroup) => void) {
  let matches;

  while ((matches = REGEX.exec(input))) {
    const kw = matches[3];
    let statementMatch = matches[5];
    if (statementMatch) {
      statementMatch = statementMatch.slice(1, statementMatch.length - 1);
    }
    const data = {
      requireStatement: kw === 'require' && statementMatch,
      dynamicImport: kw === 'import' && statementMatch,
      importModule: matches[7],
      importFrom: matches[9],
      singleLineComment: matches[11],
      commentStart: matches[13],
      commentEnd: matches[14],
      systemVariable: matches[19] && {
        declaration: matches[18],
        name: matches[19].toLowerCase(),
      },
      exportsKeyword: matches[21],
      jsxToken: matches[23],
    };
    onToken(data);
  }
}
