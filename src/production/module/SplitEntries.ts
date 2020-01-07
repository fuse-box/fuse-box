import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';
import { ModuleType } from './ModuleTree';

export type ISplitEntry = ReturnType<typeof SplitEntry>;
export type ISplitEntries = ReturnType<typeof SplitEntries>;

export function SplitEntry(productionContext: IProductionContext, module: Module) {
  module.moduleTree.moduleType = ModuleType.SPLIT_MODULE;
  // @todo:
  // fill modules

  return {
    entry: module,
    modules: [],
    references: [...module.moduleTree.dependants]
  };
}

export function SplitEntries(productionContext: IProductionContext) {
  const entries: Array<ISplitEntry> = [];

  const scope = {
    entries,
    register: function (module: Module) {
      entries.push(SplitEntry(productionContext, module));
    }
  };

  return scope;
}
