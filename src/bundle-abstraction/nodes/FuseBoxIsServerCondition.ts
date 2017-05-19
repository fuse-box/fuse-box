import { FileAbstraction } from "./../FileAbstraction";

export class FuseBoxIsServerCondition {
    constructor(public file: FileAbstraction, public ast: any) {

    }

    public setFunctionName(name: string) {
        this.ast.callee.name = name;
    }
}