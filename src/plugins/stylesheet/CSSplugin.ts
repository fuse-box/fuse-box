import * as path from "path";
import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
import { utils } from "realm-utils";
import { Concat, ensureUserPath, write, isStylesheetExtension } from "../../Utils";


export interface CSSPluginOptions {
    outFile?: { (file: string): string } | string;
    inject?: boolean | { (file: string): string }
    group?: string;
    minify?: boolean;
}

const ensureCSSExtension = (file: File | string): string => {
    let str = file instanceof File ? file.info.fuseBoxPath : file;
    const ext = path.extname(str);
    if (ext !== ".css") {
        return str.replace(ext, ".css")
    }
    return str;
}
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
    private minify = false;
    public options: CSSPluginOptions;

    public dependencies: ["fuse-box-css"];

    constructor(opts: CSSPluginOptions = {}) {
        this.options = opts;

        if (opts.minify !== undefined) {
            this.minify = opts.minify;
        }
    }

    public injectFuseModule(file: File) {
        file.addStringDependency("fuse-box-css");
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

    public getFunction() {
        return `require("fuse-box-css")`;
    }


    public inject(file: File, options: any, alternative?: boolean): string {
        // Inject properties
        // { inject : path => path } -> customise automatic injection
        // { inject : false } -> do not inject anything. User will manually put the script tag
        // No inject at all, means automatic injection with default path
        const resolvedPath = utils.isFunction(options.inject)
            ? options.inject(ensureCSSExtension(file)) : ensureCSSExtension(file);

        // noop the contents if a user wants to manually inject it
        const result = options.inject !== false ? `${this.getFunction()}("${resolvedPath}");` : "";
        if (alternative) {
            file.addAlternativeContent(result);
        } else {
            file.contents = result;
        }
        return resolvedPath;
    }

    public transformGroup(group: File) {

        const debug = (text: string) => group.context.debugPlugin(this, text);
        debug(`Start group transformation on "${group.info.fuseBoxPath}"`);

        let concat = new Concat(true, "", "\n");
        group.subFiles.forEach(file => {
            debug(`  -> Concat ${file.info.fuseBoxPath}`);
            concat.add(file.info.fuseBoxPath, file.contents, file.generateCorrectSourceMap());
        });

        let options = group.groupHandler.options || {};
        const cssContents = concat.content;

        // writing
        if (options.outFile) {
            let outFile = ensureUserPath(ensureCSSExtension(options.outFile));

            const bundleDir = path.dirname(outFile);
            const sourceMapsName = path.basename(options.outFile) + ".map";

            concat.add(null, `/*# sourceMappingURL=${sourceMapsName} */`);

            debug(`Writing ${outFile}`);
            return write(outFile, concat.content).then(() => {
                const resolvedPath = this.inject(group, options);
                this.emitHMR(group, resolvedPath);
                // Writing sourcemaps
                const sourceMapsFile = ensureUserPath(path.join(bundleDir, sourceMapsName));
                return write(sourceMapsFile, concat.sourceMap);
            });
        } else {
            debug(`Inlining ${group.info.fuseBoxPath}`);
            const safeContents = JSON.stringify(cssContents.toString());
            group.addAlternativeContent(`${this.getFunction()}("${group.info.fuseBoxPath}", ${safeContents});`)
        }

        this.emitHMR(group);
    }
    public emitHMR(file: File, resolvedPath?: string) {
        let emitRequired = false;
        const bundle = file.context.bundle;
        // We want to emit CSS Changes only if an actual CSS file was changed.
        if (bundle && bundle.lastChangedFile) {
            const lastFile = file.context.convertToFuseBoxPath(bundle.lastChangedFile);
            if (isStylesheetExtension(bundle.lastChangedFile) && lastFile === file.info.fuseBoxPath) {
                emitRequired = true;
            }
        }
        if (emitRequired) {
            if (resolvedPath) {

                file.context.sourceChangedEmitter.emit({
                    type: "hosted-css",
                    path: resolvedPath,
                });
            } else {
                file.context.sourceChangedEmitter.emit({
                    type: "css",
                    content: file.alternativeContent,
                    path: file.info.fuseBoxPath,
                });
            }

        }
    }
    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxCSSPlugin
     */
    public transform(file: File) {
        if (!file.context.sourceMapsProject) {
            file.sourceMap = undefined;
        }
        // no bundle groups here
        if (file.hasSubFiles()) {
            return;
        }
        this.injectFuseModule(file);

        const debug = (text: string) => file.context.debugPlugin(this, text);

        file.loadContents();


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
        if (this.options.group) {
            file.sourceMap = undefined;
            const bundleName = this.options.group;
            let fileGroup = context.getFileGroup(bundleName);
            if (!fileGroup) {
                fileGroup = context.createFileGroup(bundleName, file.collection, this);
            }
            // Adding current file (say a.txt) as a subFile
            fileGroup.addSubFile(file);
            debug(`  grouping -> ${bundleName}`)

            // Respect other plugins to override the output
            file.addAlternativeContent(`require("~/${bundleName}")`);
            return;
        }

        if (file.sourceMap) {
            file.sourceMap = file.generateCorrectSourceMap();
        }
        /**
         * An option just to write files to a specific path
         */
        let outFileFunction;
        if (this.options.outFile !== undefined) {
            if (!utils.isFunction(this.options.outFile)) {
                context.fatal(`Error in CSSConfig. outFile is expected to be a function that resolves a path`);
            } else {
                outFileFunction = this.options.outFile;
            }
        }

        if (outFileFunction) {
            const userPath = ensureUserPath(outFileFunction(ensureCSSExtension(file)));
            const utouchedPath = outFileFunction(file.info.fuseBoxPath);
            // reset the content so it won't get bundled

            const resolvedPath = this.inject(file, this.options, true);

            // writing ilfe
            return write(userPath, file.contents).then(() => {
                this.emitHMR(file, resolvedPath);
                if (file.sourceMap && file.context.sourceMapsProject) {
                    const fileDir = path.dirname(userPath);
                    const sourceMapPath = path.join(fileDir,
                        path.basename(utouchedPath) + ".map");
                    return write(sourceMapPath, file.sourceMap).then(() => {

                        file.sourceMap = undefined;
                    });
                }
            });
        } else {
            let safeContents = JSON.stringify(file.contents);
            file.sourceMap = undefined;

            file.addAlternativeContent(`${this.getFunction()}("${filePath}", ${safeContents})`);

            // We want to emit CSS Changes only if an actual CSS file was changed.
            this.emitHMR(file);
        }
    }

    private minifyContents(contents) {
        return contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim();
    }
}

export const CSSPlugin = (opts?: CSSPluginOptions) => {
    return new CSSPluginClass(opts);
};
