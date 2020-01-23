import { ICompilerOptions } from '../../compilerOptions/interfaces';

export interface ITranspilerOptions {
  code: string;
  compilerOptions?: ICompilerOptions;
}
