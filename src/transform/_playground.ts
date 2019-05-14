import { fastTransform, parseAst } from './fastTransform';
import * as ts from 'typescript';
const name = 1;

const str = `
export { version, parse, parseExpressionAt, tokenizer, parse_dammit, LooseParser, pluginsLoose, addLooseExports, Parser, plugins, defaultOptions, Position, SourceLocation, getLineInfo, Node, TokenType, types as tokTypes, keywords$1 as keywordTypes, TokContext, types$1 as tokContexts, isIdentifierChar, isIdentifierStart, Token, isNewLine, lineBreak, lineBreakG, nonASCIIwhitespace };
`;

const tsString = `

async function foo(){
  await import("./sdf")
}

`;

const o = parseAst(tsString);
console.log(o);

// console.log(code);
