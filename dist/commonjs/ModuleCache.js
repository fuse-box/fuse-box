"use strict";
const ModuleCollection_1 = require("./ModuleCollection");
const fs = require("fs");
const Config_1 = require("./Config");
const path = require("path");
const realm_utils_1 = require("realm-utils");
const mkdirp = require("mkdirp");
class ModuleCache {
    constructor(context) {
        this.context = context;
        this.cachedDeps = {
            tree: {},
            flat: {}
        };
        this.cacheFolder = path.join(Config_1.Config.TEMP_FOLDER, "cache", Config_1.Config.FUSEBOX_VERSION, encodeURIComponent(`${Config_1.Config.PROJECT_FOLDER}${context.outFile || ""}`));
        this.staticCacheFolder = path.join(this.cacheFolder, "static");
        mkdirp.sync(this.staticCacheFolder);
        mkdirp.sync(this.cacheFolder);
        this.cacheFile = path.join(this.cacheFolder, "deps.json");
        if (fs.existsSync(this.cacheFile)) {
            this.cachedDeps = require(this.cacheFile);
        }
    }
    getStaticCache(file) {
        let stats = fs.statSync(file.absPath);
        let fileName = encodeURIComponent(file.info.fuseBoxPath);
        let dest = path.join(this.staticCacheFolder, fileName);
        if (fs.existsSync(dest)) {
            let data = require(dest);
            if (data.mtime !== stats.mtime.getTime()) {
                return;
            }
            return data;
        }
    }
    writeStaticCache(file, sourcemaps) {
        let fileName = encodeURIComponent(file.info.fuseBoxPath);
        let dest = path.join(this.staticCacheFolder, fileName);
        let stats = fs.statSync(file.absPath);
        let data = `module.exports = { contents : ${JSON.stringify(file.contents)}, 
dependencies : ${JSON.stringify(file.analysis.dependencies)}, 
sourceMap : ${JSON.stringify(sourcemaps || {})},
mtime : ${stats.mtime.getTime()}
};`;
        fs.writeFileSync(dest, data);
    }
    resolve(files) {
        let through = [];
        let valid4Caching = [];
        files.forEach(file => {
            let info = file.info.nodeModuleInfo;
            let key = `${info.name}@${info.version}`;
            let cached = this.cachedDeps.flat[key];
            if (!cached) {
                through.push(file);
            }
            else {
                if (cached.version !== info.version || cached.files.indexOf(file.info.fuseBoxPath) === -1) {
                    through.push(file);
                    let index = valid4Caching.indexOf(key);
                    if (index !== -1) {
                        valid4Caching.splice(index, 1);
                    }
                }
                else {
                    if (valid4Caching.indexOf(key) === -1) {
                        valid4Caching.push(key);
                    }
                }
            }
        });
        let required = [];
        let operations = [];
        let getAllRequired = (key, json) => {
            if (required.indexOf(key) === -1) {
                let collection = new ModuleCollection_1.ModuleCollection(this.context, json.name);
                collection.cached = true;
                collection.cachedName = key;
                collection.cacheFile = path.join(this.cacheFolder, encodeURIComponent(key));
                operations.push(new Promise((resolve, reject) => {
                    if (fs.existsSync(collection.cacheFile)) {
                        fs.readFile(collection.cacheFile, (err, result) => {
                            collection.cachedContent = result.toString();
                            return resolve();
                        });
                    }
                    else {
                        collection.cachedContent = "";
                        console.warn(`${collection.cacheFile} was not found`);
                        return resolve();
                    }
                }));
                this.context.addNodeModule(collection.cachedName, collection);
                required.push(key);
                if (json.deps) {
                    for (let k in json.deps) {
                        if (json.deps.hasOwnProperty(k)) {
                            getAllRequired(k, json.deps[k]);
                        }
                    }
                }
            }
        };
        valid4Caching.forEach(key => {
            getAllRequired(key, this.cachedDeps.tree[key]);
        });
        return Promise.all(operations).then(() => {
            return through;
        });
    }
    buildMap(rootCollection) {
        let json = this.cachedDeps;
        let traverse = (modules, root) => {
            return realm_utils_1.each(modules, (collection) => {
                let dependencies = {};
                let flatFiles;
                if (collection.cached) {
                    return;
                }
                let key = `${collection.info.name}@${collection.info.version}`;
                if (!json.flat[key]) {
                    json.flat[key] = {
                        name: collection.name,
                        version: collection.info.version,
                        files: []
                    };
                }
                flatFiles = json.flat[key].files;
                collection.dependencies.forEach(file => {
                    if (flatFiles.indexOf(file.info.fuseBoxPath) < 0) {
                        flatFiles.push(file.info.fuseBoxPath);
                    }
                });
                root[key] = {
                    deps: dependencies,
                    name: collection.info.name,
                    version: collection.info.version,
                };
                return traverse(collection.nodeModules, dependencies);
            });
        };
        traverse(rootCollection.nodeModules, json.tree).then(() => {
            fs.writeFile(this.cacheFile, JSON.stringify(json, undefined, 2), () => { });
        });
    }
    set(info, contents) {
        return new Promise((resolve, reject) => {
            let targetName = path.join(this.cacheFolder, encodeURIComponent(`${info.name}@${info.version}`));
            fs.writeFile(targetName, contents, (err) => {
                return resolve();
            });
        });
    }
}
exports.ModuleCache = ModuleCache;
