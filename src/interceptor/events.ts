import { IBundleWriteResponse } from '../bundle/bundle';
import { Context } from '../core/context';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { ReactionStack } from '../watcher/watcher';

export interface InterceptorEvents {
  bundle_resolve_module: { module: IModule };
  init: { ctx: Context };
  module_init?: { bundleContext?: IBundleContext; module: IModule };

  before_webindex_write?: {
    bundles: Array<IBundleWriteResponse>;
    cssTags: Array<string>;
    fileContents: string;
    filePath: string;
    scriptTags: Array<string>;
  };

  watcher_reaction: { reactionStack: ReactionStack };

  complete: {
    bundleContext?: IBundleContext;
    bundles: Array<IBundleWriteResponse>;
    entries?: Array<IModule>;
    modules?: Array<IModule>;
  };
  rebundle: {
    bundles: Array<IBundleWriteResponse>;
  };
  rebundle_complete: {
    bundles: Array<IBundleWriteResponse>;
    file: string;
    entries?: Array<IModule>;
    modules?: Array<IModule>;
  };
}
