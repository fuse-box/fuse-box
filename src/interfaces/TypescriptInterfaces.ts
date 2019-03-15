import { ITypescriptPaths } from '../resolver/pathsLookup';
import * as ts from 'typescript';
export interface TypescriptConfig {
  basePath?: string;
  diagnostics?: Array<any>; // all errors come here
  jsonCompilerOptions?: IRawCompilerOptions;
  compilerOptions?: ts.CompilerOptions;
}

export interface IRawCompilerOptions {
  target?: string;
  module?: string;
  baseUrl?: string;
  allowJs?: boolean;
  paths?: ITypescriptPaths;
  jsxFactory?: string;
  moduleResolution?: string;
  jsx?: string;
  mod?: any;
  importHelpers?: boolean;
  experimentalDecorators?: boolean;
  emitDecoratorMetadata?: boolean;
}
export interface IRawTypescriptConfig {
  error?: any;
  config?: {
    compilerOptions?: IRawCompilerOptions;
  };
}
