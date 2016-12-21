import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
import * as less from "less";

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

    /**
     * @param {File} file
     * @memberOf LESSPluginClass
     */
    public transform(file: File) {
        file.loadContents();

        return less.render(file.contents, this.options).then(output => {
            file.contents = output.css;
        });
    }
}

export const LESSPlugin = (opts: any) => {
    return new LESSPluginClass(opts)
}