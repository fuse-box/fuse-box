import { File } from "../../core/File";
import { Plugin, WorkFlowContext } from "../../core/WorkflowContext";
/**
 * @export
 * @class RawPluginClass
 * @implements {Plugin}
 */
export declare class CSSResourcePluginClass implements Plugin {
    test: RegExp;
    distFolder: string;
    inlineImages: false;
    constructor(opts: any);
    init(context: WorkFlowContext): void;
    resolveFn: (p: any) => string;
    createResouceFolder(file: File): void;
    transform(file: File): any;
}
export declare const CSSResourcePlugin: (options: any) => CSSResourcePluginClass;
