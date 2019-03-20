import { Package } from '../../core/Package';
import { Bundle, createBundle } from '../Bundle';
import { Context } from '../../core/Context';
import { bundleNames } from '../BundleNames';
import { getDevelopmentApi } from '../../core/env';
import { devStrings } from '../bundleStrings';

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
    bundle.addContent(devStrings.setEntry(defaultPackage.entry.props.fuseBoxPath));
    bundle.addContent(devStrings.importFile(defaultPackage.entry.props.fuseBoxPath));
  }
}

export function inflateBundle(ctx: Context, bundle: Bundle) {
  bundle.packages.forEach(pkg => {
    let packageName = pkg.props.meta.name;
    if (!pkg.isFlat) {
      packageName += `@${pkg.props.meta.version}`;
    }
    const customVersions = {};
    pkg.externalPackages.forEach(extPackage => {
      if (!extPackage.isFlat) {
        customVersions[extPackage.props.meta.name] = extPackage.props.meta.version;
      }
    });
    bundle.addContent(devStrings.openPackage(packageName, customVersions));
    pkg.modules.forEach(_module => {
      bundle.addContent(devStrings.openFile(_module.props.fuseBoxPath));
      const data = _module.generate();
      bundle.addContent(data.contents, data.sourcemMap);
      bundle.addContent(devStrings.closeFile());
    });
    bundle.addContent(devStrings.closePackage(pkg.entry && pkg.entry.props.fuseBoxPath));
    if (bundle.props.name === bundleNames.default) {
      injectSettingsIntoDefaultBundle(ctx, bundle);
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
  bundles: { [key: string]: Bundle };
} {
  const devBundle = createBundle({ ctx: ctx, name: bundleNames.dev, priority: 100 });
  const bundles: { [key: string]: Bundle } = {
    [bundleNames.dev]: devBundle,
  };
  // add dev api
  devBundle.addContent(getDevelopmentApi());
  injectSettingIntoDevBundle(ctx, devBundle);

  packages.forEach(pkg => {
    if (pkg.isDefaultPackage) {
      let defaultBundle = bundles[bundleNames.default];
      if (!defaultBundle) {
        defaultBundle = bundles[bundleNames.default] = createBundle({
          ctx: ctx,
          name: bundleNames.default,
          priority: 99,
        });
      }
      defaultBundle.addPackage(pkg);
    } else {
      // dev packages here
      if (pkg.props.meta.fusebox) {
        if (pkg.props.meta.fusebox.dev) {
          const bundle = bundles[bundleNames.dev];
          bundle.addPackage(pkg);
        }

        if (pkg.props.meta.fusebox.system || pkg.props.meta.fusebox.polyfill) {
          let bundle = bundles[bundleNames.system];
          if (!bundle) {
            bundle = bundles[bundleNames.system] = createBundle({ ctx: ctx, name: bundleNames.system, priority: 99 });
          }
          bundle.addPackage(pkg);
        }
      } else {
        let bundle = bundles[bundleNames.vendor];
        if (!bundle) {
          bundle = bundles[bundleNames.vendor] = createBundle({ ctx: ctx, name: bundleNames.vendor, priority: 99 });
        }
        bundle.addPackage(pkg);
      }
    }
  });
  return {
    bundles,
  };
}
