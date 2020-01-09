import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Package } from '../core/Package';
import { ModuleTree } from './module/ModuleTree';
import { SplitEntries, ISplitEntries } from './module/SplitEntries';

export function ProductionContext(ctx: Context, packages: Array<Package>): IProductionContext {
  let moduleIdentifier = 0;

  const productionContext: IProductionContext = {
    ctx,
    modules: [],
  };

  productionContext.splitEntries = SplitEntries(productionContext);

  for (const pkg of packages) {
    for (const module of pkg.modules) {
      module.moduleTree = ModuleTree({ module, productionContext });
      module.moduleId = moduleIdentifier++;
      productionContext.modules.push(module);
    }
  }

  return productionContext;
}

export interface IProductionContext {
  ctx: Context;
  modules: Array<Module>;
  splitEntries?: ISplitEntries;
}
