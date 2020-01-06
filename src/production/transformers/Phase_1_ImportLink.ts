import { IVisit, IVisitorMod } from '../../compiler/Visitor/Visitor';
import { ASTNode } from '../../compiler/interfaces/AST';
import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { Module } from '../../core/Module';

const NODES_OF_INTEREST = {
  ExportAllDeclaration: 1,
  ExportNamedDeclaration: 1,
  ImportDeclaration: 1,
  ImportEqualsDeclaration: 1
};

export function Phase_1_ImportLink(): ITransformer {
  return {
    productionWarmupPhase: ({ module, productionContext }) => {
      const tree = module.moduleTree;
      const refs = module.moduleSourceRefs;

      function isEligibleRequire(node): boolean {
        return (
          node.type === 'CallExpression' &&
          node.callee.name === 'require' &&
          node.arguments.length === 1 &&
          node.arguments[0].type === 'Literal' &&
          refs[node.arguments[0].value]
        );
      }

      function isEligibleImportOrExport(node): boolean {
        return (
          NODES_OF_INTEREST[node.type] &&
          (
            (node.source && refs[node.source.value]) ||
            (node.moduleReference && refs[node.moduleReference.expression.value])
          )
        );
      }

      function isEligibleDynamicImport(node): boolean {
        return (
          node.type === 'ImportExpression' &&
          node.source &&
          refs[node.source.value]
        )
      }

      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          if (visit.parent && visit.parent.type === 'Program') {
            return;
          }

          const { node } = visit;
          if (isEligibleDynamicImport(node) || isEligibleRequire(node)) {
            tree.importReferences.register({ module, productionContext, visit });
          }
        },

        onTopLevelTraverse: (visit: IVisit) => {
          const { node } = visit;
          if (isEligibleImportOrExport(node) || isEligibleRequire(node)) {
            tree.importReferences.register({ module, productionContext, visit });
          }
        }
      };
    }
  };
}
