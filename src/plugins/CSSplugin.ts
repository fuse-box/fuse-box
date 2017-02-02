import { ensureUserPath, replaceExt } from '../Utils';
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
    private raw = false;
    private minify = false;
    private serve: any;
    private writeOptions: any;
    private bundle: any;
    private urlRules: any;

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

        let lib = path.join(Config.LOCAL_LIBS, "fsbx-default-css-plugin", "index.js")
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
            if (!utils.isPlainObject(this.writeOptions)) {
                this.writeOptions = {};
            }
            // can't work without outFile
            if (file.context.outFile) {
                // Get a directory of our bundle
                let base = path.dirname(file.context.outFile);
                // Change project path extension to .css
                let projectPath = replaceExt(file.info.fuseBoxPath, ".css");

                // Get new path based on where outFile is located + real project path
                // Making sure here that folders are created
                let newPath = ensureUserPath(path.join(base, projectPath));

                let initialContents = file.contents;
                file.contents = `__fsbx_css("${projectPath}")`;

                let tasks = [];
                if (file.sourceMap) {
                    let sourceMapFile = projectPath + ".map";
                    // adding sourcemap link to a file
                    // Sometimes it's already there (written by SASS for example)
                    // What shall we do then...
                    initialContents += `\n/*# sourceMappingURL=${sourceMapFile} */`;

                    let souceMapPath = ensureUserPath(path.join(base, sourceMapFile));
                    let initialSourceMap = file.sourceMap;
                    file.sourceMap = undefined;
                    tasks.push(new Promise((resolve, reject) => {
                        fs.writeFile(souceMapPath, initialSourceMap, (err, res) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve();
                        });
                    }));
                }

                // writing a file
                tasks.push(new Promise((resolve, reject) => {
                    fs.writeFile(newPath, initialContents, (err, res) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    });
                }));
                return Promise.all(tasks);
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

            file.context.emmitter.emit("source-changed", {
                type: "css",
                content: cssContent,
                path: file.info.fuseBoxPath,
            });
            contents = `__fsbx_css("${filePath}", ${safeContents})`;
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