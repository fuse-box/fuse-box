import { PluginChain } from './../PluginChain';
import * as fs from "fs";
import * as path from "path";
import { Config } from "./../Config";
import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
import { utils } from "realm-utils";
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
    private serve: any;

    constructor(opts: any) {
        opts = opts || {};
        if (opts.minify !== undefined) {
            this.minify = opts.minify;
        }

        if (opts.serve !== undefined) {
            this.serve = opts.serve;
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

    public bundleStart(context: WorkFlowContext) {
        let lib = path.join(Config.LOCAL_LIBS, "fsbx-default-css-plugin", "index.js")
        context.source.addContent(fs.readFileSync(lib).toString());
    }

    public onStyleChain(chain: PluginChain) {
        this.modify(chain.file);
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
        this.modify(file);
    }

    private modify(file: File) {
        let contents = "";
        let filePath = file.info.fuseBoxPath;
        let serve = false;
        if (this.serve) {
            if (utils.isFunction(this.serve)) {
                let userResult = this.serve(file.info.fuseBoxPath, file);
                if (utils.isString(userResult)) {
                    filePath = userResult;
                    serve = true;
                }
            }
        }
        if (serve) {
            contents = `__fsbx_css("${filePath}")`;
        } else {
            let cssContent = this.minify ?
                file.contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim() : file.contents;
            contents = `__fsbx_css("${filePath}", ${JSON.stringify(cssContent)})`;
        }
        file.contents = contents;
    }
}

export const CSSPlugin = (opts: any) => {
    return new CSSPluginClass(opts)
}