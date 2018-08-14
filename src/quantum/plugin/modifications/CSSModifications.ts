import { each } from "realm-utils";
import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";
import { RequireStatement } from "../../core/nodes/RequireStatement";
import { CSSFile } from "../../core/CSSFile";
import { CSSCollection } from "../../core/CSSCollection";
import { string2RegExp } from "../../../Utils";
import { QuantumBit } from "../QuantumBit";

export class CSSModifications {
	public static async perform(core: QuantumCore, file: FileAbstraction): Promise<void> {
		if (!core.opts.shouldGenerateCSS()) {
			return;
		}
		const forRemoval: RequireStatement[] = [];
		await each(file.requireStatements, (statement: RequireStatement) => {
			if (statement.nodeModuleName === "fuse-box-css") {
				if (statement.ast.$parent && statement.ast.$parent.arguments) {
					const args = statement.ast.$parent.arguments;
					if (args.length !== 2) {
						return;
					}
					const cssPath = args[0].value;
					const cssRaw = args[1].value;
					const cssFile = new CSSFile(cssPath, cssRaw, statement.file.packageAbstraction.name);
					let collection;
					if (file.quantumBit) {
						collection = this.getQuantumBitCollection(core, file.quantumBit);
					} else {
						collection = this.getCSSCollection(core, cssFile);
					}
					collection.add(cssFile);
					core.postTasks.add(() => {
						this.removeStatement(statement);
					});
					forRemoval.push(statement);
				}
			}
		});
		forRemoval.forEach(statement => {
			file.requireStatements.delete(statement);
		});
	}

	private static getQuantumBitCollection(core: QuantumCore, bit: QuantumBit) {
		const group = bit.name;
		let collection = core.cssCollection.get(group);
		if (!collection) {
			// Collection doesn't exist yet, so lets create it.
			collection = new CSSCollection(core);
			core.api.addRemoteLoading();
			core.api.addCSSLoader();
			collection.quantumBit = bit;
			bit.cssCollection = collection;
			collection.splitCSS = true;
			core.cssCollection.set(group, collection);
		}
		return collection;
	}

	private static removeStatement(statement: RequireStatement) {
		const info = statement.removeCallExpression();
		const target = statement.file;
		if (info.success) {
			if (info.empty) {
				target.markForRemoval();
			}
			return;
		}
		target.dependents.forEach(dependent => {
			dependent.requireStatements.forEach(depStatement => {
				const targetStatement = depStatement.resolve();
				const matched = targetStatement === target;
				if (matched) {
					depStatement.remove();
				}
			});
		});
	}

	private static getCSSGroup(core: QuantumCore, cssFile: CSSFile): string {
		for (let key in core.opts.getCSSFiles()) {
			let [packageName, pattern] = key.split("/", 2);
			if (!pattern) {
				pattern = "*";
			}
			const regex = string2RegExp(pattern);
			if ((packageName === "*" || packageName === cssFile.packageName) && regex.test(cssFile.name)) {
				return key;
			}
		}

		return "default";
	}

	private static getCSSCollection(core: QuantumCore, cssFile: CSSFile): CSSCollection {
		const group = this.getCSSGroup(core, cssFile);
		let collection = core.cssCollection.get(group);
		if (!collection) {
			// Collection doesn't exist yet, so lets create it.
			collection = new CSSCollection(core);
			core.cssCollection.set(group, collection);
		}

		return collection;
	}
}
