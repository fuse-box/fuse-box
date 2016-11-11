import { WorkFlowContext } from "./WorkflowContext";
import { IPackageInformation } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import * as fs from "fs";
import { File } from "./File"
import { Config } from "./Config";
import * as path from "path";
const mkdirp = require("mkdirp");

export class ModuleCache {
    public cacheFolder: string;
    private cacheFile: string;
    private cachedDeps = {
        tree: {},
        flat: {}
    };

    constructor(public context: WorkFlowContext) {
        this.cacheFolder = path.join(Config.TEMP_FOLDER, "cache",
            Config.FUSEBOX_VERSION, encodeURIComponent(Config.PROJECT_FOLDER));
        mkdirp.sync(this.cacheFolder);
        this.cacheFile = path.join(this.cacheFolder, "deps.json");
        if (fs.existsSync(this.cacheFile)) {
            this.cachedDeps = require(this.cacheFile);
        }
    }

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
                    if (valid4Caching.indexOf(key) === -1) { valid4Caching.push(key); }
                }
            }
        });
        let required = [];
        let operations: Promise<any>[] = [];

        let getAllRequired = (key, json: any) => {
            if (required.indexOf(key) === -1) {
                let collection = new ModuleCollection(this.context, json.name);
                collection.cached = true;
                collection.cachedName = key;
                collection.cacheFile = path.join(this.cacheFolder, key);
                operations.push(new Promise((resolve, reject) => {
                    fs.readFile(collection.cacheFile, (err, result) => {
                        collection.cachedContent = result.toString();
                        return resolve();
                    });
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

    public buildMap(rootCollection: ModuleCollection) {
        let json = this.cachedDeps;
        let traverse = (modules: Map<string, ModuleCollection>, root: any) => {
            modules.forEach(collection => {
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
        }
        traverse(rootCollection.nodeModules, json.tree);
        fs.writeFile(this.cacheFile, JSON.stringify(json, undefined, 2));
    }


    public set(info: IPackageInformation, contents: string) {
        return new Promise((resolve, reject) => {
            let targetName = path.join(this.cacheFolder, `${info.name}@${info.version}`);
            fs.writeFile(targetName, contents, (err) => {
                return resolve();
            });
        });
    }
}

