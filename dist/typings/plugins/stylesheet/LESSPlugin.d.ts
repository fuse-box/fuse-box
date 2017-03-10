import { File } from "../../core/File";
import { WorkFlowContext } from "./../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
/**
 * @export
 * @class LESSPluginClass
 * @implements {Plugin}
 */
export declare class LESSPluginClass implements Plugin {
    /**
     * @type {RegExp}
     * @memberOf LESSPluginClass
     */
    test: RegExp;
    options: any;
    constructor(options: any);
    init(context: WorkFlowContext): void;
    /**
     * @param {File} file
     * @memberOf LESSPluginClass
     */
    transform(file: File): any;
}
export declare const LESSPlugin: (opts: any) => LESSPluginClass;
