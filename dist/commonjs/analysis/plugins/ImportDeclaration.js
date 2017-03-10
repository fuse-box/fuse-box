"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ImportDeclaration {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        if (node.type === "CallExpression" && node.callee) {
            if (node.callee.type === "Identifier" && node.callee.name === "require") {
                let arg1 = node.arguments[0];
                if (analysis.nodeIsString(arg1)) {
                    let requireStatement = this.handleAliasReplacement(file, arg1.value);
                    arg1.value = requireStatement;
                    analysis.addDependency(requireStatement);
                }
            }
        }
        if (node.type === "ImportDeclaration") {
            if (node.source && analysis.nodeIsString(node.source)) {
                let requireStatement = this.handleAliasReplacement(file, node.source.value);
                node.source.value = requireStatement;
                analysis.addDependency(requireStatement);
            }
        }
    }
    static onEnd() { }
    static handleAliasReplacement(file, requireStatement) {
        if (!file.context.experimentalAliasEnabled) {
            return requireStatement;
        }
        const aliasCollection = file.context.aliasCollection;
        aliasCollection.forEach(props => {
            if (props.expr.test(requireStatement)) {
                requireStatement = requireStatement.replace(props.expr, `${props.replacement}$2`);
                file.analysis.requiresRegeneration = true;
            }
        });
        return requireStatement;
    }
}
exports.ImportDeclaration = ImportDeclaration;
