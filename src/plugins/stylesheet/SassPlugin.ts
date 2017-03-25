import { File } from "../../core/File";
import { WorkFlowContext, Plugin } from "../../core/WorkflowContext";
import * as path from "path";
import * as appRoot from "app-root-path";
import { Config } from "../../Config";

let sass;

/**
 * @export
 * @class SassPlugin
 * @implements {Plugin}
 */
export class SassPluginClass implements Plugin {

    public test: RegExp = /\.scss$/;
    public options: any;

    constructor(options: any) {
        this.options = options || {};
    }

    public init(context: WorkFlowContext) {
        context.allowExtension(".scss");
    }

    public transform(file: File): Promise<any> {
        file.loadContents();
        if (!file.contents) {
            return;
        }

        if (!sass) { sass = require("node-sass"); }

        const defaultMacro = {
            "$homeDir": file.context.homeDir,
            "$appRoot": appRoot.path,
            "~": Config.NODE_MODULES_DIR + "/",
        };

        const options = Object.assign({
            data: file.contents,
            sourceMap: true,
            outFile: file.info.fuseBoxPath,
            sourceMapContents: true,
        }, this.options);

        options.includePaths = [];
        if (typeof this.options.includePaths !== "undefined") {
            this.options.includePaths.forEach((path) => {
                options.includePaths.push(path);
            });
        }
        options.macros = Object.assign(defaultMacro, this.options.macros || {},);

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
        return new Promise((resolve, reject) => {
            return sass.render(options, (err, result) => {
                if (err) {
                    return reject(err);
                }
                file.sourceMap = result.map && result.map.toString();
                file.contents = result.css.toString();

                return resolve();
            });
        });

    }
}

export const SassPlugin = (options?: any) => {
    return new SassPluginClass(options);
};
