import { IBundleWriteResponse } from '../bundle/Bundle';
import { Context } from '../core/Context';
import { IBundleContext } from '../module-resolver/BundleContext';
import { IModule } from '../module-resolver/Module';

export interface InterceptorEvents {
  bundle_resolve_module: { module: IModule };
  module_init?: { bundleContext?: IBundleContext; module: IModule };

  before_webindex_write?: {
    bundles: Array<IBundleWriteResponse>;
    cssTags: Array<string>;
    fileContents: string;
    filePath: string;
    scriptTags: Array<string>;
  };

  complete: {
    bundles: Array<IBundleWriteResponse>;
    ctx: Context;
  };
  rebundle_complete: {
    bundles: Array<IBundleWriteResponse>;
    ctx: Context;
    file: string;
  };
}
