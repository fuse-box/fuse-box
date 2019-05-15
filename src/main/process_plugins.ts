import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Package } from '../core/Package';

async function processModule(module: Module) {
  const ctx = module.props.ctx;
  const ict = ctx.ict;
  ict.sync('bundle_resolve_module', { module: module });
}
async function processPackage(pkg: Package) {
  for (const module of pkg.modules) {
    if (!module.isCached) {
      await processModule(module);
    }
  }
}

export interface IBundleResolveProps {
  ctx: Context;
  packages: Array<Package>;
  plugins?: Array<(ctx: Context) => void>;
}

export async function pluginProcessPackages(props: { ctx: Context; packages: Array<Package> }) {
  const ctx = props.ctx;
  const ict = ctx.ict;
  ict.sync('bundle_resolve_start', { ctx, packages: props.packages });
  for (const pkg of props.packages) {
    if (!pkg.isCached) {
      await processPackage(pkg);
    }
  }
  await ict.resolve();
  ict.sync('bundle_resolve_end', { ctx, packages: props.packages });
}
export async function processPlugins(props: IBundleResolveProps) {
  const ctx = props.ctx;
  const packages = props.packages;

  await pluginProcessPackages({ ctx, packages });
}
