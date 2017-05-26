import { FileAbstraction } from "../FileAbstraction";
export class FuseBoxStatement {
    constructor(public file: FileAbstraction, public ast: any) {

    }
}