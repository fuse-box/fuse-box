export type ITypeScriptPaths = { [key: string]: Array<string> };

export interface ICompilerOptions {
  baseUrl?: string;
  emitDecoratorMetadata?: boolean;
  experimentalDecorators?: boolean;
  isBrowser: string;
  isServer: string;
  paths?: ITypeScriptPaths;
  target: string;
  tsConfig: string;
}

export interface IPrivateCompilerOptions {
  basePath?: string;
  emitDecoratorMetadata?: boolean;
  experimentalDecorators?: boolean;
  paths?: ITypeScriptPaths;
  target: string;
}

export interface IRawCompilerOptions {
  baseUrl?: string;
  emitDecoratorMetadata?: boolean;
  experimentalDecorators?: boolean;
  jsx?: string;
  jsxFactory?: string;
  paths?: ITypeScriptPaths;
}

export interface IRawTypescriptConfig {
  error?: any;

  config?: {
    compilerOptions?: IRawCompilerOptions;
    extends?: string;
  };
}
