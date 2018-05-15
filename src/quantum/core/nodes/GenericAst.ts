

export class GenericAst {
    constructor(public ast: any, public astProp, public node) {

    }

    public remove() {
        let target = this.ast[this.astProp];
        if (target instanceof Array) {
            let idx = target.indexOf(this.node)
            target.splice(idx, 1);
        }
    }


    public replaceWithString(value?: string) {

        let ast: any = {
            type: "Literal",
            value: value
        }
        if (value === undefined) {
            ast = {
                type: "Identifier",
                name: "undefined"
            }
        }
        if (this.astProp) {
            if (Array.isArray(this.ast[this.astProp]) && this.node.$idx > -1) {
                this.ast[this.astProp][this.node.$idx] = ast;
            } else {
                this.ast[this.astProp] = ast;
            }
        }
    }
}