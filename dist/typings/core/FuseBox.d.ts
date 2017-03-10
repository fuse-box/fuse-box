import { Server, ServerOptions } from "./../devServer/Server";
import { WorkFlowContext, Plugin } from "./WorkflowContext";
import { CollectionSource } from "./../CollectionSource";
import { BundleData } from "./../arithmetic/Arithmetic";
import { ModuleCollection } from "./ModuleCollection";
export interface FuseBoxOptions {
    homeDir?: string;
    modulesFolder?: string;
    tsConfig?: string;
    package?: string;
    cache?: boolean;
    log?: boolean;
    globals?: {
        [packageName: string]: string;
    };
    plugins?: Plugin[];
    autoImport?: any;
    natives?: any;
    shim?: any;
    standalone?: boolean;
    sourceMaps?: any;
    sourcemaps?: any;
    sourceMap?: any;
    ignoreGlobal?: string[];
    serverBundle?: boolean;
    rollup?: any;
    customAPIFile?: string;
    outFile?: string;
    debug?: boolean;
    files?: any;
    alias?: any;
    transformTypescript?: (contents: string) => string;
}
/**
 *
 *
 * @export
 * @class FuseBox
 */
export declare class FuseBox {
    opts: FuseBoxOptions;
    static init(opts?: FuseBoxOptions): FuseBox;
    virtualFiles: any;
    collectionSource: CollectionSource;
    context: WorkFlowContext;
    /**
     * Creates an instance of FuseBox.
     *
     * @param {*} opts
     *
     * @memberOf FuseBox
     */
    constructor(opts?: FuseBoxOptions);
    triggerPre(): void;
    triggerStart(): void;
    triggerEnd(): void;
    triggerPost(): void;
    /**
     * Make a Bundle (or bundles)
     */
    bundle(str: string | {
        [bundleStr: string]: string;
    }, bundleReady?: any): Promise<any>;
    /**
     * @description if configs diff, clear cache
     * @see constructor
     * @see WorkflowContext
     *
     * if caching is disabled, ignore
     * if already stored, compare
     * else, write the config for use later
     */
    compareConfig(config: FuseBoxOptions): void;
    /** Starts the dev server and returns it */
    devServer(str: string, opts?: ServerOptions): Server;
    process(bundleData: BundleData, bundleReady?: () => any): Promise<ModuleCollection>;
    handleRollup(): false | (() => any);
    addShims(): void;
    test(str: string, opts: any): Promise<any>;
    initiateBundle(str: string, bundleReady?: any): Promise<void | ModuleCollection>;
}
