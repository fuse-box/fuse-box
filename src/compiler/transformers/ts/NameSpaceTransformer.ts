import { ASTNode } from '../../interfaces/AST';
import { ITransformer, transpileModule } from '../../program/transpileModule';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { GlobalContext, createGlobalContext } from '../../program/GlobalContext';
import { createExports } from '../../Visitor/helpers';

export function NamespaceTransformer(): ITransformer {
  return {
    onEachNode: (visit: IVisit) => {
      if (visit.node.type === 'ModuleDeclaration') {
        return { ignoreChildren: true };
      }
    },
    onTopLevelTraverse: (visit: IVisit): IVisitorMod => {
      let node = visit.node;
      if (node.declare) {
        return { removeNode: true, ignoreChildren: true };
      }
      let withExport = false;
      const globalContext = visit.globalContext as GlobalContext;

      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration && node.declaration.type === 'ModuleDeclaration') {
          node = node.declaration;
          withExport = true;
        }
      }

      if (node.type === 'ModuleDeclaration') {
        const nm = node.body as ASTNode;
        const mameSpaceName = node.id.name;
        // launch custom transpilation for that namespace
        // we skip children in onEachNode
        transpileModule({
          ...globalContext.programProps,
          ast: nm,
          namespace: mameSpaceName,
          globalContext: createGlobalContext({
            namespace: mameSpaceName,
          }),
        });

        //node.body.context =
        const Declaration: ASTNode = {
          type: 'VariableDeclaration',
          kind: 'var',
          declarations: [
            {
              type: 'VariableDeclarator',
              init: null,
              id: {
                type: 'Identifier',
                name: node.id.name,
              },
            },
          ],
        };

        const FunctionBody: ASTNode = {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: mameSpaceName,
                },
              ],
              body: {
                type: 'BlockStatement',
                body: (node.body as ASTNode).body,
              },
              async: false,
              generator: false,
              id: null,
            },
            arguments: [
              {
                type: 'LogicalExpression',
                left: {
                  type: 'Identifier',
                  name: mameSpaceName,
                },
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: mameSpaceName,
                  },
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: [],
                  },
                },
                operator: '||',
              },
            ],
          },
        };

        const nodes = [Declaration, FunctionBody];
        if (withExport) {
          const exportDeclaration = createExports(globalContext.namespace, mameSpaceName, {
            type: 'Identifier',
            name: mameSpaceName,
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
}
