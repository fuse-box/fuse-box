import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
import { File } from "../../core/File";
/**
 * This plugin compile coffeescript to Javascript
 *
 * @export
 * @class CoffeePluginClass
 * @implements {Plugin}
 */
export declare class CoffeePluginClass implements Plugin {
    test: RegExp;
    private options;
    /**
     * @param {Object} options - Options for coffee compiler
     */
    constructor(options: Object);
    init(context: WorkFlowContext): void;
    transform(file: File): Promise<{}>;
}
export declare const CoffeePlugin: (options?: Object) => CoffeePluginClass;
