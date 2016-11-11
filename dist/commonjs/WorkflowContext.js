"use strict";
const Log_1 = require("./Log");
const Dump_1 = require("./Dump");
const ModuleCache_1 = require("./ModuleCache");
const readline = require("readline");
class WorkFlowContext {
    constructor() {
        this.dump = new Dump_1.FuseBoxDump();
        this.nodeModules = new Map();
        this.libPaths = new Map();
        this.printLogs = true;
        this.useCache = true;
        this.cache = new ModuleCache_1.ModuleCache(this);
        this.log = new Log_1.Log();
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
