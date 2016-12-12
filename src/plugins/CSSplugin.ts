import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";

/**
 *
 *
 * @export
 * @class FuseBoxCSSPlugin
 * @implements {Plugin}
 */
export class CSSPluginClass implements Plugin {
    /**
     *
     *
     * @type {RegExp}
     * @memberOf FuseBoxCSSPlugin
     */
    public test: RegExp = /\.css$/;
    public dependencies = ["fsb-default-css-plugin"];
    private minify = false;

    constructor(opts: any) {
        opts = opts || {};
        if (opts.minify !== undefined) {
            this.minify = opts.minify;
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
        file.loadContents();
        let contents = this.minify ?
            file.contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim() : file.contents;
        file.contents = `require("fsb-default-css-plugin")(__filename, ${JSON.stringify(contents)} );`;
    }
}

export const CSSPlugin = (opts: any) => {
    return new CSSPluginClass(opts)
}