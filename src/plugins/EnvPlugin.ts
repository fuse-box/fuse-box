import * as fs from "fs";
import * as path from "path";
import { Config } from "./../Config"
import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";

export interface EnvPluginOptions {
    [key: string]: any;
}

/**
 * @export
 * @class BannerPluginClass
 * @implements {Plugin}
 */
export class EnvPluginClass implements Plugin {
    constructor(private env: EnvPluginOptions) { }
    public bundleStart(context: WorkFlowContext) {
        context.source.addContent(`var __process_env__ = ${JSON.stringify(this.env)};`);
        if (context.serverBundle) {
            let lib = path.join(Config.FUSEBOX_MODULES, "process", "index.js");
            context.source.addContent(fs.readFileSync(lib).toString());
        }
    }
}

export const EnvPlugin = (options: EnvPluginOptions) => {
    return new EnvPluginClass(options);
};
