import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class FuseBoxHTMLPlugin implements Plugin {
    private useDefault;
    constructor(opts?: any);
    test: RegExp;
    init(context: WorkFlowContext): void;
    transform(file: File): void;
}
export declare const HTMLPlugin: (opts?: any) => FuseBoxHTMLPlugin;
