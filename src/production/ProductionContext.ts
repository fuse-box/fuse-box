import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Package } from '../core/Package';
import { ModuleTree } from './module/ModuleTree';

export function ProductionContext(ctx: Context, packages: Array<Package>) {
  const modules: Array<Module> = [];
  const context = {
    ctx,
    modules
  }

  for (const pkg of packages) {
    for (const module of pkg.modules) {
      module.moduleTree = ModuleTree(context, module);
      context.modules.push(module);
    }
  }

  return context;
}

export type IProductionContext = ReturnType<typeof ProductionContext>;
