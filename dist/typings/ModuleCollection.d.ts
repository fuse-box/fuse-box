import { File } from "./File";
import { PathMaster, IPackageInformation } from "./PathMaster";
import { WorkFlowContext } from "./WorkFlowContext";
import { BundleData } from "./Arithmetic";
export declare class ModuleCollection {
    context: WorkFlowContext;
    name: string;
    info: IPackageInformation;
    nodeModules: Map<string, ModuleCollection>;
    dependencies: Map<string, File>;
    bundle: BundleData;
    entryResolved: boolean;
    pm: PathMaster;
    entryFile: File;
    cached: boolean;
    cachedContent: string;
    cachedName: string;
    cacheFile: string;
    conflictingVersions: Map<string, string>;
    private toBeResolved;
    private delayedResolve;
    constructor(context: WorkFlowContext, name: string, info?: IPackageInformation);
    setupEntry(file: File): void;
    resolveEntry(shouldIgnoreDeps?: boolean): any;
    initPlugins(): void;
    collectBundle(data: BundleData): Promise<ModuleCollection>;
    resolveNodeModule(file: File): any;
    resolve(file: File, shouldIgnoreDeps?: boolean): any;
}
