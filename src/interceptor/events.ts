import { Bundle } from '../bundle/Bundle';
import { IBundleWriteResponse } from '../bundle_new/Bundle';
import { Context } from '../core/Context';
import { OnWatcherProps } from '../main/attach_watcher';
import { IModule } from '../ModuleResolver/Module';
import { WatcherAction } from '../watcher/watcher';
import { IBundleContext } from '../ModuleResolver/BundleContext';

export interface ISoftReload {
  filePath: string;
  timeStart: [number, number];
  FTL: boolean;
  watcherProps: OnWatcherProps;
}
export interface InterceptorEvents {
  test?: { foo: string };

  module_init?: { module: IModule; bundleContext: IBundleContext };
  assemble_module_init?: { module: IModule };
  assemble_module_ftl_init?: { module: IModule };
  assemble_module?: { module: IModule };
  assemble_module_complete?: { module: IModule };
  assemble_before_transpile?: { module: IModule };
  assemble_after_transpile?: { module: IModule };

  before_webindex_write?: {
    filePath: string;
    fileContents: string;
    bundles: Array<IBundleWriteResponse>;
    scriptTags: Array<string>;
    cssTags: Array<string>;
  };

  bundle_resolve_start: { ctx: Context };
  bundle_resolve_end: { ctx: Context };
  bundle_resolve_typescript_module: { module: IModule };
  bundle_resolve_js_module: { module: IModule };
  bundle_resolve_module: { module: IModule };
  before_bundle_write: { bundle: Bundle };
  after_bundle_write: { bundle: Bundle };
  soft_relod: { info: ISoftReload };

  complete: {
    ctx: Context;
    bundles: Array<IBundleWriteResponse>;
  };
  rebundle_complete: {
    ctx: Context;
    watcherAction: WatcherAction;
    bundles: Array<IBundleWriteResponse>;
    file: string;
  };
}
