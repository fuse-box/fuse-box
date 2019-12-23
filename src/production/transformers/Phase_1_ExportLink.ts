import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { IVisit, IVisitorMod } from '../../compiler/Visitor/Visitor';
import { ExportReferenceType } from '../module/ExportReference';
import { ASTNode } from '../../compiler/interfaces/AST';

const NODES_OF_INTEREST = {
  ExportAllDeclaration: 1,
  ExportNamedDeclaration: 1,
  ExportDefaultDeclaration: 1,
};

const OBJECT_DECLARATIONS = {
  FunctionDeclaration: 1,
  ClassDeclaration: 1,
};
function isObjectDefineLocally(node: ASTNode) {
  if (OBJECT_DECLARATIONS[node.type]) {
    if (node.id) return [{ init: true, name: node.id.name }];
  }
}

export function Phase_1_ExportLink(): ITransformer {
  return {
    productionWarmupPhase: ({ module, productionContext }) => {
      return {
        onTopLevelTraverse: (visit: IVisit) => {
          const { node } = visit;
          const tree = module.moduleTree;
          if (NODES_OF_INTEREST[node.type]) {
            tree.exportReferences.register({ productionContext: productionContext, module: module, visit: visit });
          }
        },
        onEachNode: (visit: IVisit): IVisitorMod => {
          const { node } = visit;
          const tree = module.moduleTree;
          const locals = visit.scope && visit.scope.locals ? visit.scope.locals : {};
          const refs = tree.exportReferences.references;

          // trying to find an object by local ref type
          // fro example:
          // if we had export { foo }
          // we should be able to trace that function foo()
          if (OBJECT_DECLARATIONS[node.type] && node.id && node.id.name) {
            for (const ref of refs) {
              if (ref.type === ExportReferenceType.LOCAL_REFERENCE && ref.local === node.id.name) {
                ref.targetObjectAst = node;
              }
            }
          }

          return;
        },
      };
    },
  };
}
