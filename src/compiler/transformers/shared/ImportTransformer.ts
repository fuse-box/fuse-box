import { BUNDLE_RUNTIME_NAMES } from '../../../bundleRuntime/bundleRuntimeCore';
import { IVisit } from '../../Visitor/Visitor';
import { ES_MODULE_EXPRESSION, createEsModuleDefaultInterop, createRequireStatement } from '../../Visitor/helpers';
import { isLocalDefined } from '../../helpers/astHelpers';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { ImportType } from '../../interfaces/ImportType';
import { GlobalContext } from '../../program/GlobalContext';
import { IProgramProps } from '../../program/transpileModule';

function injectEsModuleStatementIntoBody(props: IProgramProps) {
  const body = props.ast.body as Array<ASTNode>;
  body.splice(0, 0, ES_MODULE_EXPRESSION);
}

function convertQualifiedName(node: ASTNode) {
  if (node.type === ASTType.QualifiedName) node.type = 'MemberExpression';

  if (node.left) {
    node.object = node.left;
    delete node.left;
    convertQualifiedName(node.object);
  }
  if (node.right) {
    node.property = node.right;
    delete node.right;
  }
  return node;
}

function getQualifierId(node: ASTNode) {
  if (node.left) {
    if (node.left.type === ASTType.Identifier) return node.left.name;
    return getQualifierId(node.left);
  }
}

export function ImportTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      const {
        transformationContext: { compilerOptions },
      } = props;
      const esModuleInterop = compilerOptions.esModuleInterop;
      const importQualifierNames = {};
      return {
        onEachNode: (visit: IVisit) => {},

        onTopLevelTraverse: (visit: IVisit) => {
          const { node } = visit;
          const global = visit.globalContext as GlobalContext;

          if (node.type === ASTType.ImportEqualsDeclaration) {
            const moduleReference = node.moduleReference;
            const moduleIdName = node.id.name;
            if (moduleReference.type === ASTType.QualifiedName || moduleReference.type === ASTType.Identifier) {
              const qualifierId = getQualifierId(moduleReference);
              // considering the following scenario ->
              // import { some } from "some"
              // import SomeType = some.foo
              // If SomeType is referenced as an object we should alias it

              const memberReference = convertQualifiedName(moduleReference);
              // witing for the reference signal
              global.onRef(moduleIdName, (n, v) => {
                if (!isLocalDefined(moduleIdName, v.scope)) {
                  importQualifierNames[qualifierId] = 1;
                  return { replaceWith: memberReference };
                }
              });

              return {
                removeNode: true,
              };
            } else {
              const reqStatement = createRequireStatement(node.moduleReference.expression.value, node.id.name);
              if (props.onRequireCallExpression) {
                props.onRequireCallExpression(ImportType.RAW_IMPORT, reqStatement.reqStatement);
              }
              return { replaceWith: reqStatement.statement };
            }
          }
          let injectDefaultInterop;
          if (node.type === ASTType.ImportDeclaration) {
            // converts "./foo/bar.hello.js" to foo_bar_hello_js_1 (1:1 like typescript does)
            const variable = global.getModuleName(node.source.value);

            node.specifiers.forEach(specifier => {
              if (specifier.type === ASTType.ImportSpecifier) {
                global.identifierReplacement[specifier.local.name] = {
                  first: variable,
                  second: specifier.imported.name,
                };
              } else if (specifier.type === ASTType.ImportDefaultSpecifier) {
                let replacement;
                if (esModuleInterop) {
                  injectDefaultInterop = variable + 'd';
                  replacement = {
                    first: injectDefaultInterop,
                    second: 'default',
                  };
                } else {
                  replacement = {
                    first: variable,
                    second: 'default',
                  };
                }

                global.identifierReplacement[specifier.local.name] = replacement;
              } else if (specifier.type === ASTType.ImportNamespaceSpecifier) {
                // only if we have more than one specifier
                // for instance
                // i=mport MySuperClass, * as everything from "module-name";

                // in every other case like:
                // import * as everything from "module-name";
                // we don't need to do anything, since the variables should match

                global.identifierReplacement[specifier.local.name] = {
                  first: variable,
                };

                //if (node.specifiers.length > 1) afterStatement = defineVariable(variable, specifier.local.name);
              }
            });

            return {
              onComplete: (programProps: IProgramProps) => {
                const canInjectExportStatement = compilerOptions.esModuleStatement && !global.esModuleStatementInjected;
                const reqStatement = createRequireStatement(node.source.value, node.specifiers.length && variable);
                // when everything is finished we need to check if those variables have been used at all
                // they were all unused we need remove the require/import statement at all

                // assuming we have no specififers and this import HAS side effects
                // e.g import "./module"
                const parent = visit.parent;
                const property = visit.property;
                if (node.specifiers.length === 0) {
                  const index = parent[property].indexOf(node);
                  if (index > -1) {
                    if (props.onRequireCallExpression) {
                      props.onRequireCallExpression(ImportType.RAW_IMPORT, reqStatement.reqStatement);
                    }
                    parent[property].splice(index, 1, reqStatement.statement);
                  }
                  if (canInjectExportStatement) {
                    global.esModuleStatementInjected = true;
                    injectEsModuleStatementIntoBody(programProps);
                  }
                  return;
                }

                let atLeastOneInUse = false;
                for (const specifier of node.specifiers) {
                  const localName = specifier.local.name;
                  const traced = global.identifierReplacement[localName];
                  if (importQualifierNames[localName]) atLeastOneInUse = true;

                  if (traced && traced.inUse) {
                    atLeastOneInUse = true;
                    break; // we just need to know if we need to keep the node
                  }
                }
                // doing a manual replace
                if (atLeastOneInUse) {
                  const index = parent[property].indexOf(node);
                  if (index > -1) {
                    let statements = [reqStatement.statement];
                    if (injectDefaultInterop) {
                      statements.push(
                        createEsModuleDefaultInterop({
                          helperObjectName: BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ,
                          helperObjectProperty: BUNDLE_RUNTIME_NAMES.INTEROP_REQUIRE_DEFAULT_FUNCTION,
                          targetIdentifierName: variable,
                          variableName: injectDefaultInterop,
                        }),
                      );
                    }

                    parent[property].splice(index, 1, ...statements);

                    if (canInjectExportStatement) {
                      global.esModuleStatementInjected = true;
                      injectEsModuleStatementIntoBody(programProps);
                    }
                    if (props.onRequireCallExpression) {
                      props.onRequireCallExpression(ImportType.FROM, reqStatement.reqStatement);
                    }
                  }
                } else {
                  const index = parent[property].indexOf(node);
                  if (index > -1) parent[property].splice(index, 1);
                }
              },
            };
          }
        },
      };
    },
  };
}
