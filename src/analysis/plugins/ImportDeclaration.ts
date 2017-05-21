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
                } else {
									//todo: import is not a constant string => calculate/error/warn
								}
            }
        }
        if (node.type === "CallExpression" && node.callee) {
            if (node.callee.type === "Identifier" && node.callee.name === "define") {
                let arg1 = node.arguments[0];
								if('ArrayExpression'=== arg1.type) {
									for(let importName of arg1.elements) {
										if (analysis.nodeIsString(importName)) {
											if(!~['require', 'exports'].indexOf(importName)) {
												let requireStatement = this.handleAliasReplacement(file, importName.value);
												importName.value = requireStatement;
												analysis.addDependency(requireStatement);
											}
										} else {
											//todo: import is not a constant string => calculate/error/warn
										}
									}
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

        // checking for browser override (asap) case
        // these people ...
        // https://github.com/defunctzombie/package-browser-field-spec
        if (file.info.nodeModuleInfo) {
            const overrides = file.info.nodeModuleInfo.browserOverrides;
            if (overrides) {
                if (overrides[requireStatement]) {
                    requireStatement = overrides[requireStatement];
                }
            }
        }

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
