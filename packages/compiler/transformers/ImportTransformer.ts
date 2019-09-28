import * as path from "path";
import { ASTNode } from "../interfaces/AST";
import { GlobalContext } from "../program/GlobalContext";
import { createRequireStatement, defineVariable } from "../Visitor/helpers";
import { IVisit } from "../Visitor/Visitor";
import { ITransformer } from "../program/transpileModule";

// FIX SHORTHANDS
export function ImportTransformer(): ITransformer {
  return {
    onTopLevelTraverse: (visit: IVisit) => {
      const node = visit.node;
      const global = visit.globalContext as GlobalContext;

      if (node.type === "ImportDeclaration") {
        // converts "./foo/bar.hello.js" to foo_bar_hello_js_1 (1:1 like typescript does)
        const variable =
          path.basename(node.source.value).replace(/\.|-/, "_") +
          "_" +
          global.getNextIndex();

        let afterStatement: ASTNode;

        node.specifiers.forEach(specifier => {
          if (specifier.type === "ImportSpecifier") {
            global.identifierReplacement[specifier.local.name] = {
              first: variable,
              second: specifier.imported.name
            };
          } else if (specifier.type === "ImportDefaultSpecifier") {
            global.identifierReplacement[specifier.local.name] = {
              first: variable,
              second: "default"
            };
          } else if (specifier.type === "ImportNamespaceSpecifier") {
            // only if we have more than one specifier
            // for instance
            // import MySuperClass, * as everything from "module-name";

            // in every other case like:
            // import * as everything from "module-name";
            // we don't need to do anything, since the variables should match

            global.identifierReplacement[specifier.local.name] = {
              first: variable
            };

            if (node.specifiers.length > 1)
              afterStatement = defineVariable(variable, specifier.local.name);
          }
        });

        const reqStatement = createRequireStatement(
          node.source.value,
          node.specifiers.length && variable
        );
        if (afterStatement)
          return { replaceWith: [reqStatement, afterStatement] };
        return {
          replaceWith: reqStatement
        };
      }
    }
  };
}
