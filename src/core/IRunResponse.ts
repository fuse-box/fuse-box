import { IBundleWriteResponse } from '../bundle/bundle';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { ISplitEntries } from '../production/module/SplitEntries';

export interface IRunResponse {
  bundleContext?: IBundleContext;
  bundles: Array<IBundleWriteResponse>;
  entries?: Array<IModule>;
  manifest: string;
  modules?: Array<IModule>;
  splitEntries?: ISplitEntries;
  onComplete: (props: any) => void;
}
