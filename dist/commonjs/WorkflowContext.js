"use strict";
const path = require("path");
const fs = require("fs");
const BundleSource_1 = require("./BundleSource");
const Log_1 = require("./Log");
const PathMaster_1 = require("./PathMaster");
const ModuleCache_1 = require("./ModuleCache");
const realm_utils_1 = require("realm-utils");
const appRoot = require("app-root-path");
const mkdirp = require("mkdirp");
class WorkFlowContext {
    constructor() {
        this.defaultPackageName = "default";
        this.ignoreGlobal = [];
        this.nodeModules = new Map();
        this.libPaths = new Map();
        this.printLogs = true;
        this.useCache = true;
        this.doLog = true;
        this.tsMode = false;
        this.standaloneBundle = true;
    }
    initCache() {
        this.cache = new ModuleCache_1.ModuleCache(this);
    }
    reset() {
        this.log = new Log_1.Log(this.doLog);
        this.source = new BundleSource_1.BundleSource(this);
        this.nodeModules = new Map();
        this.pluginTriggers = new Map();
        this.libPaths = new Map();
    }
    allowExtension(ext) {
        PathMaster_1.AllowedExtenstions.add(ext);
    }
    setHomeDir(dir) {
        this.homeDir = dir;
    }
    setLibInfo(name, version, info) {
        let key = `${name}@${version}`;
        if (!this.libPaths.has(key)) {
            return this.libPaths.set(key, info);
        }
    }
    convert2typescript(name) {
        return name.replace(/\.ts$/, ".js");
    }
    getLibInfo(name, version) {
        let key = `${name}@${version}`;
        if (this.libPaths.has(key)) {
            return this.libPaths.get(key);
        }
    }
    setPrintLogs(printLogs) {
        this.printLogs = printLogs;
    }
    setUseCache(useCache) {
        this.useCache = useCache;
    }
    hasNodeModule(name) {
        return this.nodeModules.has(name);
    }
    isGlobalyIgnored(name) {
        return this.ignoreGlobal.indexOf(name) > -1;
    }
    addNodeModule(name, collection) {
        this.nodeModules.set(name, collection);
    }
    getTypeScriptConfig() {
        if (this.tsConfig) {
            return this.tsConfig;
        }
        let url = path.join(this.homeDir, "tsconfig.json");
        if (fs.existsSync(url)) {
            this.tsConfig = require(url);
        }
        else {
            this.tsConfig = {
                compilerOptions: {}
            };
        }
        this.tsConfig.compilerOptions.module = "commonjs";
        if (this.sourceMapConfig) {
            this.tsConfig.compilerOptions.sourceMap = true;
            this.tsConfig.compilerOptions.inlineSources = true;
        }
        return this.tsConfig;
    }
    ensureUserPath(userPath) {
        if (!path.isAbsolute(userPath)) {
            userPath = path.join(appRoot.path, userPath);
        }
        let dir = path.dirname(userPath);
        mkdirp.sync(dir);
        return userPath;
    }
    writeOutput() {
        let res = this.source.getResult();
        if (this.sourceMapConfig && this.sourceMapConfig.outFile) {
            let target = this.ensureUserPath(this.sourceMapConfig.outFile);
            fs.writeFile(target, res.sourceMap, () => { });
        }
        if (this.outFile) {
            let target = this.ensureUserPath(this.outFile);
            fs.writeFile(target, res.content, () => { });
        }
    }
    getNodeModule(name) {
        return this.nodeModules.get(name);
    }
    triggerPluginsMethodOnce(name, args, fn) {
        this.plugins.forEach(plugin => {
            if (Array.isArray(plugin)) {
                plugin.forEach(p => {
                    if (realm_utils_1.utils.isFunction(p[name])) {
                        if (this.pluginRequiresTriggering(p, name)) {
                            p[name].apply(p, args);
                            if (fn) {
                                fn(p);
                            }
                        }
                    }
                });
            }
            if (realm_utils_1.utils.isFunction(plugin[name])) {
                if (this.pluginRequiresTriggering(plugin, name)) {
                    plugin[name].apply(plugin, args);
                    if (fn) {
                        fn(plugin);
                    }
                }
            }
        });
    }
    pluginRequiresTriggering(cls, method) {
        if (!cls.constructor) {
            return true;
        }
        let name = cls.constructor.name;
        if (!this.pluginTriggers.has(name)) {
            this.pluginTriggers.set(name, new Set());
        }
        let items = this.pluginTriggers.get(name);
        if (!items.has(method)) {
            items.add(method);
            return true;
        }
        return false;
    }
}
exports.WorkFlowContext = WorkFlowContext;
