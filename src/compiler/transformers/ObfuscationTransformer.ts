import { ISchema } from '../core/nodeSchema';
import { ITransformer } from '../interfaces/ITransformer';

export function ObfuscationTransformer(): ITransformer {
  return {
    commonVisitors: props => ({
      onEach: (schema: ISchema) => {},
    }),
  };
}
