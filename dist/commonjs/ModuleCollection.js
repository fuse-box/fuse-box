"use strict";
const File_1 = require('./File');
const PathMaster_1 = require('./PathMaster');
const realm_utils_1 = require("realm-utils");
const appRoot = require("app-root-path");
class CacheCollection {
    static get(context, cache) {
        let root = new ModuleCollection(context, cache.name);
        let collectDeps = (rootCollection, item) => {
            for (let depName in item.deps) {
                if (item.deps.hasOwnProperty(depName)) {
                    let nestedCache = item.deps[depName];
                    let nestedCollection = new ModuleCollection(context, nestedCache.name);
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
        this.dependencies = new Map();
        this.entryResolved = false;
        this.conflictingVersions = new Map();
    }
    setupEntry(file) {
        if (this.dependencies.has(file.info.absPath)) {
            this.dependencies.set(file.info.absPath, file);
        }
        file.isNodeModuleEntry = true;
        this.entryFile = file;
    }
    resolveEntry() {
        if (this.entryFile && !this.entryResolved) {
            this.entryResolved = true;
            return this.resolve(this.entryFile);
        }
    }
    collectBundle(data) {
        this.bundle = data;
        return realm_utils_1.each(data.including, (withDeps, modulePath) => {
            let file = new File_1.File(this.context, this.pm.init(modulePath));
            return this.resolve(file);
        }).then(x => {
            return module;
        });
    }
    resolve(file) {
        if (file.info.isNodeModule) {
            let info = file.info.nodeModuleInfo;
            let collection;
            let moduleName = info.custom ?
                `${info.name}@${info.version}` : info.name;
            if (!this.context.hasNodeModule(moduleName)) {
                collection = new ModuleCollection(this.context, moduleName);
                collection.pm = new PathMaster_1.PathMaster(this.context, info.root);
                if (info.entry) {
                    collection.setupEntry(new File_1.File(this.context, collection.pm.init(info.entry)));
                }
                this.context.spinStart(`Resolve ${moduleName}`);
                this.context.addNodeModule(moduleName, collection);
            }
            else {
                collection = this.context.getNodeModule(moduleName);
            }
            if (info.custom) {
                this.conflictingVersions.set(info.name, info.version);
            }
            this.nodeModules.set(moduleName, collection);
            return file.info.nodeModuleExplicitOriginal
                ? collection.resolve(new File_1.File(this.context, collection.pm.init(file.info.absPath)))
                : collection.resolveEntry();
        }
        else {
            if (this.dependencies.has(file.absPath)) {
                return;
            }
            let dependencies = file.consume();
            this.dependencies.set(file.absPath, file);
            let fileLimitPath;
            if (this.entryFile && this.entryFile.isNodeModuleEntry) {
                fileLimitPath = this.entryFile.info.absPath;
            }
            return realm_utils_1.each(dependencies, name => this.resolve(new File_1.File(this.context, this.pm.resolve(name, file.info.absDir, fileLimitPath))));
        }
    }
}
exports.ModuleCollection = ModuleCollection;
