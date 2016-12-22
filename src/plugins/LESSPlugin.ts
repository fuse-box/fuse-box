import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
let less;

/**
 * @export
 * @class LESSPluginClass
 * @implements {Plugin}
 */
export class LESSPluginClass implements Plugin {
    /**
     * @type {RegExp}
     * @memberOf LESSPluginClass
     */
    public test: RegExp = /\.less$/;
    public options: any;

    constructor(options: any) {
        this.options = options || {};
    }

    public init(context: WorkFlowContext) {
        context.allowExtension(".less");
    }

    /**
     * @param {File} file
     * @memberOf LESSPluginClass
     */
    public transform(file: File) {
        file.loadContents();

        if (!less) {
            less = require("less");
        }
        return less.render(file.contents, this.options).then(output => {
            file.contents = output.css;
        });
    }
}

export const LESSPlugin = (opts: any) => {
    return new LESSPluginClass(opts)
}