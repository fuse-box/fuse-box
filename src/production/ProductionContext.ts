import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Package } from '../core/Package';
import { ModuleTree } from './module/ModuleTree';

export function ProductionContext(ctx: Context, packages: Array<Package>): IProductionContext {
  const modules: Array<Module> = [];

  const productionContext: IProductionContext = {
    ctx,
    modules,
  };

  productionContext.splitEntries = SplitEntries(productionContext);

  for (const pkg of packages) {
    for (const module of pkg.modules) {
      module.moduleTree = ModuleTree(productionContext, module);

      productionContext.modules.push(module);
    }
  }

  return context;
}

export interface IProductionContext {
  ctx: Context;
  modules: Array<Module>;
  splitEntries?: ISplitEntries;
}
