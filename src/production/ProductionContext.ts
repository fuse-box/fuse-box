import { IModule } from '../ModuleResolver/Module';
import { Context } from '../core/Context';
import { ModuleTree } from './module/ModuleTree';
import { SplitEntries, ISplitEntries } from './module/SplitEntries';

export function ProductionContext(ctx: Context, modules: Array<IModule>): IProductionContext {
  const productionContext: IProductionContext = {
    ctx,
    modules: [],
  };

  productionContext.splitEntries = SplitEntries(productionContext);

  for (const module of modules) {
    module.moduleTree = ModuleTree({ module, productionContext });
    productionContext.modules.push(module);
  }

  return productionContext;
}

export interface IProductionContext {
  ctx: Context;
  modules: Array<IModule>;
  splitEntries?: ISplitEntries;
}
