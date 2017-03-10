import { File } from "../core/File";
import { Plugin } from "../core/WorkflowContext";
export declare class ReplacePluginClass implements Plugin {
    options: any;
    test: RegExp;
    extensions: Array<string>;
    constructor(options: any);
    transform(file: File): void;
}
export declare const ReplacePlugin: (options: any) => ReplacePluginClass;
