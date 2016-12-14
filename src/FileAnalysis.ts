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


    /**
     * Consuming contents with analysis
     * 
     * 
     * @memberOf FileAST
     */
    public process() {
        this.parse();
        this.analyze();
    }



    /**
     * 
     * 
     * @private
     * 
     * @memberOf FileAST
     */
    private parse() {
        this.ast = acorn.parse(this.file.contents, {
            sourceType: "module",
            tolerant: true,
            ecmaVersion: 8,
            plugins: { es7: true, jsx: true },
            jsx: { allowNamespacedObjects: true }
        });
    }

    private analyze() {
        let out = {
            requires: [],
            processDeclared: false,
            processRequired: false,
            fuseBoxBundle: false,
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
                                if (node.property.name === "pkg") {
                                    out.fuseBoxBundle = true;
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
                    if (node.source && node.source.type === "Literal") {
                        out.requires.push(node.source.value);
                    }
                }
                if (node.type === "CallExpression") {
                    if (node.callee.type === "Identifier" && node.callee.name === "require") {
                        let arg1 = node.arguments[0];
                        if (arg1.type === "Literal") {
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

        // Reset all dependencies if a fusebox bundle spotted
        if (out.fuseBoxBundle) {
            this.file.isFuseBoxBundle = true;
            this.removeFuseBoxApiFromBundle();
            this.dependencies = [];
        }
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
