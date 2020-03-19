import { ISchema } from '../core/nodeSchema';
import { ITransformer } from '../interfaces/ITransformer';

export function SampleTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      return {
        onEach: (visit: ISchema) => {
          return;
        },
      };
    },
  };
}
