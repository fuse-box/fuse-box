import { Module } from '../core/Module';
import { IProductionContext } from './ProductionContext';
import { ModuleType } from './module/ModuleTree';

export type ISplitEntry = ReturnType<typeof SplitEntry>;
export type ISplitEntries = ReturnType<typeof SplitEntries>;

export function SplitEntry(module: Module) {
  module.moduleTree.moduleType = ModuleType.SPLIT_MODULE;

  return {
    entry: module,
    modules: [],
    references: []
  };
}

export function SplitEntries(ctx: IProductionContext) {
  const entries: Array<ISplitEntry> = [];

  const scope = {
    entries,
    register: function (module: Module) {
      entries.push(SplitEntry(module));
    }
  };

  return scope;
}
