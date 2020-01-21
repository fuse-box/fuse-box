import * as path from 'path';
import { getMTime } from '../cache/cache';
import { generate } from '../compiler/generator/generator';
import { ASTNode } from '../compiler/interfaces/AST';
import { ITransformerResult } from '../compiler/interfaces/ITranformerResult';
import { newTransformCommonVisitors } from '../compiler/new_transformer';
import { parseJavascript, parseTypeScript } from '../compiler/parser';
import { EXECUTABLE_EXTENSIONS, JS_EXTENSIONS, STYLESHEET_EXTENSIONS, TS_EXTENSIONS } from '../config/extensions';
import { Context } from '../core/Context';
import { IModuleTree } from '../production/module/ModuleTree';
import { IStylesheetModuleResponse } from '../stylesheet/interfaces';
import { makeFuseBoxPath, readFile } from '../utils/utils';
import { PackageType, IPackage } from './Package';
export function Module() {}

export interface IModule {
  absPath?: string;
  ast?: ASTNode;
  breakDependantsCache?: boolean;
  captured?: boolean;
  contents?: string;
  css?: IStylesheetModuleResponse;
  ctx?: Context;
  dependencies?: Array<IModule>;
  errored?: boolean;
  extension?: string;
  id?: number;
  isCSSModule?: boolean;
  isCSSSourceMapRequired?: boolean;
  isCSSText?: boolean;
  isCached?: boolean;
  isCommonsEligible?: boolean;
  isEntry?: boolean;
  isExecutable?: boolean;
  isJavaScript?: boolean;
  isStylesheet?: boolean;
  isTypeScript?: boolean;
  moduleSourceRefs?: Record<string, IModule>;
  moduleTree?: IModuleTree;
  pkg?: IPackage;
  publicPath?: string;
  sourceMap?: string;
  storage?: Record<string, any>;
  props?: {
    fuseBoxPath?: string;
  };
  generate?: () => void;
  getMeta?: () => any;
  init?: () => void;
  initFromCache?: (meta: IModuleMeta, data: { contents: string; sourceMap: string }) => void;
  parse?: () => ASTNode;
  read?: () => string;
  transpile?: () => ITransformerResult;
}

export interface IModuleMeta {
  absPath: string;
  dependencies: Array<number>;
  id: number;
  mtime: number;
  packageId?: string;
  publicPath: string;
}

export function createModule(props: { absPath?: string; ctx?: Context; pkg?: IPackage }): IModule {
  const scope: IModule = {
    ctx: props.ctx,
    dependencies: [],
    pkg: props.pkg,
    // legacy props
    props: {},
    storage: {},
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
        dependencies: dependencies,
        id: scope.id,
        mtime: getMTime(scope.absPath),
        packageId: props.pkg !== undefined ? props.pkg.publicName : undefined,
        publicPath: scope.publicPath,
      };
    },
    init: () => {
      const ext = path.extname(props.absPath);
      scope.extension = path.extname(props.absPath);
      scope.isJavaScript = JS_EXTENSIONS.includes(ext);
      scope.isTypeScript = TS_EXTENSIONS.includes(ext);
      scope.absPath = props.absPath;
      scope.isCommonsEligible = false;
      scope.moduleSourceRefs = {};
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
    // parse using javascript or typescript
    parse: () => {
      if (!scope.contents) throw new Error('Cannot parse without content');

      if (JS_EXTENSIONS.includes(scope.extension)) {
        try {
          scope.ast = parseJavascript(scope.contents);
          scope.errored = false;
        } catch (e) {
          scope.errored = true;
          props.ctx.log.error(`Error while parsing JavaScript ${scope.absPath}\n\t ${e.stack}`);
        }
      } else if (TS_EXTENSIONS.includes(scope.extension)) {
        try {
          scope.ast = parseTypeScript(scope.contents, { jsx: scope.extension === '.tsx' });
          scope.errored = false;
        } catch (e) {
          scope.errored = true;
          props.ctx.log.error(`Error while parsing TypeScript ${scope.absPath}\n\t ${e.stack}`);
        }
      }
      return scope.ast;
    },
    // read the contents
    read: () => {
      scope.contents = readFile(scope.absPath);
      return scope.contents;
    },
    transpile: () => newTransformCommonVisitors(scope),
  };
  return scope;
}
