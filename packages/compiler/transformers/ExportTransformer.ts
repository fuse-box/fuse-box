import { GlobalContext } from "../program/GlobalContext";
import { ITransformer } from "../program/transpileModule";
import { createExports, isDefinedLocally } from "../Visitor/helpers";
import { IVisit } from "../Visitor/Visitor";

export function ExportTransformer(): ITransformer {
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
                createExports(
                  global.namespace,
                  global.exportAfterDeclaration[localVar].target,
                  {
                    type: "Identifier",
                    name: localVar
                  }
                )
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

      // remove export interface
      // export interface HelloWorld{}
      if (node.type === "ExportNamedDeclaration") {
        if (
          node.declaration &&
          node.declaration.type === "InterfaceDeclaration"
        ) {
          return { removeNode: true };
        }
      }
      /**
       * Handling export default declaratio
       * *********************************************************
       *    export default func
       */
      if (node.type === "ExportDefaultDeclaration") {
        if (node.declaration) {
          // Looking at this case:
          //      console.log(foo)
          //      export default function foo(){}
          if (
            (node.declaration.type === "FunctionDeclaration" ||
              node.declaration.type === "ClassDeclaration") &&
            node.declaration.id
          ) {
            return {
              replaceWith: [
                node.declaration,
                createExports(global.namespace, "default", {
                  type: "Identifier",
                  name: node.declaration.id.name
                })
              ]
            };
          }
          return {
            replaceWith: createExports(
              global.namespace,
              "default",
              node.declaration
            )
          };
        }
      }

      if (node.type === "ExportNamedDeclaration") {
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
                  type: "Identifier",
                  name: specifier.local.name
                })
              );
            } else {
              // if none was decleared, it must be declared earlier (so we check if later with onEachNode in this transformer )
              if (!global.exportAfterDeclaration)
                global.exportAfterDeclaration = {};

              global.exportAfterDeclaration[specifier.local.name] = {
                target: specifier.exported.name
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
                  type: "Identifier",
                  name: node.declaration.id.name
                })
              ]
            };
          }
          if (node.declaration.type === "VariableDeclaration") {
            /**
             * ******************************************************************
             * Exports defined constants
             *
             *    export const foo = 1, bar = 3;
             */
            if (node.declaration.declarations) {
              let newNodes = [];
              for (const declaration of node.declaration.declarations) {
                global.identifierReplacement[declaration.id.name] = {
                  first: global.namespace,
                  second: declaration.id.name
                };

                if (declaration.init) {
                  // check if there is INIT
                  // we night have something like this:
                  //    export var FooBar;
                  newNodes.push(
                    createExports(
                      global.namespace,
                      declaration.id.name,
                      declaration.init
                    )
                  );
                }
              }
              return { replaceWith: newNodes };
            }
          }
        }
      }
    }
  };
}
