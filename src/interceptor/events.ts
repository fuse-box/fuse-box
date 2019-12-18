import { Bundle, IBundleWriteResponse } from '../bundle/Bundle';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Package } from '../core/Package';
import { IAssembleContext } from '../core/assemble_context';
import { OnWatcherProps } from '../main/attach_watcher';
import { Concat } from '../utils/utils';
import { WatcherAction } from '../watcher/watcher';

export interface ISoftReload {
  FTL: boolean;
  filePath: string;
  timeStart: [number, number];
  watcherProps: OnWatcherProps;
}
export interface InterceptorEvents {
  assemble_after_transpile?: { module: Module };
  assemble_before_transpile?: { module: Module };
  assemble_module?: { module: Module };
  assemble_module_complete?: { module: Module };
  assemble_module_ftl_init?: { module: Module };
  assemble_module_init?: { module: Module };
  test?: { foo: string };

  before_webindex_write?: {
    bundles: Array<IBundleWriteResponse>;
    cssTags: Array<string>;
    fileContents: string;
    filePath: string;
    scriptTags: Array<string>;
  };

  after_bundle_write: { bundle: Bundle };
  assemble_package_from_project: {
    assembleContext: IAssembleContext;
    pkg: Package;
    userModules: Array<Module>;
  };
  before_bundle_write: { bundle: Bundle };
  bundle_resolve_end: { ctx: Context; packages: Array<Package> };
  bundle_resolve_js_module: { module: Module };
  bundle_resolve_module: { module: Module };
  bundle_resolve_start: { ctx: Context; packages: Array<Package> };
  bundle_resolve_typescript_module: { module: Module };
  soft_relod: { info: ISoftReload };

  // after we've done creating a full package string
  // Concat will have content and sourceMap
  after_dev_module_inflate: { concat: Concat; ctx: Context; module: Module };
  after_dev_package_inflate: { concat: Concat; ctx: Context; pkg: Package };
  complete: {
    bundles: Array<IBundleWriteResponse>;
    ctx: Context;
    packages?: Array<Package>;
  };
  rebundle_complete: {
    bundles: Array<IBundleWriteResponse>;
    ctx: Context;
    file: string;
    packages: Array<Package>;
    watcherAction: WatcherAction;
  };
}
