import { ITarget } from '../config/ITarget';

export type ITypeScriptPaths = { [key: string]: Array<string> };

export type IJavaScriptTarget = 'ES2015' | 'ES2016' | 'ES2017' | 'ES2019' | 'ES3' | 'ES5' | 'ES6' | 'ESNext';

export interface ICompilerOptions {
  baseUrl?: string;
  buildTarget?: ITarget;
  emitDecoratorMetadata?: boolean;
  esModuleInterop?: boolean;
  esModuleStatement?: boolean;
  experimentalDecorators?: boolean;
  jsxFactory?: string;
  paths?: ITypeScriptPaths;
  processEnv?: Record<string, string>;
  tsConfig?: string;
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

export interface IRawTypescriptConfig {
  error?: any;

  config?: {
    compilerOptions?: IRawCompilerOptions;
    extends?: string;
  };
}
