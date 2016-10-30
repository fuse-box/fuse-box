"use strict";
const realm_utils_1 = require("realm-utils");
exports.moduleCollector = (defaultCollection) => {
    let modules = new Map();
    let rootModules = {};
    let collect = (nodeModules, root) => {
        return realm_utils_1.each(nodeModules, (collection, name) => {
            let currentRoot = {};
            root[name] = { deps: currentRoot };
            if (!modules.has(name)) {
                modules.set(name, collection);
                if (collection.nodeModules.size > 0) {
                    return new Promise((resolve, reject) => {
                        process.nextTick(() => {
                            return resolve(collect(collection.nodeModules, currentRoot));
                        });
                    });
                }
            }
        });
    };
    return collect(defaultCollection.nodeModules, rootModules).then(x => {
        return {
            projectModules: rootModules,
            collections: modules,
        };
    });
};
