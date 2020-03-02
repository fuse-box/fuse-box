import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { createExports } from '../../Visitor/helpers';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { GlobalContext, createGlobalContext } from '../../program/GlobalContext';
import { transpileModule } from '../../program/transpileModule';

export function NamespaceTransformer(): ITransformer {
  return {
    target: { type: 'ts' },
    commonVisitors: props => {
      return {
        onEachNode: (visit: IVisit) => {
          if (visit.node.type === ASTType.ModuleDeclaration) {
            return { ignoreChildren: true };
          }
        },
        onTopLevelTraverse: (visit: IVisit): IVisitorMod => {
          let node = visit.node;
          if (node.declare) {
            return { ignoreChildren: true, removeNode: true };
          }
          let withExport = false;
          const globalContext = visit.globalContext as GlobalContext;

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
            transpileModule({
              ...globalContext.programProps,
              ast: nm,
              globalContext: createGlobalContext({
                namespace: mameSpaceName,
              }),
              namespace: mameSpaceName,
            });

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
                exportsKey: globalContext.namespace,
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
            return {
              replaceWith: nodes,
            };
          }
        },
      };
    },
  };
}
