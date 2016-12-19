"use strict";
const acorn = require("acorn");
const traverse = require("ast-traverse");
const escodegen = require("escodegen");
require("acorn-es7")(acorn);
require("acorn-jsx/inject")(acorn);
class FileAnalysis {
    constructor(file) {
        this.file = file;
        this.wasAnalysed = false;
        this.skipAnalysis = false;
        this.dependencies = [];
    }
    astIsLoaded() {
        return this.ast !== undefined;
    }
    loadAst(ast) {
        this.ast = ast;
    }
    skip() {
        this.skipAnalysis = true;
    }
    parseUsingAcorn() {
        this.ast = acorn.parse(this.file.contents, {
            sourceType: "module",
            tolerant: true,
            ecmaVersion: 8,
            plugins: { es7: true, jsx: true },
            jsx: { allowNamespacedObjects: true }
        });
    }
    analyze() {
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
        };
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
            this.dependencies = [];
            this.file.isFuseBoxBundle = true;
            this.removeFuseBoxApiFromBundle();
            if (out.fuseBoxMain) {
                this.file.alternativeContent = `module.exports = require("${out.fuseBoxMain}")`;
            }
        }
        this.wasAnalysed = true;
    }
    removeFuseBoxApiFromBundle() {
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
exports.FileAnalysis = FileAnalysis;
