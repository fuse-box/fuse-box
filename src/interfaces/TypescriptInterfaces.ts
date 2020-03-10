import * as ts from 'typescript';
import { ITypescriptPaths } from '../resolver/pathsLookup';
import { ITypescriptPathsConfig } from '../resolver/resolver';
export interface TypescriptConfig {
  basePath?: string;
  compilerOptions?: ts.CompilerOptions;
  diagnostics?: Array<any>; // all errors come here
  jsonCompilerOptions?: IRawCompilerOptions;
  transpileOptions?: ts.TranspileOptions;
  tsConfigFilePath: string;
  typescriptPaths?: ITypescriptPathsConfig;
}

export type ITypescriptTarget = 'ES2015' | 'ES2016' | 'ES2017' | 'ES3' | 'ES5' | 'ES6';

export interface IRawCompilerOptions {
  allowJs?: boolean;
  baseUrl?: string;
  declaration?: boolean;
  emitDecoratorMetadata?: boolean;
  experimentalDecorators?: boolean;
  importHelpers?: boolean;
  inlineSources?: boolean;
  jsx?: string;
  jsxFactory?: string;
  mod?: any;
  module?: string;
  moduleResolution?: string;
  paths?: ITypescriptPaths;
  sourceMap?: boolean;
  target?: ITypescriptTarget;
}
export interface IRawTypescriptConfig {
  error?: any;

  config?: {
    compilerOptions?: IRawCompilerOptions;
    extends?: string;
  };
}
