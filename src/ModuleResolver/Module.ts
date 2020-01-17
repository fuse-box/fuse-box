import { Context } from '../core/Context';
import { readFile, makeFuseBoxPath } from '../utils/utils';
import { IPackage } from './Package';
import * as path from 'path';
import { parseTypeScript, parseJavascript } from '../compiler/parser';
import { ASTNode } from '../compiler/interfaces/AST';
import { newTransformCommonVisitors } from '../compiler/new_transformer';
import { ITransformerResult } from '../compiler/interfaces/ITranformerResult';
import { generate } from '../compiler/generator/generator';
export function Module() {}

export interface IModule {
  id?: number;
  ctx?: Context;
  pkg?: IPackage;
  absPath?: string;
  contents?: string;
  read: () => string;
  parse: () => ASTNode;
  generate: () => void;
  transpile: () => ITransformerResult;
  isJavaScript?: boolean;
  isTypeScript?: boolean;
  extension?: string;
  ast?: ASTNode;
  props?: {
    fuseBoxPath?: string;
  };
}

export function createModule(props: { pkg?: IPackage; absPath?: string; ctx?: Context }): IModule {
  const ext = path.extname(props.absPath);
  const isJavaScript = ['.js', '.jsx'].includes(ext);
  const isTypeScript = ['.tsx', '.tsx'].includes(ext);
  const scope: IModule = {
    // legacy props
    props: {
      fuseBoxPath: makeFuseBoxPath(props.ctx.config.homeDir, props.absPath),
    },
    isJavaScript,
    isTypeScript,
    ctx: props.ctx,
    absPath: props.absPath,
    pkg: props.pkg,
    extension: path.extname(props.absPath),
    // read the contents
    read: () => {
      scope.contents = readFile(scope.absPath);
      return scope.contents;
    },
    // parse using javascript or typescript
    parse: () => {
      if (!scope.contents) throw new Error('Cannot parse without content');
      if (['.js', '.jsx'].includes(scope.extension)) {
        scope.ast = parseJavascript(scope.contents);
      } else if (['.ts', '.tsx'].includes(scope.extension)) {
        scope.ast = parseTypeScript(scope.contents, { jsx: scope.extension === '.tsx' });
      }
      return scope.ast;
    },
    transpile: () => newTransformCommonVisitors(scope),
    // generate the code
    generate: () => {
      if (!scope.ast) throw new Error('Cannot generate code without AST');

      const code = generate(scope.ast, { ecmaVersion: 7 });
      scope.contents = code;
      return code;
    },
  };
  return scope;
}
