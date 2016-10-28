export declare class PropParser {
    str: any;
    excluding: {};
    including: {};
    entry: {};
    private states;
    private index;
    private word;
    constructor(str: any);
    reset(): void;
    tokenReady(): void;
    receive(char: string, last: boolean): void;
    next(): any;
    parse(): void;
    empty(): void;
    set(...args: any[]): void;
    clean(...args: any[]): void;
    has(name: any): boolean;
    once(name: any): boolean;
    unset(...args: any[]): void;
}
export interface IBundleInformation {
    deps: boolean;
    nodeModule?: boolean;
}
export declare class BundleData {
    homeDir: string;
    including: Map<string, IBundleInformation>;
    excluding: Map<string, IBundleInformation>;
    entry: string;
    constructor(homeDir: string, including: Map<string, IBundleInformation>, excluding: Map<string, IBundleInformation>, entry?: string);
    shouldIgnore(name: string): boolean;
    shouldIgnoreDependencies(name: string): boolean;
    shouldIgnoreNodeModules(asbPath: string): boolean;
}
export declare class Arithmetic {
    static parse(str: string): PropParser;
    static getFiles(parser: PropParser, homeDir: string): Promise<BundleData>;
}
