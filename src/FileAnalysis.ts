import { ASTTraverse } from "./ASTTraverse";
import { PrettyError } from "./PrettyError";
import { File } from "./File";
import { nativeModules, HeaderImport } from './HeaderImport';
const acorn = require("acorn");
const escodegen = require("escodegen");
require("acorn-es7")(acorn);
require("acorn-jsx/inject")(acorn);


const isDeclaration = (node) => {

    return node.type === "VariableDeclarator" || node.type === "FunctionDeclaration";
}

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
    private fuseBoxVariable = "FuseBox";

    private requiresRegeneration = false;

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
    public parseUsingAcorn(options?: any) {
        try {
            this.ast = acorn.parse(this.file.contents, {
                ...options || {}, ...{
                    sourceType: "module",
                    tolerant: true,
                    ecmaVersion: 8,
                    plugins: { es7: true, jsx: true },
                    jsx: { allowNamespacedObjects: true }
                }
            });
        } catch (err) {
            return PrettyError.errorWithContents(err, this.file);
        }
    }


    public handleAliasReplacement(requireStatement: string): string {

        if (!this.file.context.experimentalAliasEnabled) {
            return requireStatement;
        }
        // enable aliases only for the current project
        // if (this.file.collection.name !== this.file.context.defaultPackageName) {
        //    return requireStatement;
        // }

        const aliasCollection = this.file.context.aliasCollection;
        aliasCollection.forEach(props => {
            if (props.expr.test(requireStatement)) {
                requireStatement = requireStatement.replace(props.expr, `${props.replacement}$2`);
                // only if we need it
                this.requiresRegeneration = true;
            }
        });
        return requireStatement;
    }

    public analyze() {
        // We don't want to make analysis 2 times
        if (this.wasAnalysed || this.skipAnalysis) {
            return;
        }
        const nativeImports = {};
        const bannedImports = {};

        let out = {
            requires: [],
            fuseBoxBundle: false,
            fuseBoxMain: undefined
        };

        let isString = (node) => {
            return node.type === "Literal" || node.type === "StringLiteral";
        }


        ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) => {
                if (node.type === "Identifier") {

                    if (node.name === "$fuse$") {
                        this.fuseBoxVariable = parent.object.name;
                    } else {

                        if (nativeModules.has(node.name) && !bannedImports[node.name]) {

                            const isProperty = parent.type && parent.type === "Property";
                            const isFunctionExpression = parent.type && parent.type === "FunctionExpression" && parent.params;

                            if (isProperty || isFunctionExpression || parent && isDeclaration(parent)
                                && parent.id && parent.id.type === "Identifier" && parent.id.name === node.name) {
                                delete nativeImports[node.name];
                                if (!bannedImports[node.name]) {
                                    bannedImports[node.name] = true;
                                }
                            } else {
                                nativeImports[node.name] = nativeModules.get(node.name);
                            }
                        }
                    }
                }

                if (node.type === "MemberExpression") {
                    if (parent.type === "CallExpression") {
                        if (node.object && node.object.type === "Identifier" && node.object.name === this.fuseBoxVariable) {
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

                if (node.type === "ImportDeclaration") {
                    if (node.source && isString(node.source)) {
                        out.requires.push(node.source.value);
                    }
                }
                if (node.type === "CallExpression" && node.callee) {

                    if (node.callee.type === "Identifier" && node.callee.name === "require") {
                        let arg1 = node.arguments[0];
                        if (isString(arg1)) {
                            let requireStatement = this.handleAliasReplacement(arg1.value);
                            arg1.value = requireStatement;
                            out.requires.push(requireStatement);
                        }
                    }
                }
            }
        });

        out.requires.forEach(name => {
            this.dependencies.push(name);
        });
        // inject imports
        for (let nativeImportName in nativeImports) {
            if (nativeImports.hasOwnProperty(nativeImportName)) {
                const nativeImport: HeaderImport = nativeImports[nativeImportName];
                this.dependencies.push(nativeImport.pkg);
                this.file.addHeaderContent(nativeImport.getImportStatement());
            }
        }

        if (out.fuseBoxBundle) {
            // Reset all dependencies if a fusebox bundle is spotted
            this.dependencies = [];
            this.file.isFuseBoxBundle = true;
            // No need in extra footers
            this.removeFuseBoxApiFromBundle();
            if (out.fuseBoxMain) {
                const externalCollection = this.file.collection.name !== this.file.context.defaultPackageName;
                if (externalCollection) {
                    // Ignore this collection as it will be override by the actual bundle
                    this.file.collection.acceptFiles = false;
                } else {
                    // otherwise we know that user is referring to a file which is a FuseBox bundle
                    // We point to the package with entry point
                    // e.g require("foobar/index.js")
                    this.file.alternativeContent = `module.exports = require("${out.fuseBoxMain}")`
                }
            }
        }
        this.wasAnalysed = true;
        // regenerate content
        if (this.requiresRegeneration) {
            this.file.contents = escodegen.generate(this.ast);
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
                // handled uglified version
                if (expression.type === "UnaryExpression" && expression.operator === "!") {
                    expression = expression.argument || {};
                }

                if (expression.type === "CallExpression") {
                    let callee = expression.callee;
                    if (callee.type === "FunctionExpression") {
                        if (callee.params && callee.params[0]) {
                            let param1 = callee.params[0];

                            if (param1.type === "Identifier" && param1.name === this.fuseBoxVariable) {
                                modifiedAst = callee.body;
                            }
                        }
                    }
                }
            }
        }
        if (modifiedAst) {
            this.file.contents = `(function(${this.fuseBoxVariable})${escodegen.generate(modifiedAst)})(FuseBox);`;
        }
    }
}
