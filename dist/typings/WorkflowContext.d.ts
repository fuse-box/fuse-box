import { Log } from "./Log";
import { IPackageInformation } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { FuseBoxDump } from "./Dump";
import { ModuleCache } from "./ModuleCache";
export declare class WorkFlowContext {
    dump: FuseBoxDump;
    nodeModules: Map<string, ModuleCollection>;
    libPaths: Map<string, IPackageInformation>;
    homeDir: string;
    printLogs: boolean;
    useCache: boolean;
    cache: ModuleCache;
    log: Log;
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
