import { File } from "../File";
import { WorkFlowContext } from "../WorkflowContext";
import { Plugin } from "../WorkflowContext";

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

        const debug = (text: string) => file.context.debug(this.constructor.name, text);

        if (!sass) { sass = require("node-sass"); }

        const options = Object.assign({
            data: file.contents,
            sourceMap: true,
            outFile: file.info.fuseBoxPath,
            sourceMapContents: true,
            includePaths: [],
        }, this.options);

        options.includePaths.push(file.info.absDir);

        return new Promise((res, rej) => {
            return sass.render(options, (err, result) => {
                if (err) {
                    return rej(err);
                }
                file.sourceMap = result.map && result.map.toString();
                file.contents = result.css.toString();
                return res(file.contents);
            });
        });
    }
}

export const SassPlugin = (options: any) => {
    return new SassPluginClass(options);
};

