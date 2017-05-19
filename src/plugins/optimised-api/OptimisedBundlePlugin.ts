import { Plugin, WorkFlowContext } from "../../core/WorkflowContext";
import { BundleProducer } from "../../core/BundleProducer";
import { OptimisedCore } from "./lib/OptimisedCore";
import { IOptimisedPluginParms, OptimisedPluginOptions } from "./lib/OptimisedPluginOptions";

export class OptimisedBundlePluginClass implements Plugin {

    constructor(public coreOpts?: IOptimisedPluginParms) {

    }
    init(context: WorkFlowContext) {
        context.bundle.producer.writeBundles = false;
    }
    producerEnd(producer: BundleProducer) {
        let core = new OptimisedCore(producer, new OptimisedPluginOptions(this.coreOpts));

        return core.consume();
    }
};

export const OptimisedBundlePlugin = (opts?: IOptimisedPluginParms) => {
    return new OptimisedBundlePluginClass(opts);
};
