import { IBundleWriteResponse } from '../bundle/bundle';
import { IServerProcess } from '../devServer/server';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { ISplitEntries } from '../production/module/SplitEntries';

export interface IRunOnCompleteHandler {
  electron?: IServerProcess;
  server?: IServerProcess;
  onWatch?: (fn: () => void) => void;
}

export interface IRunResponse {
  bundleContext?: IBundleContext;
  bundles: Array<IBundleWriteResponse>;
  entries?: Array<IModule>;
  manifest: string;
  modules?: Array<IModule>;
  splitEntries?: ISplitEntries;
  onComplete: (fn: (props: IRunOnCompleteHandler) => void) => void;
  onWatch?: (fn: (bundles: Array<IBundleWriteResponse>) => void) => void;
}
