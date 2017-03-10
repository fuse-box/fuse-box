"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleCollection_1 = require("./core/ModuleCollection");
const Config_1 = require("./Config");
const realm_utils_1 = require("realm-utils");
const fsExtra = require("fs-extra");
const fs = require("fs");
const path = require("path");
const MEMORY_CACHE = {};
class ModuleCache {
    constructor(context) {
        this.context = context;
        this.cachedDeps = {
            tree: {},
            flat: {},
        };
        this.initialize();
    }
    initialize() {
        this.cacheFolder = path.join(Config_1.Config.TEMP_FOLDER, "cache", Config_1.Config.FUSEBOX_VERSION, encodeURIComponent(`${Config_1.Config.PROJECT_FOLDER}${this.context.outFile || ""}`));
        this.permanentCacheFolder = path.join(this.cacheFolder, "permanent");
        fsExtra.ensureDirSync(this.permanentCacheFolder);
        this.staticCacheFolder = path.join(this.cacheFolder, "static");
        fsExtra.ensureDirSync(this.staticCacheFolder);
        this.cacheFile = path.join(this.cacheFolder, "deps.json");
        if (fs.existsSync(this.cacheFile)) {
            try {
                this.cachedDeps = require(this.cacheFile);
            }
            catch (e) {
                this.cachedDeps = {
                    tree: {},
                    flat: {},
                };
            }
        }
    }
    setPermanentCache(key, contents) {
        key = encodeURIComponent(key);
        let filePath = path.join(this.permanentCacheFolder, key);
        fs.writeFile(filePath, contents, () => { });
        MEMORY_CACHE[filePath] = contents;
    }
    getPermanentCache(key) {
        key = encodeURIComponent(key);
        let filePath = path.join(this.permanentCacheFolder, key);
        if (MEMORY_CACHE[filePath]) {
            return MEMORY_CACHE[filePath];
        }
        if (fs.existsSync(filePath)) {
            const contents = fs.readFileSync(filePath).toString();
            MEMORY_CACHE[filePath] = contents;
            return contents;
        }
    }
    getStaticCache(file) {
        let stats = fs.statSync(file.absPath);
        let fileName = encodeURIComponent(file.info.fuseBoxPath);
        let memCacheKey = encodeURIComponent(file.absPath);
        let data;
        if (MEMORY_CACHE[memCacheKey]) {
            data = MEMORY_CACHE[memCacheKey];
            if (data.mtime !== stats.mtime.getTime()) {
                return;
            }
            return data;
        }
        else {
            let dest = path.join(this.staticCacheFolder, fileName);
            if (fs.existsSync(dest)) {
                try {
                    data = require(dest);
                }
                catch (e) {
                    console.log(e);
                    return;
                }
                if (data.mtime !== stats.mtime.getTime()) {
                    return;
                }
                MEMORY_CACHE[memCacheKey] = data;
                return data;
            }
        }
    }
    writeStaticCache(file, sourcemaps) {
        let fileName = encodeURIComponent(file.info.fuseBoxPath);
        let memCacheKey = encodeURIComponent(file.absPath);
        let dest = path.join(this.staticCacheFolder, fileName);
        let stats = fs.statSync(file.absPath);
        let cacheData = {
            contents: file.contents,
            dependencies: file.analysis.dependencies,
            sourceMap: sourcemaps || {},
            headerContent: file.headerContent,
            mtime: stats.mtime.getTime(),
        };
        let data = `module.exports = { contents: ${JSON.stringify(cacheData.contents)},
dependencies: ${JSON.stringify(cacheData.dependencies)},
sourceMap: ${JSON.stringify(cacheData.sourceMap)},
headerContent: ${JSON.stringify(cacheData.headerContent)},
mtime: ${cacheData.mtime}
};`;
        MEMORY_CACHE[memCacheKey] = cacheData;
        fs.writeFileSync(dest, data);
    }
    resolve(files) {
        let through = [];
        let valid4Caching = [];
        const moduleFileCollection = new Map();
        files.forEach(file => {
            let info = file.info.nodeModuleInfo;
            if (!moduleFileCollection.get(info.name)) {
                moduleFileCollection.set(info.name, new Map());
            }
            moduleFileCollection.get(info.name).set(file.info.fuseBoxPath, file);
        });
        files.forEach(file => {
            let info = file.info.nodeModuleInfo;
            let key = `${info.name}@${info.version}`;
            let cachePath = path.join(this.cacheFolder, encodeURIComponent(key));
            let cached = this.cachedDeps.flat[key];
            if (!cached || !fs.existsSync(cachePath)) {
                through.push(file);
            }
            else {
                if (cached.version !== info.version || cached.files.indexOf(file.info.fuseBoxPath) === -1) {
                    through.push(file);
                    for (let i = 0; i < cached.files.length; i++) {
                        let cachedFileName = cached.files[i];
                        let f = moduleFileCollection.get(info.name).get(cachedFileName);
                        if (f) {
                            through.push(f);
                        }
                    }
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
        const required = [];
        const operations = [];
        let cacheReset = false;
        const getAllRequired = (key, json) => {
            if (required.indexOf(key) === -1) {
                if (json) {
                    let collection = new ModuleCollection_1.ModuleCollection(this.context, json.name);
                    let cacheKey = encodeURIComponent(key);
                    collection.cached = true;
                    collection.cachedName = key;
                    collection.cacheFile = path.join(this.cacheFolder, cacheKey);
                    operations.push(new Promise((resolve, reject) => {
                        if (MEMORY_CACHE[cacheKey]) {
                            collection.cachedContent = MEMORY_CACHE[cacheKey];
                            return resolve();
                        }
                        if (fs.existsSync(collection.cacheFile)) {
                            fs.readFile(collection.cacheFile, (err, result) => {
                                collection.cachedContent = result.toString();
                                MEMORY_CACHE[cacheKey] = collection.cachedContent;
                                return resolve();
                            });
                        }
                        else {
                            valid4Caching = [];
                            cacheReset = true;
                            return resolve();
                        }
                    }));
                    this.context.addNodeModule(key, collection);
                    required.push(key);
                    if (json.deps) {
                        for (let k in json.deps) {
                            if (json.deps.hasOwnProperty(k)) {
                                getAllRequired(k, json.deps[k]);
                            }
                        }
                    }
                }
            }
        };
        valid4Caching.forEach(key => {
            getAllRequired(key, this.cachedDeps.tree[key]);
        });
        return Promise.all(operations).then(() => {
            if (cacheReset) {
                this.context.resetNodeModules();
                return files;
            }
            return through;
        });
    }
    buildMap(rootCollection) {
        let json = this.cachedDeps;
        const traverse = (modules, root) => {
            return realm_utils_1.each(modules, (collection) => {
                if (collection.traversed) {
                    return;
                }
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
                        files: [],
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
                collection.traversed = true;
                return traverse(collection.nodeModules, dependencies);
            });
        };
        traverse(rootCollection.nodeModules, json.tree).then(() => {
            fs.writeFile(this.cacheFile, JSON.stringify(json, undefined, 2), () => { });
        });
    }
    set(info, contents) {
        return new Promise((resolve, reject) => {
            const cacheKey = encodeURIComponent(`${info.name}@${info.version}`);
            const targetName = path.join(this.cacheFolder, cacheKey);
            MEMORY_CACHE[cacheKey] = contents;
            fs.writeFile(targetName, contents, (err) => {
                return resolve();
            });
        });
    }
}
exports.ModuleCache = ModuleCache;
