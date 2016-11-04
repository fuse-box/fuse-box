"use strict";
const path = require("path");
const fs = require("fs");
const NODE_MODULE = /^([a-z].*)$/;
class PathMaster {
    constructor(context, moduleRoot) {
        this.context = context;
        this.moduleRoot = moduleRoot;
    }
    resolve(name, root) {
        let data = {};
        data.isNodeModule = NODE_MODULE.test(name);
        if (data.isNodeModule) {
            let info = this.getNodeModuleInfo(name);
            data.nodeModuleName = info.name;
            data.nodeModulePartialOriginal = info.target;
        }
        else {
            if (root) {
                let url = this.ensureFolderAndExtensions(name, root);
                url = path.resolve(root, url);
                data.absPath = url;
            }
        }
        return data;
    }
    ensureFolderAndExtensions(name, root) {
        if (!name.match(/.js$/)) {
            let folderDir = path.join(path.dirname(root), name, "index.js");
            if (fs.existsSync(folderDir)) {
                let startsWithDot = name[0] === ".";
                name = path.join(name, "/", "index.js");
                if (startsWithDot) {
                    name = `./${name}`;
                }
            }
            else {
                name = name + ".js";
            }
        }
        return name;
    }
    getNodeModuleInfo(name) {
        let data = name.split(/\/(.+)?/);
        return {
            name: data[0],
            target: data[1],
        };
    }
}
exports.PathMaster = PathMaster;
