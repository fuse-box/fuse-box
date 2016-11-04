import { IPackageInformation, INodeModuleRequire } from "./Utils";
import { WorkFlowContext } from "./WorkFlowContext";
import { Module } from "./Module";
import { BundleData } from "./Arithmetic";
export declare class ModuleCollection {
    context: WorkFlowContext;
    name: string;
    entry: Module;
    cachedContent: any;
    packageInfo: IPackageInformation;
    nodeModules: Map<string, ModuleCollection>;
    bundle: BundleData;
    entryResolved: boolean;
    constructor(context: WorkFlowContext, name: string, entry?: Module);
    setPackageInfo(info: IPackageInformation): void;
    collect(): any;
    setCachedContent(content: string): void;
    collectBundle(data: BundleData): Promise<Module>;
    resolve(module: Module): any;
    addRootFile(info: INodeModuleRequire): any;
    addProjectFile(module: Module, name: string): any;
    processModule(module: Module, name: string, shouldIgnoreDeps?: boolean): any;
}
