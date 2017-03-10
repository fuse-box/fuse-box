import { File } from "../../core/File";
import { WorkFlowContext, Plugin } from "../../core/WorkflowContext";
/**
 *
 *
 * @export
 * @class FuseBoxHTMLPlugin
 * @implements {Plugin}
 */
export declare class ImageBase64PluginClass implements Plugin {
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
export declare const ImageBase64Plugin: () => ImageBase64PluginClass;
