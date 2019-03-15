import { IRawCompilerOptions } from '../interfaces/TypescriptInterfaces';
import { Context } from './Context';

export interface IConfig {
  root?: string;
  target?: 'browser' | 'server' | 'electron' | 'universal';
  homeDir?: string;
  output?: string;
  modules?: Array<string>;
  tsConfig?: string | IRawCompilerOptions;
  entry?: string | Array<string>;
  turboMode?:
    | {
        maxWorkers?: number;
        workerPortsRange?: { start: number; end: number };
        workerPorts?: Array<number>;
      }
    | boolean;
  sourceMap?:
    | {
        vendor?: boolean;
        project?: boolean;
        css?: boolean;
      }
    | boolean;
  plugins?: Array<(ctx: Context) => void>;
  alias?: { [key: string]: string };

  // read only
  defaultCollectionName?: string;

  production?: {};

  // normalised options
  options?: {
    entries?: Array<string>;
    vendorSourceMap?: boolean;
    projectSourceMap?: boolean;
    cssSourceMap?: boolean;
  };
}
