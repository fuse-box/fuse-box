import { WorkFlowContext } from "./core/WorkflowContext";
import { ModuleCollection } from "./core/ModuleCollection";
export declare class CollectionSource {
    context: WorkFlowContext;
    constructor(context: WorkFlowContext);
    get(collection: ModuleCollection): Promise<string>;
    private filterFiles(files);
}
