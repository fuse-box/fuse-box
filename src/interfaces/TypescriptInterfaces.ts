import { ITypescriptPaths } from '../resolver/pathsLookup';
import * as ts from 'typescript';
import { ITypescriptPathsConfig } from '../resolver/resolver';
export interface TypescriptConfig {
  typescriptPaths?: ITypescriptPathsConfig;
  basePath?: string;
  diagnostics?: Array<any>; // all errors come here
  jsonCompilerOptions?: IRawCompilerOptions;
  compilerOptions?: ts.CompilerOptions;
  transpileOptions?: ts.TranspileOptions;
  tsConfigFilePath: string;
}

export type ITypescriptTarget = 'ES3' | 'ES5' | 'ES6' | 'ES2015' | 'ES2016' | 'ES2017' | 'ESNext';

export interface IRawCompilerOptions {
  target?: ITypescriptTarget;
  module?: string;
  baseUrl?: string;
  sourceMap?: boolean;
  inlineSources?: boolean;
  allowJs?: boolean;
  paths?: ITypescriptPaths;
  jsxFactory?: string;
  moduleResolution?: string;
  jsx?: string;
  mod?: any;
  importHelpers?: boolean;
  experimentalDecorators?: boolean;
  emitDecoratorMetadata?: boolean;
  declaration?: boolean;
}
export interface IRawTypescriptConfig {
  error?: any;

  config?: {
    extends?: string;
    compilerOptions?: IRawCompilerOptions;
  };
}
