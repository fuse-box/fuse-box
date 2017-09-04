import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";

export interface PostCSSPluginOptions {
    [key: string]: any;
    paths?: string[],
    sourceMaps?: boolean;
    plugins?: any[]
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


        if (file.isCSSCached("postcss")) {
            return;
        }
        file.bustCSSCache = true;
        file.loadContents();

        let paths: string[] = this.options && this.options.paths || [];
        paths.push(file.info.absDir);

        const cssDependencies = file.context.extractCSSDependencies(file, {
            paths: this.options && this.options.paths || [file.info.absDir],
            content: file.contents,
            extensions: ["css"]
        })

        if (!postcss) {
            postcss = require("postcss");
        }
        let generateSourceMaps = true;
        let postCSSPlugins = [];
        if (Array.isArray(this.options)) {
            postCSSPlugins = this.options;
        } else {
            if (this.options) {
                if (Array.isArray(this.options.plugins)) {
                    postCSSPlugins = this.options.plugins;
                }
                if (this.options.sourceMaps !== undefined) {
                    generateSourceMaps = this.options.sourceMaps;
                }
            }
        }
        return postcss(this.processors)
            .process(file.contents, postCSSPlugins)
            .then(result => {
                file.contents = result.css;

                if (file.context.useCache) {
                    file.analysis.dependencies = cssDependencies;
                    file.context.cache.writeStaticCache(file, generateSourceMaps && file.sourceMap, "postcss");
                    file.analysis.dependencies = [];
                }
                return result.css;
            });
    }
}

export const PostCSS = (processors?: Processors, opts?: PostCSSPluginOptions) => {
    return new PostCSSPluginClass(processors, opts);
};
