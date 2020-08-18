import { Bundle, IBundleWriteResponse } from '../bundle/bundle';
import { IRunResponse } from '../core/IRunResponse';
import { Context } from '../core/context';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { ReactionStack } from '../watcher/watcher';

export interface IEventBeforeBundleWrite {
  bundle: Bundle;
}
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

  before_bundle_write: IEventBeforeBundleWrite;
  complete: IRunResponse;
  rebundle_complete: IRunResponse;
  entry_resolve: { module: IModule };
  rebundle: {
    bundles: Array<IBundleWriteResponse>;
  };
  watcher_reaction: { reactionStack: ReactionStack };
}
