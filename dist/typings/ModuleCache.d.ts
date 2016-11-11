import { WorkFlowContext } from "./WorkflowContext";
import { IPackageInformation } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { File } from "./File";
export declare class ModuleCache {
    context: WorkFlowContext;
    cacheFolder: string;
    private cacheFile;
    private cachedDeps;
    constructor(context: WorkFlowContext);
    resolve(files: File[]): Promise<File[]>;
    buildMap(rootCollection: ModuleCollection): void;
    set(info: IPackageInformation, contents: string): Promise<{}>;
}
