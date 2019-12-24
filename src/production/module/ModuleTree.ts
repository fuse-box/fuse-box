import { IVisit } from '../../compiler/Visitor/Visitor';
import { ASTNode } from '../../compiler/interfaces/AST';
import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';
import { ExportReferences, IExportReferences } from './ExportReference';
import { ImportReferences, IImportReference } from './ImportReference';

// export function DynamicImport(module: Module, visit: IVisit) {}
// export type IDynamicImport = ReturnType<typeof DynamicImport>;

// export function DynamicImports(productionContext: IProductionContext, module: Module) {
//   const collection: Array<IDynamicImport> = [];
//   return {
//     isReferencedByModule: (target: Module) => {},
//     hasModules: () => collection.length > 0,
//     register: (visit: IVisit) => collection.push(DynamicImport(module, visit)),
//   };
// }

// export type IDynamicImports = ReturnType<typeof DynamicImports>;

// export function ExternalReferences(productionContext: IProductionContext, module: Module) {
//   return {
//     add: (target: Module, node: ASTNode) => {},
//     contains: (target: Module) => false,
//   };
// }

export function ModuleTree(productionContext: IProductionContext, module: Module) {
  const importReferences: IImportReference = ImportReferences(productionContext, module);
  const exportReferences: IExportReferences = ExportReferences(productionContext, module);

  return {
    exportReferences,
    importReferences,
    //dynamicImports: DynamicImports(productionContext, module),
  };
}

export type IModuleTree = ReturnType<typeof ModuleTree>;
