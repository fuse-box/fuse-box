"use strict";
const File_1 = require("./File");
const PathMaster_1 = require("./PathMaster");
const realm_utils_1 = require("realm-utils");
class ModuleCollection {
    constructor(context, name, info) {
        this.context = context;
        this.name = name;
        this.info = info;
        this.nodeModules = new Map();
        this.dependencies = new Map();
        this.entryResolved = false;
        this.cached = false;
        this.conflictingVersions = new Map();
        this.toBeResolved = [];
        this.delayedResolve = false;
    }
    setupEntry(file) {
        if (this.dependencies.has(file.info.absPath)) {
            this.dependencies.set(file.info.absPath, file);
        }
        file.isNodeModuleEntry = true;
        this.entryFile = file;
    }
    resolveEntry(shouldIgnoreDeps) {
        if (this.entryFile && !this.entryResolved) {
            this.entryResolved = true;
            return this.resolve(this.entryFile, shouldIgnoreDeps);
        }
    }
    initPlugins() {
        if (this.context.plugins) {
            this.context.plugins.forEach(plugin => {
                if (realm_utils_1.utils.isFunction(plugin.init)) {
                    plugin.init(this.context);
                }
                if (plugin.dependencies) {
                    plugin.dependencies.forEach(mod => {
                        this.toBeResolved.push(new File_1.File(this.context, this.pm.init(mod)));
                    });
                }
            });
        }
    }
    collectBundle(data) {
        this.bundle = data;
        this.delayedResolve = true;
        this.initPlugins();
        return realm_utils_1.each(data.including, (withDeps, modulePath) => {
            let file = new File_1.File(this.context, this.pm.init(modulePath));
            return this.resolve(file);
        }).then(x => {
            return this.context.useCache ? this.context.cache.resolve(this.toBeResolved) : this.toBeResolved;
        }).then(toResolve => {
            return realm_utils_1.each(toResolve, (file) => this.resolveNodeModule(file));
        }).then(() => {
            return this.context.cache.buildMap(this);
        });
    }
    resolveNodeModule(file) {
        let info = file.info.nodeModuleInfo;
        let collection;
        let moduleName = info.custom ?
            `${info.name}@${info.version}` : info.name;
        if (!this.context.hasNodeModule(moduleName)) {
            collection = new ModuleCollection(this.context, moduleName, info);
            collection.pm = new PathMaster_1.PathMaster(this.context, info.root);
            if (info.entry) {
                collection.setupEntry(new File_1.File(this.context, collection.pm.init(info.entry)));
            }
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
    resolve(file, shouldIgnoreDeps) {
        file.collection = this;
        if (this.bundle) {
            if (this.bundle.fileBlackListed(file)) {
                return;
            }
            if (shouldIgnoreDeps === undefined) {
                shouldIgnoreDeps = this.bundle.shouldIgnoreNodeModules(file.getCrossPlatormPath());
            }
        }
        if (file.info.isNodeModule) {
            if (this.context.isGlobalyIgnored(file.info.nodeModuleName)) {
                return;
            }
            if (shouldIgnoreDeps || this.bundle && this.bundle.shouldIgnore(file.info.nodeModuleName)) {
                return;
            }
            return this.delayedResolve
                ? this.toBeResolved.push(file)
                : this.resolveNodeModule(file);
        }
        else {
            if (this.dependencies.has(file.absPath)) {
                return;
            }
            file.consume();
            this.dependencies.set(file.absPath, file);
            let fileLimitPath;
            if (this.entryFile && this.entryFile.isNodeModuleEntry) {
                fileLimitPath = this.entryFile.info.absPath;
            }
            return realm_utils_1.each(file.analysis.dependencies, name => {
                return this.resolve(new File_1.File(this.context, this.pm.resolve(name, file.info.absDir, fileLimitPath)), shouldIgnoreDeps);
            });
        }
    }
}
exports.ModuleCollection = ModuleCollection;
