import { File } from "./File";
import { PathMaster } from "./PathMaster";
import { WorkFlowContext } from "./WorkFlowContext";
import { BundleData } from "./Arithmetic";
export declare class ModuleCollection {
    context: WorkFlowContext;
    name: string;
    nodeModules: Map<string, ModuleCollection>;
    dependencies: Map<string, File>;
    bundle: BundleData;
    entryResolved: boolean;
    pm: PathMaster;
    entryFile: File;
    conflictingVersions: Map<string, string>;
    constructor(context: WorkFlowContext, name: string);
    setupEntry(file: File): void;
    resolveEntry(shouldIgnoreDeps?: boolean): any;
    collectBundle(data: BundleData): Promise<ModuleCollection>;
    resolve(file: File, shouldIgnoreDeps?: boolean): any;
}
