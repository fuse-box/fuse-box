import { Bundle, IBundleWriteResponse } from '../bundle/Bundle';
import { IAssembleContext } from '../core/assemble_context';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Package } from '../core/Package';
import { OnWatcherProps } from '../main/attach_watcher';
import { Concat } from '../utils/utils';
import { WatcherAction } from '../watcher/watcher';

export interface ISoftReload {
  filePath: string;
  timeStart: [number, number];
  FTL: boolean;
  watcherProps: OnWatcherProps;
}
export interface InterceptorEvents {
  test?: { foo: string };
  assemble_module_init?: { module: Module };
  assemble_module_ftl_init?: { module: Module };
  assemble_module?: { module: Module };
  assemble_fast_analysis?: { module: Module };

  assemble_package_from_project: { pkg: Package; userModules: Array<Module>; assembleContext: IAssembleContext };
  bundle_resolve_start: { ctx: Context; packages: Array<Package> };
  bundle_resolve_end: { ctx: Context; packages: Array<Package> };
  bundle_resolve_typescript_module: { module: Module };
  bundle_resolve_js_module: { module: Module };
  bundle_resolve_module: { module: Module };
  before_bundle_write: { bundle: Bundle };
  after_bundle_write: { bundle: Bundle };
  soft_relod: { info: ISoftReload };

  // after we've done creating a full package string
  // Concat will have content and sourceMap
  after_dev_package_inflate: { ctx: Context; pkg: Package; concat: Concat };
  after_dev_module_inflate: { ctx: Context; module: Module; concat: Concat };
  complete: { ctx: Context; bundles: Array<IBundleWriteResponse>; packages?: Array<Package> };
  rebundle_complete: {
    ctx: Context;
    watcherAction: WatcherAction;
    bundles: Array<IBundleWriteResponse>;
    packages: Array<Package>;
    file: string;
  };
}
