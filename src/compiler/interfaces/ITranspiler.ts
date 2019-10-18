import { ITarget } from '../../config/PrivateConfig';
import { ITransformer } from '../program/transpileModule';
import { Module } from '../../core/Module';
export interface ITranspiler {
  module?: Module;
  transformers?: Array<(opts: any) => ITransformer>;
  ast: any;
  target: ITarget;
  moduleFileName?: string;
  env: { [key: string]: string };
  isBrowser: boolean;
  isServer: boolean;
  emitDecoratorMetadata?: boolean;
}
