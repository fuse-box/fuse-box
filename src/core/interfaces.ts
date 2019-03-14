import { Context } from './Context';

export interface IConfig {
  root?: string;
  target?: 'browser' | 'server' | 'electron' | 'universal';
  homeDir?: string;
  output?: string;
  modules?: Array<string>;
  sourceMap?:
    | {
        vendor: boolean;
        project: boolean;
        css: boolean;
      }
    | boolean;
  plugins?: Array<(ctx: Context) => void>;
  alias?: { [key: string]: string };

  // read only
  defaultCollectionName?: string;

  // normalised options
  options?: {
    vendorSourceMap: boolean;
    projectSourceMap: boolean;
    cssSourceMap: boolean;
  };
}
