import { Context } from '../../core/Context';
import { IModule } from '../../moduleResolver/Module';

export interface IWebWorkerItem {
  absPath: string;
  bundlePath?: string;
}

export interface IWebWorkerProcessProps {
  ctx: Context;
  item?: IWebWorkerItem;
  module: IModule;
}

export interface IWebWorkerProcessProps {
  ctx: Context;
  item?: IWebWorkerItem;
  module: IModule;
}
