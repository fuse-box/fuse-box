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

        let generateSourceMaps = true;
        let postCssOptions;
        let pathOptions: string[] = [file.info.absDir];

        if (this.options) {
            const {sourceMaps = generateSourceMaps, plugins, paths = pathOptions, ...otherOptions} = this.options;
            generateSourceMaps = sourceMaps;
            postCssOptions = otherOptions;
            pathOptions = paths;
        }

        const cssDependencies = file.context.extractCSSDependencies(file, {
            paths: pathOptions,
            content: file.contents,
            extensions: ["css"]
        });

        if (!postcss) {
            postcss = require("postcss");
        }

        return postcss(this.processors)
            .process(file.contents, postCssOptions)
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
