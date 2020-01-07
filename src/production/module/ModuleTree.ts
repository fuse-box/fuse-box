import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';
import { ExportReferences, IExportReferences } from './ExportReference';
import { ImportReferences, IImport, IImportReferences } from './ImportReference';

export enum ModuleType {
  MAIN_MODULE,
  SPLIT_MODULE
};

export function ModuleTree(productionContext: IProductionContext, module: Module) {
  const dependants: Array<IImport> = [];
  const exportReferences: IExportReferences = ExportReferences(productionContext, module);
  const importReferences: IImportReferences = ImportReferences(productionContext, module);

  return {
    dependants,
    exportReferences,
    importReferences,
    moduleType: ModuleType.MAIN_MODULE,
  };
}

export type IModuleTree = ReturnType<typeof ModuleTree>;
