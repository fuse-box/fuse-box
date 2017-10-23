import { Plugin, WorkFlowContext } from "../../core/WorkflowContext";
import { BundleProducer } from "../../core/BundleProducer";
import { WebIndexPluginClass } from "../../plugins/WebIndexPlugin";
import { IQuantumExtensionParams, QuantumOptions } from "./QuantumOptions";
import { QuantumCore } from "./QuantumCore";

export class QuantumPluginClass implements Plugin {
    public coreOpts: IQuantumExtensionParams;

    constructor(coreOpts?: IQuantumExtensionParams) {
        this.coreOpts = coreOpts || {};
    }

    init(context: WorkFlowContext) {
        context.bundle.producer.writeBundles = false;
        context.bundle.producer.hmrAllowed = false;
        // filter out some plugins to apply the later

        context.bundle.producer.bundles.forEach(bundle => {
            const plugins = bundle.context.plugins;
            plugins.forEach((plugin, index) => {
                if (plugin.constructor.name === "UglifyJSPluginClass") {
                    this.coreOpts.uglify = plugin.options || {};
                    // remove uglify js
                    delete plugins[index];
                }
                if (plugin.constructor.name === "UglifyESPluginClass") {
                    this.coreOpts.uglify = { es6:true, ...plugin.options };
                    // remove uglify es
                    delete plugins[index];
                }

                if (plugin.constructor.name === "WebIndexPluginClass") {
                    this.coreOpts.webIndexPlugin = plugin as WebIndexPluginClass;
                    // remove WebIndex
                    delete plugins[index];
                }
                if (plugin.constructor.name === "HotReloadPluginClass") {
                    delete plugins[index];
                }
            })
        });
    }

    producerEnd(producer: BundleProducer) {
        let core = new QuantumCore(producer, new QuantumOptions(this.coreOpts));
        return core.consume();
    }
};

export const QuantumPlugin = (opts?: IQuantumExtensionParams) => {
    return new QuantumPluginClass(opts);
};
