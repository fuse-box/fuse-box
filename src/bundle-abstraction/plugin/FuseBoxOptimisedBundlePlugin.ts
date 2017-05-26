import { Plugin, WorkFlowContext } from "../../core/WorkflowContext";
import { BundleProducer } from "../../core/BundleProducer";
import { OptimisedCore } from "./OptimisedCore";
import { OptimisedPluginOptions, IOptimisedPluginParms } from "./OptimisedPluginOptions";
import { WebIndexPluginClass } from "../../plugins/WebIndexPlugin";



export class OptimisedBundlePluginClass implements Plugin {
    public coreOpts: IOptimisedPluginParms;
    constructor(coreOpts?: IOptimisedPluginParms) {
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

                if (plugin.constructor.name === "WebIndexPluginClass") {
                    this.coreOpts.webIndexPlugin = plugin as WebIndexPluginClass;
                    // remove WebIndex
                    delete plugins[index];
                }
                if (plugin.constructor.name === "HotReloadPluginClass") {
                    delete plugins[index];
                }
            })
        })

    }
    producerEnd(producer: BundleProducer) {
        let core = new OptimisedCore(producer, new OptimisedPluginOptions(this.coreOpts));
        return core.consume();
    }
};

export const OptimisedBundlePlugin = (opts?: IOptimisedPluginParms) => {
    return new OptimisedBundlePluginClass(opts);
};
