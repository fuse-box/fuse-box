
import * as fs from 'fs';
import * as path from "path";
import { cache } from "./ModuleCache";
import { getPackageInformation,
        ensureRelativePath,  IPackageInformation, getNodeModuleName, INodeModuleRequire } from "./Utils";
import { WorkFlowContext } from "./WorkFlowContext";
import { Module } from "./Module";
import { each } from "realm-utils";
import { BundleData } from "./Arithmetic";

const MODULE_CACHE = {};

class CacheCollection {
    public static get(context: WorkFlowContext, cache: any): ModuleCollection {
        let root = new ModuleCollection(context, cache.name);
        root.setCachedContent(cache.cache);
        let collectDeps = (rootCollection: ModuleCollection, item: any) => {
            for (let depName in item.deps) {
                if (item.deps.hasOwnProperty(depName)) {
                    let nestedCache = item.deps[depName];
                    let nestedCollection = new ModuleCollection(context, nestedCache.name);
                    nestedCollection.setCachedContent(nestedCache.cache);
                    rootCollection.nodeModules.set(nestedCache.name, nestedCollection);
                    collectDeps(nestedCollection, nestedCache);
                }
            }
        }
        collectDeps(root, cache);
        return root;
    }
}

export class ModuleCollection {

    public cachedContent;

    public packageInfo: IPackageInformation;
    /**
     * All node modules are collected there
     *
     * @type {Map<string, ModuleCollection>}
     * @memberOf ModuleCollection
     */
    public nodeModules: Map<string, ModuleCollection> = new Map();

    /**
     *
     *
     * @type {BundleData}
     * @memberOf ModuleCollection
     */
    public bundle: BundleData;

    public entryResolved = false;

    constructor(public context: WorkFlowContext, public name: string, public entry?: Module) { }


    public setPackageInfo(info: IPackageInformation) {
        this.packageInfo = info;
        if (this.entry) {
            this.entry.setPackage(info);
        }
    }
    /**
     *
     *
     * @returns
     *
     * @memberOf ModuleCollection
     */
    public collect() {


        return this.resolve(this.entry).then(result => {
            this.entryResolved = true;
            return result;
        });
    }

    public setCachedContent(content: string) {
        this.cachedContent = content;
    }


    /**
     *
     *
     * @param {BundleData} data
     * @returns {Promise<Module>}
     *
     * @memberOf ModuleCollection
     */
    public collectBundle(data: BundleData): Promise<Module> {
        this.bundle = data;
        // faking entry point
        let module = new Module(this.context);
        module.setDir(data.homeDir); // setting a home directory for a module (even though it does not have a file)

        return each(data.including, (withDeps, modulePath) => {
            return this.processModule(module, modulePath);
        }).then(data => {

            return module;
        });
    }

    /**
     *
     *
     * @param {Module} module
     * @returns
     *
     * @memberOf ModuleCollection
     */
    public resolve(module: Module) {
        let shouldIgnoreDeps = false;
        if (this.bundle) {
            if (this.bundle.excluding.has(module.absPath)) {
                return;
            }
            shouldIgnoreDeps = this.bundle.shouldIgnoreNodeModules(module.absPath);
        }
        let requires = module.digest();
        return each(requires, options => {
            return this.processModule(module, options.name, shouldIgnoreDeps);
        });
    }


    public addRootFile(info: INodeModuleRequire) {

        let modulePath = path.join(this.packageInfo.root, info.target);

        let module = new Module(this.context, modulePath);
        let fileRootDirectory = path.join(this.packageInfo.root, path.dirname(info.target));
        module.setDir(fileRootDirectory);
        module.setPackage(this.packageInfo);

        this.entry.addDependency(module);
        return this.resolve(module);
    }

    public addProjectFile(module: Module, name: string) {

        let modulePath; // module.getAbsolutePathOfModule(name, this.packageInfo);
        if (path.isAbsolute(name)) {
            modulePath = name;
        } else {

            let relativePath = ensureRelativePath(name, module.absPath);

            modulePath = path.join(path.dirname(module.absPath), relativePath);

            // if (!fs.existsSync(modulePath) && this.entry && this.entry.absPath) {
            //     this.context.dump.warn(this.name,
            //         `${name} : ${modulePath} (not found) -> Refering to index -> ${this.entry.absPath}`);
            //     modulePath = this.entry.absPath;

            // }
        }

        if (this.bundle) {
            if (this.bundle.shouldIgnore(modulePath)) { // make sure we ignore if bundle is set
                return;
            }
        }
        if (MODULE_CACHE[modulePath]) {
            module.addDependency(MODULE_CACHE[modulePath]);
        } else {
            let dependency = new Module(this.context, modulePath);

            dependency.setDir(path.dirname(modulePath));
            dependency.setPackage(this.packageInfo);
            MODULE_CACHE[modulePath] = dependency;
            module.addDependency(dependency);
            return this.resolve(dependency);
        }
    }

    /**
     *
     *
     * @param {Module} module
     * @param {string} name
     * @param {boolean} [shouldIgnoreDeps]
     * @returns
     *
     * @memberOf ModuleCollection
     */
    public processModule(module: Module, name: string, shouldIgnoreDeps?: boolean) {

        let moduleInfo = getNodeModuleName(name);
        if (moduleInfo) {

            let nodeModule = moduleInfo.name;

            if (shouldIgnoreDeps) {
                return;
            }
            if (this.bundle) { // is a bundle defined we need to check for configuration
                if (this.bundle.shouldIgnore(nodeModule)) {
                    return;
                }
            }

            if (!this.context.hasNodeModule(nodeModule)) {
                if (this.context.useCache) {
                    let cachedDeps = cache.getValidCachedDependencies(nodeModule);
                    if (cachedDeps) {
                        let cached = CacheCollection.get(this.context, cachedDeps);
                        this.nodeModules.set(nodeModule, cached);
                        return;
                    }
                }
                let packageInfo = getPackageInformation(nodeModule, this.packageInfo);

                let targetEntry = new Module(this.context, packageInfo.entry);

                let collection = new ModuleCollection(this.context, nodeModule, targetEntry);
                collection.setPackageInfo(packageInfo);
                this.context.addNodeModule(nodeModule, collection);
                this.nodeModules.set(nodeModule, collection);
                // If it's a partial request
                if (moduleInfo.target) {
                    return collection.addRootFile(moduleInfo);
                } else {

                    return collection.collect();
                }
            } else {
                let collection = this.context.getNodeModule(nodeModule);
                this.nodeModules.set(nodeModule, collection);
                if (moduleInfo.target) {
                    return collection.addRootFile(moduleInfo);
                } else {

                    if (!collection.entryResolved) {

                        return collection.collect();
                    }
                }
            }

            /*
            // just collecting node modules names
            if (!this.context.hasNodeModule(nodeModule)) {
                if (this.context.useCache) {
                    let cachedDeps = cache.getValidCachedDependencies(nodeModule);
                    if (cachedDeps) {
                        let cached = CacheCollection.get(this.context, cachedDeps);
                        this.nodeModules.set(nodeModule, cached);
                        return;
                    }
                }
                let packageInfo = getPackageInformation(nodeModule, this.packageInfo);
                let targetEntryFile = packageInfo.entry;
                let depCollection: ModuleCollection;
                // target file was found (in package.json or index.js by default)
                if (targetEntryFile) {

                    let targetEntry = new Module(this.context, targetEntryFile);
                    depCollection = new ModuleCollection(this.context, nodeModule, targetEntry);
                    depCollection.setPackageInfo(packageInfo);
                    this.context.addNodeModule(nodeModule, depCollection);
                    this.nodeModules.set(nodeModule, depCollection);
                    return depCollection.collect().then(() => {
                        // hanlde addition target if require
                        // e.g require("my-lib/dist/hello.js")
                        if (moduleInfo.target) {

                            return depCollection.addRootFile(moduleInfo);
                        }
                    });
                } else {
                    // was not found, but we still register a dummy one
                    depCollection = new ModuleCollection(this.context, name);
                    this.context.addNodeModule(nodeModule, depCollection);
                    this.nodeModules.set(nodeModule, depCollection);
                }
            } else {
                let depCollection = this.context.getNodeModule(nodeModule);
                if (moduleInfo.target) {
                    return depCollection.addRootFile(moduleInfo);
                }
            }*/



        } else {
            //console.log("ADD", name, module.absPath);
            return this.addProjectFile(module, name);
        }
    }

}
