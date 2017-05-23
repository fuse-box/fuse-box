import { Plugin, WorkFlowContext } from "../../core/WorkflowContext";
import { BundleProducer } from "../../core/BundleProducer";
import { OptimisedCore } from "./OptimisedCore";
import { OptimisedPluginOptions, IOptimisedPluginParms } from "./OptimisedPluginOptions";



export class OptimisedBundlePluginClass implements Plugin {
    public coreOpts: IOptimisedPluginParms;
    constructor(coreOpts?: IOptimisedPluginParms) {
        this.coreOpts = coreOpts || {};
    }
    init(context: WorkFlowContext) {
        context.bundle.producer.writeBundles = false;
        // filter out some plugins to apply the later

        context.bundle.producer.bundles.forEach(bundle => {
            bundle.context.plugins.forEach((plugin, index) => {
                if (plugin.constructor.name === "UglifyJSPluginClass") {
                    this.coreOpts.uglify = plugin.options || {};
                    // remove uglify js
                    bundle.context.plugins.splice(index, 1);
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
