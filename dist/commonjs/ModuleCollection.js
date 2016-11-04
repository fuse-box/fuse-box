"use strict";
const path = require("path");
const ModuleCache_1 = require("./ModuleCache");
const Utils_1 = require("./Utils");
const Module_1 = require("./Module");
const realm_utils_1 = require("realm-utils");
const MODULE_CACHE = {};
class CacheCollection {
    static get(context, cache) {
        let root = new ModuleCollection(context, cache.name);
        root.setCachedContent(cache.cache);
        let collectDeps = (rootCollection, item) => {
            for (let depName in item.deps) {
                if (item.deps.hasOwnProperty(depName)) {
                    let nestedCache = item.deps[depName];
                    let nestedCollection = new ModuleCollection(context, nestedCache.name);
                    nestedCollection.setCachedContent(nestedCache.cache);
                    rootCollection.nodeModules.set(nestedCache.name, nestedCollection);
                    collectDeps(nestedCollection, nestedCache);
                }
            }
        };
        collectDeps(root, cache);
        return root;
    }
}
class ModuleCollection {
    constructor(context, name, entry) {
        this.context = context;
        this.name = name;
        this.entry = entry;
        this.nodeModules = new Map();
        this.entryResolved = false;
    }
    setPackageInfo(info) {
        this.packageInfo = info;
        if (this.entry) {
            this.entry.setPackage(info);
        }
    }
    collect() {
        return this.resolve(this.entry).then(result => {
            this.entryResolved = true;
            return result;
        });
    }
    setCachedContent(content) {
        this.cachedContent = content;
    }
    collectBundle(data) {
        this.bundle = data;
        let module = new Module_1.Module(this.context);
        module.setDir(data.homeDir);
        return realm_utils_1.each(data.including, (withDeps, modulePath) => {
            return this.processModule(module, modulePath);
        }).then(data => {
            return module;
        });
    }
    resolve(module) {
        let shouldIgnoreDeps = false;
        if (this.bundle) {
            if (this.bundle.excluding.has(module.absPath)) {
                return;
            }
            shouldIgnoreDeps = this.bundle.shouldIgnoreNodeModules(module.absPath);
        }
        let requires = module.digest();
        return realm_utils_1.each(requires, options => {
            return this.processModule(module, options.name, shouldIgnoreDeps);
        });
    }
    addRootFile(info) {
        let modulePath = path.join(this.packageInfo.root, info.target);
        let module = new Module_1.Module(this.context, modulePath);
        let fileRootDirectory = path.join(this.packageInfo.root, path.dirname(info.target));
        module.setDir(fileRootDirectory);
        module.setPackage(this.packageInfo);
        this.entry.addDependency(module);
        return this.resolve(module);
    }
    addProjectFile(module, name) {
        let modulePath;
        if (path.isAbsolute(name)) {
            modulePath = name;
        }
        else {
            let relativePath = Utils_1.ensureRelativePath(name, module.absPath);
            console.log(relativePath);
            modulePath = path.join(path.dirname(module.absPath), relativePath);
        }
        if (this.bundle) {
            if (this.bundle.shouldIgnore(modulePath)) {
                return;
            }
        }
        if (MODULE_CACHE[modulePath]) {
            module.addDependency(MODULE_CACHE[modulePath]);
        }
        else {
            let dependency = new Module_1.Module(this.context, modulePath);
            dependency.setDir(path.dirname(modulePath));
            dependency.setPackage(this.packageInfo);
            MODULE_CACHE[modulePath] = dependency;
            module.addDependency(dependency);
            return this.resolve(dependency);
        }
    }
    processModule(module, name, shouldIgnoreDeps) {
        let moduleInfo = Utils_1.getNodeModuleName(name);
        if (moduleInfo) {
            let nodeModule = moduleInfo.name;
            if (shouldIgnoreDeps) {
                return;
            }
            if (this.bundle) {
                if (this.bundle.shouldIgnore(nodeModule)) {
                    return;
                }
            }
            if (!this.context.hasNodeModule(nodeModule)) {
                if (this.context.useCache) {
                    let cachedDeps = ModuleCache_1.cache.getValidCachedDependencies(nodeModule);
                    if (cachedDeps) {
                        let cached = CacheCollection.get(this.context, cachedDeps);
                        this.nodeModules.set(nodeModule, cached);
                        return;
                    }
                }
                let packageInfo = Utils_1.getPackageInformation(nodeModule, this.packageInfo);
                let targetEntry = new Module_1.Module(this.context, packageInfo.entry);
                let collection = new ModuleCollection(this.context, nodeModule, targetEntry);
                collection.setPackageInfo(packageInfo);
                this.context.addNodeModule(nodeModule, collection);
                this.nodeModules.set(nodeModule, collection);
                if (moduleInfo.target) {
                    return collection.addRootFile(moduleInfo);
                }
                else {
                    return collection.collect();
                }
            }
            else {
                let collection = this.context.getNodeModule(nodeModule);
                this.nodeModules.set(nodeModule, collection);
                if (moduleInfo.target) {
                    return collection.addRootFile(moduleInfo);
                }
                else {
                    if (!collection.entryResolved) {
                        return collection.collect();
                    }
                }
            }
        }
        else {
            return this.addProjectFile(module, name);
        }
    }
}
exports.ModuleCollection = ModuleCollection;
