"use strict";
const fs = require('fs');
const Config_1 = require("./Config");
const path = require("path");
const Utils_1 = require("./Utils");
const mkdirp = require("mkdirp");
class ModuleCache {
    constructor() {
        this.cachedDeps = {};
        this.cacheFolder = path.join(Config_1.Config.TEMP_FOLDER, "cache", Config_1.Config.FUSEBOX_VERSION, encodeURIComponent(Config_1.Config.PROJECT_FOLDER));
        mkdirp.sync(this.cacheFolder);
        this.cacheFile = path.join(this.cacheFolder, "deps.json");
        if (fs.existsSync(this.cacheFile)) {
            this.cachedDeps = require(this.cacheFile);
        }
    }
    getValidCachedDependencies(name) {
        let packageInfo = Utils_1.getPackageInformation(name);
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
                        let nested = item.deps[depName];
                        collectDeps(nested);
                    }
                }
            };
            collectDeps(parentItems);
            return this.cachedDeps[name];
        }
        return false;
    }
    storeLocalDependencies(projectModules) {
        let iterate = (items) => {
            for (let name in items) {
                if (items.hasOwnProperty(name)) {
                    let item = items[name];
                    let info = Utils_1.getPackageInformation(name);
                    item.version = info.version;
                    item.name = name;
                    iterate(item.deps);
                }
            }
        };
        iterate(projectModules);
        fs.writeFileSync(this.cacheFile, JSON.stringify(projectModules));
    }
    set(name, contents) {
        let info = Utils_1.getPackageInformation(name);
        let version = info.version;
        let targetName = path.join(this.cacheFolder, `${name}-${version}`);
        fs.writeFile(targetName, contents, (err) => {
        });
    }
}
exports.ModuleCache = ModuleCache;
exports.cache = new ModuleCache();
