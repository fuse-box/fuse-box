import * as path from 'path';
import * as sourceMapModule from 'source-map';
import { getMTime } from '../cache/cache';
import { generate } from '../compiler/generator/generator';
import { ASTNode } from '../compiler/interfaces/AST';
import { ITransformerResult } from '../compiler/interfaces/ITranformerResult';
import { parseJavascript, parseTypeScript } from '../compiler/parser';
import { transformCommonVisitors } from '../compiler/transformer';
import { EXECUTABLE_EXTENSIONS, JS_EXTENSIONS, STYLESHEET_EXTENSIONS, TS_EXTENSIONS } from '../config/extensions';
import { Context } from '../core/Context';
import { IModuleTree } from '../production/module/ModuleTree';
import { IStylesheetModuleResponse } from '../stylesheet/interfaces';
import { makePublicPath, readFile } from '../utils/utils';
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
  isSourceMapRequired?: boolean;
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
  const self: IModule = {
    ctx: props.ctx,
    dependencies: [],
    pkg: props.pkg,
    // legacy props
    props: {},
    storage: {},
    // generate the code
    generate: () => {
      if (!self.ast) throw new Error('Cannot generate code without AST');

      const genOptions: any = {
        ecmaVersion: 7,
      };

      if (self.isSourceMapRequired) {
        const sourceMap = new sourceMapModule.SourceMapGenerator({
          file: self.publicPath,
        });
        genOptions.sourceMap = sourceMap;
      }
      if (self.ctx.config.production) {
        genOptions.indent = '';
        genOptions.lineEnd = '';
      }

      const code = generate(self.ast, genOptions);
      if (self.isSourceMapRequired) {
        const jsonSourceMaps = genOptions.sourceMap.toJSON();
        if (!jsonSourceMaps.sourcesContent) {
          delete jsonSourceMaps.file;
          jsonSourceMaps.sources = [self.publicPath];
          jsonSourceMaps.sourcesContent = [self.contents];
        }
        self.sourceMap = JSON.stringify(jsonSourceMaps);
      }
      self.contents = code;
      return code;
    },
    getMeta: (): IModuleMeta => {
      const dependencies = [];
      for (const module of self.dependencies) {
        dependencies.push(module.id);
      }
      return {
        absPath: self.absPath,
        dependencies: dependencies,
        id: self.id,
        mtime: getMTime(self.absPath),
        packageId: props.pkg !== undefined ? props.pkg.publicName : undefined,
        publicPath: self.publicPath,
      };
    },
    init: () => {
      const ext = path.extname(props.absPath);
      self.extension = path.extname(props.absPath);
      self.isJavaScript = JS_EXTENSIONS.includes(ext);
      self.isTypeScript = TS_EXTENSIONS.includes(ext);
      self.absPath = props.absPath;
      self.isCommonsEligible = false;
      self.moduleSourceRefs = {};
      self.isEntry = false;

      let isCSSSourceMapRequired = true;
      const config = props.ctx.config;
      if (config.sourceMap.css === false) {
        isCSSSourceMapRequired = false;
      }
      if (props.pkg && props.pkg.type === PackageType.USER_PACKAGE && !config.sourceMap.vendor) {
        isCSSSourceMapRequired = false;
      }

      self.isStylesheet = STYLESHEET_EXTENSIONS.includes(ext);
      self.isExecutable = EXECUTABLE_EXTENSIONS.includes(ext);
      self.isCSSSourceMapRequired = isCSSSourceMapRequired;
      self.props.fuseBoxPath = makePublicPath(self.absPath);
      self.publicPath = self.props.fuseBoxPath;

      self.isSourceMapRequired = true;
      if (self.pkg.type === PackageType.USER_PACKAGE) {
        if (!config.sourceMap.project) self.isSourceMapRequired = false;
      } else {
        if (!config.sourceMap.vendor) self.isSourceMapRequired = false;
      }
    },
    initFromCache: (meta: IModuleMeta, data: { contents: string; sourceMap: string }) => {
      self.id = meta.id;
      self.publicPath = meta.publicPath;
      self.contents = data.contents;
      self.sourceMap = data.sourceMap;
      self.absPath = meta.absPath;
      self.isCached = true;
      self.extension = path.extname(meta.absPath);
      if (self.sourceMap) self.isSourceMapRequired = true;
    },
    // parse using javascript or typescript
    parse: () => {
      if (!self.contents) throw new Error('Cannot parse without content');

      if (JS_EXTENSIONS.includes(self.extension)) {
        try {
          self.ast = parseJavascript(self.contents, {
            locations: self.isSourceMapRequired,
          });
          self.errored = false;
        } catch (e) {
          self.errored = true;
          props.ctx.log.error(`Error while parsing JavaScript ${self.absPath}\n\t ${e.stack}`);
        }
      } else if (TS_EXTENSIONS.includes(self.extension)) {
        try {
          self.ast = parseTypeScript(self.contents, {
            jsx: self.extension === '.tsx',
            locations: self.isSourceMapRequired,
          });
          self.errored = false;
        } catch (e) {
          self.errored = true;
          props.ctx.log.error(`Error while parsing TypeScript ${self.absPath}\n\t ${e.stack}`);
        }
      }
      return self.ast;
    },
    // read the contents
    read: () => {
      try {
        self.contents = readFile(self.absPath);
      } catch (e) {
        if (self.absPath.lastIndexOf(path.join(props.ctx.config.homeDir, 'node_modules'), 0) === 0) {
          props.ctx.log.warn(`Did you forget to run 'npm install'?`);
        }
        props.ctx.log.error(`Module not found ${self.absPath.replace(props.ctx.config.homeDir, '')}`, e.message);
        throw e;
      }
      return self.contents;
    },
    transpile: () => transformCommonVisitors(self, props.ctx.compilerOptions),
  };
  return self;
}
