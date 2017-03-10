import { File } from "./File";
import { PathMaster, IPackageInformation } from "./PathMaster";
import { WorkFlowContext } from "./WorkflowContext";
import { BundleData } from "../arithmetic/Arithmetic";
/**
 *
 *
 * @export
 * @class ModuleCollection
 */
export declare class ModuleCollection {
    context: WorkFlowContext;
    name: string;
    info: IPackageInformation;
    /**
     *
     *
     * @type {Map<string, ModuleCollection>}
     * @memberOf ModuleCollection
     */
    nodeModules: Map<string, ModuleCollection>;
    traversed: boolean;
    acceptFiles: boolean;
    /**
     *
     *
     * @type {Map<string, File>}
     * @memberOf ModuleCollection
     */
    dependencies: Map<string, File>;
    /**
     *
     *
     * @type {BundleData}
     * @memberOf ModuleCollection
     */
    bundle: BundleData;
    /**
     *
     *
     *
     * @memberOf ModuleCollection
     */
    entryResolved: boolean;
    /**
     *
     *
     * @type {PathMaster}
     * @memberOf ModuleCollection
     */
    pm: PathMaster;
    /**
     *
     *
     * @type {File}
     * @memberOf ModuleCollection
     */
    entryFile: File;
    /**
     *
     *
     *
     * @memberOf ModuleCollection
     */
    cached: boolean;
    /**
     *
     *
     * @type {string}
     * @memberOf ModuleCollection
     */
    cachedContent: string;
    /**
     *
     *
     * @type {string}
     * @memberOf ModuleCollection
     */
    cachedName: string;
    /**
     *
     *
     * @type {string}
     * @memberOf ModuleCollection
     */
    cacheFile: string;
    /**
     *
     *
     * @type {Map<string, string>}
     * @memberOf ModuleCollection
     */
    conflictingVersions: Map<string, string>;
    /**
     *
     *
     * @private
     * @type {File[]}
     * @memberOf ModuleCollection
     */
    private toBeResolved;
    /**
     *
     *
     * @private
     *
     * @memberOf ModuleCollection
     */
    private delayedResolve;
    /**
     * Creates an instance of ModuleCollection.
     *
     * @param {WorkFlowContext} context
     * @param {string} name
     * @param {IPackageInformation} [info]
     *
     * @memberOf ModuleCollection
     */
    constructor(context: WorkFlowContext, name: string, info?: IPackageInformation);
    /**
     *
     *
     * @param {File} file
     *
     * @memberOf ModuleCollection
     */
    setupEntry(file: File): void;
    /**
     *
     *
     * @param {boolean} [shouldIgnoreDeps]
     * @returns
     *
     * @memberOf ModuleCollection
     */
    resolveEntry(shouldIgnoreDeps?: boolean): any;
    /**
     * Init plugins
     * Call "init" plugins with context
     * Inject dependencies as well
     * @memberOf ModuleCollection
     */
    initPlugins(): void;
    resolveDepsOnly(depsOnly: Map<string, any>): Promise<any>;
    collectBundle(data: BundleData): Promise<ModuleCollection>;
    /**
     *
     *
     * @param {File} file
     * @returns
     *
     * @memberOf ModuleCollection
     */
    resolveNodeModule(file: File): any;
    transformGroups(): Promise<any[]>;
    /**
     *
     *
     * @param {File} file
     * @param {boolean} [shouldIgnoreDeps]
     * @returns
     *
     * @memberOf ModuleCollection
     */
    resolve(file: File, shouldIgnoreDeps?: boolean): any;
}
