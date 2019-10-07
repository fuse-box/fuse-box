import { ICompilerOptions } from "./ICompilerOptions";

export interface ITranspilerOptions {
  code: string;
  compilerOptions?: ICompilerOptions;
}
