import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { IVisit, IVisitorMod } from '../../compiler/Visitor/Visitor';

export function Phase_1_ExportLink(): ITransformer {
  return {
    productionWarmupPhase: props => {
      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          return;
        },
      };
    },
  };
}
