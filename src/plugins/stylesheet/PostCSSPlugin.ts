import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";

export interface PostCSSPluginOptions {
    [key: string]: any;
}

export type Processors = (() => any)[];

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
    constructor(public processors: Processors = [], public options?: PostCSSPluginOptions) { }
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
        file.addStringDependency("fuse-box-css");
        file.loadContents();
        if (!postcss) {
            postcss = require("postcss");
        }
        return postcss(this.processors)
            .process(file.contents, this.options)
            .then(result => {
                file.contents = result.css;
                return result.css;
            });
    }
}

export const PostCSS = (processors?: Processors, opts?: PostCSSPluginOptions) => {
    return new PostCSSPluginClass(processors, opts);
};
