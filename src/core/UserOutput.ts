import { WorkFlowContext } from "./WorkflowContext";
import { ensureDir } from "../Utils";

export class UserOutput {
    public dir: string;
    constructor(public context: WorkFlowContext, public original: string) {
        this.setup();
    }
    private setup() {
        // $name is require
        if (this.original.indexOf('$name') === -1) {
            throw new Error("$name should be present in the string");
        }

        let params = this.extractParams();

        this.dir = ensureDir(params.before);
    }
    private extractParams(): any {
        let index = 0;
        let beforeDollar = [];
        let afterDollar = [];
        let dirComplete = false;
        while (index < this.original.length) {
            let symbol = this.original.charAt(index);
            if (symbol !== "$" && !dirComplete) {
                dirComplete = true;
                beforeDollar.push(symbol);
            } else {
                afterDollar.push(symbol);
            }
            index++;
        }
        return {
            before: beforeDollar.join(""),
            after: afterDollar.join(""),
        }
    }

}