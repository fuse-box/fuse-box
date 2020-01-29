import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import {
  ES_MODULE_EXPRESSION,
  createExports,
  createVariableDeclaration,
  isDefinedLocally,
} from '../../Visitor/helpers';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { ImportType } from '../../interfaces/ImportType';
import { GlobalContext } from '../../program/GlobalContext';

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
  ExportAllDeclaration: 1,
  ExportDefaultDeclaration: 1,
  ExportNamedDeclaration: 1,
};

export function ExportTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      const definedLocallyProcessed: Record<string, number> = {};
      const compilerOptions = props.compilerOptions;
      let injectEsModuleStatement = compilerOptions.esModuleStatement === true;
      let esModuleStatementInjected = !injectEsModuleStatement;
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
                // we don't want to add it multiple times
                if (definedLocallyProcessed[localVar.name]) break;
                definedLocallyProcessed[localVar.name] = 1;
                const targetAfter = global.exportAfterDeclaration[localVar.name];
                if (targetAfter) {
                  if (!response.appendToBody) response.appendToBody = [];
                  for (const item of targetAfter.targets) {
                    const ast = createExports(global.namespace, item, {
                      name: localVar.name,
                      type: 'Identifier',
                    });
                    response.appendToBody.push(ast);
                  }
                }
              }
              if (newNodes.length) {
                node.$fuse_visited = true;

                // console.log('new nodes', newNodes);
                // return { replaceWith: [node].concat(newNodes) };
                response.insertAfterThisNode = newNodes;
              }
              if (response.insertAfterThisNode || response.appendToBody) {
                // make sure exports.__eModule is injected
                if (!esModuleStatementInjected) {
                  esModuleStatementInjected = true;
                  response.prependToBody = [ES_MODULE_EXPRESSION];
                }
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
            const sourceVariable = global.getModuleName(node.source.value);

            // export * from "a"
            if (node.type === 'ExportAllDeclaration') {
              const reqExpression: ASTNode = {
                arguments: [
                  {
                    type: 'Literal',
                    value: node.source.value,
                  },
                ],
                callee: {
                  name: 'require',
                  type: 'Identifier',
                },
                type: 'CallExpression',
              };
              if (props.onRequireCallExpression) {
                props.onRequireCallExpression(ImportType.FROM, reqExpression);
              }
              const response: IVisitorMod = {
                replaceWith: {
                  arguments: [
                    {
                      name: 'exports',
                      type: 'Identifier',
                    },
                    reqExpression,
                  ],
                  callee: {
                    computed: false,
                    object: {
                      name: 'Object',
                      type: 'Identifier',
                    },
                    property: {
                      name: 'assign',
                      type: 'Identifier',
                    },
                    type: 'MemberExpression',
                  },
                  type: 'CallExpression',
                },
              };

              // make sure exports.__eModule is injected
              if (!esModuleStatementInjected) {
                esModuleStatementInjected = true;
                response.prependToBody = [ES_MODULE_EXPRESSION];
              }
              return response;
            }

            // export { foo } from "./bar"
            // creating
            //    var obj = require("module")
            const exportedNodes: Array<ASTNode> = [
              {
                declarations: [
                  {
                    id: {
                      name: sourceVariable,
                      type: 'Identifier',
                    },
                    init: {
                      arguments: [
                        {
                          type: 'Literal',
                          value: node.source.value,
                        },
                      ],
                      callee: {
                        name: 'require',
                        type: 'Identifier',
                      },
                      type: 'CallExpression',
                    },
                    type: 'VariableDeclarator',
                  },
                ],
                kind: 'var',
                type: 'VariableDeclaration',
              },
            ];

            if (type === 'ExportNamedDeclaration') {
              for (const specifier of node.specifiers) {
                exportedNodes.push(
                  createExports(global.namespace, specifier.exported.name, {
                    computed: false,
                    object: {
                      name: sourceVariable,
                      type: 'Identifier',
                    },
                    property: {
                      name: specifier.local.name,
                      type: 'Identifier',
                    },
                    type: 'MemberExpression',
                  }),
                );
              }
            }
            const response: IVisitorMod = { replaceWith: exportedNodes };
            // make sure exports.__eModule is injected
            if (!esModuleStatementInjected) {
              esModuleStatementInjected = true;
              response.prependToBody = [ES_MODULE_EXPRESSION];
            }
            return response;
          }

          /**
           * Handling export default declaratio
           * *********************************************************
           *    export default func
           */
          if (type === 'ExportDefaultDeclaration') {
            if (node.declaration) {
              if (node.declaration.type === ASTType.InterfaceDeclaration) {
                return { removeNode: true };
              }
              // Looking at this case:
              //      console.log(foo)
              //      export default function foo(){}
              if (node.declaration.type === 'FunctionDeclaration' || node.declaration.type === 'ClassDeclaration') {
                if (!node.declaration.id) {
                  node.declaration.id = { name: '__DefaultExport__', type: 'Identifier' };
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
                const response: IVisitorMod = {
                  replaceWith: [
                    statement,
                    createExports(global.namespace, 'default', {
                      name: node.declaration.id.name,
                      type: 'Identifier',
                    }),
                  ],
                };
                // make sure exports.__eModule is injected
                if (!esModuleStatementInjected) {
                  esModuleStatementInjected = true;
                  response.prependToBody = [ES_MODULE_EXPRESSION];
                }
                return response;
              }
              const response: IVisitorMod = {
                replaceWith: createExports(global.namespace, 'default', node.declaration),
              };
              // make sure exports.__eModule is injected
              if (!esModuleStatementInjected) {
                esModuleStatementInjected = true;
                response.prependToBody = [ES_MODULE_EXPRESSION];
              }
              return response;
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
                      name: specifier.local.name,
                      type: 'Identifier',
                    }),
                  );
                } else {
                  // if none was decleared, it must be declared earlier (so we check if later with onEachNode in this transformer )
                  let exportAfterDeclaration = global.exportAfterDeclaration;
                  if (!exportAfterDeclaration) {
                    global.exportAfterDeclaration = exportAfterDeclaration = {};
                  }

                  if (!exportAfterDeclaration[specifier.local.name]) {
                    exportAfterDeclaration[specifier.local.name] = { targets: [] };
                  }
                  // it can have multiple exports of the same variable. For example
                  // export {foo, foo as foo1}

                  exportAfterDeclaration[specifier.local.name].targets.push(specifier.exported.name);
                }
              }
              const response: IVisitorMod = { replaceWith: newNodes };
              // make sure exports.__eModule is injected
              if (!esModuleStatementInjected) {
                esModuleStatementInjected = true;
                response.prependToBody = [ES_MODULE_EXPRESSION];
              }
              return response;
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
                      name: node.declaration.id.name,
                      type: 'Identifier',
                    }),
                  ],
                };
              }
              if (node.declaration.type === 'VariableDeclaration') {
                if (node.declaration.declare) {
                  return { ignoreChildren: true, removeNode: true };
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
                  const response: IVisitorMod = { replaceWith: newNodes };

                  // make sure exports.__eModule is injected
                  if (!esModuleStatementInjected) {
                    esModuleStatementInjected = true;
                    response.prependToBody = [ES_MODULE_EXPRESSION];
                  }
                  return response;
                }
              }
            }
          }
        },
      };
    },
  };
}
