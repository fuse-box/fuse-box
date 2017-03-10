import { File } from "../core/File";
import { WorkFlowContext, Plugin } from "./../core/WorkflowContext";
/**
 *
 *
 * @export
 * @class FuseBoxHTMLPlugin
 * @implements {Plugin}
 */
export declare class ConcatPluginClass implements Plugin {
    private ext;
    private bundleName;
    private delimiter;
    constructor(opts?: any);
    /**
     *
     *
     * @type {RegExp}
     * @memberOf FuseBoxHTMLPlugin
     */
    test: RegExp;
    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf FuseBoxHTMLPlugin
     */
    init(context: WorkFlowContext): void;
    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxHTMLPlugin
     */
    transform(file: File): void;
    transformGroup(group: File): void;
}
export declare const ConcatPlugin: (opts?: any) => ConcatPluginClass;
