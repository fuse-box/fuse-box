import { IPackageInformation, IPathInformation } from './PathMaster';
import { WorkFlowContext } from "./WorkflowContext";
export interface INodeModuleRequire {
    name: string;
    target?: string;
}
export interface IPathInformation {
    isRemoteFile?: boolean;
    remoteURL?: string;
    isNodeModule: boolean;
    nodeModuleName?: string;
    nodeModuleInfo?: IPackageInformation;
    nodeModuleExplicitOriginal?: string;
    absDir?: string;
    fuseBoxPath?: string;
    absPath?: string;
}
export interface IPackageInformation {
    name: string;
    missing?: boolean;
    entry: string;
    version: string;
    root: string;
    entryRoot: string;
    custom: boolean;
    customBelongsTo?: string;
}
export declare class AllowedExtenstions {
    static list: Set<string>;
    static add(name: string): void;
    static has(name: any): boolean;
}
export declare class PathMaster {
    context: WorkFlowContext;
    rootPackagePath: string;
    private tsMode;
    constructor(context: WorkFlowContext, rootPackagePath?: string);
    init(name: string): IPathInformation;
    setTypeScriptMode(): void;
    resolve(name: string, root: string, rootEntryLimit?: string): IPathInformation;
    getFuseBoxPath(name: string, root: string): string;
    getAbsolutePath(name: string, root: string, rootEntryLimit?: string): string;
    getParentFolderName(): string;
    private ensureFolderAndExtensions(name, root);
    private getNodeModuleInfo(name);
    private getNodeModuleInformation(name);
}
