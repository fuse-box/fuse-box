export interface RequireOptions {
    name: string;
    str: string;
}
export interface IPackageInformation {
    name: string;
    entry: string;
    version: string;
    root: string;
}
export declare function getPackageInformation(name: string, parent?: IPackageInformation): IPackageInformation;
export declare function ensureRelativePath(name: string, absPath: string): string;
export declare function extractRequires(contents: string, absPath: string): RequireOptions[];
export interface INodeModuleRequire {
    name: string;
    target?: string;
}
export declare function getNodeModuleName(name: string): INodeModuleRequire;
export declare function getAbsoluteEntryPath(entry: string): string;
