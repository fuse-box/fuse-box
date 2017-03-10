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
export declare class CSSPluginClass implements Plugin {
    /**
     *
     *
     * @type {RegExp}
     * @memberOf FuseBoxCSSPlugin
     */
    test: RegExp;
    private raw;
    private minify;
    opts: any;
    private serve;
    private writeOptions;
    constructor(opts: any);
    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf FuseBoxCSSPlugin
     */
    init(context: WorkFlowContext): void;
    bundleStart(context: WorkFlowContext): void;
    inject(file: File, options: any, alternative?: boolean): void;
    transformGroup(group: File): Promise<{}>;
    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxCSSPlugin
     */
    transform(file: File): Promise<{}>;
    private minifyContents(contents);
}
export declare const CSSPlugin: (opts?: any) => CSSPluginClass;
