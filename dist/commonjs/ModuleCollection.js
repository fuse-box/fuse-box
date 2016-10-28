"use strict";
const Module_1 = require("./Module");
const path = require("path");
const fs = require("fs");
const realm_utils_1 = require("realm-utils");
const MODULE_CACHE = {};
const appRoot = require("app-root-path");
const NODE_MODULES_DIR = path.join(appRoot.path, "node_modules");
const LOCAL_LIBS = path.join(__dirname, "../../assets/libs");
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
    collectBundle(data) {
        this.bundle = data;
        let module = new Module_1.Module();
        module.setDir(data.homeDir);
        return realm_utils_1.each(data.including, (withDeps, modulePath) => {
            return this.processModule(module, modulePath);
        }).then(x => {
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
                let targetEntryFile = this.getNodeModuleMainFile(nodeModule);
                let depCollection;
                if (targetEntryFile) {
                    let targetEntry = new Module_1.Module(targetEntryFile);
                    depCollection = new ModuleCollection(nodeModule, targetEntry);
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
            let modulePath = module.getAbsolutePathOfModule(name);
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
    getNodeModuleMainFile(name) {
        let localLib = path.join(LOCAL_LIBS, name);
        let modulePath = path.join(NODE_MODULES_DIR, name);
        let readMainFile = (folder) => {
            let packageJSONPath = path.join(folder, "package.json");
            if (fs.existsSync(packageJSONPath)) {
                let json = JSON.parse(fs.readFileSync(packageJSONPath).toString());
                if (json.main) {
                    let entryFile = path.join(folder, json.main);
                    return entryFile;
                }
                else {
                    return path.join(folder, "index.js");
                }
            }
            else {
                return path.join(folder, "index.js");
            }
        };
        if (fs.existsSync(localLib)) {
            return readMainFile(localLib);
        }
        else {
            return readMainFile(modulePath);
        }
    }
}
exports.ModuleCollection = ModuleCollection;
