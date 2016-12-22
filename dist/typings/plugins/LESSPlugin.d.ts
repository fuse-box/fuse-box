import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class LESSPluginClass implements Plugin {
    test: RegExp;
    options: any;
    constructor(options: any);
    init(context: WorkFlowContext): void;
    transform(file: File): any;
}
export declare const LESSPlugin: (opts: any) => LESSPluginClass;
