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
        const producer = context.bundle.producer;
        if (producer) {
            producer.addUserProcessEnvVariables(this.env);
        }
        context.source.addContent(`var __process_env__ = ${JSON.stringify(this.env)};`);
    }
}

export const EnvPlugin = (options: EnvPluginOptions) => {
    return new EnvPluginClass(options);
};
