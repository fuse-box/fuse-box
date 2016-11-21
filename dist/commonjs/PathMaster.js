"use strict";
const path = require("path");
const fs = require("fs");
const Config_1 = require("./Config");
const NODE_MODULE = /^([a-z].*)$/;
class AllowedExtenstions {
    static add(name) {
        if (!this.list.has(name)) {
            this.list.add(name);
        }
    }
    static has(name) {
        return this.list.has(name);
    }
}
AllowedExtenstions.list = new Set([".js", ".ts", ".json", ".xml", ".css", ".html"]);
exports.AllowedExtenstions = AllowedExtenstions;
class PathMaster {
    constructor(context, rootPackagePath) {
        this.context = context;
        this.rootPackagePath = rootPackagePath;
        this.tsMode = false;
    }
    init(name) {
        return this.resolve(name, this.rootPackagePath);
    }
    setTypeScriptMode() {
        this.tsMode = true;
    }
    resolve(name, root, rootEntryLimit) {
        let data = {};
        data.isNodeModule = NODE_MODULE.test(name);
        if (data.isNodeModule) {
            let info = this.getNodeModuleInfo(name);
            data.nodeModuleName = info.name;
            let nodeModuleInfo = this.getNodeModuleInformation(info.name);
            let cachedInfo = this.context.getLibInfo(nodeModuleInfo.name, nodeModuleInfo.version);
            if (cachedInfo) {
                data.nodeModuleInfo = cachedInfo;
            }
            else {
                data.nodeModuleInfo = nodeModuleInfo;
                this.context.setLibInfo(nodeModuleInfo.name, nodeModuleInfo.version, nodeModuleInfo);
            }
            if (info.target) {
                data.absPath = this.getAbsolutePath(info.target, data.nodeModuleInfo.root);
                data.absDir = path.dirname(data.absPath);
                data.nodeModuleExplicitOriginal = info.target;
            }
            else {
                data.absPath = data.nodeModuleInfo.entry;
                data.absDir = data.nodeModuleInfo.root;
            }
            if (data.absPath) {
                data.fuseBoxPath = this.getFuseBoxPath(data.absPath, data.nodeModuleInfo.root);
            }
        }
        else {
            if (root) {
                data.absPath = this.getAbsolutePath(name, root, rootEntryLimit);
                data.absDir = path.dirname(data.absPath);
                data.fuseBoxPath = this.getFuseBoxPath(data.absPath, this.rootPackagePath);
            }
        }
        return data;
    }
    getFuseBoxPath(name, root) {
        if (!root) {
            return;
        }
        name = name.replace(/\\/g, "/");
        root = root.replace(/\\/g, "/");
        name = name.replace(root, "").replace(/^\/|\\/, "");
        if (this.tsMode) {
            name = this.context.convert2typescript(name);
        }
        return name;
    }
    getAbsolutePath(name, root, rootEntryLimit) {
        let url = this.ensureFolderAndExtensions(name, root);
        let result = path.resolve(root, url);
        if (rootEntryLimit && name.match(/\.\.\/$/)) {
            if (result.indexOf(path.dirname(rootEntryLimit)) < 0) {
                return rootEntryLimit;
            }
        }
        return result;
    }
    getParentFolderName() {
        if (this.rootPackagePath) {
            let s = this.rootPackagePath.split(/\/|\\/g);
            return s[s.length - 1];
        }
        return "";
    }
    ensureFolderAndExtensions(name, root) {
        let ext = path.extname(name);
        let fileExt = this.tsMode ? ".ts" : ".js";
        if (name[0] === "~" && name[1] === "/" && this.rootPackagePath) {
            name = "." + name.slice(1, name.length);
            name = path.join(this.rootPackagePath, name);
        }
        if (!AllowedExtenstions.has(ext)) {
            if (/\/$/.test(name)) {
                return `${name}index${fileExt}`;
            }
            let folderDir = path.isAbsolute(name) ? path.join(name, `index${fileExt}`)
                : path.join(root, name, `index${fileExt}`);
            if (fs.existsSync(folderDir)) {
                let startsWithDot = name[0] === ".";
                name = path.join(name, "/", `index${fileExt}`);
                if (startsWithDot) {
                    name = `./${name}`;
                }
            }
            else {
                name += fileExt;
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
    getNodeModuleInformation(name) {
        let readMainFile = (folder, isCustom) => {
            let packageJSONPath = path.join(folder, "package.json");
            if (fs.existsSync(packageJSONPath)) {
                let json = require(packageJSONPath);
                let entryFile;
                let entryRoot;
                if (json.main) {
                    entryFile = path.join(folder, json.main);
                }
                else {
                    entryFile = path.join(folder, "index.js");
                }
                entryRoot = path.dirname(entryFile);
                return {
                    name: name,
                    custom: isCustom,
                    root: folder,
                    entryRoot: entryRoot,
                    entry: entryFile,
                    version: json.version,
                };
            }
            let defaultEntry = path.join(folder, "index.js");
            let entryFile = fs.existsSync(defaultEntry) ? defaultEntry : undefined;
            let defaultEntryRoot = entryFile ? path.dirname(entryFile) : undefined;
            return {
                name: name,
                custom: isCustom,
                root: folder,
                entry: entryFile,
                entryRoot: defaultEntryRoot,
                version: "0.0.0",
            };
        };
        let localLib = path.join(Config_1.Config.LOCAL_LIBS, name);
        let modulePath = path.join(Config_1.Config.NODE_MODULES_DIR, name);
        if (this.context.customModulesFolder) {
            let customFolder = path.join(this.context.customModulesFolder, name);
            if (fs.existsSync(customFolder)) {
                return readMainFile(customFolder, false);
            }
        }
        if (this.rootPackagePath) {
            let nestedNodeModule = path.join(this.rootPackagePath, "node_modules", name);
            if (fs.existsSync(nestedNodeModule)) {
                return readMainFile(nestedNodeModule, true);
            }
            else {
                let upperNodeModule = path.join(this.rootPackagePath, "../", name);
                if (fs.existsSync(upperNodeModule)) {
                    let isCustom = path.dirname(this.rootPackagePath) !== Config_1.Config.NODE_MODULES_DIR;
                    return readMainFile(upperNodeModule, isCustom);
                }
            }
        }
        if (fs.existsSync(localLib)) {
            return readMainFile(localLib, false);
        }
        else {
            return readMainFile(modulePath, false);
        }
    }
}
exports.PathMaster = PathMaster;
