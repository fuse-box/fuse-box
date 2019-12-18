import { ITransformer } from '../interfaces/ITransformer';
import { IVisit, IVisitorMod } from '../Visitor/Visitor';

export function SampleTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          return;
        },
      };
    },
  };
}
