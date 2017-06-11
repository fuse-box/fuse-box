import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";

export interface StylusPluginOptions {
    sourcemap?: { [key: string]: boolean | string };
}

interface InternalOpts {
    filename?: string;
}

let stylus;

/**
 * @export
 * @class StylusPluginClass
 * @implements {Plugin}
 */
export class StylusPluginClass implements Plugin {
	/**
	 * @type {RegExp}
	 * @memberOf StylusPluginClass
	 */
    public test: RegExp = /\.styl$/;

    constructor(public options: StylusPluginOptions = {}) { }

    public init(context: WorkFlowContext) {
        context.allowExtension(".styl");
    }

    public transform(file: File): Promise<any> {
        file.addStringDependency("fuse-box-css");
        const context: WorkFlowContext = file.context;
        const options: StylusPluginOptions & InternalOpts = { ...this.options };
        const sourceMapDef = {
            comment: false,
            sourceRoot: file.info.absDir,
        };

        file.loadContents();

        if (!stylus) stylus = require("stylus");

        options.filename = file.info.fuseBoxPath;

        if ("sourceMapConfig" in context) {
            options.sourcemap = { ...sourceMapDef, ...this.options.sourcemap || {} };
        }

        return new Promise((res, rej) => {
            const renderer = stylus(file.contents, options);

            return renderer.render((err, css) => {
                if (err) return rej(err);

                if (renderer.sourcemap) {
                    file.sourceMap = JSON.stringify(renderer.sourcemap);
                }

                file.contents = css;

                return res(css);
            });
        });
    }
}

export const StylusPlugin = (options?: StylusPluginOptions) => {
    return new StylusPluginClass(options);
};
