
import * as fs from "fs";
import * as path from "path";
import { Config } from "./../../Config";
import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
import { utils } from "realm-utils";
import { CSSPluginDeprecated } from './CSSPluginDeprecated';
import { Concat, ensureUserPath, write } from '../../Utils';

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
    public opts: any;
    private serve: any;

    private writeOptions: any;


    constructor(opts: any) {
        opts = opts || {};

        this.opts = opts;

        if (opts.raw !== undefined) {
            this.raw = opts.raw;
        }

        if (opts.write) {
            this.writeOptions = opts.write;
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

    public inject(file: File, options: any, alternative?: boolean) {
        // Inject properties
        // { inject : path => path } -> customise automatic injection
        // { inject : false } -> do not inject anything. User will manually put the script tag
        // No inject at all, means automatic injection with default path
        const resolvedPath = utils.isFunction(options.inject)
            ? options.inject(file.info.fuseBoxPath) : file.info.fuseBoxPath;

        // noop the contents if a user wants to manually inject it
        const result = options.inject !== false ? `__fsbx_css("${resolvedPath}");` : '';
        if (alternative) {
            file.alternativeContent = result;
        } else {
            file.contents = result;
        }
    }

    public transformGroup(group: File) {

        const debug = (text: string) => group.context.debugPlugin(this, text);
        debug(`Start group transformation on "${group.info.fuseBoxPath}"`);

        let concat = new Concat(true, "", "\n");
        group.subFiles.forEach(file => {
            debug(`  -> Concat ${file.info.fuseBoxPath}`);
            concat.add(file.info.fuseBoxPath, file.contents, file.generateCorrectSourceMap());
        });

        let options = group.groupHandler.opts || {};
        const cssContents = concat.content;

        // writing
        if (options.outFile) {
            let outFile = ensureUserPath(options.outFile);
            const bundleDir = path.dirname(outFile);
            const sourceMapsName = path.basename(outFile) + ".map";

            concat.add(null, `/*# sourceMappingURL=${sourceMapsName} */`);


            debug(`Writing ${outFile}`);
            return write(outFile, concat.content).then(() => {
                this.inject(group, options);
                // emitting changes
                // need to reload a file if possible
                group.context.sourceChangedEmitter.emit({
                    type: "css-file",
                    content: "",
                    path: group.info.fuseBoxPath,
                });

                // Writing sourcemaps
                const sourceMapsFile = ensureUserPath(path.join(bundleDir, sourceMapsName))
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

        const debug = (text: string) => file.context.debugPlugin(this, text);

        file.loadContents();

        let contents;
        let filePath = file.info.fuseBoxPath;

        let context = file.context;

        file.contents = this.minify ? this.minifyContents(file.contents) : file.contents;

        /**
         * Bundle many files into 1 file
         * Should not start with . or /
         *     e.g "bundle.css""
         * require("./a.css"); require("./b.css");
         * 
         * 2 files combined will be written or inlined to "bundle.css"
         */
        if (this.opts.group) {
            const bundleName = this.opts.group;
            let fileGroup = context.getFileGroup(bundleName);
            if (!fileGroup) {
                fileGroup = context.createFileGroup(bundleName, file.collection, this);
            }
            // Adding current file (say a.txt) as a subFile 
            fileGroup.addSubFile(file);
            debug(`  grouping -> ${bundleName}`);

            const chainExports = file.getProperty("exports");

            // Respect other plugins to override the output
            file.alternativeContent = `module.exports = ${chainExports && contents ? chainExports : "require('./" + bundleName + "')"}`;
            return;
        }

        /**
         * An option just to write files to a specific path
         */
        let outFileFunction;
        if (this.opts.outFile !== undefined) {
            if (!utils.isFunction(this.opts.outFile)) {
                context.fatal(`Error in CSSConfig. outFile is expected to be a function that resolves a path`);
            } else {
                outFileFunction = this.opts.outFile;
            }
        }

        if (outFileFunction) {
            const userPath = ensureUserPath(outFileFunction(file.info.fuseBoxPath));
            // reset the content so it won't get bundled
            file.alternativeContent = '';
            this.inject(file, this.opts, true);
            // writing ilfe
            return write(userPath, file.contents).then(() => {
                if (file.sourceMap) {
                    const fileDir = path.dirname(userPath);
                    const sourceMapPath = path.join(fileDir, path.basename(userPath) + ".map");
                    return write(sourceMapPath, file.sourceMap);
                }
            });
        } else {
            let safeContents = JSON.stringify(file.contents);
            let serve = false;
            if (this.writeOptions) {
                const writeResult = CSSPluginDeprecated.writeOptions(this.writeOptions, file);
                if (writeResult) {
                    return writeResult;
                }
            } else {
                file.sourceMap = undefined;
            }

            /** DEPRECATED */
            if (this.serve) {
                if (utils.isFunction(this.serve)) {
                    let userResult = this.serve(file.info.fuseBoxPath, file);
                    if (utils.isString(userResult)) {
                        filePath = userResult;
                        serve = true;
                    }
                }
            }
            if (serve) { /** DEPRECATED */
                file.alternativeContent = `__fsbx_css("${filePath}")`;
            } else {
                file.context.sourceChangedEmitter.emit({
                    type: "css",
                    content: file.contents,
                    path: file.info.fuseBoxPath,
                });
                file.alternativeContent = `__fsbx_css("${filePath}", ${safeContents});`;
            }
        }

    }

    private minifyContents(contents) {
        return contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim();
    }
}

export const CSSPlugin = (opts?: any) => {
    return new CSSPluginClass(opts)
}