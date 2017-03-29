//import { WorkFlowContext } from "../core/WorkflowContext";
import { File } from "../core/File";
import { Plugin, WorkFlowContext } from "../core/WorkflowContext";
import { utils } from "realm-utils";
import { extractExtension, string2RegExp, hashString, joinFuseBoxPath } from "../Utils";
import * as fs from "fs-extra";
import * as path from "path";

export interface CopyPluginOptions {
    files?: string[];
    useDefault?: boolean;
    dest?: string;
    resolve?: string;
}

/**
 * @export
 * @class AssetPluginClass
 * @implements {Plugin}
 */
export class CopyPluginClass implements Plugin {
    public extensions: Array<string>;
    public test: RegExp = /.*/;
    private useDefault = true;
    private resolve = "/assets/";
    private dest = "assets";

    constructor(public options: CopyPluginOptions = {}) {
        options = options || {};
        if (options.useDefault !== undefined) {
            this.useDefault = options.useDefault;
        }
        if (options.resolve !== undefined) {
            this.resolve = options.resolve;
        }
        if (options.dest !== undefined) {
            this.dest = options.dest;
        }
        if (utils.isArray(options.files)) {
            this.extensions = [];
            options.files.forEach(str => {
                this.extensions.push("." + extractExtension(str));
            });
            this.test = string2RegExp(options.files.join("|"));
        }
    }
    public init(context: WorkFlowContext) {
        if (Array.isArray(this.extensions)) {
            return this.extensions.forEach(ext => context.allowExtension(ext));
        }
    }

    public transform(file: File) {
        const context = file.context;
        file.isLoaded = true;
        let userFile = (!context.hash ? hashString(file.info.fuseBoxPath) + "-" : "") + path.basename(file.info.fuseBoxPath);
        let userPath = path.join(this.dest, userFile);
        let exportsKey = this.useDefault ? "module.exports.default" : "module.exports";

        file.alternativeContent = (`${exportsKey} = "${joinFuseBoxPath(this.resolve, userFile)}";`);
        if (fs.existsSync(userPath)) {
            return;
        }
        return new Promise((resolve, reject) => {
            fs.readFile(file.absPath, (err, data) => {
                if (err) {
                    return reject();
                }
                return context.output.write(userPath, data).then(result => {
                    if (result.hash) {
                        file.alternativeContent = (`${exportsKey} = "${joinFuseBoxPath(this.resolve, result.filename)}";`);
                    }
                    return resolve();
                }).catch(reject);
            });
        });
    }
}

export const CopyPlugin = (options?: CopyPluginOptions) => {
    return new CopyPluginClass(options);
};
