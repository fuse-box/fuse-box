import { ITypescriptPaths } from '../resolver/pathsLookup';

export interface TypescriptConfig {
  compilerOptions: IRawCompilerOptions;
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
