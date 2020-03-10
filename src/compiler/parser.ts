import * as parser from '@typescript-eslint/typescript-estree';
import * as meriyah from 'meriyah';
import { ASTNode } from './interfaces/AST';
export interface IParserOptions {
  jsx?: boolean;
  locations?: boolean;
}

export type ICodeParser = (code: string, props?: IParserOptions) => ASTNode;

export function parseTypeScript(code: string, props?: IParserOptions): ASTNode {
  props = props || {};
  return parser.parse(code, {
    range: props.locations,
    raw: true,
    useJSXTextNode: true,
    loc: props.locations,
    jsx: props.jsx,
  }) as any;
}

export function parseJavascript(code: string, props?: IParserOptions): ASTNode {
  props = props || {};

  return meriyah.parse(code, { jsx: props.jsx, loc: props.locations, module: true }) as any;
}
