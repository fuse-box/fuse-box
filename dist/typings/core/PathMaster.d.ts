import { IPackageInformation, IPathInformation } from "./PathMaster";
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
    params?: Map<string, string>;
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
/**
 * Manages the allowed extensions e.g.
 * should user be allowed to do `require('./foo.ts')`
 */
export declare class AllowedExtenstions {
    /**
     * Users are allowed to require files with these extensions by default
     **/
    static list: Set<string>;
    static add(name: string): void;
    static has(name: any): boolean;
}
/**
 * PathMaster
 */
export declare class PathMaster {
    context: WorkFlowContext;
    rootPackagePath: string;
    private tsMode;
    constructor(context: WorkFlowContext, rootPackagePath?: string);
    init(name: string): IPathInformation;
    setTypeScriptMode(): void;
    resolve(name: string, root?: string, rootEntryLimit?: string): IPathInformation;
    getFuseBoxPath(name: string, root: string): string;
    /**
     * Make sure that all extensions are in place
     * Returns a valid absolute path
     *
     * @param {string} name
     * @param {string} root
     * @returns
     *
     * @memberOf PathMaster
     */
    getAbsolutePath(name: string, root: string, rootEntryLimit?: string, explicit?: boolean): string;
    getParentFolderName(): string;
    private testFolder(folder, name);
    private checkFileName(root, name);
    private ensureFolderAndExtensions(name, root, explicit?);
    private getNodeModuleInfo(name);
    private getNodeModuleInformation(name);
}
