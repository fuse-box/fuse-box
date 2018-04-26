import { FileAbstraction } from "../core/FileAbstraction";
import { QuantumCore } from "./QuantumCore";
import { BundleAbstraction } from "../core/BundleAbstraction";

export class FlatFileGenerator {
    public contents = [];
    public entryId;
    public globals = new Map<string, string>();
    constructor(public core: QuantumCore, public bundleAbstraction?: BundleAbstraction​​) { }

    public setGlobals(packageName: string, fileID: string) {
        this.globals.set(packageName, fileID);
    }

    public init() {
        if (this.core.opts.isTargetBrowser() || this.core.opts.isTargetUniveral()) {
            if (this.core.opts.isContained()) {
                this.contents.push("(function(){\n/*$$CONTAINED_API_PLACEHOLDER$$*/");
            } else {
                this.contents.push(`(function(${this.core.opts.quantumVariableName}){`);
            }
        } else {
            if (this.core.opts.isContained()) {
                this.contents.push("/*$$CONTAINED_API_PLACEHOLDER$$*/");
            }
        }
    }

    public addFile(file: FileAbstraction, ensureES5 = false) {
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
        this.contents.push(`// ${file.packageAbstraction.name}/${file.fuseBoxPath}`);
        this.contents.push(`${this.core.opts.quantumVariableName}.f[${JSON.stringify(fileId)}] = ${file.generate(ensureES5)}`);
    }

    public addHoistedVariables() {

        this.bundleAbstraction.hoisted.forEach((item, key) => {
            this.contents.push(`var ${key} = ${this.core.opts.quantumVariableName}.r(${item.getID()});`);
        });
    }

    public render() {
        if (this.bundleAbstraction) {
            this.addHoistedVariables();
        }
        if (this.bundleAbstraction) {
            if (this.bundleAbstraction.globalVariableRequired) {
                const defineGlobalFn = "var global = window";
                if (this.core.opts.isTargetBrowser()) {
                    this.contents.push(defineGlobalFn);
                }
            }
        }

        this.globals.forEach((fileID, globalName) => {
            const req = `${this.core.opts.quantumVariableName}.r(${JSON.stringify(fileID)})`;
            if (this.core.opts.isTargetNpm() || this.core.opts.isTargetServer()) {
                this.contents.push(`module.exports = ${req}`);
            }

            if (this.core.opts.isTargetBrowser()) {
                this.contents.push(`window['${globalName}']=${req}`);
            }


        })

        if (this.entryId !== undefined) {
            const req = `${this.core.opts.quantumVariableName}.r(${JSON.stringify(this.entryId)})`;
            this.contents.push(req);
        }
        // finish wrapping
        if (this.core.opts.isTargetBrowser() || this.core.opts.isTargetUniveral()) {
            if (this.core.opts.isContained()) {
                this.contents.push("})();");
            } else {
                this.contents.push(`})(${this.core.opts.quantumVariableName});`);
            }
        }
        return this.contents.join("\n");
    }
}
