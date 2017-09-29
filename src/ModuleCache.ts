import { WorkFlowContext } from "./core/WorkflowContext";
import { IPackageInformation } from "./core/PathMaster";
import { ModuleCollection } from "./core/ModuleCollection";
import { File } from "./core/File";
import { Config } from "./Config";
import { each } from "realm-utils";
import { AbsDir } from "./Types";
import * as fsExtra from "fs-extra";
import * as fs from "fs";
import * as path from "path";

const MEMORY_CACHE = {};

/**
 *
 * @class ModuleCache
 */
export class ModuleCache {
    /**
     *
     *
     * @type {AbsDir}
     * @memberOf ModuleCache
     */
    public cacheFolder: AbsDir;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberOf ModuleCache
     */
    private cacheFile: string;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberOf ModuleCache
     */
    private staticCacheFolder: string;

    private permanentCacheFolder: string;
    /**
     *
     *
     * @private
     *
     * @memberOf ModuleCache
     */
    private cachedDeps = {
        tree: {},
        flat: {},
    };

    /**
     * Creates an instance of ModuleCache.
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf ModuleCache
     */
    constructor(public context: WorkFlowContext) { }

    public initialize() {
        this.cacheFolder = path.join(Config.TEMP_FOLDER, "cache",
        encodeURIComponent(Config.FUSEBOX_VERSION), this.context.output.getUniqueHash());

        this.permanentCacheFolder = path.join(this.cacheFolder, "permanent");
        fsExtra.ensureDirSync(this.permanentCacheFolder);

        this.staticCacheFolder = path.join(this.cacheFolder, "static");
        fsExtra.ensureDirSync(this.staticCacheFolder);

        this.cacheFile = path.join(this.cacheFolder, "deps.json");
        if (fs.existsSync(this.cacheFile)) {
            try {
                this.cachedDeps = require(this.cacheFile);
            } catch (e) {
                this.cachedDeps = {
                    tree: {},
                    flat: {},
                };
            }
        }
    }

    public setPermanentCache(key: string, contents: string) {
        key = encodeURIComponent(key);
        let filePath = path.join(this.permanentCacheFolder, key);
        fs.writeFile(filePath, contents, () => { });
        MEMORY_CACHE[filePath] = contents;
    }

    public getPermanentCache(key: string) {
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

    public getStaticCacheKey(file: File, type: string = "") {
        return encodeURIComponent(this.context.bundle.name + type + file.absPath);
    }

    public encodeCacheFileName(str: string) {
        let ext = path.extname(str);
        if (ext !== ".js") {
            str = str + ".js"
        }
        return encodeURIComponent(str);
    }

    /**
     *
     *
     * @param {File} file
     * @returns
     *
     * @memberOf ModuleCache
     */
    public getStaticCache(file: File, type: string = "") {
        if (file.ignoreCache) {
          return;
        }

        let stats = fs.statSync(file.absPath);
        let fileName = this.encodeCacheFileName(type + file.info.fuseBoxPath);
        let memCacheKey = this.getStaticCacheKey(file, type);
        let data;

        if (MEMORY_CACHE[memCacheKey]) {
            data = MEMORY_CACHE[memCacheKey];
            if (data.mtime !== stats.mtime.getTime()) {
                return;
            }
            return data;
        } else {
            let dest = path.join(this.staticCacheFolder, fileName);
            if (fs.existsSync(dest)) {
                try {
                    data = require(dest);
                } catch (e) {
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

    public getCSSCache(file: File) {
        if (file.ignoreCache){
            return;
        }
        let stats = fs.statSync(file.absPath);
        let fileName = this.encodeCacheFileName(file.info.fuseBoxPath);
        let memCacheKey = this.getStaticCacheKey(file);
        let data;

        if (MEMORY_CACHE[memCacheKey]) {
            data = MEMORY_CACHE[memCacheKey];
            if (data.mtime !== stats.mtime.getTime()) {
                return;
            }
            return data;
        } else {
            let dest = path.join(this.staticCacheFolder, fileName);
            if (fs.existsSync(dest)) {
                try {
                    data = require(dest);
                } catch (e) {
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

    /**
     *
     *
     * @param {File} file
     * @param {any} dependencies
     * @param {string} sourcemaps
     *
     * @memberOf ModuleCache
     */
    public writeStaticCache(file: File, sourcemaps: string, type: string = "") {
        if(file.ignoreCache){
            return;
        }
        let fileName = this.encodeCacheFileName(type + file.info.fuseBoxPath);
        let memCacheKey = this.getStaticCacheKey(file, type);
        let dest = path.join(this.staticCacheFolder, fileName);
        let stats: any = fs.statSync(file.absPath);

        let cacheData: any = {
            contents: file.contents,
            dependencies: file.analysis.dependencies,
            sourceMap: sourcemaps || {},
            headerContent: file.headerContent,
            mtime: stats.mtime.getTime(),
            _ : file.cacheData || {}
        };
        if (file.devLibsRequired) {
            cacheData.devLibsRequired = file.devLibsRequired;
        }
        let data = `module.exports = { contents: ${JSON.stringify(cacheData.contents)},
dependencies: ${JSON.stringify(cacheData.dependencies)},
sourceMap: ${JSON.stringify(cacheData.sourceMap)},
headerContent: ${JSON.stringify(cacheData.headerContent)},
mtime: ${cacheData.mtime},
devLibsRequired : ${JSON.stringify(cacheData.devLibsRequired)},
_ : ${JSON.stringify(cacheData._ || {})}
}
`;
        MEMORY_CACHE[memCacheKey] = cacheData;
        fs.writeFileSync(dest, data);
    }

    /**
     *
     *
     * @param {File[]} files
     * @returns {Promise<File[]>}
     *
     * @memberOf ModuleCache
     */
    public resolve(files: File[]): Promise<File[]> {
        let through: File[] = [];
        let valid4Caching = [];

        const moduleFileCollection = new Map<string, Map<string, File>>();
        files.forEach(file => {
            let info = file.info.nodeModuleInfo;
            if (!moduleFileCollection.get(info.name)) {
                moduleFileCollection.set(info.name, new Map<string, File>());
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
            } else {
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
                } else {
                    if (valid4Caching.indexOf(key) === -1) {
                        valid4Caching.push(key);
                    }
                }
            }
        });

        const required = [];
        const operations: Promise<any>[] = [];
        let cacheReset = false;
        /**
         *
         *
         * @param {any} err
         * @param {any} result
         * @returns
         */
        const getAllRequired = (key, json: any) => {
            if (required.indexOf(key) === -1) {
                if (json) {
                    let collection = new ModuleCollection(this.context, json.name);
                    let cacheKey = encodeURIComponent(key);
                    collection.cached = true;
                    collection.cachedName = key;
                    collection.cacheFile = path.join(this.cacheFolder, cacheKey);
                    operations.push(new Promise((resolve, reject) => {
                        if (MEMORY_CACHE[collection.cacheFile]) {
                            collection.cachedContent = MEMORY_CACHE[collection.cacheFile];
                            return resolve();
                        }
                        if (fs.existsSync(collection.cacheFile)) {
                            fs.readFile(collection.cacheFile, (err, result) => {
                                collection.cachedContent = result.toString();
                                MEMORY_CACHE[collection.cacheFile] = collection.cachedContent;
                                return resolve();
                            });
                        } else {
                            // reset cache
                            valid4Caching = [];
                            cacheReset = true;
                            return resolve();
                        }

                    }));
                    this.context.addNodeModule(key, collection);
                    required.push(key);
                    if (json.deps) {
                        for (let k in json.deps) { if (json.deps.hasOwnProperty(k)) { getAllRequired(k, json.deps[k]); } }
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

    /**
     *
     *
     * @param {ModuleCollection} rootCollection
     *
     * @memberOf ModuleCache
     */
    public buildMap(rootCollection: ModuleCollection) {
        let json = this.cachedDeps;
        /**
         *
         *
         * @param {Map<string, ModuleCollection>} modules
         * @param {*} root
         * @returns
         */
        /**
         *
         *
         * @param {ModuleCollection} collection
         * @returns
         */
        /**
         *
         *
         * @param {any} file
         */
        /**
         *
         *
         * @param {any} resolve
         * @param {any} reject
         * @returns
         */
        const traverse = (modules: Map<string, ModuleCollection>, root: any) => {
            return each(modules, (collection: ModuleCollection) => {
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
        //console.log("traverse...", rootCollection.nodeModules);
        traverse(rootCollection.nodeModules, json.tree).then(() => {
            fs.writeFile(this.cacheFile, JSON.stringify(json, undefined, 2), () => { });
        });
    }

    /**
     *
     *
     * @param {IPackageInformation} info
     * @param {string} contents
     * @returns
     *
     * @memberOf ModuleCache
     */
    public set(info: IPackageInformation, contents: string) {
        return new Promise((resolve, reject) => {
            const cacheKey = encodeURIComponent(`${info.name}@${info.version}`);
            const targetName = path.join(this.cacheFolder, cacheKey);

            // storing to memory
            MEMORY_CACHE[cacheKey] = contents;
            fs.writeFile(targetName, contents, (err) => {
                return resolve();
            });
        });
    }
}
