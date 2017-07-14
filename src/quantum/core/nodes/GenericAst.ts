

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

    public replaceWithString(value: string) {
        if (this.astProp) {
            if (Array.isArray(this.ast[this.astProp]) && this.node.$idx > -1) {
                this.ast[this.astProp][this.node.$idx] = {
                    type: "Literal",
                    value: value
                }
            } else {
                this.ast[this.astProp] = {
                    type: "Literal",
                    value: value
                };
            }
        }
    }
}