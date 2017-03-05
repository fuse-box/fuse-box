import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";

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

export const EnvPlugin = (banner: any) => {
    return new EnvPluginClass(banner);
}