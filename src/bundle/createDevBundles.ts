import { Context } from '../core/Context';
import { getDevelopmentApi } from '../core/env';
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
  pkg.externalPackages.forEach(extPackage => {
    if (!extPackage.isFlat) {
      customVersions[extPackage.props.meta.name] = extPackage.props.meta.version;
    }
  });

  const concat = createConcat(true, '', '\n');
  concat.add(null, devStrings.openPackage(packageName, customVersions));

  pkg.modules.forEach(_module => {
    if (_module.isCached) {
      concat.add(null, _module.cache.contents, _module.cache.sourceMap);
    } else {
      const fileConcat = createConcat(true, '', '\n');
      fileConcat.add(null, devStrings.openFile(_module.props.fuseBoxPath));
      const data = _module.generate();
      fileConcat.add(null, data.contents, data.sourceMap);
      fileConcat.add(null, devStrings.closeFile());
      concat.add(null, fileConcat.content, fileConcat.sourceMap);
      ctx.ict.sync('after_dev_module_inflate', { concat: fileConcat, ctx, module: _module });
    }
  });
  concat.add(null, devStrings.closePackage(pkg.entry && pkg.entry.props.fuseBoxPath));
  return concat;
}

export function inflateBundle(ctx: Context, bundle: Bundle) {
  bundle.packages.forEach(pkg => {
    if (pkg.isCached) {
      bundle.addContent(pkg.cache.contents, pkg.cache.sourceMap);
    } else {
      const concat = inflatePackage(ctx, pkg);
      bundle.addContent(concat.content.toString(), concat.sourceMap);
      ctx.ict.sync('after_dev_package_inflate', { ctx, concat, pkg: pkg });

      if (bundle.props.type === BundleType.PROJECT_JS) {
        injectSettingsIntoDefaultBundle(ctx, bundle);
      }
    }
  });
}

export function inflateBundles(ctx: Context, bundles: { [key: string]: Bundle }) {
  for (const key in bundles) {
    inflateBundle(ctx, bundles[key]);
  }
}

export function createDevBundles(
  ctx: Context,
  packages: Array<Package>,
): {
  bundles: BundleCollection;
} {
  const bundleSet = createBundleSet(ctx);
  const devBundle = bundleSet.getBundle(BundleType.DEV);

  // add dev api
  devBundle.addContent(getDevelopmentApi());
  injectSettingIntoDevBundle(ctx, devBundle);

  packages.forEach(pkg => {
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
  });
  return {
    bundles: bundleSet.collection,
  };
}
