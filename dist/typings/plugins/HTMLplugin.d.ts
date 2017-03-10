import { File } from "../core/File";
import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";
/**
 *
 *
 * @export
 * @class FuseBoxHTMLPlugin
 * @implements {Plugin}
 */
export declare class FuseBoxHTMLPlugin implements Plugin {
    private useDefault;
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
}
export declare const HTMLPlugin: (opts?: any) => FuseBoxHTMLPlugin;
