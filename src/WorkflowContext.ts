import { Log } from "./Log";
import { IPackageInformation } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { ModuleCache } from "./ModuleCache";
const readline = require("readline");


export interface Plugin {
    test: RegExp;
    transform: { (data: any) };
}

/**
 * WorkFlowContext
 */
export class WorkFlowContext {


    public nodeModules: Map<string, ModuleCollection> = new Map();
    public libPaths: Map<string, IPackageInformation> = new Map();
    public homeDir: string;
    public printLogs = true;
    public plugins: Plugin[];
    public useCache = true;
    public cache = new ModuleCache(this);
    public log: Log;

    public reset() {
        this.log = new Log();
        this.nodeModules = new Map();
        this.libPaths = new Map();
    }
    public setHomeDir(dir: string) {
        this.homeDir = dir;
    }

    public setLibInfo(name: string, version: string, info: IPackageInformation) {
        let key = `${name}@${version}`;
        if (!this.libPaths.has(key)) {
            return this.libPaths.set(key, info);
        }
    }
    public getLibInfo(name: string, version: string): IPackageInformation {
        let key = `${name}@${version}`;
        if (this.libPaths.has(key)) {
            return this.libPaths.get(key);
        }
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

    public spinStart(title: string) {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${title}`);
    }

    public getNodeModule(name: string): ModuleCollection {
        return this.nodeModules.get(name);
    }
}