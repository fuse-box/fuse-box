import { ISchema } from '../../../src/compiler/core/nodeSchema';
import { ITransformer } from '../../../src/compiler/interfaces/ITransformer';

function onEach(schema: ISchema) {
  const { node, replace } = schema;
  if (node.name === 'console') {
    //throw new Error('sdf');
    //i++;
    return replace({ name: 'kakka', type: 'Identifier' });
  }
}

export default function MyAwesomeTransformer(myOptions): ITransformer {
  return {
    commonVisitors: props => ({
      onEach: onEach,
    }),
  };
}
