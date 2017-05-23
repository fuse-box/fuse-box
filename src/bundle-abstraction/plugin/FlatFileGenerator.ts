import { FileAbstraction } from "../core/FileAbstraction";

export class FlatFileGenerator {
    public contents = [];
    public entryId;
    constructor() {

    }
    public addGlobal(code: string) {
        this.contents.push(code);
    }

    public init() {
        this.contents.push("(function($fsx){")
    }

    public addFile(file: FileAbstraction) {
        let args: string[] = [];
        if (file.isExportInUse()) {

            args.push("module", "exports")
        }
        if (args.length) {
            file.wrapWithFunction(args);
        }
        let fileId = file.getID();
        if (file.isEntryPoint) {
            this.entryId = fileId;
        }
        this.contents.push(`$fsx.f[${JSON.stringify(fileId)}] = ${file.generate()}`);


    }

    public render() {
        if (this.entryId !== undefined) {
            this.contents.push(`$fsx.r(${JSON.stringify(this.entryId)})`);
        }
        this.contents.push("})($fsx)");
        return this.contents.join("\n");
    }
}