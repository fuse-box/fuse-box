import { File } from "../core/File";
import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";

export interface MarkdownPluginOptions {
    gfm?: boolean;
    tables?: boolean;
    breaks?: boolean;
    pedantic?: boolean,
    sanitize?: boolean,
    smartLists?: boolean,
    smartypants?: boolean
    useDefault?: boolean;
    renderer?: () => any;
}

let marked;

/**
 *
 *
 * @export
 * @class FuseBoxMarkdownPlugin
 * @implements {Plugin}
 */
export class FuseBoxMarkdownPlugin implements Plugin {
    private useDefault = true;

    public options: MarkdownPluginOptions = {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    };

    constructor(opts: MarkdownPluginOptions = {}) {
        if (opts.useDefault !== undefined) {
            this.useDefault = opts.useDefault;
        }

        this.options = Object.assign(this.options, opts);
    }
    /**
     *
     *
     * @type {RegExp}
     * @memberOf FuseBoxMarkdownPlugin
     */
    public test: RegExp = /\.md$/;

    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf FuseBoxMarkdownPlugin
     */
    public init(context: WorkFlowContext) {
        context.allowExtension(".md");
    }
    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxMarkdownPlugin
     */
    public transform(file: File) {

        let context = file.context;
        if (context.useCache) {
            let cached = context.cache.getStaticCache(file);
            if (cached) {
                file.isLoaded = true;
                file.contents = cached.contents;
                return;
            }
        }

        file.loadContents();

        if (!marked) {
            marked = require("marked");
        }

        if (this.options.renderer) {
            this.options.renderer = new marked.Renderer();
        }

        // Transform the markdown using marked
        marked.setOptions(this.options);
        const html = marked(file.contents);

        if (this.useDefault) {
            file.contents = `module.exports.default =  ${JSON.stringify(html)}`;
        } else {
            file.contents = `module.exports =  ${JSON.stringify(html)}`;
        }

        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
};

export const MarkdownPlugin = (options?: MarkdownPluginOptions) => {
    return new FuseBoxMarkdownPlugin(options);
};
