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
					if (requireStatement) {
						analysis.registerReplacement(arg1.value, requireStatement);
						arg1.value = requireStatement;
						analysis.addDependency(requireStatement);
					}
				}
			}
		}

		if (node.type === "ExportDefaultDeclaration") {
			file.es6module = true;
		}
		if (node.type === "ExportAllDeclaration") {
			file.es6module = true;
			analysis.addDependency(node.source.value);
		}

		if (node.type === "ImportDeclaration" || node.type === "ExportNamedDeclaration") {
			file.es6module = true;
			if (node.source && analysis.nodeIsString(node.source)) {
				let requireStatement = this.handleAliasReplacement(file, node.source.value);
				node.source.value = requireStatement;
				analysis.addDependency(requireStatement);
			}
		}
	}

	public static onEnd(file: File) {
		if (file.es6module) {
			file.analysis.requiresTranspilation = true;
		}
	}

	/**
	 * Replace aliases using the context collection
	 */
	private static handleAliasReplacement(file: File, requireStatement: string): string {
		// checking for browser override (asa) case
		// these people ...
		// https://github.com/defunctzombie/package-browser-field-spec
		if (file.collection && file.collection.info && file.collection.info.browserOverrides) {
			const overrides = file.collection.info.browserOverrides;
			const pm = file.collection.pm;

			if (overrides) {
				if (overrides[requireStatement] !== undefined) {
					if (typeof overrides[requireStatement] === "string") {
						requireStatement = overrides[requireStatement];
					} else {
						if (overrides[requireStatement] === false) {
							// which means that's the package should not be bundled and return undefined;
							file.analysis.registerReplacement(requireStatement, "fuse-empty-package");
							file.analysis.addDependency("fuse-empty-package");
							return;
						}
					}
				} else {
					const resolved = pm.resolve(requireStatement, file.info.absDir);
					// it might be solved to a node_module
					if (resolved && resolved.absPath) {
						const fuseBoxPath = pm.getFuseBoxPath(resolved.absPath, file.collection.entryFile.info.absDir);
						if (overrides[fuseBoxPath] !== undefined) {
							if (typeof overrides[fuseBoxPath] === "string") {
								requireStatement = overrides[fuseBoxPath];
							} else {
								if (overrides[fuseBoxPath] === false) {
									// which means that's the package should not be bundled and return undefined;
									file.analysis.registerReplacement(requireStatement, "fuse-empty-package");
									file.analysis.addDependency("fuse-empty-package");
									return;
								}
								return;
							}
						}
					}
				}
			}
		}

		let result = file.context.replaceAliases(requireStatement);
		return result.requireStatement;
	}
}
