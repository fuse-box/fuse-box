
import * as fs from "fs";
import * as path from "path";
import { Config } from "./../Config";
import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
import { utils } from "realm-utils";
import { CSSPluginDeprecated } from './CSSPluginDeprecated';
import { Concat, ensureUserPath, write } from '../Utils';

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
    private opts: any;
    private serve: any;

    private writeOptions: any;
    private bundle: any;

    constructor(opts: any) {
        opts = opts || {};

        this.opts = opts;

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

    public transformGroup(group: File) {

        const debug = (text: string) => group.context.debug("CSSPlugin", text);
        debug(`Start ${group.info.fuseBoxPath}`);

        let concat = new Concat(true, "", "\n");
        group.subFiles.forEach(file => {
            debug(`Concat ${file.info.fuseBoxPath}`);
            concat.add(file.info.fuseBoxPath, file.contents, file.generateCorrectSourceMap());
        });

        let options = group.groupOptions || {};
        const cssContents = concat.content;

        // writing
        if (options.outFile) {
            let outFile = ensureUserPath(options.outFile);
            const bundleDir = path.dirname(outFile);
            const sourceMapsName = path.basename(outFile) + ".map";

            concat.add(null, `/*# sourceMappingURL=${sourceMapsName} */`);


            debug(`Writing ${outFile}`);
            return write(outFile, concat.content).then(() => {
                // here we need to handle sourcemaps
                // Yet to come
                group.contents = `__fsbx_css("${group.info.fuseBoxPath}");`;


                // emitting changes
                // need to reload a file if possible
                group.context.sourceChangedEmitter.emit({
                    type: "css-file",
                    content: "",
                    path: group.info.fuseBoxPath,
                });

                // Writing sourcemaps
                const sourceMapsFile = ensureUserPath(path.join(bundleDir, sourceMapsName))
                console.log(concat.sourceMap.toString());
                return write(sourceMapsFile, concat.sourceMap);
            });
        } else {
            debug(`Inlining ${group.info.fuseBoxPath}`);
            const safeContents = JSON.stringify(cssContents.toString());
            group.contents = `__fsbx_css("${group.info.fuseBoxPath}", ${safeContents});`;
        }


        // emitting changes
        group.context.sourceChangedEmitter.emit({
            type: "css",
            content: cssContents.toString(),
            path: group.info.fuseBoxPath,
        });
    }


    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxCSSPlugin
     */
    public transform(file: File) {
        // no bundle groups here
        if (file.hasSubFiles()) {
            return;
        }

        file.loadContents();

        let contents;
        let filePath = file.info.fuseBoxPath;
        let serve = false;
        let context = file.context;

        // bundle files

        if (this.bundle) {
            let fileGroup = context.getFileGroup(this.bundle);
            if (!fileGroup) {
                fileGroup = context.createFileGroup(this.bundle, file.collection, this.opts);
            }
            // Adding current file (say a.txt) as a subFile 
            fileGroup.addSubFile(file);

            const chainExports = file.getProperty("exports");

            // Respect other plugins to override the output
            file.alternativeContent = `module.exports = ${chainExports && contents ? chainExports : "require('./" + this.bundle + "')"}`;
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


    }

    private minifyContents(contents) {
        return contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim();
    }
}

export const CSSPlugin = (opts: any) => {
    return new CSSPluginClass(opts)
}