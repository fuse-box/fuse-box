export interface ITokenizerGroup {
  sharedWorkerImport?: string;
  workerImport?: string;
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
  mappedLine?: string;
}

/** A list of token with simplified replacable aliases
 *
 * @group : ?<${name}>
 * Compiles down to one RegEx
 */

const TOKENS = {
  requireStatement: /(?:[^\.\w]|^)(require|import|Worker|SharedWorker)\((\s*\/\*.*\*\/\s*)?("(?:\\["\\]|[^\n"\\])*"|'(?:\\['\\]|[^\n'\\])*')/,
  importModule: /import\s+['"]([^"']+)/,
  importFrom: /\s+from\s+['"]([^"']+)/,
  singleLineComment: /(\/\/.*$)/,
  singeLineMultiComment: /\/\*.*?\*\//,
  commentStart: /(\/\*)/,
  commentEnd: /(\*\/)/,
  systemVariables: /(?:^|[\s=:\[,\(])((var|const|let)\s*)?(stream|process|buffer|Buffer|http|https|__dirname|__filename)(?:$|[\).\s:\],])/,
  exportsKeyword: /(export)\s/,

  str: /".*?"|'.*?'/,
};

// Compile a single long RegEx
const data = [];
for (const name in TOKENS) {
  data.push(`(${TOKENS[name].source})`);
}

const REGEX = new RegExp(`(${data.join(`|`)})`, 'gm');

export function tokenize(input: string, onToken: (group: ITokenizerGroup) => void, debug?) {
  let matches;

  while ((matches = REGEX.exec(input))) {
    const kw = matches[3];
    let statementMatch = matches[5];
    if (statementMatch) {
      statementMatch = statementMatch.slice(1, statementMatch.length - 1);
    }

    const data = {
      sharedWorkerImport: kw === 'SharedWorker' && statementMatch,
      workerImport: kw === 'Worker' && statementMatch,
      requireStatement: kw === 'require' && statementMatch,
      dynamicImport: kw === 'import' && statementMatch,
      importModule: matches[7],
      importFrom: matches[9],
      singleLineComment: matches[11],
      singeLineMultiComment: matches[12],
      commentStart: matches[14],
      commentEnd: matches[15],
      systemVariable: matches[20] && {
        declaration: matches[19],
        name: matches[20],
      },
      exportsKeyword: matches[22],
    };

    onToken(data);
  }
}
