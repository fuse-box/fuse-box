import { ITransformer } from '../compiler/interfaces/ITransformer';
import { ITarget } from '../config/ITarget';

export type ITypeScriptPaths = { [key: string]: Array<string> };

export type IJavaScriptTarget = 'ES2015' | 'ES2016' | 'ES2017' | 'ES2019' | 'ES3' | 'ES5' | 'ES6' | 'ESNext';

export type ICompilerParserType = 'meriyah' | 'ts';

export interface ICompilerOptionTransformer {
  name?: string;
  opts?: Record<string, any>;
  script?: string;
  transformer?: (options: any) => ITransformer;
}

export interface ICompilerOptions {
  baseUrl?: string;
  buildEnv?: Record<string, any>;
  buildTarget?: ITarget;
  emitDecoratorMetadata?: boolean;
  esModuleInterop?: boolean;
  esModuleStatement?: boolean;
  experimentalDecorators?: boolean;
  jsxFactory?: string;
  paths?: ITypeScriptPaths;
  processEnv?: Record<string, string>;
  transformers?: Array<ICompilerOptionTransformer>;
  tsConfig?: string;
  tsReferences?: ITsConfigReference[];
  jsParser?: { nodeModules?: ICompilerParserType; project?: ICompilerParserType };
}

export interface IPrivateCompilerOptions {
  basePath?: string;
  emitDecoratorMetadata?: boolean;
  experimentalDecorators?: boolean;
  paths?: ITypeScriptPaths;
  target: string;
}

export interface IRawCompilerOptions {
  allowJs?: boolean;
  allowSyntheticDefaultImports?: boolean;
  baseUrl?: string;
  declaration?: boolean;
  emitDecoratorMetadata?: boolean;
  esModuleInterop?: boolean;

  experimentalDecorators?: boolean;
  importHelpers?: boolean;
  inlineSources?: boolean;
  jsx?: string;
  jsxFactory?: string;
  mod?: any;
  module?: string;
  moduleResolution?: string;
  paths?: ITypeScriptPaths;
  sourceMap?: boolean;
  target?: IJavaScriptTarget;
}

// an element in the "references":[] array in a tsconfig.json
export interface ITsConfigReference {
  path?: string;
}

export interface IRawTypescriptConfig {
  error?: any;

  config?: {
    compilerOptions?: IRawCompilerOptions;
    extends?: string;
    references?: ITsConfigReference[];
  };
}
