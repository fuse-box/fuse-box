import { AutoImportedModule } from "../../core/AutoImportedModule";
import { File } from "../../core/File";

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
    static onNode(file: File, node: any, parent: any) {
        const analysis = file.analysis;
        const modules = file.context.autoImportConfig;
        if (node.type === "Identifier") {
            // here we dicide we can inject
            // there are many conditions where injection should not happen
            if (modules[node.name] && !analysis.bannedImports[node.name]) {
                const belongsToAnotherObject =
                    parent.type === "MemberExpression" &&
                    parent.object &&
                    parent.object.type === "Identifier" &&
                    parent.object.name !== node.name;

                if (belongsToAnotherObject) {
                    return;
                }

                const isProperty =
                    parent.type && parent.type === "Property" && parent.value && parent.value.name !== node.name;

                const isFunction =
                    parent.type &&
                    (parent.type === "FunctionExpression" || parent.type === "FunctionDeclaration") &&
                    parent.params;
                const isDeclaration = parent.type === "VariableDeclarator" || parent.type === "FunctionDeclaration";

                if (
                    isProperty ||
                    isFunction ||
                    (parent &&
                        isDeclaration &&
                        parent.id &&
                        parent.id.type === "Identifier" &&
                        parent.id.name === node.name)
                ) {
                    delete analysis.nativeImports[node.name];
                    if (!analysis.bannedImports[node.name]) {
                        analysis.bannedImports[node.name] = true;
                    }
                } else {
                    analysis.nativeImports[node.name] = modules[node.name];
                }
            }
        }
    }

    /**
     * Add found dependencies
     * Add require statement to the content
     */
    static onEnd(file: File) {
        const analysis = file.analysis;
        if (file.headerContent) {
            file.headerContent = [];
        }
        for (const nativeImportName in analysis.nativeImports) {
            if (analysis.nativeImports.hasOwnProperty(nativeImportName)) {
                const nativeImport: AutoImportedModule = analysis.nativeImports[nativeImportName];
                analysis.dependencies.push(nativeImport.pkg);
                file.addHeaderContent(nativeImport.getImportStatement());
            }
        }
    }
}
