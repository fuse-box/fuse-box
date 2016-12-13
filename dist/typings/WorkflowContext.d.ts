import { BundleSource } from "./BundleSource";
import { File } from "./File";
import { Log } from "./Log";
import { IPackageInformation } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { ModuleCache } from "./ModuleCache";
export interface Plugin {
    test?: RegExp;
    dependencies?: string[];
    init: {
        (context: WorkFlowContext);
    };
    transform: {
        (file: File, ast?: any);
    };
    bundleStart?(context: WorkFlowContext): any;
    bundleEnd?(context: WorkFlowContext): any;
}
export declare class WorkFlowContext {
    ignoreGlobal: string[];
    nodeModules: Map<string, ModuleCollection>;
    libPaths: Map<string, IPackageInformation>;
    homeDir: string;
    printLogs: boolean;
    plugins: Plugin[];
    useCache: boolean;
    doLog: boolean;
    cache: ModuleCache;
    tsConfig: any;
    customModulesFolder: string;
    tsMode: boolean;
    globals: any;
    standaloneBundle: boolean;
    source: BundleSource;
    sourceMapConfig: any;
    outFile: string;
    log: Log;
    initCache(): void;
    reset(): void;
    allowExtension(ext: string): void;
    setHomeDir(dir: string): void;
    setLibInfo(name: string, version: string, info: IPackageInformation): Map<string, IPackageInformation>;
    convert2typescript(name: string): string;
    getLibInfo(name: string, version: string): IPackageInformation;
    setPrintLogs(printLogs: any): void;
    setUseCache(useCache: boolean): void;
    hasNodeModule(name: string): boolean;
    isGlobalyIgnored(name: string): boolean;
    addNodeModule(name: string, collection: ModuleCollection): void;
    getTypeScriptConfig(): any;
    ensureUserPath(userPath: string): string;
    writeOutput(): void;
    getNodeModule(name: string): ModuleCollection;
}
