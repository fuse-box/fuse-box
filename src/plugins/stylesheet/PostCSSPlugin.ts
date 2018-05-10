import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";

export interface PostCSSPluginOptions {
    [key: string]: any;
    paths?: string[],
    sourceMaps?: boolean;
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
    public test: RegExp = /\.p?css$/;
    public dependencies = [];
    constructor(public processors: Processors = [], public options: PostCSSPluginOptions = {}) { }
    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf FuseBoxCSSPlugin
     */
    public init(context: WorkFlowContext) {
        context.allowExtension(".css");
        context.allowExtension(".pcss");
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
            sourceMaps = true,
            ...postCssOptions
        } = this.options;

        const paths = [file.info.absDir, ...this.options.paths || []]

        const cssDependencies = file.context.extractCSSDependencies(file, {
            paths: paths,
            content: file.contents,
            extensions: ["css", "pcss"]
        });
        file.cssDependencies = cssDependencies;

        if (!postcss) {
            postcss = require("postcss");
        }
        postCssOptions.map = file.context.useSourceMaps ? { inline: false } : false
        let fromFile = file.getCorrectSourceMapPath();
        if( fromFile.charAt(0) === "/"){
            fromFile = fromFile.slice(1)
        }
        postCssOptions.from = postCssOptions.from || file.info.absPath;
        postCssOptions.to = postCssOptions.to || fromFile;
        return postcss(this.processors)
            .process(file.contents, postCssOptions)
            .then(result => {
                file.contents = result.css;
                file.sourceMap = result.map ? result.map.toString() : undefined;
                if (file.context.useCache) {
                    file.analysis.dependencies = cssDependencies;
                    file.context.cache.writeStaticCache(file, file.sourceMap, "postcss");
                    file.analysis.dependencies = [];
                }
                return result.css;
            });
    }
}

function PostCSS (processors?: Processors, opts?: PostCSSPluginOptions);
function PostCSS (options?: PostCSSPluginOptions);

function PostCSS (processors?: Processors | PostCSSPluginOptions, opts?: PostCSSPluginOptions) {
    if (Array.isArray(processors)) {
      const options = extractPlugins(opts);
      return new PostCSSPluginClass(processors.concat(options.plugins), options.postCssOptions);
    }
    const options = extractPlugins(processors);
    return new PostCSSPluginClass(options.plugins, options.postCssOptions);
}

// We still take the "plugins" from options for legacy reasons
// It is discouraged and does not appear in type definitions
function extractPlugins(opts: PostCSSPluginOptions): {plugins: Processors, postCssOptions: PostCSSPluginOptions} {
  const {plugins = [], ...otherOptions} = opts || {};
  if (plugins.length > 0) {
    console.warn(`The postcss "plugin" option is deprecated. Please use PostCssPlugin(plugins, options) instead.`)
  }
  return {
    plugins,
    postCssOptions: otherOptions
  }
}

export {PostCSS}