import { AnalysisPlugin, FileAnalysis } from './../FileAnalysis';
import { File } from "../../core/File";

/**
 * Handles require and ImportDeclarations
 * At the moment does not transpile 
 */
export class ImportDeclaration implements AnalysisPlugin {
    constructor(public file: File, public analysis: FileAnalysis) { }

    /**
     * Extract require statements
     * At the same time replace aliases
     */
    public onNode(node: any, parent: any) {

        if (node.type === "CallExpression" && node.callee) {
            if (node.callee.type === "Identifier" && node.callee.name === "require") {
                let arg1 = node.arguments[0];
                if (this.analysis.nodeIsString(arg1)) {
                    let requireStatement = this.handleAliasReplacement(arg1.value);
                    arg1.value = requireStatement;
                    this.analysis.addDependency(requireStatement)
                }
            }
        }
        if (node.type === "ImportDeclaration") {
            if (node.source && this.analysis.nodeIsString(node.source)) {
                this.analysis.addDependency(node.source.value);
            }
        }
    }


    public onEnd() { }

    /**
     * Replace aliases using the context collection
     */
    private handleAliasReplacement(requireStatement: string): string {

        if (!this.file.context.experimentalAliasEnabled) {
            return requireStatement;
        }
        const aliasCollection = this.file.context.aliasCollection;
        aliasCollection.forEach(props => {
            if (props.expr.test(requireStatement)) {
                requireStatement = requireStatement.replace(props.expr, `${props.replacement}$2`);
                // only if we need it
                this.file.analysis.requiresRegeneration = true;
            }
        });
        return requireStatement;
    }
}