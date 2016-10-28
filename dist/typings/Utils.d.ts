export interface RequireOptions {
    name: string;
    str: string;
}
export declare function extractRequires(contents: string, transform: boolean): RequireOptions[];
export declare function getAbsoluteEntryPath(entry: string): string;
export declare function getWorkspaceDir(entry: string): string;
