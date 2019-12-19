import { Module } from '../core/Module';
import { ASTNode } from '../compiler/interfaces/AST';
import { ProductionContext } from './ProductionContext';

export function DynamicImport(module: Module, node: ASTNode) {}
export type IDynamicImport = ReturnType<typeof DynamicImport>;

export function DynamicImports(productionContext: ProductionContext, module: Module) {
  const collection: Array<IDynamicImport> = [];
  return {
    isReferencedByModule: (target: Module) => {},
    hasModules: () => collection.length > 0,
    register: (node: ASTNode) => collection.push(DynamicImport(module, node)),
  };
}

export type IDynamicImports = ReturnType<typeof DynamicImports>;

export function ModuleMeta(productionContext: ProductionContext, module: Module) {
  return {
    dynamicImports: DynamicImports(productionContext, module),
  };
}

export type IModuleMeta = ReturnType<typeof ModuleMeta>;

// example
const a: any = {};
const b: any = {};

const meta = ModuleMeta(a, b);
// meta.dynamicImports.register( node )
