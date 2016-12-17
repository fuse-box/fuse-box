import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class TypeScriptHelpersClass implements Plugin {
    test: RegExp;
    private helpers;
    private registeredHelpers;
    constructor(opts: any);
    init(context: WorkFlowContext): void;
    bundleEnd(context: WorkFlowContext): void;
    transform(file: File): void;
}
export declare let TypeScriptHelpers: () => TypeScriptHelpersClass;
