"use strict";
const path = require('path');
const fs = require('fs');
const BundleSource_1 = require("./BundleSource");
const Log_1 = require("./Log");
const PathMaster_1 = require("./PathMaster");
const ModuleCache_1 = require("./ModuleCache");
const appRoot = require("app-root-path");
class WorkFlowContext {
    constructor() {
        this.nodeModules = new Map();
        this.libPaths = new Map();
        this.printLogs = true;
        this.useCache = true;
        this.doLog = true;
        this.cache = new ModuleCache_1.ModuleCache(this);
        this.tsMode = false;
        this.globals = [];
        this.standaloneBundle = true;
    }
    reset() {
        this.log = new Log_1.Log(this.doLog);
        this.source = new BundleSource_1.BundleSource(this);
        this.nodeModules = new Map();
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
    writeOutput() {
        let res = this.source.getResult();
        if (this.sourceMapConfig && this.sourceMapConfig.outFile) {
            let outFile = this.sourceMapConfig.outFile;
            if (!path.isAbsolute(outFile)) {
                outFile = path.join(appRoot.path, outFile);
            }
            fs.writeFile(outFile, res.sourceMap);
        }
        if (this.outFile) {
            if (!path.isAbsolute(this.outFile)) {
                this.outFile = path.join(appRoot.path, this.outFile);
            }
            fs.writeFile(this.outFile, res.content);
        }
    }
    getNodeModule(name) {
        return this.nodeModules.get(name);
    }
}
exports.WorkFlowContext = WorkFlowContext;
