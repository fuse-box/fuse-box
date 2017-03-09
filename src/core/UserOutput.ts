import { WorkFlowContext } from "./WorkflowContext";
import { ensureDir } from "../Utils";
import * as path from "path";

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
        const before = path.dirname(this.original);
        const after = path.basename(this.original);
        return {
            before: before,
            after: after,
        }
    }

}