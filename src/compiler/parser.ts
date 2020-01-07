import * as parser from '@typescript-eslint/typescript-estree';
import { ASTNode } from './interfaces/AST';

export interface IParserOptions {
  jsx?: boolean;
  locations?: boolean;
}
export function parseTypeScript(code: string, props?: IParserOptions): ASTNode {
  props = props || {};
  return parser.parse(code, {
    range: props.locations,
    // loc: false,
    useJSXTextNode: true,
    loc: props.locations,
    jsx: props.jsx,
  }) as any;
}
