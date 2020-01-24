import { Context } from '../../core/context';
import { IModule } from '../../moduleResolver/module';

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
