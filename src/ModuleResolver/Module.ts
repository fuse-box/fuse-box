import { Context } from '../core/Context';
import { readFile, makeFuseBoxPath } from '../utils/utils';
import { IPackage, PackageType } from './Package';
import * as path from 'path';
import { parseTypeScript, parseJavascript } from '../compiler/parser';
import { ASTNode } from '../compiler/interfaces/AST';
import { newTransformCommonVisitors } from '../compiler/new_transformer';
import { ITransformerResult } from '../compiler/interfaces/ITranformerResult';
import { generate } from '../compiler/generator/generator';
import { IStylesheetModuleResponse } from '../stylesheet/interfaces';
import { STYLESHEET_EXTENSIONS, EXECUTABLE_EXTENSIONS, JS_EXTENSIONS, TS_EXTENSIONS } from '../config/extensions';
import { statSync } from 'fs';
import { IModuleTree } from '../production/module/ModuleTree';
export function Module() { }

export interface IModule {
  init?: () => void;
  initFromCache?: (meta: IModuleMeta, data: { contents: string; sourceMap: string }) => void;
  id?: number;
  ctx?: Context;
  pkg?: IPackage;
  absPath?: string;
  contents?: string;
  sourceMap?: string;
  publicPath?: string;
  moduleTree?: IModuleTree;
  read?: () => string;
  errored?: boolean;
  parse?: () => ASTNode;
  css?: IStylesheetModuleResponse;
  captured?: boolean;
  isCached?: boolean;
  isEntry?: boolean;
  generate?: () => void;
  transpile?: () => ITransformerResult;
  isJavaScript?: boolean;
  isTypeScript?: boolean;
  isCSSSourceMapRequired?: boolean;
  dependencies?: Array<IModule>;
  isCSSModule?: boolean;
  isCSSText?: boolean;
  isStylesheet?: boolean;
  isCommonsEligible?: boolean;
  extension?: string;
  ast?: ASTNode;
  breakDependantsCache?: boolean;
  isExecutable?: boolean;
  storage?: Record<string, any>;
  props?: {
    fuseBoxPath?: string;
  };
  getMeta?: () => any;
}

export interface IModuleMeta {
  absPath: string;
  id: number;
  publicPath: string;
  dependencies: Array<number>;
  mtime: string;
}

export function createModule(props: { pkg?: IPackage; absPath?: string; ctx?: Context; }): IModule {
  const scope: IModule = {
    init: () => {
      const ext = path.extname(props.absPath);
      scope.extension = path.extname(props.absPath);
      scope.isJavaScript = JS_EXTENSIONS.includes(ext);
      scope.isTypeScript = TS_EXTENSIONS.includes(ext);
      scope.absPath = props.absPath;
      scope.isCommonsEligible = false;
      scope.isEntry = false;

      let isCSSSourceMapRequired = true;
      const config = props.ctx.config;
      if (config.sourceMap.css === false) {
        isCSSSourceMapRequired = false;
      }
      if (props.pkg && props.pkg.type === PackageType.USER_PACKAGE && !config.sourceMap.vendor) {
        isCSSSourceMapRequired = false;
      }

      scope.isStylesheet = STYLESHEET_EXTENSIONS.includes(ext);
      scope.isExecutable = EXECUTABLE_EXTENSIONS.includes(ext);
      scope.isCSSSourceMapRequired = isCSSSourceMapRequired;
      scope.props.fuseBoxPath = makeFuseBoxPath(props.ctx.config.homeDir, props.absPath);
      scope.publicPath = props.pkg && props.pkg.publicName + '/' + scope.props.fuseBoxPath;
    },
    initFromCache: (meta: IModuleMeta, data: { contents: string; sourceMap: string }) => {
      scope.id = meta.id;
      scope.publicPath = meta.publicPath;
      scope.contents = data.contents;
      scope.sourceMap = data.sourceMap;
      scope.absPath = meta.absPath;
      scope.isCached = true;
      scope.extension = path.extname(meta.absPath);
    },
    // legacy props
    props: {},
    storage: {},
    dependencies: [],
    ctx: props.ctx,
    pkg: props.pkg,
    // read the contents
    read: () => {
      scope.contents = readFile(scope.absPath);
      return scope.contents;
    },
    // parse using javascript or typescript
    parse: () => {
      if (!scope.contents) throw new Error('Cannot parse without content');
      if (JS_EXTENSIONS.includes(scope.extension)) {
        scope.ast = parseJavascript(scope.contents);
      } else if (TS_EXTENSIONS.includes(scope.extension)) {
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
    getMeta: (): IModuleMeta => {
      const dependencies = [];
      for (const module of scope.dependencies) {
        dependencies.push(module.id);
      }
      return {
        absPath: scope.absPath,
        id: scope.id,
        publicPath: scope.publicPath,
        dependencies: dependencies,
        mtime: statSync(scope.absPath).mtime.toString(),
      };
    },
  };
  return scope;
}
