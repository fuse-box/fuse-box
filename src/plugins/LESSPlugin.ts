import * as console from 'console';
import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";

// Do we want to do this? Or do we want them to pass LESS in?
// Letting users pass it in seems to defeat the purpose of wrapping the plugin up TBH
const less = require('less');
/**
 *
 *
 * @export
 * @class LESSPluginClass
 * @implements {Plugin}
 */
export class LESSPluginClass implements Plugin {
    /**
     *
     *
     * @type {RegExp}
     * @memberOf LESSPluginClass
     */
    public test: RegExp = /\.less$/;
    public options: any;
    private minify = false;
    private serve: any;

    constructor(options: any) {
        this.options = options || {};
    }
    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf LESSPluginClass
     */
    public init(context: WorkFlowContext) {
        context.allowExtension(".less");
    }

    /**
     *
     *
     * @param {File} file
     *
     * @memberOf LESSPluginClass
     */
    public transform(file: File) {
        file.loadContents();

        return less.render(file.contents, this.options).then(output => {
            file.contents = output.css;
            console.log('LESS', file.contents);
        });
    }
}

export const LESSPlugin = (opts: any) => {
    return new LESSPluginClass(opts)
}