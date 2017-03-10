import { ModuleCollection } from "./ModuleCollection";
import { FileAnalysis } from "../analysis/FileAnalysis";
import { WorkFlowContext, Plugin } from "./WorkflowContext";
import { IPathInformation, IPackageInformation } from "./PathMaster";
/**
 *
 *
 * @export
 * @class File
 */
export declare class File {
    context: WorkFlowContext;
    info: IPathInformation;
    isFuseBoxBundle: boolean;
    /**
     * In order to keep bundle in a bundle
     * We can't destory the original contents
     * But instead we add additional property that will override bundle file contents
     *
     * @type {string}
     * @memberOf FileAnalysis
     */
    alternativeContent: string;
    notFound: boolean;
    params: Map<string, string>;
    /**
     *
     *
     * @type {string}
     * @memberOf File
     */
    absPath: string;
    /**
     *
     *
     * @type {string}
     * @memberOf File
     */
    contents: string;
    /**
     *
     *
     *
     * @memberOf File
     */
    isLoaded: boolean;
    /**
     *
     *
     *
     * @memberOf File
     */
    isNodeModuleEntry: boolean;
    /**
     *
     *
     * @type {ModuleCollection}
     * @memberOf File
     */
    collection: ModuleCollection;
    /**
     *
     *
     * @type {string[]}
     * @memberOf File
     */
    headerContent: string[];
    /**
     *
     *
     *
     * @memberOf File
     */
    isTypeScript: boolean;
    /**
     *
     *
     * @type {*}
     * @memberOf File
     */
    sourceMap: any;
    properties: Map<string, any>;
    /**
     *
     *
     * @type {FileAnalysis}
     * @memberOf File
     */
    analysis: FileAnalysis;
    /**
     *
     *
     * @type {Promise<any>[]}
     * @memberOf File
     */
    resolving: Promise<any>[];
    subFiles: File[];
    groupMode: boolean;
    groupHandler: Plugin;
    /**
     * Creates an instance of File.
     *
     * @param {WorkFlowContext} context
     * @param {IPathInformation} info
     *
     * @memberOf File
     */
    constructor(context: WorkFlowContext, info: IPathInformation);
    static createByName(collection: ModuleCollection, name: string): File;
    static createModuleReference(collection: ModuleCollection, packageInfo: IPackageInformation): File;
    addProperty(key: string, obj: any): void;
    getProperty(key: string): any;
    hasSubFiles(): boolean;
    addSubFile(file: File): void;
    /**
     *
     *
     * @returns
     *
     * @memberOf File
     */
    getCrossPlatormPath(): string;
    /**
     * Typescript transformation needs to be handled
     * Before the actual transformation
     * Can't exists within a chain group
     */
    tryTypescriptPlugins(): void;
    /**
     *
     *
     * @param {*} [_ast]
     *
     * @memberOf File
     */
    tryPlugins(_ast?: any): void;
    /**
     *
     *
     * @param {string} str
     *
     * @memberOf File
     */
    addHeaderContent(str: string): void;
    /**
     *
     *
     *
     * @memberOf File
     */
    loadContents(): void;
    makeAnalysis(parserOptions?: any): void;
    /**
     *
     *
     * @returns
     *
     * @memberOf File
     */
    consume(): void;
    loadVendorSourceMap(): void;
    /**
     *
     *
     * @private
     * @returns
     *
     * @memberOf File
     */
    private handleTypescript();
    generateCorrectSourceMap(fname?: string): any;
    /**
     * Provides a file-specific transpilation config. This is needed so we can supply the filename to
     * the TypeScript compiler.
     *
     * @private
     * @returns
     *
     * @memberOf File
     */
    private getTranspilationConfig();
}
