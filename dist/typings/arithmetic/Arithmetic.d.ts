import { PropParser } from "./ArithmeticStringParser";
import Fluent from "./Fluent";
import { File } from "../core/File";
export { Fluent };
export interface IBundleInformation {
    deps: boolean;
    nodeModule?: boolean;
}
/**
 * BundleData
 */
export declare class BundleData {
    tmpFolder: string;
    including: Map<string, IBundleInformation>;
    excluding: Map<string, IBundleInformation>;
    depsOnly: Map<string, IBundleInformation>;
    entry: string;
    homeDir: string;
    typescriptMode: boolean;
    standalone: boolean;
    cache: boolean;
    setIncluding(info: Map<string, IBundleInformation>): void;
    setupTempFolder(tmpFolder: string): void;
    fileBlackListed(file: File): boolean;
    fileWhiteListed(file: File): boolean;
    finalize(): void;
    shouldIgnore(name: string): boolean;
    shouldIgnoreDependencies(name: string): boolean;
    shouldIgnoreNodeModules(asbPath: string): boolean;
}
export interface ArithmeticProperties {
    tempDir: string;
    data: any;
}
/**
 *
 *
 * @export
 * @class Arithmetic
 */
export declare class Arithmetic {
    /**
     *
     *
     * @static
     * @param {string} str
     * @returns
     *
     * @memberOf Arithmetic
     */
    static parse(str: string): PropParser;
    /**
     * Get files from a directory
     * In case of virtualFiles we create a temp folder,
     * where we write all the contents and start from there
     *
     * @static
     * @param {PropParser} parser
     * @param {string} fileCollection
     * @param {string} homeDir
     * @returns
     *
     * @memberOf Arithmetic
     */
    static getFiles(parser: PropParser, virtualFiles: string, homeDir: string): Promise<BundleData>;
}
