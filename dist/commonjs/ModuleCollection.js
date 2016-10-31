"use strict";
const ModuleCache_1 = require('./ModuleCache');
const Utils_1 = require("./Utils");
const Module_1 = require("./Module");
const realm_utils_1 = require("realm-utils");
const MODULE_CACHE = {};
class CacheCollection {
    static get(cache) {
        let root = new ModuleCollection(cache.name);
        root.setCachedContent(cache.cache);
        let collectDeps = (rootCollection, item) => {
            for (let depName in item.deps) {
                if (item.deps.hasOwnProperty(depName)) {
                    let nestedCache = item.deps[depName];
                    let nestedCollection = new ModuleCollection(nestedCache.name);
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
    constructor(name, entry) {
        this.name = name;
        this.entry = entry;
        this.nodeModules = new Map();
        this.dependencies = new Map();
    }
    collect() {
        return this.resolve(this.entry);
    }
    setCachedContent(content) {
        this.cachedContent = content;
    }
    collectBundle(data) {
        this.bundle = data;
        let module = new Module_1.Module();
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
    processModule(module, name, shouldIgnoreDeps) {
        let nodeModule = this.getNodeModuleName(name);
        if (nodeModule) {
            if (shouldIgnoreDeps) {
                return;
            }
            if (this.bundle) {
                if (this.bundle.shouldIgnore(nodeModule)) {
                    return;
                }
            }
            if (!this.nodeModules.has(nodeModule)) {
                let cachedDeps = ModuleCache_1.cache.getValidCachedDependencies(nodeModule);
                if (cachedDeps) {
                    let cached = CacheCollection.get(cachedDeps);
                    this.nodeModules.set(nodeModule, cached);
                    return;
                }
                let packageInfo = Utils_1.getPackageInformation(nodeModule);
                let targetEntryFile = packageInfo.entry;
                let depCollection;
                if (targetEntryFile) {
                    let targetEntry = new Module_1.Module(targetEntryFile);
                    depCollection = new ModuleCollection(nodeModule, targetEntry);
                    depCollection.packageInfo = packageInfo;
                    this.nodeModules.set(nodeModule, depCollection);
                    return depCollection.collect();
                }
                else {
                    depCollection = new ModuleCollection(name);
                    this.nodeModules.set(nodeModule, depCollection);
                }
            }
        }
        else {
            let modulePath = module.getAbsolutePathOfModule(name, this.packageInfo);
            if (this.bundle) {
                if (this.bundle.shouldIgnore(modulePath)) {
                    return;
                }
            }
            if (MODULE_CACHE[modulePath]) {
                module.addDependency(MODULE_CACHE[modulePath]);
            }
            else {
                let dependency = new Module_1.Module(modulePath);
                MODULE_CACHE[modulePath] = dependency;
                module.addDependency(dependency);
                return this.resolve(dependency);
            }
        }
    }
    getNodeModuleName(name) {
        if (!name) {
            return;
        }
        let matched = name.match(/^([a-z].*)$/);
        if (matched) {
            return name.split("/")[0];
        }
    }
}
exports.ModuleCollection = ModuleCollection;
