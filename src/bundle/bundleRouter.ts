import * as path from 'path';
import { bundleRuntimeCore, ICodeSplittingMap } from '../bundleRuntime/bundleRuntimeCore';
import { Context } from '../core/context';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { PackageType } from '../moduleResolver/package';
import { ISplitEntry } from '../production/module/SplitEntries';
import { beautifyBundleName, writeFile } from '../utils/utils';
import { Bundle, BundleType, createBundle, IBundleWriteResponse } from './bundle';

export interface IBundleRouter {
  generateBundles: (modules: Array<IModule>) => void;
  generateSplitBundles: (entries: Array<ISplitEntry>) => void;
  init: (modules: Array<IModule>) => void;
  writeBundles: () => Promise<Array<IBundleWriteResponse>>;
  writeManifest: (bundles: Array<IBundleWriteResponse>) => Promise<string>;
}

export interface IBundleRouteProps {
  bundleContext?: IBundleContext;
  ctx: Context;
  entries: Array<IModule>;
}

export function createBundleRouter(props: IBundleRouteProps): IBundleRouter {
  const { ctx, entries } = props;
  const ict = ctx.ict;
  const outputConfig = ctx.outputConfig;
  const hasVendorConfig = !!outputConfig.vendor;
  const hasMappings = !!outputConfig.mapping;
  const mappings = hasMappings && outputConfig.mapping.map(m => ({ ...m, regexp: RegExp(m.matching) }));
  const bundles: Array<Bundle> = [];
  const splitFileNames: Array<string> = [];
  const codeSplittingMap: ICodeSplittingMap = {
    b: {},
  };
  let mainBundle: Bundle;
  let cssBundle: Bundle;
  let vendorBundle: Bundle;

  function generateSplitFileName(relativePath: string): string {
    const paths = relativePath.split(path.sep).reverse();
    let fileName = beautifyBundleName(paths.shift());
    while (splitFileNames.indexOf(fileName) !== -1) {
      fileName = beautifyBundleName(paths.shift() + path.sep + fileName);
    }
    splitFileNames.push(fileName);
    return fileName;
  }

  function createCSSBundle(name?: string) {
    cssBundle = createBundle({
      bundleConfig: outputConfig.styles,
      ctx: ctx,
      type: BundleType.CSS_APP,
    });
    bundles.push(cssBundle);
  }

  function createMainBundle() {
    mainBundle = createBundle({
      bundleConfig: outputConfig.app,
      ctx: ctx,
      priority: 1,
      type: BundleType.JS_APP,
    });
    bundles.push(mainBundle);
  }

  function createVendorBundle() {
    vendorBundle = createBundle({
      bundleConfig: outputConfig.vendor,
      ctx: ctx,
      priority: 2,
      type: BundleType.JS_VENDOR,
    });
    bundles.push(vendorBundle);
  }

  function createSubVendorBundle(module, mapping) {
    const bundle = bundles.find(b => b.path === mapping.target.path);
    if (bundle) bundle.source.modules.push(module);
    else {
      const bundle = createBundle({
        bundleConfig: mapping.target,
        ctx: ctx,
        priority: 1,
        type: BundleType.JS_VENDOR,
      });
      bundle.source.modules.push(module);
      bundles.push({ ...bundle, path: mapping.target.path });
    }
  }

  let codeSplittingIncluded = false;

  function createRuntimeCore(): string {
    let typescriptHelpersPath;
    if (ctx.config.productionBuildTarget) typescriptHelpersPath = ctx.config.tsHelpersPath;

    return bundleRuntimeCore({
      codeSplittingMap: codeSplittingIncluded ? codeSplittingMap : undefined,
      includeHMR: ctx.config.hmr.enabled,
      interopRequireDefault: ctx.compilerOptions.esModuleInterop,
      isIsolated: false,
      target: ctx.config.target,

      typescriptHelpersPath: typescriptHelpersPath,
    });
  }

  const self: IBundleRouter = {
    generateBundles: (modules: Array<IModule>) => {
      for (const module of modules) {
        // we skip this module
        if (module.isSplit || module.ignore) {
          continue;
        }
        if (ctx.config.isProduction && ctx.config.supportsStylesheet() && module.css) {
          // special treatement for production styles
          if (module.css.json) {
            // if it's a css module
            if (!mainBundle) createMainBundle();
            mainBundle.source.modules.push(module);
          }
          if (!cssBundle) createCSSBundle();
          cssBundle.source.modules.push(module);
        } else if (module.pkg.type === PackageType.EXTERNAL_PACKAGE && hasVendorConfig) {
          let isMappedBundle = false;
          if (hasMappings) {
            for (const mapping of mappings) {
              if (mapping.regexp.test(module.pkg.publicName)) {
                createSubVendorBundle(module, mapping);
                isMappedBundle = true;
                break;
              }
            }
          }
          if (!isMappedBundle) {
            if (!vendorBundle) createVendorBundle();
            vendorBundle.source.modules.push(module);
          }
        } else {
          if (!mainBundle) createMainBundle();
          mainBundle.source.modules.push(module);
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
            publicPath: outputConfig.codeSplitting.publicPath,
          },
          ctx,
          fileName,
          type: BundleType.JS_SPLIT,
          webIndexed: false,
        });

        let currentCSSBundle: Bundle;

        for (const module of modules) {
          if (ctx.config.isProduction && module.css) {
            if (module.css.json) {
              // if it's a css module
              splitBundle.source.modules.push(module);
            }

            if (!currentCSSBundle) {
              const cssFileName = generateSplitFileName(entry.publicPath.replace(/\.(\w+)$/, '.css'));
              currentCSSBundle = createBundle({
                bundleConfig: {
                  path: outputConfig.styles.codeSplitting.path,
                  publicPath: outputConfig.styles.codeSplitting.publicPath,
                },
                ctx,
                fileName: cssFileName,
                type: BundleType.CSS_SPLIT,
                webIndexed: false,
              });
              bundles.push(currentCSSBundle);
            }
            currentCSSBundle.source.modules.push(module);
          } else {
            splitBundle.source.modules.push(module);
          }
        }

        const bundleConfig = splitBundle.prepare();
        // update a json object with entry for the API
        codeSplittingMap.b[entry.id] = {
          p: bundleConfig.browserPath,
        };
        if (currentCSSBundle) {
          const cssSplitConfig = currentCSSBundle.prepare();
          codeSplittingMap.b[entry.id].s = cssSplitConfig.browserPath;
        }
        codeSplittingIncluded = true;
        bundles.push(splitBundle);
      }
    },
    init: async (modules: Array<IModule>) => {
      for (const m of modules) {
        if (!m.isCached) ict.sync('bundle_resolve_module', { module: m });
      }
      await ict.resolve();
    },
    writeBundles: async () => {
      const bundleAmount = bundles.length;
      let index = 0;

      let apiInserted = false;

      const writers = [];
      let lastWebIndexed: Bundle;

      bundles.sort((a, b) => a.priority - b.priority);

      while (index < bundleAmount) {
        const bundle = bundles[index];
        let writerProps: any = { uglify: ctx.config.uglify };
        if (bundle.webIndexed && !bundle.isCSSType) {
          lastWebIndexed = bundle;
          if (!apiInserted && bundle.priority === 1) {
            apiInserted = true;
            bundle.containsAPI = true;
            writerProps.runtimeCore = createRuntimeCore();
          }
        }

        writers.push(() => bundle.generate(writerProps));
        index++;
      }

      if (lastWebIndexed) {
        lastWebIndexed.containsApplicationEntryCall = true;
        lastWebIndexed.entries = entries;
        lastWebIndexed.exported = outputConfig.exported;
      }
      return await Promise.all(
        writers.map(write => {
          return write();
        }),
      );
    },
    writeManifest: async (bundles: Array<IBundleWriteResponse>): Promise<string> => {
      const manifest = [];
      for (const bundle of bundles) {
        let type: string;
        switch (bundle.bundle.type) {
          case BundleType.CSS_APP:
          case BundleType.CSS_SPLIT:
            type = 'css';
            break;
          case BundleType.JS_APP:
          case BundleType.JS_SERVER_ENTRY:
          case BundleType.JS_SPLIT:
          case BundleType.JS_VENDOR:
          default:
            type = 'js';
            break;
        }
        manifest.push({
          absPath: bundle.absPath,
          browserPath: bundle.browserPath,
          relativePath: bundle.relativePath,
          type,
          webIndexed: bundle.bundle.webIndexed,
        });
      }
      try {
        const manifestFile = path.join(outputConfig.distRoot, `manifest-${ctx.config.target}.json`);
        await writeFile(manifestFile, JSON.stringify(manifest, null, 2));
        return manifestFile;
      } catch (err) {
        return;
      }
    },
  };
  return self;
}
