import { Context } from '../core/Context';
import { getDevelopmentApi, openDevelopmentApi, closeDevelopmentApi } from '../env';
import { Package } from '../core/Package';
import { Bundle, BundleCollection, BundleType, createBundleSet } from './Bundle';
import { devStrings } from './bundleStrings';
import { createConcat, Concat } from '../utils/utils';

/**
 * Adding global settings like allowSyntheticDefaultImports and targets
 * @param ctx
 * @param bundle
 */
export function injectSettingIntoDevBundle(ctx: Context, bundle: Bundle) {
  if (ctx.config.allowSyntheticDefaultImports) {
    bundle.addContent(devStrings.allowSyntheticDefaultImports());
  }

  if (ctx.config.hmr.enabled && ctx.config.hmr.hmrProps.reloadEntryOnStylesheet) {
    bundle.addContent(devStrings.reloadEntryOnStylesheet(true));
  }

  bundle.addContent(devStrings.processEnv(ctx.config.env));
  bundle.addContent(devStrings.target(ctx.config.target || 'server'));
}

/**
 * Inject data into a default module
 * @param ctx
 * @param bundle
 */
export function injectSettingsIntoDefaultBundle(ctx: Context, bundle: Bundle) {
  const defaultPackage = bundle.packages[0];
  if (defaultPackage.entry) {
    bundle.addContent(devStrings.setEntry(`default/${defaultPackage.entry.props.fuseBoxPath}`));
  }
}

export function inflatePackage(ctx: Context, pkg: Package): Concat {
  let packageName = pkg.getPublicName();
  const customVersions = {};
  for (const extPackage of pkg.externalPackages) {
    if (!extPackage.isFlat) {
      customVersions[extPackage.props.meta.name] = extPackage.props.meta.version;
    }
  }

  const concat = createConcat(true, '', '\n');
  concat.add(null, devStrings.openPackage(packageName, customVersions));

  for (const _module of pkg.modules) {
    if (_module.isCached) {
      concat.add(null, _module.cache.contents, _module.isExecutable() ? _module.cache.sourceMap : undefined);
    } else {
      if (_module.contents === undefined) {
        ctx.log.error('$pkg/$path has not been processed by any plugins', {
          pkg: _module.pkg.getPublicName(),
          path: _module.props.fuseBoxPath,
        });
      } else {
        const fileConcat = createConcat(true, '', '\n');
        fileConcat.add(null, devStrings.openFile(_module.props.fuseBoxPath));
        const data = _module.generate();

        fileConcat.add(null, data.contents, _module.isExecutable() ? data.sourceMap : undefined);
        fileConcat.add(null, devStrings.closeFile());
        concat.add(null, fileConcat.content, fileConcat.sourceMap);
        ctx.ict.sync('after_dev_module_inflate', {
          concat: fileConcat,
          ctx,
          module: _module,
        });
      }
    }
  }

  concat.add(null, devStrings.closePackage(pkg.entry && pkg.entry.props.fuseBoxPath));
  return concat;
}

export function inflateBundle(ctx: Context, bundle: Bundle) {
  for (const pkg of bundle.packages) {
    if (pkg.isCached) {
      bundle.addContent(pkg.cache.contents, pkg.cache.sourceMap);
    } else {
      const concat = inflatePackage(ctx, pkg);
      bundle.addContent(concat.content, concat.sourceMap);
      ctx.ict.sync('after_dev_package_inflate', { ctx, concat, pkg: pkg });
    }
  }
  // close developmentAPI for isolated bundles
  if (bundle.isolated) {
    const defaultProject = bundle.packages.find(pkg => pkg.isDefaultPackage);
    if (defaultProject.entry) {
      bundle.addContent(devStrings.setEntry(`default/${defaultProject.entry.props.fuseBoxPath}`));
    }
    bundle.addContent(closeDevelopmentApi());
  }
}

export function inflateBundles(ctx: Context, bundles: { [key: string]: Bundle }) {
  for (const key in bundles) {
    const bundle = bundles[key];
    inflateBundle(ctx, bundle);
  }
}

export function createDevBundles(
  ctx: Context,
  packages: Array<Package>,
): {
  bundles: BundleCollection;
} {
  const useOneBundle = ctx.config.target === 'web-worker' || ctx.config.useSingleBundle;
  const bundleSet = createBundleSet(ctx);
  let devBundle: Bundle;

  if (!useOneBundle) {
    devBundle = bundleSet.getBundle(BundleType.DEV);
    devBundle.addContent(getDevelopmentApi());
    injectSettingIntoDevBundle(ctx, devBundle);
  } else {
    const defaultBundle = bundleSet.getBundle(BundleType.PROJECT_JS);
    defaultBundle.isolated = true;
    defaultBundle.addContent(openDevelopmentApi());
    injectSettingIntoDevBundle(ctx, defaultBundle);
  }

  packages.forEach(pkg => {
    if (useOneBundle) {
      let defaultBundle = bundleSet.getBundle(BundleType.PROJECT_JS);
      defaultBundle.addPackage(pkg);
    } else {
      if (pkg.isDefaultPackage) {
        let defaultBundle = bundleSet.getBundle(BundleType.PROJECT_JS);
        defaultBundle.addPackage(pkg);
      } else {
        // dev packages here
        if (pkg.props.meta.fusebox) {
          if (pkg.props.meta.fusebox.dev) {
            devBundle.addPackage(pkg);
          }
          if (pkg.props.meta.fusebox.system || pkg.props.meta.fusebox.polyfill) {
            const bundle = bundleSet.getBundle(BundleType.VENDOR_JS);
            bundle.addPackage(pkg);
          }
        } else {
          const bundle = bundleSet.getBundle(BundleType.VENDOR_JS);
          bundle.addPackage(pkg);
        }
      }
    }
  });

  inflateBundles(ctx, bundleSet.collection);

  if (!useOneBundle) {
    const defaultProject = packages.find(pkg => pkg.isDefaultPackage);
    if (defaultProject.entry) {
      const targetBundle = bundleSet.getBundle(BundleType.PROJECT_ENTRY);
      targetBundle.addContent(devStrings.setEntry(`default/${defaultProject.entry.props.fuseBoxPath}`));
    }
  }

  return {
    bundles: bundleSet.collection,
  };
}
