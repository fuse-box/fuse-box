import { ISchema } from '../../../src/compiler/core/nodeSchema';
import { ITransformer } from '../../../src/compiler/interfaces/ITransformer';

function onEach(schema: ISchema) {
  const { node, replace } = schema;
  if (node.name === 'foo') {
    return replace({ name: 'bar', type: 'Identifier' });
  }
}

export default function MyAwesomeTransformer(myOptions): ITransformer {
  console.log(myOptions);
  return {
    commonVisitors: props => ({
      onEach: onEach,
    }),
  };
}
