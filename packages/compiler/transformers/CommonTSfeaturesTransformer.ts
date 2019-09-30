import { ITransformer } from '../program/transpileModule';
import { IVisit } from '../Visitor/Visitor';

export function CommonTSfeaturesTransformer(): ITransformer {
  return (visit: IVisit) => {
    const { node } = visit;
    switch (node.type) {
      case 'ParameterProperty':
        return { replaceWith: node.parameter };
      case 'AbstractMethodDefinition':
      case 'InterfaceDeclaration':
        return { removeNode: true };
      case 'ExportNamedDeclaration':
        if (node.declaration && node.declaration.type === 'InterfaceDeclaration') {
          return { removeNode: true };
        }
        break;
    }
  };
}
