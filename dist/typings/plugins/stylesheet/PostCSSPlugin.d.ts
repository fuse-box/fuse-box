import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
/**
 *
 *
 * @export
 * @class FuseBoxCSSPlugin
 * @implements {Plugin}
 */
export declare class PostCSSPluginClass implements Plugin {
    processors: any;
    opts: any;
    /**
     *
     *
     * @type {RegExp}
     * @memberOf FuseBoxCSSPlugin
     */
    test: RegExp;
    dependencies: any[];
    constructor(processors: any, opts: any);
    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf FuseBoxCSSPlugin
     */
    init(context: WorkFlowContext): void;
    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxCSSPlugin
     */
    transform(file: File): any;
}
export declare const PostCSS: (processors?: any, opts?: any) => PostCSSPluginClass;
