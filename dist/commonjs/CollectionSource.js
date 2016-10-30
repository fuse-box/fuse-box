"use strict";
const ModuleWrapper_1 = require("./ModuleWrapper");
const realm_utils_1 = require("realm-utils");
class CollectionSource {
    constructor(dump) {
        this.dump = dump;
    }
    get(collection, depsOnly) {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                this.dump.log(collection.name, "[cached]", collection.cachedContent);
                return resolve(collection.cachedContent);
            });
        }
        let entry = collection.entry;
        if (!entry) {
            return new Promise((resolve, reject) => {
                return resolve(ModuleWrapper_1.ModuleWrapper.wrapModule(collection.name, "", collection.name));
            });
        }
        let visited = {};
        let cnt = [];
        let collectionResources = (module, projectPath) => {
            return new Promise((resolve, reject) => {
                if (!module) {
                    return resolve();
                }
                let rpath = module.getProjectPath(entry, entry.dir);
                if (!visited[rpath]) {
                    visited[rpath] = true;
                    let content = ModuleWrapper_1.ModuleWrapper.wrapGeneric(rpath, module.contents);
                    this.dump.log(collection.name, rpath, content);
                    cnt.push(content);
                    return realm_utils_1.each(module.dependencies, dep => {
                        return collectionResources(dep);
                    }).then(resolve).catch(reject);
                }
                return resolve();
            });
        };
        if (depsOnly) {
            return realm_utils_1.each(entry.dependencies, dep => {
                return collectionResources(dep, entry.dir);
            }).then(result => {
                return ModuleWrapper_1.ModuleWrapper.wrapModule(collection.name, cnt.join("\n"));
            });
        }
        return collectionResources(entry).then(result => {
            return ModuleWrapper_1.ModuleWrapper.wrapModule(collection.name, cnt.join("\n"), entry.getProjectPath());
        });
    }
}
exports.CollectionSource = CollectionSource;
