import { ModuleCollection } from "./ModuleCollection";
import { FuseBoxDump } from "./Dump";

/**
 * WorkFlowContext
 */
export class WorkFlowContext {
    public dump: FuseBoxDump = new FuseBoxDump();

    public nodeModules: Map<string, ModuleCollection> = new Map();

    public homeDir: string;
    public printLogs = true;
    public useCache = true;


    public setHomeDir(dir: string) {
        this.homeDir = dir;
    }

    public setPrintLogs(printLogs) {
        this.printLogs = printLogs;
    }

    public setUseCache(useCache: boolean) {
        this.useCache = useCache;
    }

    public hasNodeModule(name: string) {
        return this.nodeModules.has(name);
    }

    public addNodeModule(name: string, collection: ModuleCollection) {
        this.nodeModules.set(name, collection);
    }

    public getNodeModule(name: string): ModuleCollection {
        return this.nodeModules.get(name);
    }

}