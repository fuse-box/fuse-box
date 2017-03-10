import { File } from "../core/File";
import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";
/**
 * @export
 * @class SourceMapPlainJsPluginClass
 * @implements {Plugin}
 */
export declare class SourceMapPlainJsPluginClass implements Plugin {
    /**
     * @type {RegExp}
     * @memberOf SourceMapPlainJsPluginClass
     */
    test: RegExp;
    /**
     * @type {string}
     * @memberOf SourceMapPlainJsPluginClass
     */
    ext: string;
    /**
     * @type {WorkFlowContext}
     * @memberOf SourceMapPlainJsPluginClass
     */
    private context;
    constructor(options?: any);
    init(context: WorkFlowContext): void;
    transform(file: File): boolean;
    private getSourceMap(file, tokens);
}
export declare const SourceMapPlainJsPlugin: (options?: any) => SourceMapPlainJsPluginClass;
