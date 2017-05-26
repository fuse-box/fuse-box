

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
            this.ast[this.astProp] = {
                type: "Literal",
                value: value
            }
        }
    }

}