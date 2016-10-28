import { Module } from "./Module";
import { BundleData } from "./Arithmetic";
export declare class ModuleCollection {
    name: string;
    entry: Module;
    nodeModules: Map<string, ModuleCollection>;
    dependencies: Map<string, Module>;
    bundle: BundleData;
    constructor(name: string, entry?: Module);
    collect(): any;
    collectBundle(data: BundleData): Promise<Module>;
    resolve(module: Module): any;
    processModule(module: Module, name: string, shouldIgnoreDeps?: boolean): any;
    getNodeModuleName(name: string): string;
    private getNodeModuleMainFile(name);
}
