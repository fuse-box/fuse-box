import { WorkFlowContext } from "./WorkflowContext";
import { ModuleCollection } from "./ModuleCollection";
export declare class CollectionSource {
    context: WorkFlowContext;
    constructor(context: WorkFlowContext);
    get(collection: ModuleCollection, withSourceMaps?: boolean): Promise<string>;
    private resolveFiles(files);
}
