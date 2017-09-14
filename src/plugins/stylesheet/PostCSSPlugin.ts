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
    public options: PostCSSPluginOptions = {
      sourceMaps: true,
      plugins: [],
      paths: []
    };

    constructor(opts: Processors | PostCSSPluginOptions) {
        if (Array.isArray(opts)) {
            this.options.plugins = opts
        } else {
            this.options = Object.assign(this.options, opts);
        }
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

        file.addStringDependency("fuse-box-css");


        if (file.isCSSCached("postcss")) {
            return;
        }
        file.bustCSSCache = true;
        file.loadContents();

        const {
            sourceMaps,
            plugins,
            paths,
            ...postCssOptions
        } = this.options;

        paths.push(file.info.absDir);

        const cssDependencies = file.context.extractCSSDependencies(file, {
            paths: paths,
            content: file.contents,
            extensions: ["css"]
        });

        if (!postcss) {
            postcss = require("postcss");
        }

        return postcss(plugins)
            .process(file.contents, postCssOptions)
            .then(result => {
                file.contents = result.css;

                if (file.context.useCache) {
                    file.analysis.dependencies = cssDependencies;
                    file.context.cache.writeStaticCache(file, sourceMaps && file.sourceMap, "postcss");
                    file.analysis.dependencies = [];
                }
                return result.css;
            });
    }
}

export const PostCSS = (opts?: Processors | PostCSSPluginOptions) => {
    return new PostCSSPluginClass(opts);
};
