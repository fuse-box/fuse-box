import { WorkFlowContext, Plugin } from '../WorkflowContext';
import { utils } from "realm-utils";

export class ChainPluginClass {
    private test: RegExp;
    private plugins: Array<Plugin>;

    constructor(test: RegExp, plugins: Array<Plugin>) {
        this.test = test;
        this.plugins = plugins;
    }
    
    add(plugin: Plugin) {
        this.plugins.push(plugin);
        return this;
    }

    bundleStart(context: WorkFlowContext) {
        // Get the first plugin that has a bundleStart - this should take priority
        let length = this.plugins.length;

        while (length--) {
            let plugin = this.plugins[length];

            if (utils.isFunction(plugin.bundleStart)) {
                plugin.bundleStart(context);
                break;
            }
        }
    }

    transform(file, ast?): Promise<void> {
        return this.plugins.reduce((chain: Promise<void>, plugin) => {
            if (!utils.isFunction(plugin.transform)) {
                return Promise.resolve();
            }

            return chain.then(() => plugin.transform.apply(plugin, [file, ast]));
        }, Promise.resolve());
    }

    bundleEnd(context: WorkFlowContext) {
        // Get the first plugin that has a bundleEnd - this should take priority
        let length = this.plugins.length;

        while (length--) {
            let plugin = this.plugins[length];

            if (utils.isFunction(plugin.bundleEnd)) {
                plugin.bundleEnd(context);
                break;
            }
        }
    }
}

export const ChainPlugin = (test: RegExp, plugins: Array<Plugin>) => {
    return new ChainPluginClass(test, plugins);
}