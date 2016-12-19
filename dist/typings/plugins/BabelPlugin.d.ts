import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class BabelPluginClass implements Plugin {
    test: RegExp;
    context: WorkFlowContext;
    private limit2project;
    private config;
    constructor(opts: any);
    init(context: WorkFlowContext): void;
    transform(file: File, ast: any): void;
}
export declare const BabelPlugin: (opts: any) => BabelPluginClass;
