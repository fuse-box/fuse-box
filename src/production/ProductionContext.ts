import { IRunResponse } from '../core/IRunResponse';
import { Context } from '../core/context';
import { FuseBoxLogAdapter } from '../fuseLog/FuseBoxLogAdapter';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { ModuleResolver } from '../moduleResolver/moduleResolver';
import { ModuleTree } from './module/ModuleTree';
import { createSplitEntries, ISplitEntries } from './module/SplitEntries';

export interface IProductionContext {
  bundleContext?: IBundleContext;
  ctx: Context;
  entries?: Array<IModule>;
  log?: FuseBoxLogAdapter;
  modules?: Array<IModule>;
  runResponse?: IRunResponse;
  splitEntries?: ISplitEntries;
}

export function createProductionContext(ctx): IProductionContext {
  const { bundleContext, entries, modules } = ModuleResolver(ctx, ctx.config.entries);
  const productionContext: IProductionContext = {
    bundleContext,
    ctx,
    entries,
    log: ctx.log,
    modules,
    splitEntries: createSplitEntries(),
  };

  for (const module of modules) {
    if (module.isExecutable) {
      // reset the contents
      module.contents = undefined;
      module.read();
      module.parse();
    }
    module.moduleTree = ModuleTree({ module, productionContext });
  }

  return productionContext;
}
