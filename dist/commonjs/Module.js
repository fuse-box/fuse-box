"use strict";
const Utils_1 = require("./Utils");
const fs = require("fs");
const path = require("path");
class Module {
    constructor(absPath) {
        this.absPath = absPath;
        this.dependencies = [];
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
    digest() {
        if (!this.absPath) {
            return [];
        }
        if (!fs.existsSync(this.absPath)) {
            console.warn("File ", this.absPath, "Does not exist");
            this.contents = "";
            return [];
        }
        this.contents = fs.readFileSync(this.absPath).toString();
        if (this.absPath.match(/\.json$/)) {
            this.contents = "module.exports = " + this.contents;
        }
        if (this.absPath.match(/\.js$/)) {
            let reqs = Utils_1.extractRequires(this.contents, true);
            return reqs;
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
        let root = userRootPath || path.dirname(entry && entry.absPath ? entry.absPath : this.absPath);
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
