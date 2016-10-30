import * as fs from 'fs';
import { Config } from "./Config";
import * as path from "path";
import { getPackageInformation } from "./Utils";
const mkdirp = require("mkdirp");

export class ModuleCache {
    public cacheFolder: string;
    private cacheFile: string;
    private cachedDeps = {};

    constructor() {
        this.cacheFolder = path.join(Config.TEMP_FOLDER, "cache",
            Config.FUSEBOX_VERSION, Config.PROJECT_FOLDER.replace(/\/|\\/g, "_"));
        mkdirp.sync(this.cacheFolder);
        this.cacheFile = path.join(this.cacheFolder, "deps.json");
        if (fs.existsSync(this.cacheFile)) {
            this.cachedDeps = require(this.cacheFile);
        }
    }
    public getValidCachedDependencies(name: string) {

        let packageInfo = getPackageInformation(name);
        if (!this.cachedDeps[name]) {
            return false;
        }
        if (this.cachedDeps[name].version === packageInfo.version) {
            let parentItems = this.cachedDeps[name];
            let collectDeps = (item) => {
                let targetName = path.join(this.cacheFolder, `${item.name}-${item.version}`);
                item.cache = fs.readFileSync(targetName).toString();
                for (let depName in item.deps) {
                    if (item.deps.hasOwnProperty(depName)) {
                        let nested = item.deps[depName]
                        collectDeps(nested);
                    }
                }
            }
            collectDeps(parentItems);
            return this.cachedDeps[name];
        }
        return false;
    }

    public storeLocalDependencies(projectModules) {
        let iterate = (items) => {
            for (let name in items) {
                if (items.hasOwnProperty(name)) {
                    let item = items[name];
                    let info = getPackageInformation(name);
                    item.version = info.version;
                    item.name = name;
                    iterate(item.deps);
                }
            }
        };
        iterate(projectModules);
        fs.writeFileSync(this.cacheFile, JSON.stringify(projectModules));
    }

    public set(name: string, contents: string) {
        let info = getPackageInformation(name);
        let version = info.version;
        let targetName = path.join(this.cacheFolder, `${name}-${version}`);
        fs.writeFileSync(targetName, contents);
    }
}
export let cache = new ModuleCache();