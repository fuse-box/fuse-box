import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';
import { IImport } from './ImportReference';
import { ModuleType } from './ModuleTree';

export interface ISplitEntry {
  entry: Module;
  modules: Array<Module>;
  references: Array<IImport>;
}

export interface ISplitEntryProps {
  module: Module;
  productionContext: IProductionContext;
  subModules: Array<Module>;
}

export function SplitEntry(props: ISplitEntryProps): ISplitEntry {
  const { module, subModules } = props;
  module.moduleTree.moduleType = ModuleType.SPLIT_MODULE;

  return {
    entry: module,
    modules: subModules,
    references: module.moduleTree.dependants,
  };
}

export interface ISplitEntries {
  entries: Array<ISplitEntry>;
  ids: Record<number, boolean>;
  addId: (moduleId: number) => void;
  register: (splitEntry: ISplitEntry) => void;
}

export function SplitEntries(productionContext: IProductionContext): ISplitEntries {
  const entries: Array<ISplitEntry> = [];
  const ids: Record<number, boolean> = {};

  return {
    addId: function (moduleId: number): void {
      ids[moduleId] = true;
    },
    entries,
    ids,
    register: function (splitEntry: ISplitEntry): void {
      entries.push(splitEntry);
    }
  }
}
