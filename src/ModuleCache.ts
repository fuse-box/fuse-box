import { WorkFlowContext } from "./WorkflowContext";
import { IPackageInformation } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import * as fs from "fs";
import { File } from "./File"
import { Config } from "./Config";
import * as path from "path";
import { each } from "realm-utils";
const mkdirp = require("mkdirp");

/**
 * 
 * 
 * @export
 * @class ModuleCache
 */
export class ModuleCache {
    /**
     * 
     * 
     * @type {string}
     * @memberOf ModuleCache
     */
    public cacheFolder: string;
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
    /**
     * 
     * 
     * @private
     * 
     * @memberOf ModuleCache
     */
    private cachedDeps = {
        tree: {},
        flat: {}
    };

    /**
     * Creates an instance of ModuleCache.
     * 
     * @param {WorkFlowContext} context
     * 
     * @memberOf ModuleCache
     */
    constructor(public context: WorkFlowContext) {
        this.cacheFolder = path.join(Config.TEMP_FOLDER, "cache",
            Config.FUSEBOX_VERSION,
            encodeURIComponent(`${Config.PROJECT_FOLDER}${context.outFile || ""}`));


        this.staticCacheFolder = path.join(this.cacheFolder, "static");
        mkdirp.sync(this.staticCacheFolder);
        mkdirp.sync(this.cacheFolder);
        this.cacheFile = path.join(this.cacheFolder, "deps.json");
        if (fs.existsSync(this.cacheFile)) {
            this.cachedDeps = require(this.cacheFile);
        }
    }

    /**
     * 
     * 
     * @param {File} file
     * @returns
     * 
     * @memberOf ModuleCache
     */
    public getStaticCache(file: File) {

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

    /**
     * 
     * 
     * @param {File} file
     * @param {any} dependencies
     * @param {string} sourcemaps
     * 
     * @memberOf ModuleCache
     */
    public writeStaticCache(file: File, sourcemaps: string) {

        let fileName = encodeURIComponent(file.info.fuseBoxPath);
        let dest = path.join(this.staticCacheFolder, fileName);
        let stats: any = fs.statSync(file.absPath);
        let data = `module.exports = { contents : ${JSON.stringify(file.contents)}, 
dependencies : ${JSON.stringify(file.analysis.dependencies)}, 
sourceMap : ${JSON.stringify(sourcemaps || {})},
mtime : ${stats.mtime.getTime()}
};`;
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
        files.forEach(file => {
            let info = file.info.nodeModuleInfo;
            let key = `${info.name}@${info.version}`;
            let cached = this.cachedDeps.flat[key];
            if (!cached) {
                through.push(file);
            } else {

                if (cached.version !== info.version || cached.files.indexOf(file.info.fuseBoxPath) === -1) {

                    through.push(file);
                    let index = valid4Caching.indexOf(key);
                    if (index === -1) { valid4Caching.splice(index, 1); }
                } else {

                    if (valid4Caching.indexOf(key) === -1) {
                        valid4Caching.push(key);
                    }
                }
            }
        });
        let required = [];
        let operations: Promise<any>[] = [];

        /**
         * 
         * 
         * @param {any} err
         * @param {any} result
         * @returns
         */
        let getAllRequired = (key, json: any) => {
            if (required.indexOf(key) === -1) {
                let collection = new ModuleCollection(this.context, json.name);
                collection.cached = true;
                collection.cachedName = key;
                collection.cacheFile = path.join(this.cacheFolder, encodeURIComponent(key));

                operations.push(new Promise((resolve, reject) => {
                    if (fs.existsSync(collection.cacheFile)) {
                        fs.readFile(collection.cacheFile, (err, result) => {
                            collection.cachedContent = result.toString();
                            return resolve();
                        });
                    } else {
                        collection.cachedContent = "";
                        console.warn(`${collection.cacheFile} was not found`);
                        return resolve();
                    }

                }));
                this.context.addNodeModule(collection.cachedName, collection);
                required.push(key);
                if (json.deps) {
                    for (let k in json.deps) { if (json.deps.hasOwnProperty(k)) { getAllRequired(k, json.deps[k]); } }
                }
            }
        }
        valid4Caching.forEach(key => {

            getAllRequired(key, this.cachedDeps.tree[key]);
        });
        return Promise.all(operations).then(() => {
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
        let traverse = (modules: Map<string, ModuleCollection>, root: any) => {
            return each(modules, (collection: ModuleCollection) => {
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
                return new Promise((resolve, reject) => {
                    //  console.log(collection.nodeModules);
                    return resolve(traverse(collection.nodeModules, dependencies));

                });

            });
        }
        traverse(rootCollection.nodeModules, json.tree).then(() => {
            fs.writeFile(this.cacheFile, JSON.stringify(json, undefined, 2));
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

            let targetName = path.join(this.cacheFolder, encodeURIComponent(`${info.name}@${info.version}`));

            fs.writeFile(targetName, contents, (err) => {
                return resolve();
            });
        });
    }
}

