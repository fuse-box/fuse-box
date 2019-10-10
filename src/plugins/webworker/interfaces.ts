import { Context } from '../../core/Context';
import { Module } from '../../core/Module';

export interface IWebWorkerItem {
  absPath: string;
  bundlePath?: string;
}

export interface IWebWorkerProcessProps {
  ctx: Context;
  module: Module;
  item?: IWebWorkerItem;
}

export interface IWebWorkerProcessProps {
  ctx: Context;
  module: Module;
  item?: IWebWorkerItem;
}
