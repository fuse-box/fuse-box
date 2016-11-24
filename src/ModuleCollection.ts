import { File } from "./File";
import { PathMaster, IPackageInformation } from "./PathMaster";
import { WorkFlowContext } from "./WorkFlowContext";
import { each, utils } from "realm-utils";
import { BundleData } from "./Arithmetic";


/**
 * 
 * 
 * @export
 * @class ModuleCollection
 */
export class ModuleCollection {
    /**
     * 
     * 
     * @type {Map<string, ModuleCollection>}
     * @memberOf ModuleCollection
     */
    public nodeModules: Map<string, ModuleCollection> = new Map();
    /**
     * 
     * 
     * @type {Map<string, File>}
     * @memberOf ModuleCollection
     */
    public dependencies: Map<string, File> = new Map();
    /**
     * 
     * 
     * @type {BundleData}
     * @memberOf ModuleCollection
     */
    public bundle: BundleData;
    /**
     * 
     * 
     * 
     * @memberOf ModuleCollection
     */
    public entryResolved = false;
    /**
     * 
     * 
     * @type {PathMaster}
     * @memberOf ModuleCollection
     */
    public pm: PathMaster;
    /**
     * 
     * 
     * @type {File}
     * @memberOf ModuleCollection
     */
    public entryFile: File;

    /**
     * 
     * 
     * 
     * @memberOf ModuleCollection
     */
    public cached = false;
    /**
     * 
     * 
     * @type {string}
     * @memberOf ModuleCollection
     */
    public cachedContent: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf ModuleCollection
     */
    public cachedName: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf ModuleCollection
     */
    public cacheFile: string;


    /**
     * 
     * 
     * @type {Map<string, string>}
     * @memberOf ModuleCollection
     */
    public conflictingVersions: Map<string, string> = new Map();

    /**
     * 
     * 
     * @private
     * @type {File[]}
     * @memberOf ModuleCollection
     */
    private toBeResolved: File[] = [];
    /**
     * 
     * 
     * @private
     * 
     * @memberOf ModuleCollection
     */
    private delayedResolve = false;

    /**
     * Creates an instance of ModuleCollection.
     * 
     * @param {WorkFlowContext} context
     * @param {string} name
     * @param {IPackageInformation} [info]
     * 
     * @memberOf ModuleCollection
     */
    constructor(public context: WorkFlowContext, public name: string, public info?: IPackageInformation) { }

    /**
     * 
     * 
     * @param {File} file
     * 
     * @memberOf ModuleCollection
     */
    public setupEntry(file: File) {
        if (this.dependencies.has(file.info.absPath)) {
            this.dependencies.set(file.info.absPath, file);
        }
        file.isNodeModuleEntry = true;
        this.entryFile = file;
    }


    /**
     * 
     * 
     * @param {boolean} [shouldIgnoreDeps]
     * @returns
     * 
     * @memberOf ModuleCollection
     */
    public resolveEntry(shouldIgnoreDeps?: boolean) {
        if (this.entryFile && !this.entryResolved) {
            this.entryResolved = true;
            return this.resolve(this.entryFile, shouldIgnoreDeps);
        }
    }

    /**
     * Init plugins
     * Call "init" plugins with context
     * Inject dependencies as well
     * @memberOf ModuleCollection
     */
    public initPlugins() {
        if (this.context.plugins) {
            this.context.plugins.forEach(plugin => {
                if (utils.isFunction(plugin.init)) {
                    plugin.init(this.context);
                }
                if (plugin.dependencies) {
                    plugin.dependencies.forEach(mod => {
                        this.toBeResolved.push(
                            new File(this.context, this.pm.init(mod))
                        );
                    });
                }
            });
        }
    }

    /**
     * 
     * 
     * @param {BundleData} data
     * @returns {Promise<ModuleCollection>}
     * 
     * @memberOf ModuleCollection
     */
    public collectBundle(data: BundleData): Promise<ModuleCollection> {
        this.bundle = data;
        this.delayedResolve = true;
        this.initPlugins();

        // faking entry point
        return each(data.including, (withDeps, modulePath) => {
            let file = new File(this.context, this.pm.init(modulePath));
            return this.resolve(file);
        }).then(x => {

            return this.context.useCache ? this.context.cache.resolve(this.toBeResolved) : this.toBeResolved;
        }).then(toResolve => {

            return each(toResolve, (file: File) => this.resolveNodeModule(file));
        }).then(() => {
            return this.context.cache.buildMap(this);
        });
    }

    /**
     * 
     * 
     * @param {File} file
     * @returns
     * 
     * @memberOf ModuleCollection
     */
    public resolveNodeModule(file: File) {
        let info = file.info.nodeModuleInfo;
        let collection: ModuleCollection;

        // setting key for a module
        // It might be just lodash (for default version) or lodash@1.0.0
        // We don't register and process node_modules twice
        // So for example, 2 modules have a custom dependency lodash@1.0.0
        // In a nutshell we try to avoid grabbing the same source from different folders
        let moduleName = info.custom ?
            `${info.name}@${info.version}` : info.name;

        // Make sure it has not been mentioned ever befor
        if (!this.context.hasNodeModule(moduleName)) {
            collection = new ModuleCollection(this.context, moduleName, info);
            collection.pm = new PathMaster(this.context, info.root);

            if (info.entry) { // Some modules don't have entry files
                collection.setupEntry(new File(this.context, collection.pm.init(info.entry)));
            }
            this.context.addNodeModule(moduleName, collection);
        } else {
            collection = this.context.getNodeModule(moduleName);
        }

        // If we are using a custom version 
        // THe source output should know about.
        // When compiling the ouput we will take it into a consideration
        if (info.custom) {
            this.conflictingVersions.set(info.name, info.version);
        }

        // Setting it a node dependency, so later on we could build a dependency tree
        // For caching
        this.nodeModules.set(moduleName, collection);

        // Handle explicit require differently
        // e.g require("lodash") - we require entry file
        // unlike require("requre/each") - points to an explicit file
        // So we might never resolve the entry (if only a partial require was mentioned)
        return file.info.nodeModuleExplicitOriginal
            ? collection.resolve(new File(this.context, collection.pm.init(file.info.absPath)))
            : collection.resolveEntry();
    }

    /**
     * 
     * 
     * @param {File} file
     * @param {boolean} [shouldIgnoreDeps]
     * @returns
     * 
     * @memberOf ModuleCollection
     */
    public resolve(file: File, shouldIgnoreDeps?: boolean) {
        if (this.bundle) {
            if (this.bundle.fileBlackListed(file)) {
                return;
            }
            if (shouldIgnoreDeps === undefined) {
                shouldIgnoreDeps = this.bundle.shouldIgnoreNodeModules(file.getCrossPlatormPath());
            }
        }
        if (file.info.isNodeModule) {
            // Check if a module needs to ignored
            // It could be defined previosly (as in exluding all dependencies)
            // Of an explict exclusion
            if (shouldIgnoreDeps || this.bundle && this.bundle.shouldIgnore(file.info.nodeModuleName)) {
                return;
            }
            // If a collection a primary one (project "default")
            // We would like to collect dependencies first and resolve them later
            // In order to understand what is cached
            return this.delayedResolve
                ? this.toBeResolved.push(file)
                : this.resolveNodeModule(file);
        } else {
            if (this.dependencies.has(file.absPath)) { return; }

            // Consuming file 
            // Here we read it and return a list of require statements
            let dependencies = file.consume();

            this.dependencies.set(file.absPath, file);
            let fileLimitPath;
            // Checking for the limits
            // we must have a workaround for ../ and if it goes beyond project limits
            if (this.entryFile && this.entryFile.isNodeModuleEntry) {
                fileLimitPath = this.entryFile.info.absPath;
            }

            // Process file dependencies recursively
            return each(dependencies, name => {
                return this.resolve(new File(this.context,
                    this.pm.resolve(name, file.info.absDir, fileLimitPath)), shouldIgnoreDeps);
            });
        }
    }
}
