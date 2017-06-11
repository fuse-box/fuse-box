import { File } from "../../core/File";
import { WorkFlowContext } from "./../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
let less;

export interface LESSPluginOptions {
    sourceMap?: any;
}

export interface LESSPluginInternalOpts {
    filename?: string;
}

/**
 * @export
 * @class LESSPluginClass
 * @implements {Plugin}
 */
export class LESSPluginClass implements Plugin {
    /**
     * @type {RegExp}
     * @memberOf LESSPluginClass
     */
    public test: RegExp = /\.less$/;
    public options: LESSPluginOptions & LESSPluginInternalOpts;

    constructor(options: LESSPluginOptions = {}) {
        this.options = options;
    }

    public init(context: WorkFlowContext) {
        context.allowExtension(".less");
    }

    /**
     * @param {File} file
     * @memberOf LESSPluginClass
     */
    public transform(file: File) {
        file.addStringDependency("fuse-box-css");
        const context: WorkFlowContext = file.context;
        const options = { ...this.options };

        file.loadContents();

        const sourceMapDef = {
            sourceMapBasepath: ".",
            sourceMapRootpath: file.info.absDir,
        };

        if (!less) {
            less = require("less");
        }

        options.filename = file.context.homeDir + (options.filename || file.info.fuseBoxPath);

        if ("sourceMapConfig" in context) {
            options.sourceMap = { ...sourceMapDef, ...options.sourceMap || {} };
        }

        return less.render(file.contents, options).then(output => {
            if (output.map) {
                file.sourceMap = output.map;
            }

            file.contents = output.css;
        });
    }
}

export const LESSPlugin = (opts?: LESSPluginOptions) => {
    return new LESSPluginClass(opts);
};
