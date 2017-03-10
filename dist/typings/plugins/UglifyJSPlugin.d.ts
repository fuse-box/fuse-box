import { Plugin } from "../core/WorkflowContext";
/**
 * @export
 * @class UglifyJSPluginClass
 * @implements {Plugin}
 */
export declare class UglifyJSPluginClass implements Plugin {
    /**
     * @type {any}
     * @memberOf UglifyJSPluginClass
     */
    options: any;
    constructor(options: any);
    postBundle(context: any): void;
}
export declare const UglifyJSPlugin: (options: any) => UglifyJSPluginClass;
