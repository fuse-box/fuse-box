"use strict";
const Utils_1 = require("./Utils");
class PluginChain {
    constructor(name, file, opts) {
        this.file = file;
        this.opts = opts;
        let methodName = Utils_1.camelCase(name);
        this.methodName = `on${methodName.charAt(0).toUpperCase() + methodName.slice(1)}Chain`;
    }
    setContext(context) {
        this.context = context;
    }
}
exports.PluginChain = PluginChain;
