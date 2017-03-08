import { File } from "../../core/File";
import { nativeModules, HeaderImport } from "./../HeaderImport";

/**
 * Checks if a variable needs to magically imported
 * Yes, this is a black magic.
 * For example you reference
 *   process.env
 *
 * Browser does not have it globally, so instead of polluting the window
 * we inject
 *   var process = require("process")
 *
 * That's a very delicate subject as it's possible (yes) to break but only intentionally
 */
export class AutoImport {

    public static onNode(file: File, node: any, parent: any) {
        const analysis = file.analysis;
        if (node.type === "Identifier") {
            // here we dicide we can inject
            // there are many conditions where injection should not happen
            if (nativeModules.has(node.name) && !analysis.bannedImports[node.name]) {
                const isProperty = parent.type && parent.type === "Property";
                const isFunction = parent.type
                    && (parent.type === "FunctionExpression" ||
                        parent.type === "FunctionDeclaration"
                    ) && parent.params;
                const isDeclaration = parent.type === "VariableDeclarator" || parent.type === "FunctionDeclaration";

                if (isProperty || isFunction || parent && isDeclaration
                    && parent.id && parent.id.type === "Identifier" && parent.id.name === node.name) {
                    delete analysis.nativeImports[node.name];
                    if (!analysis.bannedImports[node.name]) {
                        analysis.bannedImports[node.name] = true;
                    }
                } else {
                    analysis.nativeImports[node.name] = nativeModules.get(node.name);
                }
            }
        }
    }

    /**
     * Add found dependencies
     * Add require statement to the content
     */
    public static onEnd(file: File) {
        const analysis = file.analysis;
        for (let nativeImportName in analysis.nativeImports) {
            if (analysis.nativeImports.hasOwnProperty(nativeImportName)) {
                const nativeImport : HeaderImport = analysis.nativeImports[nativeImportName];
                analysis.dependencies.push(nativeImport.pkg);
                file.addHeaderContent(nativeImport.getImportStatement());
            }
        }
    }
}
