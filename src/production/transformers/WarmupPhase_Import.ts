import { IVisit, IVisitorMod } from '../../compiler/Visitor/Visitor';
import { getDynamicImport } from '../../compiler/helpers/importHelpers';
import { ASTNode, ASTType } from '../../compiler/interfaces/AST';
import { ITransformer } from '../../compiler/interfaces/ITransformer';

const NODES_OF_INTEREST = {
  [ASTType.ExportAllDeclaration]: 1,
  [ASTType.ExportNamedDeclaration]: 1,
  [ASTType.ImportDeclaration]: 1,
  [ASTType.ImportEqualsDeclaration]: 1,
};

export function Phase_1_ImportLink(): ITransformer {
  return {
    productionWarmupPhase: ({ module, productionContext }) => {
      const tree = module.moduleTree;
      const refs = module.moduleSourceRefs || {};

      function isEligibleRequire(node): boolean {
        return (
          node.type === ASTType.CallExpression &&
          node.callee.name === 'require' &&
          node.arguments.length === 1 &&
          node.arguments[0].type === 'Literal' &&
          !!refs[node.arguments[0].value]
        );
      }

      function isEligibleImportOrExport(node): boolean {
        return (
          !!NODES_OF_INTEREST[node.type] &&
          ((!!node.source && !!refs[node.source.value]) ||
            (!!node.moduleReference && !!refs[node.moduleReference.expression.value]))
        );
      }

      function isEligibleDynamicImport(node): boolean {
        const dynamicImport = getDynamicImport(node);
        return !!dynamicImport && !!dynamicImport.source && !!refs[dynamicImport.source];
      }

      function shouldStyleImportRemove(node: ASTNode) {
        if (node.type === ASTType.ImportDeclaration && node.specifiers.length === 0) {
          const target = refs[node.source.value];
          return target && target.isStylesheet;
        }
      }

      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          if (!visit.parent || visit.parent.type === ASTType.Program) {
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
            // we don't need the references in the code
            // those will become real css files
            // however, tracking should happen above (for css code splitting)
            if (shouldStyleImportRemove(node)) return { removeNode: true };
          }
        },
      };
    },
  };
}
