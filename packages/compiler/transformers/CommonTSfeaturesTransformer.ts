import { ITransformer } from '../program/transpileModule';
import { IVisit } from '../Visitor/Visitor';

export function CommonTSfeaturesTransformer(): ITransformer {
  return (visit: IVisit) => {
    const { node } = visit;
    switch (node.type) {
      case 'ParameterProperty':
        return { replaceWith: node.parameter };
      case 'AbstractMethodDefinition':
        return { removeNode: true };
    }
  };
}
