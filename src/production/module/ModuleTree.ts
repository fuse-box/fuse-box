import { IVisit } from '../../compiler/Visitor/Visitor';
import { ASTNode } from '../../compiler/interfaces/AST';
import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';
import { ExportReferences, IExportReferences } from './ExportReference';
import { ImportReferences, IImportReference } from './ImportReference';

export function ModuleTree(productionContext: IProductionContext, module: Module) {
  const importReferences: IImportReference = ImportReferences(productionContext, module);
  const exportReferences: IExportReferences = ExportReferences(productionContext, module);

  return {
    exportReferences,
    importReferences,
  };
}

export type IModuleTree = ReturnType<typeof ModuleTree>;
