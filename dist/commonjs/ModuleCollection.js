"use strict";
const File_1 = require("./File");
const PathMaster_1 = require("./PathMaster");
const realm_utils_1 = require("realm-utils");
class ModuleCollection {
    constructor(context, name) {
        this.context = context;
        this.name = name;
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
    resolveEntry(shouldIgnoreDeps) {
        if (this.entryFile && !this.entryResolved) {
            this.entryResolved = true;
            return this.resolve(this.entryFile, shouldIgnoreDeps);
        }
    }
    collectBundle(data) {
        this.bundle = data;
        return realm_utils_1.each(data.including, (withDeps, modulePath) => {
            let file = new File_1.File(this.context, this.pm.init(modulePath));
            return this.resolve(file);
        }).then(x => {
            return this;
        });
    }
    resolve(file, shouldIgnoreDeps) {
        if (this.bundle) {
            if (this.bundle.excluding.has(file.info.absDir)) {
                return;
            }
            if (shouldIgnoreDeps === undefined) {
                shouldIgnoreDeps = this.bundle.shouldIgnoreNodeModules(file.info.absPath);
            }
        }
        if (file.info.isNodeModule) {
            if (shouldIgnoreDeps || this.bundle && this.bundle.shouldIgnore(file.info.nodeModuleName)) {
                return;
            }
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
                ? collection.resolve(new File_1.File(this.context, collection.pm.init(file.info.absPath)), shouldIgnoreDeps)
                : collection.resolveEntry(shouldIgnoreDeps);
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
            return realm_utils_1.each(dependencies, name => this.resolve(new File_1.File(this.context, this.pm.resolve(name, file.info.absDir, fileLimitPath)), shouldIgnoreDeps));
        }
    }
}
exports.ModuleCollection = ModuleCollection;
