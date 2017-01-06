import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";

/**
 * @export
 * @class BannerPluginClass
 * @implements {Plugin}
 */
export class EnvPluginClass implements Plugin {
    constructor(private env: any) { }
    public bundleStart(context: WorkFlowContext) {
        context.source.addContent(`var __process_env__ = ${JSON.stringify(this.env)};`);
    }
}

export const EnvPlugin = (banner: string) => {
    return new EnvPluginClass(banner);
}