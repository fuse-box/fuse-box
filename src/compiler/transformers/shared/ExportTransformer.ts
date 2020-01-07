import * as path from 'path';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ImportType } from '../../interfaces/ImportType';
import { ITransformer } from '../../interfaces/ITransformer';
import { GlobalContext } from '../../program/GlobalContext';
import { createExports, createVariableDeclaration, isDefinedLocally } from '../../Visitor/helpers';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { generateVariableFromSource } from '../astHelpers';

const IGNORED_DECLARATIONS = {
  [ASTType.InterfaceDeclaration]: 1,
  [ASTType.TypeAliasDeclaration]: 1,
};
function considerDecorators(node: ASTNode) {
  let statement: ASTNode = node.declaration;
  if (
    node.declaration.type === 'ClassDeclaration' &&
    node.declaration.decorators &&
    node.declaration.decorators.length
  ) {
    statement = createVariableDeclaration(node.declaration.id.name, node.declaration);
    // assigne decorators to the statement
    statement.decorators = node.declaration.decorators;
    statement.$fuse_decoratorForClassIdentifier = node.declaration.id.name;
    // remove them from the original declaration (in order for the decorators to be instered after)
    node.declaration.decorators = [];
  }
  return statement;
}
const INTERESTED_NODES = {
  ExportNamedDeclaration: 1,
  ExportDefaultDeclaration: 1,
  ExportAllDeclaration: 1,
};

export function ExportTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      return {
        onEachNode: (visit: IVisit) => {
          const global = visit.globalContext as GlobalContext;

          if (global.exportAfterDeclaration) {
            const node = visit.node;
            const definedLocally = isDefinedLocally(node);

            if (definedLocally && !visit.node.$fuse_visited) {
              const newNodes = [];

              const response: IVisitorMod = {};

              for (const localVar of definedLocally) {
                if (global.exportAfterDeclaration[localVar.name]) {
                  const ast = createExports(global.namespace, global.exportAfterDeclaration[localVar.name].target, {
                    type: 'Identifier',
                    name: localVar.name,
                  });

                  if (!response.appendToBody) response.appendToBody = [];
                  response.appendToBody.push(ast);
                }
              }
              if (newNodes.length) {
                node.$fuse_visited = true;

                // console.log('new nodes', newNodes);
                // return { replaceWith: [node].concat(newNodes) };
                response.insertAfterThisNode = newNodes;
              }
              if (response.insertAfterThisNode || response.appendToBody) {
                return response;
              }
            }
          }
        },
        onTopLevelTraverse: (visit: IVisit) => {
          const node = visit.node;

          const global = visit.globalContext as GlobalContext;

          const type = node.type;
          if (!INTERESTED_NODES[type]) return;

          // remove export interface
          // export interface HelloWorld{}
          if (type === 'ExportNamedDeclaration') {
            if (node.declaration && IGNORED_DECLARATIONS[node.declaration.type]) {
              return { removeNode: true };
            }
          }

          /**
           * **************************************************************************
           * Export with source
           * export { one, two } from "./source"
           *
           * Needs to be simply replaced, no tracking involved
           */
          if (node.source) {
            const sourceVariable = generateVariableFromSource(node.source.value, global.getNextIndex());

            // export * from "a"
            if (node.type === 'ExportAllDeclaration') {
              const reqExpression: ASTNode = {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'require',
                },
                arguments: [
                  {
                    type: 'Literal',
                    value: node.source.value,
                  },
                ],
              };
              if (props.onRequireCallExpression) {
                props.onRequireCallExpression(ImportType.FROM, reqExpression);
              }
              return {
                replaceWith: {
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'Object',
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'assign',
                    },
                  },
                  arguments: [
                    {
                      type: 'Identifier',
                      name: 'exports',
                    },
                    reqExpression,
                  ],
                },
              };
            }

            // export { foo } from "./bar"
            // creating
            //    var obj = require("module")
            const exportedNodes: Array<ASTNode> = [
              {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    init: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'require',
                      },
                      arguments: [
                        {
                          type: 'Literal',
                          value: node.source.value,
                        },
                      ],
                    },
                    id: {
                      type: 'Identifier',
                      name: sourceVariable,
                    },
                  },
                ],
              },
            ];

            if (type === 'ExportNamedDeclaration') {
              for (const specifier of node.specifiers) {
                exportedNodes.push(
                  createExports(global.namespace, specifier.exported.name, {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: sourceVariable,
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: specifier.local.name,
                    },
                  }),
                );
              }
            }
            return { replaceWith: exportedNodes };
          }

          /**
           * Handling export default declaratio
           * *********************************************************
           *    export default func
           */
          if (type === 'ExportDefaultDeclaration') {
            if (node.declaration) {
              // Looking at this case:
              //      console.log(foo)
              //      export default function foo(){}
              if (node.declaration.type === 'FunctionDeclaration' || node.declaration.type === 'ClassDeclaration') {
                if (!node.declaration.id) {
                  node.declaration.id = { type: 'Identifier', name: '__DefaultExport__' };
                }

                // if there are decorators on the class we need to transform and assigne to a variable
                /**
                 * @dec
                 * export default class A {
                 *
                 * }
                 *
                 * Should be converted to:
                 *
                 * let A = class A {
                 * }
                 */
                let statement: ASTNode = considerDecorators(node);
                return {
                  replaceWith: [
                    statement,
                    createExports(global.namespace, 'default', {
                      type: 'Identifier',
                      name: node.declaration.id.name,
                    }),
                  ],
                };
              }
              return {
                replaceWith: createExports(global.namespace, 'default', node.declaration),
              };
            }
          }

          if (type === 'ExportNamedDeclaration') {
            /**
             * ******************************************************************************
             * CASE with variable exports
             *
             *      export { name1, name2 }
             *
             * Will be "soft" replaced if those defined earlier
             * Then if it's not defined we need to wait for those (they might come later)
             */

            const newNodes = [];

            if (node.specifiers && node.specifiers.length) {
              for (const specifier of node.specifiers) {
                // if the variable present in the scope...
                // or picked up by the identifierReplacement ( we can leave that for GlobalContextTranformer)
                if (
                  (visit.scope && visit.scope.locals[specifier.local.name]) ||
                  global.identifierReplacement[specifier.local.name]
                ) {
                  newNodes.push(
                    createExports(global.namespace, specifier.exported.name, {
                      type: 'Identifier',
                      name: specifier.local.name,
                    }),
                  );
                } else {
                  //console.log('NOE', specifier.local.name);
                  // if none was decleared, it must be declared earlier (so we check if later with onEachNode in this transformer )
                  if (!global.exportAfterDeclaration) global.exportAfterDeclaration = {};

                  global.exportAfterDeclaration[specifier.local.name] = {
                    target: specifier.exported.name,
                  };
                }
              }
              return { replaceWith: newNodes };
            }
            /**
             * ************************************************************************
             * Export objects directly
             *
             *  export function hello(){}
             *  export class Bar(){}
             */
            if (node.declaration) {
              if (node.declaration.id && node.declaration.id.name) {
                const statement = considerDecorators(node);
                return {
                  replaceWith: [
                    statement,
                    createExports(global.namespace, node.declaration.id.name, {
                      type: 'Identifier',
                      name: node.declaration.id.name,
                    }),
                  ],
                };
              }
              if (node.declaration.type === 'VariableDeclaration') {
                if (node.declaration.declare) {
                  return { removeNode: true, ignoreChildren: true };
                }
                /**
                 * ******************************************************************
                 * Exports defined constants
                 *
                 *    export const foo = 1, bar = 3;
                 */
                if (node.declaration.declarations) {
                  let newNodes = [];
                  for (const declaration of node.declaration.declarations) {
                    if (!declaration.declare) {
                      global.identifierReplacement[declaration.id.name] = {
                        first: global.namespace,
                        second: declaration.id.name,
                      };

                      if (declaration.init) {
                        // check if there is INIT
                        // we night have something like this:
                        //    export var FooBar;
                        newNodes.push(createExports(global.namespace, declaration.id.name, declaration.init));
                      }
                    }
                  }
                  return { replaceWith: newNodes };
                }
              }
            }
          }
        },
      };
    },
  };
}
