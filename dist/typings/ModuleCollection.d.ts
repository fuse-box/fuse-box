import { Module } from "./Module";
import { BundleData } from "./Arithmetic";
export declare class ModuleCollection {
    name: string;
    entry: Module;
    cachedContent: any;
    nodeModules: Map<string, ModuleCollection>;
    version: string;
    dependencies: Map<string, Module>;
    bundle: BundleData;
    constructor(name: string, entry?: Module);
    collect(): any;
    setCachedContent(content: string): void;
    collectBundle(data: BundleData): Promise<Module>;
    resolve(module: Module): any;
    processModule(module: Module, name: string, shouldIgnoreDeps?: boolean): any;
    getNodeModuleName(name: string): string;
}
