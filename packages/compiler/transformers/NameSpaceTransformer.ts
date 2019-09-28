import { ASTNode } from "../interfaces/AST";
import { ITransformer, transpileModule } from "../program/transpileModule";
import { IVisit, IVisitorMod } from "../Visitor/Visitor";
import { GlobalContext, createGlobalContext } from "../program/GlobalContext";

export function NamespaceTransformer(): ITransformer {
  return {
    onEachNode: (visit: IVisit) => {
      if (visit.node.type === "ModuleDeclaration") {
        return { ignoreChildren: true };
      }
    },
    onTopLevelTraverse: (visit: IVisit): IVisitorMod => {
      const node = visit.node;
      const globalContext = visit.globalContext as GlobalContext;

      if (node.type === "ModuleDeclaration") {
        const nm = node.body as ASTNode;
        const mameSpaceName = node.id.name;
        // launch custom transpilation for that namespace
        // we skip children in onEachNode
        transpileModule({
          ...globalContext.programProps,
          ast: nm,
          namespace: mameSpaceName,
          globalContext: createGlobalContext({
            namespace: mameSpaceName
          })
        });

        //node.body.context =
        const Declaration: ASTNode = {
          type: "VariableDeclaration",
          kind: "var",
          declarations: [
            {
              type: "VariableDeclarator",
              init: null,
              id: {
                type: "Identifier",
                name: node.id.name
              }
            }
          ]
        };

        const FunctionBody: ASTNode = {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "FunctionExpression",
              params: [
                {
                  type: "Identifier",
                  name: mameSpaceName
                }
              ],
              body: {
                type: "BlockStatement",
                body: (node.body as ASTNode).body
              },
              async: false,
              generator: false,
              id: null
            },
            arguments: [
              {
                type: "LogicalExpression",
                left: {
                  type: "Identifier",
                  name: mameSpaceName
                },
                right: {
                  type: "AssignmentExpression",
                  left: {
                    type: "Identifier",
                    name: mameSpaceName
                  },
                  operator: "=",
                  right: {
                    type: "ObjectExpression",
                    properties: []
                  }
                },
                operator: "||"
              }
            ]
          }
        };
        // replace it with a new node
        return {
          replaceWith: [Declaration, FunctionBody]
        };
      }
    }
  };
}
