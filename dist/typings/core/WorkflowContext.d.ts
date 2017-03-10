import { BundleSource } from "../BundleSource";
import { File } from "./File";
import { Log } from "../Log";
import { IPackageInformation } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { ModuleCache } from "../ModuleCache";
import { EventEmitter } from "../EventEmitter";
import { SourceChangedEvent } from "../devServer/Server";
/**
 * All the plugin method names
 */
export declare type PluginMethodName = "init" | "preBuild" | "preBundle" | "bundleStart" | "bundleEnd" | "postBundle" | "postBuild";
/**
 * Interface for a FuseBox plugin
 */
export interface Plugin {
    test?: RegExp;
    opts?: any;
    init?(context: WorkFlowContext): any;
    transform?(file: File, ast?: any): any;
    transformGroup?(file: File): any;
    onTypescriptTransform?(file: File): any;
    bundleStart?(context: WorkFlowContext): any;
    bundleEnd?(context: WorkFlowContext): any;
    /**
     * If provided then the dependencies are loaded on the client
     *  before the plugin is invoked
     */
    dependencies?: string[];
}
/**
 * Gets passed to each plugin to track FuseBox configuration
 */
export declare class WorkFlowContext {
    shim: any;
    sourceChangedEmitter: EventEmitter<SourceChangedEvent>;
    /**
     * The default package name or the package name configured in options
     */
    defaultPackageName: string;
    transformTypescript?: (contents: string) => string;
    ignoreGlobal: string[];
    pendingPromises: Promise<any>[];
    customAPIFile: string;
    defaultEntryPoint: string;
    rollupOptions: any;
    /**
     * Explicitly target bundle to server
     */
    serverBundle: boolean;
    nodeModules: Map<string, ModuleCollection>;
    libPaths: Map<string, IPackageInformation>;
    homeDir: string;
    printLogs: boolean;
    plugins: Plugin[];
    fileGroups: Map<string, File>;
    useCache: boolean;
    doLog: boolean;
    cache: ModuleCache;
    tsConfig: any;
    customModulesFolder: string;
    tsMode: boolean;
    loadedTsConfig: string;
    globals: {
        [packageName: string]: string;
    };
    standaloneBundle: boolean;
    source: BundleSource;
    sourceMapConfig: any;
    outFile: string;
    initialLoad: boolean;
    debugMode: boolean;
    log: Log;
    pluginTriggers: Map<string, Set<String>>;
    natives: {
        process: boolean;
        stream: boolean;
        Buffer: boolean;
        http: boolean;
    };
    autoImportConfig: {};
    storage: Map<string, any>;
    aliasCollection: any[];
    experimentalAliasEnabled: boolean;
    customCodeGenerator: any;
    initCache(): void;
    resolve(): Promise<void>;
    queue(obj: any): void;
    getHeaderImportsConfiguration(): void;
    setCodeGenerator(fn: any): void;
    generateCode(ast: any): any;
    emitJavascriptHotReload(file: File): void;
    debug(group: string, text: string): void;
    nukeCache(): void;
    warning(str: string): void;
    fatal(str: string): void;
    debugPlugin(plugin: Plugin, text: string): void;
    isShimed(name: string): boolean;
    /**
     * Resets significant class members
     */
    reset(): void;
    initAutoImportConfig(userNatives: any, userImports: any): void;
    setItem(key: string, obj: any): void;
    getItem(key: string): any;
    /**
     * Create a new file group
     * Mocks up file
     */
    createFileGroup(name: string, collection: ModuleCollection, handler: Plugin): File;
    getFileGroup(name: string): File;
    allowExtension(ext: string): void;
    setHomeDir(dir: string): void;
    setLibInfo(name: string, version: string, info: IPackageInformation): Map<string, IPackageInformation>;
    /** Converts the file extension from `.ts` to `.js` */
    convert2typescript(name: string): string;
    getLibInfo(name: string, version: string): IPackageInformation;
    setPrintLogs(printLogs: boolean): void;
    setUseCache(useCache: boolean): void;
    hasNodeModule(name: string): boolean;
    isGlobalyIgnored(name: string): boolean;
    resetNodeModules(): void;
    addNodeModule(name: string, collection: ModuleCollection): void;
    /**
     * Retuns the parsed `tsconfig.json` contents
     */
    getTypeScriptConfig(): any;
    isFirstTime(): boolean;
    writeOutput(outFileWritten?: () => any): void;
    getNodeModule(name: string): ModuleCollection;
    /**
     * @param fn if provided, its called once the plugin method has been triggered
     */
    triggerPluginsMethodOnce(name: PluginMethodName, args: any, fn?: {
        (plugin: Plugin);
    }): void;
    /**
     * Makes sure plugin method is triggered only once
     * @returns true if the plugin needs triggering
     */
    private pluginRequiresTriggering(cls, method);
}
