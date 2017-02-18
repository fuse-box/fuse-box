
import * as fs from "fs";
import * as path from "path";
import { Config } from "./../Config";
import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
import { utils } from "realm-utils";
import { CSSPluginDeprecated } from './CSSPluginDeprecated';
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
    private raw = false;
    private minify = false;
    private serve: any;
    private writeOptions: any;
    private bundle: any;

    constructor(opts: any) {
        opts = opts || {};

        if (opts.raw !== undefined) {
            this.raw = opts.raw;
        }

        if (opts.write) {
            this.writeOptions = opts.write;
        }

        if (opts.bundle) {
            this.bundle = opts.bundle;
        }

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

        let lib = path.join(Config.FUSEBOX_MODULES, "fsbx-default-css-plugin", "index.js")
        context.source.addContent(fs.readFileSync(lib).toString());
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

        let contents;
        let filePath = file.info.fuseBoxPath;
        let serve = false;
        let context = file.context;

        // bundle files
        if (this.bundle) {
            let fileGroup = context.getFileGroup(this.bundle);
            if (!fileGroup) {
                fileGroup = context.createFileGroup(this.bundle);
            }
            // Adding current file (say a.txt) as a subFile 
            fileGroup.addSubFile(file);

            // making sure the current file refers to an object at runtime that calls our bundle
            file.alternativeContent = `module.exports = require("./${this.bundle}")`;
            return;
        }
        if (this.writeOptions) {
            const writeResult = CSSPluginDeprecated.writeOptions(this.writeOptions, file);
            if (writeResult) {
                return writeResult;
            }
        } else {
            file.sourceMap = undefined;
        }

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
            let cssContent = this.minify ? this.minifyContents(file.contents) : file.contents;
            let safeContents = JSON.stringify(cssContent);

            file.context.sourceChangedEmitter.emit({
                type: "css",
                content: cssContent,
                path: file.info.fuseBoxPath,
            });
            contents = `__fsbx_css("${filePath}", ${safeContents});`;
        }

        const chainExports = file.getProperty("exports");
        if (chainExports && contents) {
            contents += `module.exports = ${chainExports}`;
        }
        file.contents = contents;
    }

    private minifyContents(contents) {
        return contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim();
    }
}

export const CSSPlugin = (opts: any) => {
    return new CSSPluginClass(opts)
}