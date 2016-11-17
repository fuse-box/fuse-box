import { WorkFlowContext } from "./WorkflowContext";
import { ModuleCollection } from "./ModuleCollection";
export declare class CollectionSource {
    context: WorkFlowContext;
    constructor(context: WorkFlowContext);
    get(collection: ModuleCollection): Promise<string>;
    private resolveFiles(files);
}
