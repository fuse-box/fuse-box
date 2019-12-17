import { ITransformer } from '../../program/transpileModule';
import { IVisit } from '../../Visitor/Visitor';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { ImportType } from '../../interfaces/ImportType';
import { GlobalContext } from '../../program/GlobalContext';

/**
 * The purpose of this transformer is to emit import statements for assemble to pick them up
 * WE should consider:
 * - Unused imports should be ignored and not emitted
 * - Reference to typings should be ignored too
 * - Reference with method decorators should be emitted
 * - Dynamic imports should be emitted too
 */
export function InitialModuleReferenceTransformer(options: ITransformerSharedOptions): ITransformer {
  const localRefs = {};
  return {
    onTopLevelTraverse: (visit: IVisit) => {
      const node = visit.node;
      if (node.type === 'ImportEqualsDeclaration') {
        if (options.onRequireCallExpression) {
          options.onRequireCallExpression(ImportType.RAW_IMPORT, node, node.moduleReference.expression.value);
        }
        return;
      }
      if (node.type === 'ImportDeclaration') {
        node.specifiers.forEach(specifier => {
          if (specifier.type === 'ImportSpecifier') {
            localRefs[specifier.local.name] = { used: 0 };
          } else if (specifier.type === 'ImportDefaultSpecifier') {
            localRefs[specifier.local.name] = { used: 0 };
          } else if (specifier.type === 'ImportNamespaceSpecifier') {
            localRefs[specifier.local.name] = { used: 0 };
          }
        });

        return {
          onComplete: () => {
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
                  options.onRequireCallExpression(ImportType.RAW_IMPORT, node, node.source.value);
                }
              }
              return;
            }

            let atLeastOneInUse = false;
            for (const specifier of node.specifiers) {
              const traced = localRefs[specifier.local.name];
              if (traced && traced.used) {
                atLeastOneInUse = true;
                break; // we just need to know if we need to keep the node
              }
            }

            if (atLeastOneInUse) {
              const index = parent[property].indexOf(node);
              if (index > -1) {
                if (options.onRequireCallExpression) {
                  options.onRequireCallExpression(ImportType.FROM, node);
                }
              }
            } else {
              const index = parent[property].indexOf(node);
              if (index > -1) parent[property].splice(index, 1);
            }
          },
        };
      } else if (node.source) {
        // everything else could be export ... from "source"
        options.onRequireCallExpression(ImportType.FROM, node, node.source.value);
      }
    },
    onEachNode: visit => {
      const node = visit.node;

      const locals = visit.scope && visit.scope.locals ? visit.scope.locals : {};

      // grab require statements
      if (node.type === 'CallExpression' && node.callee.name === 'require' && !node['emitted']) {
        if (!locals[node.name]) {
          options.onRequireCallExpression(ImportType.REQUIRE, node);
        }
      } else if (node.type === 'ImportExpression') {
        options.onRequireCallExpression(ImportType.DYNAMIC, node);
      }

      if (node.type === 'ObjectPattern') {
        for (const item of node.properties) {
          item.$assign_pattern = true;
        }
      }
      let shorthand;
      if (node.type === 'Property' && node.shorthand === true) {
        if (node.value && node.value.type === 'Identifier') {
          shorthand = node.value;
        }
      }

      if (visit.isLocalIdentifier || (shorthand && !node.$assign_pattern)) {
        let nodeName;
        if (shorthand) nodeName = shorthand.name;
        else nodeName = node.name;

        // if it belongs to a function "someFunc(foo){}"

        const traced = localRefs[nodeName];

        // traced.replaced is confusing, fails on
        //      import * as hey from "./oi"
        //      hey.something();

        if (traced) {
          if (locals[nodeName] === 1) {
            return;
          }
          localRefs[nodeName].used = 1;
        }
      }
    },
  };
}
