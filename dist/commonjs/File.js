"use strict";
const FileAST_1 = require('./FileAST');
const fs = require("fs");
const realm_utils_1 = require("realm-utils");
class File {
    constructor(context, info) {
        this.context = context;
        this.info = info;
        this.isLoaded = false;
        this.isNodeModuleEntry = false;
        this.resolving = [];
        this.absPath = info.absPath;
    }
    getCrossPlatormPath() {
        let name = this.absPath;
        name = name.replace(/\\/g, "/");
        return name;
    }
    tryPlugins(_ast) {
        if (this.context.plugins) {
            let target;
            let index = 0;
            while (!target && index < this.context.plugins.length) {
                let plugin = this.context.plugins[index];
                if (plugin.test.test(this.absPath)) {
                    target = plugin;
                }
                index++;
            }
            if (target) {
                if (realm_utils_1.utils.isFunction(target.transform)) {
                    let response = target.transform.apply(target, [this, _ast]);
                    if (realm_utils_1.utils.isPromise(response)) {
                        this.resolving.push(response);
                    }
                }
            }
        }
    }
    addHeaderContent(str) {
        if (!this.headerContent) {
            this.headerContent = [];
        }
        this.headerContent.push(str);
    }
    consume() {
        if (!this.absPath) {
            return [];
        }
        if (!fs.existsSync(this.info.absPath)) {
            this.contents = "";
            return [];
        }
        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;
        if (this.absPath.match(/\.js$/)) {
            let fileAst = new FileAST_1.FileAST(this);
            fileAst.consume();
            this.tryPlugins(fileAst);
            return fileAst.dependencies;
        }
        this.tryPlugins();
        return [];
    }
}
exports.File = File;
