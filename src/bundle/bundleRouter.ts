import { Context } from '../core/context';
import { IModule } from '../moduleResolver/module';
import { PackageType } from '../moduleResolver/package';
import { ISplitEntry } from '../production/module/SplitEntries';
import { createBundle, IBundle, IBundleType, IBundleWriteResponse } from './bundle';

export interface IBundleRouter {
  generateBundles: (modules: Array<IModule>) => void;
  generateSplitBundles: (entries: Array<ISplitEntry>) => void;
  writeBundles: () => Promise<Array<IBundleWriteResponse>>;
}

export interface IBundleRouteProps {
  ctx: Context;
  entries: Array<IModule>;
}

export function createBundleRouter(props: IBundleRouteProps) {
  const { ctx, entries } = props;
  const ict = ctx.ict;
  const outputConfig = ctx.outputConfig;
  const hasVendorConfig = !!outputConfig.vendor;
  const bundles: Array<IBundle> = [];
  let mainBundle: IBundle;
  let vendorBundle: IBundle;

  function createMainBundle() {
    mainBundle = createBundle({
      bundleConfig: outputConfig.app,
      ctx: ctx,
      entries,
      includeAPI: true,
      priority: 2,
      type: IBundleType.JS_APP,
    });
    bundles.push(mainBundle);
  }

  function createVendorBundle() {
    vendorBundle = createBundle({
      bundleConfig: outputConfig.vendor,
      ctx: ctx,
      includeAPI: false,
      priority: 1,
      type: IBundleType.JS_VENDOR,
    });
    bundles.push(vendorBundle);
  }

  function dispatch(bundle: IBundle, module: IModule) {
    if (!module.isCached) {
      ict.sync('bundle_resolve_module', { module: module });
    }
    bundle.source.modules.push(module);
  }

  const self: IBundleRouter = {
    generateBundles: (modules: Array<IModule>) => {
      for (const module of modules) {
        // we skip this module
        if (module.isSplit) {
          continue;
        } else if (module.pkg.type === PackageType.EXTERNAL_PACKAGE && hasVendorConfig) {
          if (!vendorBundle) createVendorBundle();
          dispatch(vendorBundle, module);
        } else {
          if (!mainBundle) createMainBundle();
          dispatch(mainBundle, module);
        }
      }
    },
    generateSplitBundles: (entries: Array<ISplitEntry>) => {
      for (const splitEntry of entries) {
        const splitBundle = createBundle({
          bundleConfig: {
            path: outputConfig.codeSplitting.path,
          },
          ctx: ctx,
          includeAPI: false,
          type: IBundleType.JS_SPLIT,
          webIndexed: false,
        });
        for (const module of splitEntry.modules) {
          dispatch(splitBundle, module);
        }
        bundles.push(splitBundle);
      }
    },
    writeBundles: async () => {
      let output = [];
      await Promise.all(
        bundles.map(bundle => bundle.generate())
      ).then(bundleOutputs => {
        for (const response of bundleOutputs) {
          output = output.concat(response);
        }
      }).catch(e => {
        console.log('do something with ', e);
      });
      return output;
    }
  };

  return self;
}
