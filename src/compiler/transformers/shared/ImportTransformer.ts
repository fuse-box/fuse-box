import * as path from 'path';
import { GlobalContext } from '../../program/GlobalContext';
import { ITransformer } from '../../program/transpileModule';
import { createRequireStatement } from '../../Visitor/helpers';
import { IVisit } from '../../Visitor/Visitor';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { ImportType } from '../../interfaces/ImportType';

// FIX SHORTHANDS
export function ImportTransformer(options?: ITransformerSharedOptions): ITransformer {
  options = options || {};
  return {
    onTopLevelTraverse: (visit: IVisit) => {
      const node = visit.node;
      const global = visit.globalContext as GlobalContext;

      if (node.type === 'ImportDeclaration') {
        // converts "./foo/bar.hello.js" to foo_bar_hello_js_1 (1:1 like typescript does)
        const variable = path.basename(node.source.value).replace(/\.|-/, '_') + '_' + global.getNextIndex();

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
                if (options.onRequireCallExpression) {
                  options.onRequireCallExpression(ImportType.RAW_IMPORT, reqStatement.reqStatement);
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
                if (options.onRequireCallExpression) {
                  options.onRequireCallExpression(ImportType.FROM, reqStatement.reqStatement);
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
}
