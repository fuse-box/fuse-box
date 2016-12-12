import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class CSSPluginClass implements Plugin {
    test: RegExp;
    dependencies: string[];
    private minify;
    constructor(opts: any);
    init(context: WorkFlowContext): void;
    transform(file: File): void;
}
export declare const CSSPlugin: (opts: any) => CSSPluginClass;
