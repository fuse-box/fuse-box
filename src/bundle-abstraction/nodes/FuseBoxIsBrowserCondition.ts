import { FileAbstraction } from "./../FileAbstraction";
import { utils } from "realm-utils";

export class FuseBoxIsBrowserCondition {
    constructor(public file: FileAbstraction, public ast: any, public astProp, public idx) {

    }
    public setFunctionName(name: string) {
        let target = this.ast[this.astProp];

        if (utils.isArray(target) && this.idx) {

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