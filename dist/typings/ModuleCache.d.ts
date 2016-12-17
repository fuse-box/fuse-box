import { WorkFlowContext } from "./WorkflowContext";
import { IPackageInformation } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { File } from "./File";
export declare class ModuleCache {
    context: WorkFlowContext;
    cacheFolder: string;
    private cacheFile;
    private staticCacheFolder;
    private cachedDeps;
    constructor(context: WorkFlowContext);
    getStaticCache(file: File): any;
    writeStaticCache(file: File, sourcemaps: string): void;
    resolve(files: File[]): Promise<File[]>;
    buildMap(rootCollection: ModuleCollection): void;
    set(info: IPackageInformation, contents: string): Promise<{}>;
}
