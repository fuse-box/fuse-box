import { File } from "../core/File";
import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";
export declare class VuePluginClass implements Plugin {
    test: RegExp;
    opts: any;
    constructor(opts: any);
    init(context: WorkFlowContext): void;
    transform(file: File): void;
}
export declare const VuePlugin: (opts: any) => VuePluginClass;
