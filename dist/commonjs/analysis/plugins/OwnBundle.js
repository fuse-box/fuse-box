"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escodegen = require("escodegen");
class OwnBundle {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        if (node.type === "MemberExpression") {
            if (parent.type === "CallExpression") {
                if (node.object && node.object.type === "Identifier" &&
                    node.object.name === analysis.fuseBoxVariable) {
                    if (node.property && node.property.type === "Identifier") {
                        if (node.property.name === "main") {
                            if (parent.arguments) {
                                let f = parent.arguments[0];
                                if (f && analysis.nodeIsString(f)) {
                                    analysis.fuseBoxMainFile = f.value;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    static onEnd(file) {
        const analysis = file.analysis;
        if (analysis.fuseBoxMainFile) {
            file.analysis.dependencies = [];
            file.isFuseBoxBundle = true;
            this.removeFuseBoxApiFromBundle(file);
            const externalCollection = file.collection.name !== file.context.defaultPackageName;
            if (externalCollection) {
                file.collection.acceptFiles = false;
            }
            else {
                file.alternativeContent = `module.exports = require("${file.analysis.fuseBoxMainFile}")`;
            }
        }
    }
    static removeFuseBoxApiFromBundle(file) {
        let ast = file.analysis.ast;
        const fuseVariable = file.analysis.fuseBoxVariable;
        let modifiedAst;
        if (ast.type === "Program") {
            let first = ast.body[0];
            if (first && first.type === "ExpressionStatement") {
                let expression = first.expression;
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
exports.OwnBundle = OwnBundle;
