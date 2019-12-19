import { Context } from '../core/Context';
import { Package } from '../core/Package';
import { Module } from '../core/Module';

export function ProductionContext(ctx: Context, packages: Array<Package>) {
  const modules: Array<Module> = [];

  for (const pkg of packages) {
    for (const module of pkg.modules) {
      modules.push(module);
    }
  }
  return {
    modules,
    ctx,
  };
}
export type IProductionContext = ReturnType<typeof ProductionContext>;
