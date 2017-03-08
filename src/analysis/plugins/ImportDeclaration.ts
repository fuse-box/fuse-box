import { File } from "../../core/File";

/**
 * Handles require and ImportDeclarations
 * At the moment does not transpile
 */
export class ImportDeclaration {

    /**
     * Extract require statements
     * At the same time replace aliases
     */
    public static onNode(file: File, node: any, parent: any) {
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

    public static onEnd() { }

    /**
     * Replace aliases using the context collection
     */
    private static handleAliasReplacement(file: File, requireStatement: string): string {

        if (!file.context.experimentalAliasEnabled) {
            return requireStatement;
        }
        const aliasCollection = file.context.aliasCollection;
        aliasCollection.forEach(props => {
            if (props.expr.test(requireStatement)) {
                requireStatement = requireStatement.replace(props.expr, `${props.replacement}$2`);
                // only if we need it
                file.analysis.requiresRegeneration = true;
            }
        });
        return requireStatement;
    }
}
