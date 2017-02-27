import { AnalysisPlugin, FileAnalysis } from './../FileAnalysis';
import { File } from "../../core/File";
import { nativeModules, HeaderImport } from './../HeaderImport';

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
export class AutoImport implements AnalysisPlugin {
    private bannedImports = {};
    private nativeImports = {};

    constructor(public file: File, public analysis: FileAnalysis) { }

    public onNode(node: any, parent: any) {
        if (node.type === "Identifier") {
            // here we dicide we can inject
            // there are many conditions where injection should not happen
            if (nativeModules.has(node.name) && !this.bannedImports[node.name]) {
                const isProperty = parent.type && parent.type === "Property";
                const isFunction = parent.type
                    && (parent.type === "FunctionExpression" ||
                        parent.type === "FunctionDeclaration"
                    ) && parent.params;
                const isDeclaration = parent.type === "VariableDeclarator" || parent.type === "FunctionDeclaration";

                if (isProperty || isFunction || parent && isDeclaration
                    && parent.id && parent.id.type === "Identifier" && parent.id.name === node.name) {
                    delete this.nativeImports[node.name];
                    if (!this.bannedImports[node.name]) {
                        this.bannedImports[node.name] = true;
                    }
                } else {
                    this.nativeImports[node.name] = nativeModules.get(node.name);
                }
            }
        }
    }

    /**
     * Add found dependencies
     * Add require statement to the content
     */
    public onEnd() {
        for (let nativeImportName in this.nativeImports) {
            if (this.nativeImports.hasOwnProperty(nativeImportName)) {
                const nativeImport: HeaderImport = this.nativeImports[nativeImportName];
                this.analysis.dependencies.push(nativeImport.pkg);
                this.file.addHeaderContent(nativeImport.getImportStatement());
            }
        }
    }
}