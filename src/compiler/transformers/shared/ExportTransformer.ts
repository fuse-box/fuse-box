import { BUNDLE_RUNTIME_NAMES } from '../../../bundleRuntime/bundleRuntimeCore';
import { ISchema } from '../../core/nodeSchema';
import { createEsModuleDefaultInterop, createExports, createVariableDeclaration } from '../../helpers/helpers';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { ImportType } from '../../interfaces/ImportType';

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
      const {
        transformationContext: { compilerOptions },
      } = props;

      let USE_MODULE_EXPORTS = false;

      const esModuleInterop = compilerOptions.esModuleInterop;
      let exportAfterDeclaration;
      const definedLocallyProcessed: Record<string, number> = {};
      return {
        onEach: (schema: ISchema) => {
          const { context, node, parent } = schema;

          // handle a case where user set his own "exports". We need to change it
          // this is a very VERY rare case
          // and we do it because Babel supports (TypeScript will not compile the following code correctly)
          // var exports = {}
          // export { exports as default };

          if (parent && parent.type === ASTType.Program) {
            if (node.type == ASTType.VariableDeclaration && node.declarations) {
              for (const decl of node.declarations) {
                if (decl.id && decl.id.name === 'exports') {
                  USE_MODULE_EXPORTS = true;
                }
              }
            }
          }

          if (parent && parent.type !== ASTType.Program) return;

          if (exportAfterDeclaration && !node.$fuse_visited) {
            const definedLocally: Array<string> = [];

            for (const key in exportAfterDeclaration) {
              if (definedLocallyProcessed[key] === 1) {
              } else if (schema.getLocal(key)) {
                definedLocallyProcessed[key] = 1;
                definedLocally.push(key);
              }
            }

            if (definedLocally.length && !node.$fuse_visited) {
              const newNodes = [];

              for (const localVar of definedLocally) {
                const targetAfter = exportAfterDeclaration[localVar];
                if (targetAfter) {
                  for (const item of targetAfter.targets) {
                    const ast = createExports({
                      exportsKey: context.moduleExportsName,
                      exportsVariableName: item,
                      property: {
                        name: localVar,
                        type: 'Identifier',
                      },
                      useModule: USE_MODULE_EXPORTS,
                    });

                    schema.bodyAppend([ast]);
                  }
                }
              }
              if (newNodes.length) {
                node.$fuse_visited = true;
                schema.insertAfter(newNodes);
              }
              return schema.ensureESModuleStatement(compilerOptions);
            }
          }
        },
        onProgramBody: (schema: ISchema) => {
          const { context, node, parent } = schema;
          // handle a case where user set his own "exports". We need to change it
          // this is a very VERY rare case
          // and we do it because Babel supports (TypeScript will not compile the following code correctly)
          // var exports = {}
          // export { exports as default };

          if (parent && parent.type === ASTType.Program) {
            if (node.type == ASTType.VariableDeclaration && node.declarations) {
              for (const decl of node.declarations) {
                if (decl.id && decl.id.name === 'exports') {
                  USE_MODULE_EXPORTS = true;
                }
              }
            }
          }

          const type = node.type;

          if (node.type == ASTType.VariableDeclaration && node.declarations) {
            for (const decl of node.declarations) {
              if (decl.id && decl.id.name === 'exports') {
                USE_MODULE_EXPORTS = true;
              }
            }
          }

          if (!INTERESTED_NODES[type]) return;

          if (node.exportKind && node.exportKind === 'type') {
            return schema.remove();
          }
          // remove export interface
          // export interface HelloWorld{}
          if (type === 'ExportNamedDeclaration') {
            if (node.declaration && IGNORED_DECLARATIONS[node.declaration.type]) {
              return schema.remove();
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
            const sourceVariable = context.getModuleName(node.source.value);

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
              schema.replace([
                {
                  expression: {
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
                  type: 'ExpressionStatement',
                },
              ]);

              return schema.ensureESModuleStatement(compilerOptions);
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
                let targetVariable = sourceVariable;
                if (esModuleInterop && specifier.local.name === 'default') {
                  targetVariable = targetVariable + 'd';
                  exportedNodes.push(
                    createEsModuleDefaultInterop({
                      helperObjectName: BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ,
                      helperObjectProperty: BUNDLE_RUNTIME_NAMES.INTEROP_REQUIRE_DEFAULT_FUNCTION,
                      targetIdentifierName: sourceVariable,
                      variableName: targetVariable,
                    }),
                  );
                }
                exportedNodes.push(
                  createExports({
                    exportsKey: context.moduleExportsName,
                    exportsVariableName: specifier.exported.name,
                    property: {
                      computed: false,
                      object: {
                        name: targetVariable,
                        type: 'Identifier',
                      },
                      property: {
                        name: specifier.local.name,
                        type: 'Identifier',
                      },
                      type: 'MemberExpression',
                    },
                    useModule: USE_MODULE_EXPORTS,
                  }),
                );
              }
            }
            schema.ensureESModuleStatement(compilerOptions);

            return schema.replace(exportedNodes);
          }

          /**
           * Handling export default declaratio
           * *********************************************************
           *    export default func
           */
          if (type === 'ExportDefaultDeclaration') {
            if (node.declaration) {
              if (node.declaration.type === ASTType.InterfaceDeclaration) {
                return schema.remove();
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

                schema.replace([
                  statement,
                  createExports({
                    exportsKey: context.moduleExportsName,
                    exportsVariableName: 'default',
                    property: {
                      name: node.declaration.id.name,
                      type: 'Identifier',
                    },
                    useModule: USE_MODULE_EXPORTS,
                  }),
                ]);
                // make sure exports.__eModule is injected
                return schema.ensureESModuleStatement(compilerOptions);
              }

              schema.replace([
                createExports({
                  exportsKey: context.moduleExportsName,
                  exportsVariableName: 'default',
                  property: node.declaration,
                  useModule: USE_MODULE_EXPORTS,
                }),
              ]);
              // make sure exports.__eModule is injected
              return schema.ensureESModuleStatement(compilerOptions);
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
                // console.log(schema.getLocal(specifier.local.name), context.coreReplacements[specifier.local.name]);
                // if the variable present in the scope...
                // or picked up by the identifierReplacement ( we can leave that for schema transformer to take care)

                //if (schema.getLocal(specifier.local.name) || context.coreReplacements[specifier.local.name]) {
                if (context.coreReplacements[specifier.local.name]) {
                  newNodes.push(
                    createExports({
                      exportsKey: schema.context.moduleExportsName,
                      exportsVariableName: specifier.exported.name,
                      property: {
                        name: specifier.local.name,
                        type: 'Identifier',
                      },
                      useModule: USE_MODULE_EXPORTS,
                    }),
                  );
                } else {
                  // if none was decleared, it must be declared earlier (so we check if later with onEachNode in this transformer )

                  if (!exportAfterDeclaration) exportAfterDeclaration = {};

                  if (!exportAfterDeclaration[specifier.local.name]) {
                    exportAfterDeclaration[specifier.local.name] = { targets: [] };
                  }
                  // it can have multiple exports of the same variable. For example
                  // export {foo, foo as foo1}

                  exportAfterDeclaration[specifier.local.name].targets.push(specifier.exported.name);
                }
              }
              schema.replace(newNodes);
              return schema.ensureESModuleStatement(compilerOptions);
            } else if (!node.declaration) return schema.remove();

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

                return schema.replace([
                  statement,
                  createExports({
                    exportsKey: context.moduleExportsName,
                    exportsVariableName: node.declaration.id.name,
                    property: {
                      name: node.declaration.id.name,
                      type: 'Identifier',
                    },
                    useModule: USE_MODULE_EXPORTS,
                  }),
                ]);
              }
              if (node.declaration.type === 'VariableDeclaration') {
                if (node.declaration.declare) {
                  return schema.remove();
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
                      context.coreReplacements[declaration.id.name] = {
                        first: context.moduleExportsName,
                        second: declaration.id.name,
                      };

                      if (declaration.init) {
                        // check if there is INIT
                        // we night have something like this:
                        //    export var FooBar;

                        newNodes.push(
                          createExports({
                            exportsKey: context.moduleExportsName,
                            exportsVariableName: declaration.id.name,
                            property: declaration.init,
                            useModule: USE_MODULE_EXPORTS,
                          }),
                        );
                      }
                    }
                  }
                  schema.replace(newNodes);

                  // make sure exports.__eModule is injected
                  return schema.ensureESModuleStatement(compilerOptions);
                }
              }
            }
          }
        },
      };
    },
  };
}
