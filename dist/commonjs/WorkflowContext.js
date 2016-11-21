"use strict";
const Log_1 = require("./Log");
const PathMaster_1 = require("./PathMaster");
const ModuleCache_1 = require("./ModuleCache");
const readline = require("readline");
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
    }
    reset() {
        this.log = new Log_1.Log(this.doLog);
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
    spinStart(title) {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${title}`);
    }
    getNodeModule(name) {
        return this.nodeModules.get(name);
    }
}
exports.WorkFlowContext = WorkFlowContext;
