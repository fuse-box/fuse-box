import { ITransformer } from '../program/transpileModule';
import { IVisit, IVisitorMod } from '../Visitor/Visitor';

export function CommonTSfeaturesTransformer(): ITransformer {
  return (visit: IVisit): IVisitorMod => {
    const { node } = visit;

    if (node.declare) {
      return { removeNode: true, ignoreChildren: true };
    }

    switch (node.type) {
      case 'ParameterProperty':
        return { replaceWith: node.parameter };
      case 'AbstractMethodDefinition':
      case 'InterfaceDeclaration':
        return { removeNode: true, ignoreChildren: true };
      case 'ExportNamedDeclaration':
        const decl = node.declaration;
        if (decl) {
          if (decl.declare || decl.type === 'InterfaceDeclaration') {
            return { removeNode: true, ignoreChildren: true };
          }
        }
        break;
    }
  };
}
