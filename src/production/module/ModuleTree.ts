import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';
import { ExportReferences, IExportReferences } from './ExportReference';
import { ImportReferences, IImport, IImportReferences } from './ImportReference';

export function ModuleTree(productionContext: IProductionContext, module: Module) {
  const dependants: Array<IImport> = [];
  const exportReferences: IExportReferences = ExportReferences(productionContext, module);
  const importReferences: IImportReferences = ImportReferences(productionContext, module);

  return {
    dependants,
    exportReferences,
    importReferences,
  };
}

export type IModuleTree = ReturnType<typeof ModuleTree>;
