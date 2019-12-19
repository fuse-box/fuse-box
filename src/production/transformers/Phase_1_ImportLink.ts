import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { IVisit, IVisitorMod } from '../../compiler/Visitor/Visitor';

export enum TreeReferenceType {
  SIDE_EFFECT_IMPORT,
  IMPORT_SPECIFIERS,
  DYNAMIC_IMPORT,
  EXPORT,
}
export function Phase_1_ImportLink(): ITransformer {
  return {
    productionWarmupPhase: ({ ctx, module, productionContext }) => {
      const tree = module.moduleTree;
      return {
        onTopLevelTraverse: (visit: IVisit) => {
          const { node } = visit;
          if (node.type === 'ImportDeclaration') {
            if (node.specifiers.length === 0) {
              tree['stuff'] = true;
              // find module in refs and also add TreeReferenceType
              //tree.externalReferences.add( )
            }
          }
          return;
        },
        onEachNode: (visit: IVisit): IVisitorMod => {
          return;
        },
      };
    },
  };
}
