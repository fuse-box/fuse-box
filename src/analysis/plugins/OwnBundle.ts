import { AnalysisPlugin, FileAnalysis } from './../FileAnalysis';
import { File } from "../../core/File";
import * as escodegen from 'escodegen';


/**
 * This plugin exists to understand FuseBox bundles.
 * For example if you bundle fusebox bundle this plugin will ensure 
 * that all redundancies are removed (API wise)
 * 
 * It will understand an uglified version of FuseBox
 * That's why we need OwnVariable plugin
 */
export class OwnBundle implements AnalysisPlugin {
    public fuseBoxMainFile: false;
    constructor(public file: File, public analysis: FileAnalysis) { }

    public onNode(node: any, parent: any) {
        if (node.type === "MemberExpression") {
            if (parent.type === "CallExpression") {
                if (node.object && node.object.type === "Identifier" &&
                    node.object.name === this.analysis.fuseBoxVariable) {
                    if (node.property && node.property.type === "Identifier") {

                        // Extraing main file name from a bundle
                        if (node.property.name === "main") {
                            if (parent.arguments) {
                                let f = parent.arguments[0];
                                if (f && this.analysis.nodeIsString(f)) {
                                    this.fuseBoxMainFile = f.value;
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    public onEnd() {
        if (this.fuseBoxMainFile) {
            // Reset all dependencies if a fusebox bundle is spotted
            this.file.analysis.dependencies = [];
            this.file.isFuseBoxBundle = true;
            // No need in extra footers
            this.removeFuseBoxApiFromBundle();
            const externalCollection = this.file.collection.name !== this.file.context.defaultPackageName;
            if (externalCollection) {
                // Ignore this collection as it will be override by the actual bundle
                this.file.collection.acceptFiles = false;
            } else {
                // otherwise we know that user is referring to a file which is a FuseBox bundle
                // We pnt to the package with entry point
                // e.g require("foobar/index.js")
                this.file.alternativeContent = `module.exports = require("${this.fuseBoxMainFile}")`
            }
        }
    }

    /**
     * Getting rid of redundancies
     */
    private removeFuseBoxApiFromBundle() {
        let ast = this.analysis.ast;
        const fuseVariable = this.analysis.fuseBoxVariable;
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
            this.file.contents = `(function(${fuseVariable})${escodegen.generate(modifiedAst)})(FuseBox);`;
        }
    }
}