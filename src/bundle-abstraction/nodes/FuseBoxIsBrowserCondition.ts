import { FileAbstraction } from "./../FileAbstraction";

export class FuseBoxIsBrowserCondition {
    constructor(public file: FileAbstraction, public ast: any) {

    }
    public setFunctionName(name: string) {
        this.ast.callee.name = name;
    }
}