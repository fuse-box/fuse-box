import { PrettyError } from './PrettyError';
import { File } from "./File";
const acorn = require("acorn");
const traverse = require("ast-traverse");
const escodegen = require("escodegen");
require("acorn-es7")(acorn);
require("acorn-jsx/inject")(acorn);

/**
 * Makes static analysis on the code
 * Gets require statements (es5 and es6) 
 * 
 * Adds additional injections (if needed)
 * 
 * @export
 * @class FileAST
 */
export class FileAnalysis {

    /**
     * Acorn AST
     * 
     * @type {*}
     * @memberOf FileAST
     */
    public ast: any;

    private wasAnalysed = false;
    private skipAnalysis = false;



    /**
     * A list of dependencies 
     * 
     * @type {string[]}
     * @memberOf FileAST
     */
    public dependencies: string[] = [];

    /**
     * Creates an instance of FileAST.
     * 
     * @param {File} file
     * 
     * @memberOf FileAST
     */
    constructor(public file: File) { }

    public astIsLoaded(): boolean {
        return this.ast !== undefined;
    }


    /**
     * Loads an AST
     * 
     * @param {*} ast
     * 
     * @memberOf FileAnalysis
     */
    public loadAst(ast: any) {
        this.ast = ast;
    }

    public skip() {
        this.skipAnalysis = true;
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf FileAST
     */
    public parseUsingAcorn() {
        try {
            this.ast = acorn.parse(this.file.contents, {
                sourceType: "module",
                tolerant: true,
                ecmaVersion: 8,
                plugins: { es7: true, jsx: true },
                jsx: { allowNamespacedObjects: true }
            });
        } catch (err) {
            return PrettyError.errorWithContents(err, this.file);
        }
    }

    public analyze() {
        // We don't want to make analysis 2 times
        if (this.wasAnalysed || this.skipAnalysis) {
            return;
        }


        let out = {
            requires: [],
            processDeclared: false,
            processRequired: false,
            fuseBoxBundle: false,
            fuseBoxMain: undefined
        };

        let isString = (node) => {
            return node.type === "Literal" || node.type === "StringLiteral";
        }

        traverse(this.ast, {
            pre: (node, parent, prop, idx) => {

                if (node.type === "MemberExpression") {
                    if (node.object && node.object.type === "Identifier") {
                        if (node.object.name === "process") {
                            out.processRequired = true;
                        }
                    }
                    if (parent.type === "CallExpression") {
                        if (node.object && node.object.type === "Identifier" && node.object.name === "FuseBox") {
                            if (node.property && node.property.type === "Identifier") {

                                // Extraing main file name from a bundle
                                if (node.property.name === "main") {
                                    if (parent.arguments) {
                                        let f = parent.arguments[0];
                                        if (f && isString(f)) {
                                            out.fuseBoxMain = f.value;
                                            out.fuseBoxBundle = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (node.type === "VariableDeclarator") {
                    if (node.id && node.id.type === "Identifier" && node.id.name === "process") {
                        out.processDeclared = true;
                    }
                }
                if (node.type === "ImportDeclaration") {
                    if (node.source && isString(node.source)) {
                        out.requires.push(node.source.value);
                    }
                }
                if (node.type === "CallExpression") {

                    if (node.callee.type === "Identifier" && node.callee.name === "require") {
                        let arg1 = node.arguments[0];
                        if (isString(arg1)) {
                            out.requires.push(arg1.value);
                        }
                    }
                }
            }
        });
        out.requires.forEach(name => {
            this.dependencies.push(name);
        });
        if (!out.processDeclared) {
            if (out.processRequired) {
                this.dependencies.push("process");
                this.file.addHeaderContent(`var process = require("process");`);
            }
        }


        if (out.fuseBoxBundle) {
            // Reset all dependencies if a fusebox bundle is spotted
            this.dependencies = [];
            this.file.isFuseBoxBundle = true;
            // No need in extra footers
            this.removeFuseBoxApiFromBundle();
            if (out.fuseBoxMain) {
                this.file.alternativeContent = `module.exports = require("${out.fuseBoxMain}")`
            }
        }
        this.wasAnalysed = true;
    }

    /**
     * Removes a footer with FuseBox API
     * In case a file we require appears to be a bundle
     * 
     * @private
     * 
     * @memberOf FileAnalysis
     */
    private removeFuseBoxApiFromBundle() {
        let ast = this.ast;
        let modifiedAst;
        if (ast.type === "Program") {
            let first = ast.body[0];
            if (first && first.type === "ExpressionStatement") {
                let expression = first.expression;
                if (expression.type === "CallExpression") {
                    let callee = expression.callee;
                    if (callee.type === "FunctionExpression") {
                        if (callee.params && callee.params[0]) {
                            let param1 = callee.params[0];
                            if (param1.type === "Identifier" && param1.name === "FuseBox") {
                                modifiedAst = callee.body;
                            }
                        }
                    }
                }
            }
        }
        if (modifiedAst) {
            this.file.contents = `(function()${escodegen.generate(modifiedAst)})();`;
        }
    }
}
