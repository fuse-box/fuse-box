import { FileAbstraction } from "../core/FileAbstraction";
import { OptimisedCore } from "./OptimisedCore";

export class FlatFileGenerator {
    public contents = [];
    public entryId;
    public globalsName: string;
    constructor(public core: OptimisedCore) { }
    public addGlobal(code: string) {
        this.contents.push(code);
    }

    public init() {
        if (this.core.opts.isTargetBrowser() || this.core.opts.isTargetUniveral()) {
            this.contents.push("(function($fsx){")
        }
    }

    public addFile(file: FileAbstraction, ensureES5 = false) {
        // if (file.canBeRemoved) {
        //     return;
        // }
        let args: string[] = [];

        if (file.isExportInUse()) {
            args.push("module")
        }
        if (file.isExportStatementInUse()) {
            args.push("exports")
        }
        if (args.length) {
            file.wrapWithFunction(args);
        }
        let fileId = file.getID();
        if (file.isEntryPoint) {
            this.entryId = fileId;
            this.globalsName = file.globalsName;
        }
        this.contents.push(`// ${file.packageAbstraction.name}/${file.fuseBoxPath}`);
        this.contents.push(`$fsx.f[${JSON.stringify(fileId)}] = ${file.generate(ensureES5)}`);


    }

    public render() {
        if (this.entryId !== undefined) {
            const req = `$fsx.r(${JSON.stringify(this.entryId)})`;

            if (this.globalsName) {
                if (this.core.opts.isTargetServer()) {
                    this.contents.push(`module.exports = ${req}`);
                }

                if (this.core.opts.isTargetBrowser()) {
                    if (this.globalsName === "*") {
                        this.contents.push(`var r = ${req}`);
                        this.contents.push(`if (r){for(var i in r){ window[i] = r[i] }}`);
                    } else {
                        this.contents.push(`window['${this.globalsName}']=${req}`);
                    }
                }
            } else {
                this.contents.push(req);
            }
        }
        // finish wrapping
        if (this.core.opts.isTargetBrowser() || this.core.opts.isTargetUniveral()) {
            this.contents.push("})($fsx)");
        }
        return this.contents.join("\n");
    }
}