import { File } from "../../core/File";
import { WorkFlowContext, Plugin } from "../../core/WorkflowContext";
import * as path from "path";
import { Config } from "../../Config";

export interface SassPluginOptions {
    includePaths?: string[];
    macros?: { [key: string]: string };
    importer?: boolean | ImporterFunc;
    cache?: boolean;
    indentedSyntax?: boolean,
    functions?: { [key: string]: (...args: any[]) => any }
}

export interface ImporterFunc {
    (url: string, prev: string, done: (opts: { url?: string; file?: string; }) => any): any;
}

let sass;

/**
 * @export
 * @class SassPlugin
 * @implements {Plugin}
 */
export class SassPluginClass implements Plugin {

    public test: RegExp = /\.(scss|sass)$/;
    public context: WorkFlowContext;

    constructor(public options: SassPluginOptions = {}) { }

    public init(context: WorkFlowContext) {
        context.allowExtension(".scss");
        context.allowExtension(".sass");
        this.context = context;
    }

    public transform(file: File): Promise<any> {
        file.addStringDependency("fuse-box-css");
        const context = file.context;

        if (file.isCSSCached("sass")) {
            return;
        }
        file.bustCSSCache = true;
        file.loadContents();
        if (!file.contents) {
            return;
        }

        if (!sass) { sass = require("node-sass"); }


        const defaultMacro = {
            "$homeDir": file.context.homeDir,
            "$appRoot": context.appRoot,
            "~": Config.NODE_MODULES_DIR + "/",
        };

        const options = Object.assign({
            data: file.contents,
            sourceMap: true,
            outFile: file.info.fuseBoxPath,
            sourceMapContents: true
        }, this.options);

        options.includePaths = [];
        if (typeof this.options.includePaths !== "undefined") {
            this.options.includePaths.forEach((path) => {
                options.includePaths.push(path);
            });
        }

        options.macros = Object.assign(defaultMacro, this.options.macros || {}, );

        if (this.options.importer === true) {
            options.importer = (url, prev, done) => {
                if (/https?:/.test(url)) {
                    return done({ url });
                }
                for (let key in options.macros) {
                    if (options.macros.hasOwnProperty(key)) {
                        url = url.replace(key, options.macros[key]);
                    }
                }
                done({ file: path.normalize(url) });
            };
        }

        options.includePaths.push(file.info.absDir);

        const cssDependencies = file.context.extractCSSDependencies(file, {
            paths: options.includePaths,
            content: file.contents,
            sassStyle: true,
            importer: options.importer as any,
            extensions: ["css", options.indentedSyntax ? "sass" : "scss"]
        })
        return new Promise((resolve, reject) => {
            return sass.render(options, (err, result) => {
                if (err) {
                    const errorFile = err.file === 'stdin' ? file.absPath : err.file
                    file.contents = "";
                    file.addError(`${err.message}\n      at ${errorFile}:${err.line}:${err.column}`)
                    return resolve();
                }

                file.sourceMap = result.map && result.map.toString();
                file.contents = result.css.toString();
                if (context.useCache) {
                    file.analysis.dependencies = cssDependencies;
                    context.cache.writeStaticCache(file, file.sourceMap, "sass");
                    file.analysis.dependencies = [];
                }
                return resolve();
            });
        });

    }
}

export const SassPlugin = (options?: SassPluginOptions) => {
    return new SassPluginClass(options);
};
