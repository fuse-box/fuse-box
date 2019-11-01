import { ITransformer } from '../../program/transpileModule';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';

const FUNC_EXPRESSIONS = { FunctionExpression: 1, FunctionDeclaration: 1 };
// to test: function maybeUnwrapEmpty<T>(value: T[]): T[];
// to test: (oi as any).foo
export function CommonTSfeaturesTransformer(): ITransformer {
  return {
    onTopLevelTraverse: (visit: IVisit): IVisitorMod => {
      if (visit.node.declare) {
        return { removeNode: true, ignoreChildren: true };
      }
    },
    onEachNode: (visit: IVisit): IVisitorMod => {
      const { node, parent, property } = visit;

      // handle "this" typings
      // e.g function hey(this: number, a) {}
      if (
        parent &&
        property === 'params' &&
        FUNC_EXPRESSIONS[parent.type] &&
        node.type === 'Identifier' &&
        node.name === 'this'
      ) {
        return { removeNode: true };
      }

      if (node.declare) {
        return { removeNode: true, ignoreChildren: true };
      }

      if (node.type === 'TypeAssertion' || node.type === 'NonNullExpression') {
        return { replaceWith: node.expression };
      }

      if (node.type === 'MethodDefinition' && node.value && node.value.type === 'EmptyBodyFunctionExpression') {
        return { removeNode: true };
      }
      switch (node.type) {
        case 'ParameterProperty':
          return { replaceWith: node.parameter };
        case 'AsExpression':
          return { replaceWith: node.expression };
        case 'DeclareFunction':
        case 'TypeAliasDeclaration':
        case 'AbstractMethodDefinition':
        case 'InterfaceDeclaration':
        case 'ClassProperty':
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
    },
  };
}
