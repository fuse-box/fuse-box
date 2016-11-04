"use strict";
const ModuleWrapper_1 = require("./ModuleWrapper");
const realm_utils_1 = require("realm-utils");
class CollectionSource {
    constructor(context) {
        this.context = context;
    }
    get(collection, depsOnly) {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                this.context.dump.log(collection.name, "[cached]", collection.cachedContent);
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
                let rpath = module.getProjectPath(entry, projectPath || entry.dir);
                if (!visited[rpath]) {
                    visited[rpath] = true;
                    if (module.isLoaded) {
                        let content = ModuleWrapper_1.ModuleWrapper.wrapGeneric(rpath, module.contents);
                        cnt.push(content);
                        this.context.dump.log(collection.name, rpath, content);
                    }
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
        return collectionResources(entry).then(() => {
            return ModuleWrapper_1.ModuleWrapper.wrapModule(collection.name, cnt.join("\n"), entry.isLoaded
                ? entry.getProjectPath() : undefined);
        });
    }
}
exports.CollectionSource = CollectionSource;
