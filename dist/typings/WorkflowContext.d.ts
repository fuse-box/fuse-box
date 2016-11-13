import { Log } from "./Log";
import { IPackageInformation } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { ModuleCache } from "./ModuleCache";
export declare class WorkFlowContext {
    nodeModules: Map<string, ModuleCollection>;
    libPaths: Map<string, IPackageInformation>;
    homeDir: string;
    printLogs: boolean;
    useCache: boolean;
    cache: ModuleCache;
    log: Log;
    reset(): void;
    setHomeDir(dir: string): void;
    setLibInfo(name: string, version: string, info: IPackageInformation): Map<string, IPackageInformation>;
    getLibInfo(name: string, version: string): IPackageInformation;
    setPrintLogs(printLogs: any): void;
    setUseCache(useCache: boolean): void;
    hasNodeModule(name: string): boolean;
    addNodeModule(name: string, collection: ModuleCollection): void;
    spinStart(title: string): void;
    getNodeModule(name: string): ModuleCollection;
}
