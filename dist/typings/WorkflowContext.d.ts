import { ModuleCollection } from "./ModuleCollection";
import { FuseBoxDump } from "./Dump";
export declare class WorkFlowContext {
    dump: FuseBoxDump;
    nodeModules: Map<string, ModuleCollection>;
    homeDir: string;
    printLogs: boolean;
    useCache: boolean;
    setHomeDir(dir: string): void;
    setPrintLogs(printLogs: any): void;
    setUseCache(useCache: boolean): void;
    hasNodeModule(name: string): boolean;
    addNodeModule(name: string, collection: ModuleCollection): void;
    getNodeModule(name: string): ModuleCollection;
}
