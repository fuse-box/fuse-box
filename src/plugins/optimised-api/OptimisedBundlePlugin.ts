import { Plugin, WorkFlowContext } from "../../core/WorkflowContext";
import { BundleProducer } from "../../core/BundleProducer";
import { OptimisedCore } from "./lib/OptimisedCore";

export class OptimisedBundlePluginClass implements Plugin {
    init(context: WorkFlowContext) {
        context.bundle.producer.writeBundles = false;
    }
    producerEnd(producer: BundleProducer) {
        let core = new OptimisedCore(producer);

        return core.consume();
    }
};

export const OptimisedBundlePlugin = () => {
    return new OptimisedBundlePluginClass();
};
