import { File } from "../core/File";
import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";
/**
 * @export
 * @class RawPluginClass
 * @implements {Plugin}
 */
export declare class RawPluginClass implements Plugin {
    /**
     * @type {RegExp}
     * @memberOf RawPluginClass
     */
    test: RegExp;
    /**
     * @type {Array<string>}
     * @memberOf RawPluginClass
     */
    extensions: Array<string>;
    constructor(options: any);
    init(context: WorkFlowContext): void;
    transform(file: File): void;
}
export declare const RawPlugin: (options: any) => RawPluginClass;
