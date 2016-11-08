"use strict";
const Utils_1 = require("./Utils");
const fs = require("fs");
const path = require("path");
class Module {
    constructor(context, absPath) {
        this.context = context;
        this.absPath = absPath;
        this.dependencies = [];
        this.isLoaded = false;
        if (!absPath) {
            return;
        }
        if (!path.isAbsolute(absPath)) {
            absPath = Utils_1.getAbsoluteEntryPath(absPath);
        }
        this.absPath = this.ensureExtension(absPath);
        this.dir = path.dirname(absPath);
    }
    setDir(dir) {
        this.dir = dir;
    }
    setNodeModuleDir(dir) {
        this.nodeModuleDir = dir;
    }
    setPackage(info) {
        this.packageInfo = info;
    }
    digest() {
        if (!this.absPath) {
            return [];
        }
        if (!fs.existsSync(this.absPath)) {
            this.context.dump.error(this.packageInfo.name, this.absPath, "Not found");
            this.contents = "";
            return [];
        }
        this.contents = fs.readFileSync(this.absPath).toString();
        this.isLoaded = true;
        if (this.absPath.match(/\.json$/)) {
            this.contents = "module.exports = " + this.contents;
        }
        if (this.absPath.match(/\.js$/)) {
            let reqs = Utils_1.extractRequires(this.contents, path.join(this.absPath));
        }
        return [];
    }
    getAbsolutePathOfModule(name, packageInfo) {
        if (path.isAbsolute(name)) {
            return name;
        }
        let mpath = path.join(this.dir, name);
        let target = this.ensureExtension(mpath);
        if (packageInfo && !fs.existsSync(target)) {
            return packageInfo.entry;
        }
        return target;
    }
    addDependency(module) {
        this.dependencies.push(module);
    }
    getProjectPath(entry, userRootPath) {
        let root = this.packageInfo ? this.packageInfo.root : userRootPath;
        let input = this.absPath;
        input = input.replace(/\\/g, "/");
        root = root.replace(/\\/g, "/");
        input = input.replace(root, "");
        input = input.replace(/^\/|\\/, "");
        return input;
    }
    ensureExtension(name) {
        if (!name.match(/\.\w{1,}$/)) {
            if (name.match(/\/$/)) {
                return name + "index.js";
            }
            else {
                let folderIndex = `${name}/index.js`;
                if (fs.existsSync(folderIndex)) {
                    return folderIndex;
                }
            }
            return name + ".js";
        }
        return name;
    }
}
exports.Module = Module;
