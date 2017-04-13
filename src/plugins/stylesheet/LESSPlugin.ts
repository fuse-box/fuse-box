import { File } from "../../core/File";
import { WorkFlowContext } from "./../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
let less;

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
    public options: any;

    constructor(options: any) {
        this.options = options || {};
    }

    public init(context: WorkFlowContext) {
        context.allowExtension(".less");
    }

    /**
     * @param {File} file
     * @memberOf LESSPluginClass
     */
    public transform(file: File) {
        const context : WorkFlowContext = file.context;
        const options = { ...this.options };

        file.loadContents();

        const sourceMapDef = {
            sourceMapBasepath: ".",
            sourceMapRootpath: file.info.absDir,
        };

        if (!less) {
            less = require("less");
        }

        options.filename = options.filename || file.info.fuseBoxPath;

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

export const LESSPlugin = (opts: any) => {
    return new LESSPluginClass(opts);
};
