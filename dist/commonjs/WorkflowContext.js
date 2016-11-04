"use strict";
const Dump_1 = require("./Dump");
class WorkFlowContext {
    constructor() {
        this.dump = new Dump_1.FuseBoxDump();
        this.nodeModules = new Map();
        this.printLogs = true;
        this.useCache = true;
    }
    setHomeDir(dir) {
        this.homeDir = dir;
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
    getNodeModule(name) {
        return this.nodeModules.get(name);
    }
}
exports.WorkFlowContext = WorkFlowContext;
