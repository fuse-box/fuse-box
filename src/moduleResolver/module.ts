import * as path from 'path';
import * as sourceMapModule from 'source-map';
import * as ts from 'typescript';
import { generate } from '../compiler/generator/generator';
import { ASTNode } from '../compiler/interfaces/AST';
import { ITransformerResult } from '../compiler/interfaces/ITranformerResult';
import { parseJavascript, parseTypeScript } from '../compiler/parser';
import { transformCommonVisitors } from '../compiler/transformer';
import { EXECUTABLE_EXTENSIONS, JS_EXTENSIONS, STYLESHEET_EXTENSIONS, TS_EXTENSIONS } from '../config/extensions';
import { Context } from '../core/context';
import { env } from '../env';
import { ITypescriptTarget } from '../interfaces/TypescriptInterfaces';
import { IModuleTree } from '../production/module/ModuleTree';
import { IStylesheetModuleResponse } from '../stylesheet/interfaces';
import { getFileModificationTime, makePublicPath, readFile } from '../utils/utils';
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
    init: () => {
      const ext = path.extname(props.absPath);
      self.extension = path.extname(props.absPath);
      self.isJavaScript = JS_EXTENSIONS.includes(ext);
      self.isTypeScript = TS_EXTENSIONS.includes(ext);
      self.isStylesheet = STYLESHEET_EXTENSIONS.includes(ext);
      self.isExecutable = EXECUTABLE_EXTENSIONS.includes(ext);
      self.absPath = props.absPath;
      self.isCommonsEligible = false;
      self.moduleSourceRefs = {};
      self.isEntry = false;
      self.isSplit = false;

      let isCSSSourceMapRequired = true;
      const config = props.ctx.config;
      if (config.sourceMap.css === false) {
        isCSSSourceMapRequired = false;
      }
      if (props.pkg && props.pkg.type === PackageType.USER_PACKAGE && !config.sourceMap.vendor) {
        isCSSSourceMapRequired = false;
      }

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

      if (JS_EXTENSIONS.includes(self.extension)) {
        try {
          // @todo: fix jsx properly
          self.ast = parseJavascript(self.contents, {
            jsx: true,
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
        if (self.absPath.includes('node_modules')) {
          props.ctx.log.warn(`Did you forget to run 'npm install'?`);
        }
        props.ctx.log.error(`Module not found at\n\t${self.publicPath}`, e.message);
        throw e;
      }
      return self.contents;
    },
    transpile: () => {
      let result;
      try {
        result = transformCommonVisitors(self, props.ctx.compilerOptions);
      } catch (e) {
        props.ctx.log.error(`Error while transforming ${self.absPath}\n\t ${e.stack}`);
      }
      return result;
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
