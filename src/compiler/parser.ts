import * as parser from '@typescript-eslint/typescript-estree';
import { ASTNode } from './interfaces/AST';
import * as meriyah from 'meriyah';
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

export function parseJavascript(code: string, props?: IParserOptions): ASTNode {
  props = props || {};

  return meriyah.parse(code, { jsx: props.jsx }) as any;
}
