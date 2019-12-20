import { ASTNode } from '../../compiler/interfaces/AST';
import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';
import { IVisit } from '../../compiler/Visitor/Visitor';

export function DynamicImport(module: Module, visit: IVisit) {}
export type IDynamicImport = ReturnType<typeof DynamicImport>;

export function DynamicImports(productionContext: IProductionContext, module: Module) {
  const collection: Array<IDynamicImport> = [];
  return {
    isReferencedByModule: (target: Module) => {},
    hasModules: () => collection.length > 0,
    register: (visit: IVisit) => collection.push(DynamicImport(module, visit)),
  };
}

export type IDynamicImports = ReturnType<typeof DynamicImports>;

export function ExternalReferences(productionContext: IProductionContext, module: Module) {
  return {
    add: (target: Module, node: ASTNode) => {},
    contains: (target: Module) => false,
  };
}

export function ModuleTree(productionContext: IProductionContext, module: Module) {
  return {
    externalReferences: ExternalReferences(productionContext, module),
    dynamicImports: DynamicImports(productionContext, module),
  };
}

export type IModuleTree = ReturnType<typeof ModuleTree>;
