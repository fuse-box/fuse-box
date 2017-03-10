import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
/**
 *
 *
 * @export
 * @class FuseBoxHTMLPlugin
 * @implements {Plugin}
 */
export declare class BabelPluginClass implements Plugin {
    /**
     * We can add tsx and ts here as well
     * Because Babel won't capture it just being a Plugin
     * Typescript files are handled before any external plugin is executed
     */
    test: RegExp;
    context: WorkFlowContext;
    private limit2project;
    private config;
    private configPrinted;
    constructor(opts: any);
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
    transform(file: File, ast: any): void;
}
export declare const BabelPlugin: (opts: any) => BabelPluginClass;
