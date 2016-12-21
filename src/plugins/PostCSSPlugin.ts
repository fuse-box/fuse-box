import { PluginChain } from '../PluginChain';
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
    public transform(file: File): Promise<PluginChain> {
        file.loadContents();
        if (!postcss) {
            postcss = require("postcss");
        }
        return new Promise((resolve, reject) => {
            return postcss(this.processors).process(file.contents).then(result => {
                file.contents = result.css;
                // what are we going to do with sourcemaps?
                // What about caching?

                // Resolve styling chain
                // All plugins that have onStyleChain will get triggered
                return resolve(file.createChain("style", file));
            });
        });

    }
}

export const PostCSS = (processors? : any, opts?: any) => {
    return new PostCSSPluginClass(processors, opts);
}