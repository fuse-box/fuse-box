import * as path from 'path';
import { ImportType } from '../../interfaces/ImportType';
import { ITransformer } from '../../interfaces/ITransformer';
import { GlobalContext } from '../../program/GlobalContext';
import { createRequireStatement } from '../../Visitor/helpers';
import { IVisit } from '../../Visitor/Visitor';
import { ASTType } from '../../interfaces/AST';

export function ImportTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      return {
        onTopLevelTraverse: (visit: IVisit) => {
          const node = visit.node;
          const global = visit.globalContext as GlobalContext;

          if (node.type === ASTType.ImportEqualsDeclaration) {
            const reqStatement = createRequireStatement(node.moduleReference.expression.value, node.id.name);
            if (props.onRequireCallExpression) {
              props.onRequireCallExpression(ImportType.RAW_IMPORT, reqStatement.reqStatement);
            }
            return { replaceWith: reqStatement.statement };
          }
          if (node.type === 'ImportDeclaration') {
            // converts "./foo/bar.hello.js" to foo_bar_hello_js_1 (1:1 like typescript does)
            const variable = path.basename(node.source.value).replace(/\.|-/g, '_') + '_' + global.getNextIndex();

            node.specifiers.forEach(specifier => {
              if (specifier.type === 'ImportSpecifier') {
                global.identifierReplacement[specifier.local.name] = {
                  first: variable,
                  second: specifier.imported.name,
                };
              } else if (specifier.type === 'ImportDefaultSpecifier') {
                global.identifierReplacement[specifier.local.name] = {
                  first: variable,
                  second: 'default',
                };
              } else if (specifier.type === 'ImportNamespaceSpecifier') {
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
              onComplete: () => {
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
                  return;
                }

                let atLeastOneInUse = false;
                for (const specifier of node.specifiers) {
                  const traced = global.identifierReplacement[specifier.local.name];
                  if (traced && traced.inUse) {
                    atLeastOneInUse = true;
                    break; // we just need to know if we need to keep the node
                  }
                }
                // doing a manual replace
                if (atLeastOneInUse) {
                  const index = parent[property].indexOf(node);
                  if (index > -1) {
                    parent[property].splice(index, 1, reqStatement.statement);
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
