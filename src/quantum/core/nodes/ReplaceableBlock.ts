import { GenericAst } from "./GenericAst";

export class ReplaceableBlock extends GenericAst {
    public value: string;
    public undefinedValue = false;
    public isConditional = false;
    public activeAST: any;
    public ifStatementAST: any;
    public markedForRemoval = false;
    public identifier: string;
    public setValue(value: string) {
        this.value = value;
    }

    public setUndefinedValue() {
        this.undefinedValue = true;
    }

    public setFunctionName(name: string) {
        let target = this.node.$parent;;
        const $idx = this.node.$idx;
        if (target instanceof Array && $idx !== undefined) {
            this.ast[this.astProp][$idx] = {
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

    public setIFStatementAST(ast: any) {
        this.ifStatementAST = ast;
    }

    public conditionalAnalysis(node: any, evaluatedValue: boolean) {
        this.setConditional();
        this.setIFStatementAST(node);
        if (evaluatedValue === false) {
            if (node.alternate) {
                this.setActiveAST(node.alternate);
                return node.alternate;
            } else {
                this.markForRemoval();
                return false;
            }
        } else {
            this.setActiveAST(node.consequent);
            return node.consequent;
        }
    }

    public markForRemoval() {
        this.markedForRemoval = true;
    }


    public setConditional() {
        this.isConditional = true;
    }

    public setActiveAST(ast: any) {
        this.activeAST = ast;
    }


    public handleActiveCode() {
        const parent = this.ifStatementAST.$parent;
        const prop = this.ifStatementAST.$prop;
        if (this.markedForRemoval) {
            if (parent[prop]) {
                if (Array.isArray(parent[prop])) {
                    const index = parent[prop].indexOf(this.ifStatementAST);
                    if (index > -1) {
                        parent[prop].splice(index, 1);
                    }
                }
            }
        } else {
            if (parent && prop && this.activeAST) {
                if (parent[prop]) {
                    if (Array.isArray(parent[prop])) {
                        const index = parent[prop].indexOf(this.ifStatementAST);
                        // console.log(this.activeAST);
                        if (index > -1) {
                            if (prop === "body" && this.activeAST.body) {
                                parent[prop].splice(index, 1, ...this.activeAST.body);
                            } else {
                                parent[prop][index] = this.activeAST;
                            }
                        }
                    }
                }
            }
        }
    }
    public replaceWithValue() {
        if (this.undefinedValue) {
            this.replaceWithString();
        } else {
            if (this.value !== undefined) {
                this.replaceWithString(this.value);
            }
        }
    }
}

// export class NamedExport extends GenericAst {
//     public name: string;
//     public isUsed = false;


// }