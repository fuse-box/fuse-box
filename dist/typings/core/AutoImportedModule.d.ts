export declare class AutoImportedModule {
    variable: string;
    pkg: string;
    statement: string;
    constructor(variable: string, pkg: any);
    getImportStatement(): string;
}
export declare function registerDefaultAutoImportModules(userConfig: any): any;
