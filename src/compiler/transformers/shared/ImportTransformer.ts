import { BUNDLE_RUNTIME_NAMES } from '../../../bundleRuntime/bundleRuntimeCore';
import { ISchema } from '../../core/nodeSchema';
import { createEsModuleDefaultInterop, createRequireStatement, createVariableDeclaration } from '../../helpers/helpers';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { ImportType } from '../../interfaces/ImportType';

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
  if (node.type === ASTType.Identifier) return node.name;
}

export function ImportTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      const {
        transformationContext: { compilerOptions },
      } = props;
      const esModuleInterop = compilerOptions.esModuleInterop;
      const qualifierRefs = {};

      return {
        onProgramBody: (schema: ISchema) => {
          const { context, node } = schema;

          if (node.type === ASTType.ImportEqualsDeclaration) {
            const moduleReference = node.moduleReference;
            const moduleIdName = node.id.name;
            const qualifierId = getQualifierId(moduleReference);
            if (moduleReference.type === ASTType.QualifiedName || moduleReference.type === ASTType.Identifier) {
              // considering the following scenario ->
              // import { some } from "some"
              // import SomeType = some.foo
              // If SomeType is referenced as an object we should alias it

              let isReferenced = false;
              context.onRef(moduleIdName, localSchema => {
                // waiting for reference. If reference lead to nothing
                // that means we're referencing "mport SomeType" which is ignored by the scope tracker
                if (!localSchema.getLocal(moduleIdName)) {
                  isReferenced = true;
                }
              });

              return context.onComplete(() => {
                const memberReference = createVariableDeclaration(moduleIdName, convertQualifiedName(moduleReference));
                if (isReferenced) {
                  // set the flag for the import to know that it is being in use
                  qualifierRefs[qualifierId] = 1;
                  schema.replace(memberReference, { forceRevisit: true });
                } else schema.remove();
              }, 0); // prioritise the callback to be ahead of imports
            } else {
              const reqStatement = createRequireStatement(node.moduleReference.expression.value, node.id.name);
              if (props.onRequireCallExpression) {
                props.onRequireCallExpression(ImportType.RAW_IMPORT, reqStatement.reqStatement);
              }
              return schema.replace(reqStatement.statement);
            }
          }

          if (node.type === ASTType.ImportDeclaration) {
            if (node.importKind && node.importKind === 'type') {
              return schema.remove();
            }
            const coreReplacements = context.coreReplacements;

            const variable = context.getModuleName(node.source.value);

            let injectDefaultInterop;
            const specifiers = node.specifiers;
            for (const specifier of specifiers) {
              if (specifier.type === ASTType.ImportSpecifier) {
                coreReplacements[specifier.local.name] = {
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
                coreReplacements[specifier.local.name] = replacement;
              } else if (specifier.type === ASTType.ImportNamespaceSpecifier) {
                coreReplacements[specifier.local.name] = { first: variable };
              }
            }
            return context.onComplete(() => {
              const reqStatement = createRequireStatement(node.source.value, node.specifiers.length && variable);
              if (specifiers.length === 0) {
                if (props.onRequireCallExpression) {
                  props.onRequireCallExpression(ImportType.RAW_IMPORT, reqStatement.reqStatement);
                  schema.replace(reqStatement.statement);
                  schema.ensureESModuleStatement(compilerOptions);
                  return;
                }
              }

              let atLeastOneInUse = false;

              for (const specifier of node.specifiers) {
                const localName = specifier.local.name;
                const traced = context.coreReplacements[localName];
                // the only exception when when we check if the qualifier is referenced
                if (qualifierRefs[localName]) {
                  atLeastOneInUse = true;
                  break;
                }
                if (traced && traced.inUse) {
                  atLeastOneInUse = true;
                  break; // we just need to know if we need to keep the node
                }
              }
              // doing a manual replace
              if (atLeastOneInUse) {
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
                if (props.onRequireCallExpression) {
                  props.onRequireCallExpression(ImportType.FROM, reqStatement.reqStatement);
                }

                schema.replace(statements);
                schema.ensureESModuleStatement(compilerOptions);
                return schema;
              } else return schema.remove();
            });
          }
        },
      };
    },
  };
}
