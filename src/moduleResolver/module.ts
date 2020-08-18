import * as path from 'path';
import * as sourceMapModule from 'source-map';
import * as ts from 'typescript';
import { generate } from '../compiler/generator/generator';
import { ASTNode } from '../compiler/interfaces/AST';
import { ITransformerResult } from '../compiler/interfaces/ITranformerResult';
import { ImportType } from '../compiler/interfaces/ImportType';
import { parseJavascript, parseTypeScript, ICodeParser } from '../compiler/parser';
import { ISerializableTransformationContext } from '../compiler/transformer';
import { EXECUTABLE_EXTENSIONS, JS_EXTENSIONS, STYLESHEET_EXTENSIONS, TS_EXTENSIONS } from '../config/extensions';
import { Context } from '../core/context';
import { env } from '../env';
import { ITypescriptTarget } from '../interfaces/TypescriptInterfaces';
import { IModuleTree } from '../production/module/ModuleTree';
import { IStylesheetModuleResponse } from '../stylesheet/interfaces';
import { getFileModificationTime, makePublicPath, readFile } from '../utils/utils';
import { IRelativeResolve } from './asyncModuleResolver';
import { PackageType, IPackage } from './package';
export function Module() {}

export interface IModule {
  absPath?: string;
  ast?: ASTNode;
  breakDependantsCache?: boolean;
  captured?: boolean;
  contents?: string;
  css?: IStylesheetModuleResponse;
  ctx?: Context;
  dependencies?: Array<number>;
  errored?: boolean;
  extension?: string;
  id?: number;
  ignore?: boolean;
  isCSSModule?: boolean;
  isCSSSourceMapRequired?: boolean;
  isCSSText?: boolean;
  isCached?: boolean;
  isCommonsEligible?: boolean;
  isEntry?: boolean;
  isExecutable?: boolean;
  isJavaScript?: boolean;
  isSourceMapRequired?: boolean;
  isSplit?: boolean;
  isStylesheet?: boolean;
  isTypeScript?: boolean;
  moduleSourceRefs?: Record<string, IModule>;
  moduleTree?: IModuleTree;
  pending?: Array<Promise<any>>;
  pkg?: IPackage;
  publicPath?: string;
  sourceMap?: string;
  storage?: Record<string, any>;
  props?: {
    fuseBoxPath?: string;
  };
  generate?: () => void;
  getMeta?: () => any;
  getTransformationContext?: () => ISerializableTransformationContext;
  init?: () => void;
  initFromCache?: (meta: IModuleMeta, data: { contents: string; sourceMap: string }) => void;
  parse?: () => ASTNode;
  read?: () => string;
  resolve?: (props: { importType?: ImportType; statement: string }) => Promise<IRelativeResolve>;
  transpile?: () => ITransformerResult;
  transpileDown?(buildTarget: ITypescriptTarget): void;
}

export interface IModuleMeta {
  absPath: string;
  breakDependantsCache?: boolean;
  dependencies: Array<number>;
  id: number;
  mtime: number;
  packageId?: string;
  publicPath: string;
  // a list of dependencies for verification (essential dependency)
  // if those dependencies changed this one should be affected too.
  v?: Array<number>;
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
      if (self.ctx.config.isProduction) {
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
      const meta: IModuleMeta = {
        absPath: self.absPath,
        dependencies: self.dependencies,
        id: self.id,

        mtime: getFileModificationTime(self.absPath),
        packageId: props.pkg !== undefined ? props.pkg.publicName : undefined,
        publicPath: self.publicPath,
      };
      if (self.breakDependantsCache) meta.breakDependantsCache = true;
      return meta;
    },
    getTransformationContext: () => {
      return {
        compilerOptions: self.ctx.compilerOptions,
        config: {
          electron: {
            nodeIntegration: self.ctx.config.electron.nodeIntegration,
          },
        },
        module: {
          absPath: self.absPath,
          extension: self.extension,
          isSourceMapRequired: self.isSourceMapRequired,
          publicPath: self.publicPath,
        },
        pkg: { type: self.pkg.type },
        //userTransformers: self.ctx.userTransformers,
      };
    },
    init: () => {
      const ext = path.extname(props.absPath);
      self.extension = path.extname(props.absPath);
      self.isJavaScript = JS_EXTENSIONS.includes(ext);
      self.isTypeScript = TS_EXTENSIONS.includes(ext);
      self.isStylesheet = STYLESHEET_EXTENSIONS.includes(ext);
      self.isExecutable = EXECUTABLE_EXTENSIONS.includes(ext);
      self.absPath = props.absPath;
      self.isCommonsEligible = false;
      self.pending = [];
      self.moduleSourceRefs = {};
      self.isEntry = false;
      self.isSplit = false;

      const config = props.ctx.config;
      if (self.isStylesheet) {
        let isCSSSourceMapRequired = true;
        if (config.sourceMap.css === false) {
          isCSSSourceMapRequired = false;
        }
        if (props.pkg && props.pkg.type === PackageType.EXTERNAL_PACKAGE && !config.sourceMap.vendor) {
          isCSSSourceMapRequired = false;
        }
        self.isCSSSourceMapRequired = isCSSSourceMapRequired;
      }

      self.props.fuseBoxPath = makePublicPath(self.absPath);
      self.publicPath = self.props.fuseBoxPath;

      self.isSourceMapRequired = true;

      if (self.pkg && self.pkg.type === PackageType.USER_PACKAGE) {
        if (!config.sourceMap.project) self.isSourceMapRequired = false;
      } else {
        if (!config.sourceMap.vendor) self.isSourceMapRequired = false;
      }
    },
    initFromCache: (meta: IModuleMeta, data: { contents: string; sourceMap: string }) => {
      self.id = meta.id;
      self.absPath = meta.absPath;
      self.extension = path.extname(self.absPath);
      self.isJavaScript = JS_EXTENSIONS.includes(self.extension);
      self.isTypeScript = TS_EXTENSIONS.includes(self.extension);
      self.isStylesheet = STYLESHEET_EXTENSIONS.includes(self.extension);
      self.isExecutable = EXECUTABLE_EXTENSIONS.includes(self.extension);
      self.contents = data.contents;
      self.sourceMap = data.sourceMap;
      self.dependencies = meta.dependencies;
      self.publicPath = meta.publicPath;
      self.breakDependantsCache = meta.breakDependantsCache;
      self.isCached = true;
      if (self.sourceMap) self.isSourceMapRequired = true;
    },
    // parse using javascript or typescript
    parse: () => {
      if (!self.contents) {
        props.ctx.log.warn(`One of your dependencies contains an empty module:\n\t ${self.publicPath}`);
        self.ast = {
          body: [
            {
              declaration: {
                type: 'Literal',
                value: '',
              },
              type: 'ExportDefaultDeclaration',
            },
          ],
          sourceType: 'module',
          type: 'Program',
        };
        return self.ast;
      }

      let parser: ICodeParser;
      if (self.isTypeScript) parser = parseTypeScript;
      else {
        parser = parseJavascript;
        const parserOptions = self.ctx.compilerOptions.jsParser;
        const isExternal = self.pkg.type === PackageType.EXTERNAL_PACKAGE;
        if (isExternal) {
          if (parserOptions.nodeModules === 'ts') parser = parseTypeScript;
        } else if (parserOptions.project === 'ts') parser = parseTypeScript;
      }

      const jsxRequired = self.extension !== '.ts';

      try {
        // @todo: fix jsx properly
        self.ast = parser(self.contents, {
          jsx: jsxRequired,
          locations: self.isSourceMapRequired,
        });
        self.errored = false;
      } catch (e) {
        self.errored = true;
        const message = `Error while parsing module ${self.absPath}\n\t ${e.stack || e.message}`;
        props.ctx.log.error(message);

        self.ast = parseJavascript(``);
      }

      return self.ast;
    },
    // read the contents
    read: () => {
      if (self.contents !== undefined) return self.contents;

      try {
        self.contents = readFile(self.absPath);
      } catch (e) {
        if (self.absPath.includes('node_modules')) {
          props.ctx.log.warn(`Did you forget to run 'npm install'?`);
        }
        props.ctx.log.error(`Module not found at\n\t${self.publicPath}`, e.message);
        throw e;
      }
      return self.contents;
    },
    transpileDown: (buildTarget: ITypescriptTarget) => {
      // we can't support sourcemaps on downtranspiling
      self.isSourceMapRequired = false;
      const config = ts.convertCompilerOptionsFromJson(
        { importHelpers: false, noEmitHelpers: true, target: buildTarget },
        env.SCRIPT_PATH,
      );
      const data = ts.transpileModule(self.contents, {
        compilerOptions: config.options,
        fileName: self.absPath,
      });
      self.contents = data.outputText;
    },
  };
  return self;
}
