import { File } from './File';
import { PathMaster } from './PathMaster';
import { WorkFlowContext } from "./WorkFlowContext";
import { Module } from "./Module";
import { BundleData } from "./Arithmetic";
export declare class ModuleCollection {
    context: WorkFlowContext;
    name: string;
    entry: Module;
    nodeModules: Map<string, ModuleCollection>;
    dependencies: Map<string, File>;
    bundle: BundleData;
    entryResolved: boolean;
    pm: PathMaster;
    entryFile: File;
    conflictingVersions: Map<string, string>;
    constructor(context: WorkFlowContext, name: string, entry?: Module);
    setupEntry(file: File): void;
    resolveEntry(): any;
    collectBundle(data: BundleData): Promise<Module>;
    resolve(file: File): any;
}
