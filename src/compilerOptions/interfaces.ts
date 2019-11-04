export type ITypeScriptPaths = { [key: string]: Array<string> };

export interface ICompilerOptions {
  tsConfig: string;
  baseUrl?: string;
  paths?: ITypeScriptPaths;
  target: string;
  isBrowser: string;
  isServer: string;
  emitDecoratorMetadata?: boolean;
  experimentalDecorators?: boolean;
}

export interface IPrivateCompilerOptions {
  target: string;
  emitDecoratorMetadata?: boolean;
  experimentalDecorators?: boolean;
  basePath?: string;
  paths?: ITypeScriptPaths;
}

export interface IRawCompilerOptions {
  emitDecoratorMetadata?: boolean;
  experimentalDecorators?: boolean;
  baseUrl?: string;
  paths?: ITypeScriptPaths;
  jsxFactory?: string;
  jsx?: string;
}

export interface IRawTypescriptConfig {
  error?: any;

  config?: {
    extends?: string;
    compilerOptions?: IRawCompilerOptions;
  };
}
