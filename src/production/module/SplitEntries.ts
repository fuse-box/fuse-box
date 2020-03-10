import { IModule } from '../../moduleResolver/module';
import { IProductionContext } from '../ProductionContext';
import { IImport } from './ImportReference';
import { ModuleType } from './ModuleTree';

export interface ISplitEntry {
  entry: IModule;
  modules: Array<IModule>;
  references: Array<IImport>;
}

export interface ISplitEntryProps {
  module: IModule;
  productionContext: IProductionContext;
  subModules: Array<IModule>;
}

export function createSplitEntry(props: ISplitEntryProps): ISplitEntry {
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
  register: (splitEntry: ISplitEntry) => void;
}

export function createSplitEntries(): ISplitEntries {
  const entries: Array<ISplitEntry> = [];
  const ids: Record<number, boolean> = {};

  return {
    entries,
    ids,
    register: function (splitEntry: ISplitEntry): void {
      entries.push(splitEntry);
    },
  };
}
