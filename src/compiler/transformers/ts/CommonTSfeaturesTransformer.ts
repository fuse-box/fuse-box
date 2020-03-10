import { ITransformer } from '../../interfaces/ITransformer';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { ASTType } from '../../interfaces/AST';

const FUNC_EXPRESSIONS = { FunctionExpression: 1, FunctionDeclaration: 1 };
// to test: function maybeUnwrapEmpty<T>(value: T[]): T[];
// to test: (oi as any).foo

export function CommonTSfeaturesTransformer(): ITransformer {
  return {
    target: { type: 'ts' },
    commonVisitors: props => {
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

          if (node.type === ASTType.TypeAssertion || node.type === ASTType.NonNullExpression) {
            return { replaceWith: node.expression };
          }
          // EmptyBodyFunctionExpression is a specific buntis key
          if (
            node.type === 'MethodDefinition' &&
            node.value &&
            (node.value.type === 'EmptyBodyFunctionExpression' || !node.value.body)
          ) {
            return { removeNode: true };
          }
          switch (node.type) {
            case ASTType.ParameterProperty:
              return { replaceWith: node.parameter };
            case ASTType.AsExpression:
              return { replaceWith: node.expression };
            case ASTType.DeclareFunction:
            case ASTType.TypeAliasDeclaration:
            case ASTType.AbstractMethodDefinition:
            case ASTType.InterfaceDeclaration:
            case ASTType.AbstractClassProperty:
            case 'ClassProperty':
              return { removeNode: true, ignoreChildren: true };
            case 'ExportNamedDeclaration':
              const decl = node.declaration;
              if (decl) {
                if (decl.declare || decl.type === ASTType.InterfaceDeclaration) {
                  return { removeNode: true, ignoreChildren: true };
                }
              }
              break;
          }
        },
      };
    },
  };
}
