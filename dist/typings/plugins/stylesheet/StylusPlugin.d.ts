import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
/**
 * @export
 * @class StylusPluginClass
 * @implements {Plugin}
 */
export declare class StylusPluginClass implements Plugin {
    /**
     * @type {RegExp}
     * @memberOf StylusPluginClass
     */
    test: RegExp;
    options: any;
    constructor(options: any);
    init(context: WorkFlowContext): void;
    transform(file: File): Promise<any>;
}
export declare const StylusPlugin: (options: any) => StylusPluginClass;
