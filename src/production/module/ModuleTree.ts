import { IModule } from '../../moduleResolver/module';
import { IProductionContext } from '../ProductionContext';
import { ExportReferences, IExportReferences } from './ExportReference';
import { ImportReferences, IImport, IImportReferences } from './ImportReference';

export enum ModuleType {
  MAIN_MODULE,
  SPLIT_MODULE,
}

export interface IModuleTree {
  dependants: Array<IImport>;
  exportReferences: IExportReferences;
  importReferences: IImportReferences;
  moduleType: ModuleType;
}

export interface IModuleTreeProps {
  module: IModule;
  productionContext: IProductionContext;
}

export function ModuleTree({ module, productionContext }: IModuleTreeProps): IModuleTree {
  const exportReferences: IExportReferences = ExportReferences(productionContext, module);
  const importReferences: IImportReferences = ImportReferences(productionContext, module);

  return {
    dependants: [],
    exportReferences,
    importReferences,
    moduleType: ModuleType.MAIN_MODULE,
  };
}
