import { PropParser } from "./ArithmeticStringParser";
export interface IBundleInformation {
    deps: boolean;
    nodeModule?: boolean;
}
export declare class BundleData {
    homeDir: string;
    including: Map<string, IBundleInformation>;
    excluding: Map<string, IBundleInformation>;
    entry: string;
    tmpFolder: string;
    constructor(homeDir: string, including: Map<string, IBundleInformation>, excluding: Map<string, IBundleInformation>, entry?: string);
    setupTempFolder(tmpFolder: string): void;
    finalize(): void;
    shouldIgnore(name: string): boolean;
    shouldIgnoreDependencies(name: string): boolean;
    shouldIgnoreNodeModules(asbPath: string): boolean;
}
export declare class Arithmetic {
    static parse(str: string): PropParser;
    static getFiles(parser: PropParser, virtualFiles: string, homeDir: string): Promise<BundleData>;
}
