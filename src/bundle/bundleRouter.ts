import * as path from 'path';
import { Context } from '../core/context';
import { IModule } from '../moduleResolver/module';
import { PackageType } from '../moduleResolver/package';
import { ISplitEntry } from '../production/module/SplitEntries';
import { beautifyBundleName } from '../utils/utils';
import { Bundle, BundleType, createBundle, IBundleWriteResponse } from './bundle';

export interface IBundleRouter {
  generateBundles: (modules: Array<IModule>) => void;
  generateSplitBundles: (entries: Array<ISplitEntry>) => void;
  writeBundles: () => Promise<Array<IBundleWriteResponse>>;
}

export interface IBundleRouteProps {
  ctx: Context;
  entries: Array<IModule>;
}

export type ICodeSplittingMap = {
  entries: Record<number, { bundlePath: string }>;
};

export function createBundleRouter(props: IBundleRouteProps) {
  const { ctx, entries } = props;
  const ict = ctx.ict;
  const outputConfig = ctx.outputConfig;
  const hasVendorConfig = !!outputConfig.vendor;
  const bundles: Array<Bundle> = [];
  const splitFileNames: Array<string> = [];
  const codeSplittingMapping = {
    entries: {},
    // resolveConfig: {},
  };
  let mainBundle: Bundle;
  let vendorBundle: Bundle;

  function generateSplitFileName(relativePath: string): string {
    const paths = relativePath.split(path.sep).reverse();
    let fileName = beautifyBundleName(paths.shift());
    while (splitFileNames[fileName]) {
      fileName = beautifyBundleName(paths.shift() + path.sep + fileName);
    }
    splitFileNames.push(fileName);
    return fileName;
  }

  function createMainBundle() {
    mainBundle = createBundle({
      bundleConfig: outputConfig.app,
      ctx: ctx,
      entries,
      includeAPI: true,
      priority: 2,
      type: BundleType.JS_APP,
    });
  }

  function createVendorBundle() {
    vendorBundle = createBundle({
      bundleConfig: outputConfig.vendor,
      ctx: ctx,
      includeAPI: false,
      priority: 1,
      type: BundleType.JS_VENDOR,
    });
  }

  function dispatch(bundle: Bundle, module: IModule) {
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
        const { entry, modules } = splitEntry;
        const fileName = generateSplitFileName(entry.publicPath);
        // @todo: improve the codeSplitting config
        const splitBundle = createBundle({
          bundleConfig: {
            path: outputConfig.codeSplitting.path,
          },
          ctx,
          fileName,
          includeAPI: false,
          type: BundleType.JS_SPLIT,
          webIndexed: false,
        });
        for (const module of modules) {
          dispatch(splitBundle, module);
        }
        const bundleConfig = splitBundle.prepare();
        codeSplittingMapping.entries[entry.id] = {
          bundlePath: bundleConfig.relativePath,
        };
        bundles.push(splitBundle);
      }
    },
    writeBundles: async () => {
      let output = [];
      if (Object.keys(codeSplittingMapping.entries).length > 0) {
        mainBundle.addCodeSplittingMap(codeSplittingMapping);
      }
      await Promise.all([mainBundle.generate(), vendorBundle.generate(), ...bundles.map(bundle => bundle.generate())])
        .then(bundleResponses => {
          for (const response of bundleResponses) {
            output = output.concat(response);
          }
        })
        .catch(e => {
          console.log('do something with ', e);
        });
      return output;
    },
  };

  return self;
}
