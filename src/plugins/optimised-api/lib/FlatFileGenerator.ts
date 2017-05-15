import { FileAbstraction } from "../../../bundle-abstraction/FileAbstraction";

export class FlatFileGenerator {
    public contents = [];
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
        this.contents.push(`$fsx.f[${JSON.stringify(file.getID())}] = ${file.generate()}`);
    }

    public render() {
        this.contents.push("})($fsx)");
        return this.contents.join("\n");
    }
}