import { timingSafeEqual } from 'crypto';
import { CollectionSource } from './CollectionSource';
import * as path from 'path';
import { cache } from './ModuleCache';
import { getPackageInformation, IPackageInformation, getNodeModuleName, INodeModuleRequire } from "./Utils";

import { Module } from "./Module";
import { each } from "realm-utils";
import { BundleData } from "./Arithmetic";

const MODULE_CACHE = {};

class CacheCollection {
    public static get(cache: any): ModuleCollection {
        let root = new ModuleCollection(cache.name);
        root.setCachedContent(cache.cache);
        let collectDeps = (rootCollection: ModuleCollection, item: any) => {
            for (let depName in item.deps) {
                if (item.deps.hasOwnProperty(depName)) {
                    let nestedCache = item.deps[depName];
                    let nestedCollection = new ModuleCollection(nestedCache.name);
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
     * Root Collections
     * Sometimes people go crazy and do that
     * require("node-module/dist/foo.js")
     *
     * I guess that's not thier fault, it's a packaging fault
     * So we store all the individual calls
     *
     * @type {Module}
     * @memberOf ModuleCollection
     */
    public rootCollections: Map<string, ModuleCollection>;
    /**
     * All local dependencies (from require come here)
     *
     * @type {Map<string, Module>}
     * @memberOf ModuleCollection
     */
    public dependencies: Map<string, Module> = new Map();


    /**
     *
     *
     * @type {BundleData}
     * @memberOf ModuleCollection
     */
    public bundle: BundleData;

    constructor(public name: string, public entry?: Module) { }


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
        return this.resolve(this.entry);
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
        let module = new Module();
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
        let module = new Module(modulePath);
        module.setDir(this.packageInfo.root);

        this.entry.addDependency(module);
        return this.resolve(module);
    }

    public addProjectFile(module: Module, name: string) {

        let modulePath = module.getAbsolutePathOfModule(name, this.packageInfo);

        if (this.bundle) {
            if (this.bundle.shouldIgnore(modulePath)) { // make sure we ignore if bundle is set
                return;
            }
        }
        if (MODULE_CACHE[modulePath]) {
            module.addDependency(MODULE_CACHE[modulePath]);
        } else {
            let dependency = new Module(modulePath);
            if (this.packageInfo) {
                dependency.setPackage(this.packageInfo);
            }
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


            // just collecting node modules names
            if (!this.nodeModules.has(nodeModule)) {
                let cachedDeps = cache.getValidCachedDependencies(nodeModule);
                // if (cachedDeps) {
                //     let cached = CacheCollection.get(cachedDeps);
                //     this.nodeModules.set(nodeModule, cached);
                //     console.log('here!!');
                //     return;
                // }
                let packageInfo = getPackageInformation(nodeModule);

                let targetEntryFile = packageInfo.entry;
                let depCollection: ModuleCollection;
                // target file was found (in package.json or index.js by default)
                if (targetEntryFile) {

                    let targetEntry = new Module(targetEntryFile);
                    depCollection = new ModuleCollection(nodeModule, targetEntry);
                    depCollection.setPackageInfo( packageInfo);
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
                    depCollection = new ModuleCollection(name);
                    this.nodeModules.set(nodeModule, depCollection);
                }
            } else {
                let depCollection = this.nodeModules.get(nodeModule);
                if (moduleInfo.target) {
                    return depCollection.addRootFile(moduleInfo);
                }
            }

        } else {
            return this.addProjectFile(module, name);
        }
    }


}
