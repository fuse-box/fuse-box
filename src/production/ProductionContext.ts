import { Context } from '../core/context';
import { IModule } from '../moduleResolver/module';
import { ModuleResolver } from '../moduleResolver/moduleResolver';
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
    splitEntries: createSplitEntries(),
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
