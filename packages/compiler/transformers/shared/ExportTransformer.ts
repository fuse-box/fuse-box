import { GlobalContext } from '../../program/GlobalContext';
import { ITransformer } from '../../program/transpileModule';
import { createExports, isDefinedLocally } from '../../Visitor/helpers';
import { IVisit } from '../../Visitor/Visitor';
import * as path from 'path';
import { ASTNode } from '../../interfaces/AST';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { ImportType } from '../../interfaces/ImportType';

const INTERESTED_NODES = {
  ExportNamedDeclaration: 1,
  ExportDefaultDeclaration: 1,
  ExportAllDeclaration: 1,
};
export function ExportTransformer(options?: ITransformerSharedOptions): ITransformer {
  options = options || options;
  return {
    onEachNode: (visit: IVisit) => {
      const global = visit.globalContext as GlobalContext;

      if (global.exportAfterDeclaration) {
        const node = visit.node;
        const definedLocally = isDefinedLocally(node);
        if (definedLocally) {
          const newNodes = [];
          for (const localVar of definedLocally) {
            if (global.exportAfterDeclaration[localVar]) {
              newNodes.push(
                createExports(global.namespace, global.exportAfterDeclaration[localVar].target, {
                  type: 'Identifier',
                  name: localVar,
                }),
              );
            }
          }
          if (newNodes.length) {
            return { insertAfterThisNode: newNodes };
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
        if (node.declaration && node.declaration.type === 'InterfaceDeclaration') {
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
        const sourceVariable = path.basename(node.source.value).replace(/\.|-/, '_') + '_' + global.getNextIndex();

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
          if (options.onRequireCallExpression) {
            options.onRequireCallExpression(ImportType.FROM, reqExpression);
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
          if (
            (node.declaration.type === 'FunctionDeclaration' || node.declaration.type === 'ClassDeclaration') &&
            node.declaration.id
          ) {
            return {
              replaceWith: [
                node.declaration,
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
            return {
              replaceWith: [
                node.declaration,
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
}
