import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class CSSPlugin implements Plugin {
    test: RegExp;
    dependencies: string[];
    private minify;
    constructor(opts: any);
    init(context: WorkFlowContext): void;
    transform(file: File): void;
}
