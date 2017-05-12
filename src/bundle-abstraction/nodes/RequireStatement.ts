import { FileAbstraction } from "../FileAbstraction";
import { joinFuseBoxPath } from "../../Utils";
import * as path from "path";

export class RequireStatement {
    public functionName: string;
    public value: string;
    public isNodeModule: boolean;
    constructor(public file: FileAbstraction, public ast: any) {
        this.functionName = ast.callee.name;
        this.value = ast.arguments[0].value;
        this.isNodeModule = /^([a-z@](?!:).*)$/.test(this.value)
    }

    public setFunctionName(name: string) {
        this.ast.callee.name = name;
    }

    public setValue(str: string) {
        this.ast.arguments[0].value = str;
    }

    public resolve() {
        const pkgName = !this.isNodeModule ? this.file.packageAbstraction.name : "";

        if (!this.isNodeModule) {
            let resolvedName = joinFuseBoxPath(path.dirname(this.file.fuseBoxPath), this.value);
            const producerAbstraction = this.file.packageAbstraction.bundleAbstraction.producerAbstraction;
            producerAbstraction.findFileAbstraction(pkgName, resolvedName);
        }
    }
}