import { ISchema } from '../../core/nodeSchema';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';

const FUNC_EXPRESSIONS = { FunctionDeclaration: 1, FunctionExpression: 1 };
// to test: function maybeUnwrapEmpty<T>(value: T[]): T[];
// to test: (oi as any).foo

export function CommonTSfeaturesTransformer(): ITransformer {
  return {
    target: { type: 'ts' },
    commonVisitors: (props) => {
      return {
        onEach: (schema: ISchema) => {
          const { node, parent, property } = schema;

          // handle "this" typings
          // e.g function hey(this: number, a) {}
          if (
            parent &&
            property === 'params' &&
            FUNC_EXPRESSIONS[parent.type] &&
            node.type === 'Identifier' &&
            node.name === 'this'
          ) {
            return schema.remove();
          }

          if (node.declare) {
            return schema.remove();
          }

          if (node.type === ASTType.TypeAssertion || node.type === ASTType.NonNullExpression) {
            return schema.replace([node.expression]);
          }
          // EmptyBodyFunctionExpression is a specific buntis key
          if (
            node.type === 'MethodDefinition' &&
            node.value &&
            (node.value.type === 'EmptyBodyFunctionExpression' || !node.value.body)
          ) {
            return schema.remove();
          }
          switch (node.type) {
            case 'TSExportAssignment':
              const expression: ASTNode = {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '=',
                  left: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'module',
                    },
                    property: {
                      type: 'Identifier',
                      name: 'exports',
                    },
                    computed: false,
                    optional: false,
                  },
                  right: node.expression,
                },
              };
              schema.replace(expression);
              return;
            case 'ClassProperty':
            case ASTType.AbstractClassProperty:
            case ASTType.AbstractMethodDefinition:
            case ASTType.DeclareFunction:
            case ASTType.IndexSignature:
            case ASTType.InterfaceDeclaration:
            case ASTType.TypeAliasDeclaration:
              return schema.remove();
            case 'ExportNamedDeclaration':
              const decl = node.declaration;
              if (decl) {
                if (decl.declare || decl.type === ASTType.InterfaceDeclaration) {
                  return schema.remove();
                }
              }
              break;
            case ASTType.AsExpression:
              return schema.replace([node.expression]);

            case ASTType.ParameterProperty:
              return schema.replace([node.parameter]);
          }
        },
        onProgramBody: (schema: ISchema) => {
          if (schema.node.declare) {
            return schema.remove();
          }
        },
      };
    },
  };
}
