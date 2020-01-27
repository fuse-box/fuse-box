import * as path from 'path';
import { bundleRuntimeCore, ICodeSplittingMap } from '../bundleRuntime/bundleRuntimeCore';
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

export function createBundleRouter(props: IBundleRouteProps) {
  const { ctx, entries } = props;
  const ict = ctx.ict;
  const outputConfig = ctx.outputConfig;
  const hasVendorConfig = !!outputConfig.vendor;
  const bundles: Array<Bundle> = [];
  const splitFileNames: Array<string> = [];
  const codeSplittingMap: ICodeSplittingMap = {
    e: {},
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
      priority: 2,
      type: BundleType.JS_APP,
    });
    bundles.push(mainBundle);
  }

  function createVendorBundle() {
    vendorBundle = createBundle({
      bundleConfig: outputConfig.vendor,
      ctx: ctx,
      priority: 1,
      type: BundleType.JS_VENDOR,
    });
    bundles.push(vendorBundle);
  }

  function dispatch(bundle: Bundle, module: IModule) {
    if (!module.isCached) {
      ict.sync('bundle_resolve_module', { module: module });
    }
    bundle.source.modules.push(module);
  }

  function createRuntimeCore(): string {
    return bundleRuntimeCore({
      codeSplittingMap: codeSplittingMap,
      interopRequireDefault: ctx.compilerOptions.esModuleInterop,
      isIsolated: false,
      target: ctx.config.target,
    });
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
          type: BundleType.JS_SPLIT,
          webIndexed: false,
        });
        for (const module of modules) dispatch(splitBundle, module);

        const bundleConfig = splitBundle.prepare();
        // update a json object with entry for the API
        codeSplittingMap.e[entry.id] = {
          b: bundleConfig.relativePath,
        };
        bundles.push(splitBundle);
      }
    },
    writeBundles: async () => {
      const bundleAmount = bundles.length;
      let index = 0;

      let apiInserted = false;

      const writers = [];
      while (index < bundleAmount) {
        const bundle = bundles[index];
        if (bundle.webIndexed && !apiInserted) {
          apiInserted = true;
          writers.push(bundle.generate({ runtimeCore: createRuntimeCore() }));
        } else writers.push(bundle.generate());
        index++;
      }

      return await Promise.all(writers);
    },
  };

  return self;
}
