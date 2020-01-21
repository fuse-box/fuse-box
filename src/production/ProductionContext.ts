import { Context } from '../core/Context';
import { IModule } from '../moduleResolver/Module';
import { ModuleResolver } from '../moduleResolver/ModuleResolver';
import { ModuleTree } from './module/ModuleTree';
import { createSplitEntries, ISplitEntries } from './module/SplitEntries';

export interface IProductionContext {
  ctx: Context;
  entries?: Array<IModule>;
  modules?: Array<IModule>;
  splitEntries?: ISplitEntries;
}

export function createProductionContext(ctx): IProductionContext {
  const { entries, modules } = ModuleResolver(ctx, ctx.config.entries);
  const productionContext: IProductionContext = {
    ctx,
    entries,
    modules,
    splitEntries: createSplitEntries()
  };

  for (const module of modules) {
    if (module.isExecutable) {
      module.read();
      module.parse();
    }
    module.moduleTree = ModuleTree({ module, productionContext });
  }

  return productionContext;
}
