import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';
import { IImport } from './ImportReference';
import { ModuleType } from './ModuleTree';

export interface ISplitEntry {
  entry: Module;
  modules: Array<IImport>;
  references: Array<IImport>;
}

export function SplitEntry(productionContext: IProductionContext, module: Module, subModules: Array<IImport>): ISplitEntry {
  module.moduleTree.moduleType = ModuleType.SPLIT_MODULE;

  return {
    entry: module,
    modules: subModules,
    references: module.moduleTree.dependants,
  };
}

export interface ISplitEntries {
  entries: Array<ISplitEntry>;
  register: (module: Module, subModules: Array<IImport>) => void;
}

export function SplitEntries(productionContext: IProductionContext): ISplitEntries {
  const entries: Array<ISplitEntry> = [];

  return {
    entries,
    register: function (module: Module, subModules: Array<IImport>) {
      entries.push(SplitEntry(productionContext, module, subModules));
    },
  };
}
