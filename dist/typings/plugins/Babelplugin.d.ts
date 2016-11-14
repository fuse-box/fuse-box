import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class BabelPlugin implements Plugin {
    test: RegExp;
    opts: any;
    constructor(test: RegExp, opts?: any);
    init(context: WorkFlowContext): void;
    transform(file: File): void;
}
