export declare class HeaderImport {
    variable: string;
    pkg: string;
    statement: string;
    constructor(variable: string, pkg: any);
    getImportStatement(): string;
}
export declare class HeaderImportCollection {
    collection: Map<string, HeaderImport>;
    add(config: HeaderImport): void;
    get(variable: string): HeaderImport;
    has(variable: string): Boolean;
}
export declare const nativeModules: HeaderImportCollection;
