import { Bundle } from "../../core/Bundle";
import { Concat } from "../../Utils";
import { BundleAbstraction } from "../core/BundleAbstraction";
import { FileAbstraction } from "../core/FileAbstraction";
import { QuantumCore } from "./QuantumCore";

export class FlatFileGenerator {
	public contents: Concat;
	public entryId;
	public globals: Map<string, string>;
	public sourceMapsPath: string;
	constructor(public core: QuantumCore, public bundleAbstraction?: BundleAbstraction) {
		this.contents = new Concat(true, "", "\n");
		this.globals = new Map<string, string>();
	}

	public setGlobals(packageName: string, fileID: string) {
		this.globals.set(packageName, fileID);
	}

	public init() {
		if (this.core.opts.isTargetBrowser() || this.core.opts.isTargetUniveral()) {
			if (this.core.opts.isContained()) {
				this.contents.add(null, "(function(){\n/*$$CONTAINED_API_PLACEHOLDER$$*/");
			} else {
				this.contents.add(null, `(function(${this.core.opts.quantumVariableName}){`);
			}
		} else {
			if (this.core.opts.isContained()) {
				this.contents.add(null, "/*$$CONTAINED_API_PLACEHOLDER$$*/");
			}
		}
	}

	public async addFile(file: FileAbstraction, ensureES5 = false) {
		if (file.canBeRemoved) {
			return;
		}
		let args: string[] = [];

		if (file.isExportInUse()) {
			args.push("module");
		}
		if (file.isExportStatementInUse()) {
			args.push("exports");
		}
		if (args.length) {
			file.wrapWithFunction(args);
		}
		let fileId = file.getID();
		if (file.isEntryPoint) {
			this.entryId = fileId;
		}
		this.contents.add(null, `// ${file.packageAbstraction.name}/${file.fuseBoxPath}`);
		this.contents.add(null, `${this.core.opts.quantumVariableName}.f[${JSON.stringify(fileId)}] =`);
		const cnt = await file.generate(ensureES5);

		this.contents.add(null, cnt.content.toString(), cnt.sourceMap);
	}

	public addHoistedVariables() {
		this.bundleAbstraction.hoisted.forEach((item, key) => {
			this.contents.add(null, `var ${key} = ${this.core.opts.quantumVariableName}.r(${item.getID()});`);
		});
	}

	public render(bundle: Bundle) {
		if (this.bundleAbstraction) {
			this.addHoistedVariables();

			if (this.bundleAbstraction.globalVariableRequired) {
				const defineGlobalFn = "var global = window";
				if (this.core.opts.isTargetBrowser()) {
					this.contents.add(null, defineGlobalFn);
				}
			}
		}

		if (this.core.opts.isTargetBrowser()) {
			this.globals.forEach((fileID, globalName) => {
				const req = `${this.core.opts.quantumVariableName}.r(${JSON.stringify(fileID)})`;
				if (globalName == "*") {
					this.contents.add(null, `var r = ${req}`);
					this.contents.add(null, `if (r){for(var i in r){ window[i] = r[i] }}`);
				} else {
					this.contents.add(null, `window['${globalName}']=${req}`);
				}
			});
		}

		if (this.entryId !== undefined) {
			const req = `${this.core.opts.quantumVariableName}.r(${JSON.stringify(this.entryId)})`;

			if (this.core.opts.isTargetServer()) {
				// look for a global mention of the entry package, ignore other settings. this could use some improvement.
				var dirtyCheck = false;
				this.globals.forEach((fileID, globalName) => {
					if (fileID == this.entryId && globalName == "*") {
						dirtyCheck = true;
					}
				});

				if (dirtyCheck) {
					this.contents.add(null, `module.exports = ${req}`);
				} else {
					this.contents.add(null, req);
				}
			} else {
				this.contents.add(null, req);
			}
		}

		// finish wrapping
		if (this.core.opts.isTargetBrowser() || this.core.opts.isTargetUniveral()) {
			if (this.core.opts.isContained()) {
				this.contents.add(null, "})();");
			} else {
				this.contents.add(null, `})(${this.core.opts.quantumVariableName});`);
			}
		}
		this.contents.add(null, "\n");
		if (this.core.context.useSourceMaps) {
			this.sourceMapsPath = `${bundle.name}_quantum.js.map`;
			this.contents.add(null, "//# sourceMappingURL=" + this.core.opts.getSourceMapsPath(this.sourceMapsPath));
		}
		return this.contents;
	}
}
