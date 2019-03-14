import { Context } from '../core/__Context';
import { Package } from '../core/Package';
import { Module } from '../core/Module';

async function processModule(module: Module) {
  const ctx = module.props.ctx;
  const ict = ctx.interceptor;

  if (module.isExecutable()) {
    if (module.isTypescriptModule()) {
      ict.sync('bundle_resolve_typescript_module', { module: module });
    } else {
      ict.sync('bundle_resolve_js_module', { module: module });
    }
  }
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
export async function processModules(props: IBundleResolveProps) {
  const ctx = props.ctx;
  const packages = props.packages;
  if (props.plugins) {
    props.plugins.forEach(plugin => plugin(ctx));
  }
  const ict = ctx.interceptor;
  ict.sync('bundle_resolve_start', { ctx, packages });
  for (const pkg of props.packages) {
    if (!pkg.isCached) {
      await processPackage(pkg);
    }
  }
  await ict.resolve();
  ict.sync('bundle_resolve_end', { ctx, packages });
}
