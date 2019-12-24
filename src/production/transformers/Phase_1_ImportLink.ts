import { IVisit, IVisitorMod } from '../../compiler/Visitor/Visitor';
import { ASTNode } from '../../compiler/interfaces/AST';
import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { Module } from '../../core/Module';

const NODES_OF_INTEREST = {
  ImportDeclaration: 1,
  ImportEqualsDeclaration: 1
};

export function Phase_1_ImportLink(): ITransformer {
  return {
    productionWarmupPhase: ({ module, productionContext }) => {
      const tree = module.moduleTree;

      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          return;
        },
        onTopLevelTraverse: (visit: IVisit) => {
          const { node } = visit;
          // @todo, dynamic imports and export from.
          if (
            NODES_OF_INTEREST[node.type] ||
            (node.type === 'CallExpression' && node.callee.name === 'require')
          ) {
            tree.importReferences.register({ module, productionContext, visit });
          }
        }
      };
    }
  };
}
