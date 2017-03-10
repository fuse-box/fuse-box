import { WorkFlowContext } from "./core/WorkflowContext";
import { IPackageInformation } from "./core/PathMaster";
import { ModuleCollection } from "./core/ModuleCollection";
import { File } from "./core/File";
import { AbsDir } from "./Types";
/**
 *
 * @class ModuleCache
 */
export declare class ModuleCache {
    context: WorkFlowContext;
    /**
     *
     *
     * @type {AbsDir}
     * @memberOf ModuleCache
     */
    cacheFolder: AbsDir;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberOf ModuleCache
     */
    private cacheFile;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberOf ModuleCache
     */
    private staticCacheFolder;
    private permanentCacheFolder;
    /**
     *
     *
     * @private
     *
     * @memberOf ModuleCache
     */
    private cachedDeps;
    /**
     * Creates an instance of ModuleCache.
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf ModuleCache
     */
    constructor(context: WorkFlowContext);
    initialize(): void;
    setPermanentCache(key: string, contents: string): void;
    getPermanentCache(key: string): any;
    /**
     *
     *
     * @param {File} file
     * @returns
     *
     * @memberOf ModuleCache
     */
    getStaticCache(file: File): any;
    /**
     *
     *
     * @param {File} file
     * @param {any} dependencies
     * @param {string} sourcemaps
     *
     * @memberOf ModuleCache
     */
    writeStaticCache(file: File, sourcemaps: string): void;
    /**
     *
     *
     * @param {File[]} files
     * @returns {Promise<File[]>}
     *
     * @memberOf ModuleCache
     */
    resolve(files: File[]): Promise<File[]>;
    /**
     *
     *
     * @param {ModuleCollection} rootCollection
     *
     * @memberOf ModuleCache
     */
    buildMap(rootCollection: ModuleCollection): void;
    /**
     *
     *
     * @param {IPackageInformation} info
     * @param {string} contents
     * @returns
     *
     * @memberOf ModuleCache
     */
    set(info: IPackageInformation, contents: string): Promise<{}>;
}
