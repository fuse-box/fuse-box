import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';
import { IImport } from './ImportReference';
import { ModuleType } from './ModuleTree';

export interface ISplitEntry {
  entry: Module;
  modules: Array<Module>;
  references: Array<IImport>;
}

export function SplitEntry(productionContext: IProductionContext, module: Module): ISplitEntry {
  module.moduleTree.moduleType = ModuleType.SPLIT_MODULE;
  // @todo:
  // fill modules

  return {
    entry: module,
    modules: [],
    references: [...module.moduleTree.dependants],
  };
}

export interface ISplitEntries {
  entries: Array<ISplitEntry>;
  register: (module: Module) => void;
}

export function SplitEntries(productionContext: IProductionContext): ISplitEntries {
  const entries: Array<ISplitEntry> = [];

  return {
    entries,
    register: function(module: Module) {
      entries.push(SplitEntry(productionContext, module));
    },
  };
}
