import { ISchema } from '../../core/nodeSchema';
import { createExports } from '../../helpers/helpers';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';

export function NamespaceTransformer(): ITransformer {
  return {
    target: { type: 'ts' },
    commonVisitors: props => {
      return {
        onEach: (schema: ISchema) => {
          const { node } = schema;
          if (node.type === ASTType.ModuleDeclaration) {
            return schema.ignore();
          }
        },
        onProgramBody: (schema: ISchema) => {
          let { context, node } = schema;
          if (node.declare) {
            return schema.remove().ignore();
          }
          let withExport = false;

          if (node.type === 'ExportNamedDeclaration') {
            if (node.declaration && node.declaration.type === ASTType.ModuleDeclaration) {
              node = node.declaration;
              withExport = true;
            }
          }

          if (node.type === ASTType.ModuleDeclaration) {
            const nm = node.body as ASTNode;
            const mameSpaceName = node.id.name;
            // launch custom transpilation for that namespace
            // we skip children in onEachNode

            context.fork({ contextOverrides: { moduleExportsName: mameSpaceName }, root: nm });

            //node.body.context =
            const Declaration: ASTNode = {
              declarations: [
                {
                  id: {
                    name: node.id.name,
                    type: 'Identifier',
                  },
                  init: null,
                  type: 'VariableDeclarator',
                },
              ],
              kind: 'var',
              type: 'VariableDeclaration',
            };

            const FunctionBody: ASTNode = {
              expression: {
                arguments: [
                  {
                    left: {
                      name: mameSpaceName,
                      type: 'Identifier',
                    },
                    operator: '||',
                    right: {
                      left: {
                        name: mameSpaceName,
                        type: 'Identifier',
                      },
                      operator: '=',
                      right: {
                        properties: [],
                        type: 'ObjectExpression',
                      },
                      type: 'AssignmentExpression',
                    },
                    type: 'LogicalExpression',
                  },
                ],
                callee: {
                  async: false,
                  body: {
                    body: (node.body as ASTNode).body,
                    type: 'BlockStatement',
                  },
                  generator: false,
                  id: null,
                  params: [
                    {
                      name: mameSpaceName,
                      type: 'Identifier',
                    },
                  ],
                  type: 'FunctionExpression',
                },
                type: 'CallExpression',
              },
              type: 'ExpressionStatement',
            };

            const nodes = [Declaration, FunctionBody];
            if (withExport) {
              const exportDeclaration = createExports({
                exportsKey: context.moduleExportsName,
                exportsVariableName: mameSpaceName,
                property: {
                  name: mameSpaceName,
                  type: 'Identifier',
                },
                useModule: false,
              });
              nodes.push(exportDeclaration);
            }
            // replace it with a new node
            return schema.replace(nodes);
          }
        },
      };
    },
  };
}
