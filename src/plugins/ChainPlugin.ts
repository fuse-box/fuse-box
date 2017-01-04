import { WorkFlowContext, Plugin } from '../WorkflowContext';
import { utils, each } from "realm-utils";

export class ChainPluginClass {
    private test: RegExp;
    private plugins: Array<Plugin>;

    constructor(test: RegExp, plugins: Array<Plugin>) {
        this.test = test;
        this.plugins = plugins;
    }

    public add(plugin: Plugin) {
        this.plugins.push(plugin);
        return this;
    }

    public bundleStart(context: WorkFlowContext) {
        // Get the first plugin that has a bundleStart - this should take priority
        let plugin = this.plugins.find(plugin => utils.isFunction(plugin.bundleStart));
        if (plugin) {
            plugin.bundleStart(context);
        }
    }

    public transform(file): Promise<void> {
        // reduce? might it help here?
        // each resolves promises in a waterfall
        return each(this.plugins, (plugin) => {

            if (utils.isFunction(plugin.initialize)) {
                return plugin.initialize.apply(plugin, [file.context]);
            }
            if (utils.isFunction(plugin.transform)) {
                return plugin.transform.apply(plugin, [file]);
            }
        });
    }

    public bundleEnd(context: WorkFlowContext) {
        // Get the first plugin that has a bundleEnd - this should take priority
        let plugin = this.plugins.find(plugin => utils.isFunction(plugin.bundleEnd));

        if (plugin) {
            plugin.bundleEnd(context);
        }
    }
}

export const ChainPlugin = (test: RegExp, plugins: Array<Plugin>) => {
    return new ChainPluginClass(test, plugins);
}