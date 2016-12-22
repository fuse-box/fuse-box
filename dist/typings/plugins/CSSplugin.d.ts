import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class CSSPluginClass implements Plugin {
    test: RegExp;
    dependencies: string[];
    private raw;
    private minify;
    private serve;
    constructor(opts: any);
    init(context: WorkFlowContext): void;
    bundleStart(context: WorkFlowContext): void;
    transform(file: File): void;
    private minifyContents(contents);
}
export declare const CSSPlugin: (opts: any) => CSSPluginClass;
