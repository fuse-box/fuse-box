import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";


let postcss;
/**
 *
 *
 * @export
 * @class FuseBoxCSSPlugin
 * @implements {Plugin}
 */
export class PostCSSPluginClass implements Plugin {
    /**
     *
     *
     * @type {RegExp}
     * @memberOf FuseBoxCSSPlugin
     */
    public test: RegExp = /\.css$/;
    public dependencies = [];
    constructor(public processors: any, public opts: any) {
        this.opts = this.opts || {};
        this.processors = this.processors || [];
    }
    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf FuseBoxCSSPlugin
     */
    public init(context: WorkFlowContext) {
        context.allowExtension(".css");
    }

    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxCSSPlugin
     */
    public transform(file: File) {
        file.loadContents();
        if (!postcss) {
            postcss = require("postcss");
        }
        return postcss(this.processors)
        	.process(file.contents)
        	.then(result => {
            	file.contents = result.css;
            	return result.css;
	        });
    }
}

export const PostCSS = (processors?: any, opts?: any) => {
    return new PostCSSPluginClass(processors, opts);
}