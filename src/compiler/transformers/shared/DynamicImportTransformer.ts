import { ISchema } from '../../core/nodeSchema';
import { getDynamicImport } from '../../helpers/importHelpers';
import { ASTNode } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { ImportType } from '../../interfaces/ImportType';

export function DynamicImportTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      return {
        onEach: (schema: ISchema) => {
          const { node } = schema;

          const dynamicImport = getDynamicImport(node);
          if (dynamicImport) {
            if (dynamicImport.error) return;

            const requireCallExpression: ASTNode = {
              arguments: [
                {
                  type: 'Literal',
                  value: dynamicImport.source,
                },
              ],
              callee: {
                name: 'require',
                type: 'Identifier',
              },
              type: 'CallExpression',
            };

            if (props.onRequireCallExpression) {
              props.onRequireCallExpression(ImportType.DYNAMIC, requireCallExpression);
            }

            const callExpression: ASTNode = {
              arguments: [
                {
                  async: false,
                  body: requireCallExpression,
                  expression: true,
                  params: [],
                  type: 'ArrowFunctionExpression',
                },
              ],
              callee: {
                computed: false,
                object: {
                  arguments: [],
                  callee: {
                    computed: false,
                    object: {
                      name: 'Promise',
                      type: 'Identifier',
                    },
                    property: {
                      name: 'resolve',
                      type: 'Identifier',
                    },
                    type: 'MemberExpression',
                  },
                  type: 'CallExpression',
                },
                property: {
                  name: 'then',
                  type: 'Identifier',
                },
                type: 'MemberExpression',
              },
              type: 'CallExpression',
            };
            return schema.replace(callExpression);
          }
        },
      };
    },
  };
}
