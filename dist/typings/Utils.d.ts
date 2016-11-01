export interface RequireOptions {
    name: string;
    str: string;
}
export interface IPackageInformation {
    entry: string;
    version: string;
    root: string;
}
export declare function getPackageInformation(name: string): IPackageInformation;
export declare function extractRequires(contents: string, transform: boolean): RequireOptions[];
export interface INodeModuleRequire {
    name: string;
    target?: string;
}
export declare function getNodeModuleName(name: string): INodeModuleRequire;
export declare function getAbsoluteEntryPath(entry: string): string;
export declare function getWorkspaceDir(entry: string): string;
