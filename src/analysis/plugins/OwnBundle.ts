import { File } from "../../core/File";
import * as escodegen from "escodegen";


function extractMainFileFromPackageEntry(input: string) {
    let res = input.split("/");
    if (res.length > 1) {
        return res.splice(1).join("/");
    }
}
/**
 * This plugin exists to understand FuseBox bundles.
 * For example if you bundle fusebox bundle this plugin will ensure
 * that all redundancies are removed (API wise)
 *
 * It will understand an uglified version of FuseBox
 * That's why we need OwnVariable plugin
 */
export class OwnBundle {

    public static onNode(file: File, node: any, parent: any) {
        const analysis = file.analysis;
        if (file.collection && file.collection.entryFile && node.type === "MemberExpression") {
            if (parent.type === "CallExpression") {
                if (node.object && node.object.type === "Identifier" &&
                    node.object.name === analysis.fuseBoxVariable) {
                    if (node.property && node.property.type === "Identifier") {

                        // Extraing main file name from a bundle
                        if (node.property.name === "main") {
                            if (parent.arguments) {
                                let f = parent.arguments[0];
                                if (f && analysis.nodeIsString(f)) {
                                    const extractedEntry = extractMainFileFromPackageEntry(f.value);
                                    if (extractedEntry && file.collection) {
                                        file.collection.entryFile.info.fuseBoxPath = extractedEntry;
                                    }
                                    analysis.fuseBoxMainFile = f.value;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public static onEnd(file: File) {
        const analysis = file.analysis;

        if (analysis.fuseBoxMainFile) {
            // Reset all dependencies if a fusebox bundle is spotted
            file.analysis.dependencies = [];
            file.isFuseBoxBundle = true;
            // No need in extra footers
            this.removeFuseBoxApiFromBundle(file);
            const externalCollection = file.collection.name !== file.context.defaultPackageName;

            if (externalCollection) {
                // Ignore this collection as it will be override by the actual bundle
                file.collection.acceptFiles = false;
            } else {
                // otherwise we know that user is referring to a file which is a FuseBox bundle
                // We pnt to the package with entry point
                // e.g require("foobar/index.js")
                file.alternativeContent = `module.exports = require("${file.analysis.fuseBoxMainFile}")`;
            }
        }
    }

    /**
     * Getting rid of redundancies
     */
    private static removeFuseBoxApiFromBundle(file: File) {
        let ast = file.analysis.ast;
        const fuseVariable = file.analysis.fuseBoxVariable;
        let modifiedAst;
        if (ast.type === "Program") {
            let first = ast.body[0];

            if (first && first.type === "ExpressionStatement") {
                let expression = first.expression;
                // handled uglified version
                if (expression.type === "UnaryExpression" && expression.operator === "!") {
                    expression = expression.argument || {};
                }

                if (expression.type === "CallExpression") {
                    let callee = expression.callee;
                    if (callee.type === "FunctionExpression") {
                        if (callee.params && callee.params[0]) {
                            let param1 = callee.params[0];

                            if (param1.type === "Identifier" && param1.name === fuseVariable) {
                                modifiedAst = callee.body;
                            }
                        }
                    }
                }
            }
        }
        if (modifiedAst) {
            file.contents = `(function(${fuseVariable})${escodegen.generate(modifiedAst)})(FuseBox);`;
        }
    }
}
