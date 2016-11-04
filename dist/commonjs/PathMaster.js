"use strict";
const NODE_MODULE = /^([a-z].*)$/;
class PathMaster {
    constructor(context, moduleRoot) {
        this.context = context;
        this.moduleRoot = moduleRoot;
    }
    resolve(name, root) {
        let isNodeModule = NODE_MODULE.test(name);
        if (isNodeModule) {
        }
        return {
            isNodeModule: isNodeModule
        };
    }
}
exports.PathMaster = PathMaster;
