import { FileAbstraction } from "./../FileAbstraction";

export class FuseBoxIsServerCondition {
    constructor(public file: FileAbstraction, public ast: any, public astProp, public idx) {

    }

    public setFunctionName(name: string) {
        let target = this.ast[this.astProp];

        if (target instanceof Array && this.idx !== undefined) {
            this.ast[this.astProp][this.idx] = {
                type: "Identifier",
                name: name
            }
        } else {
            this.ast[this.astProp] = {
                type: "Identifier",
                name: name
            }
        }
    }
}