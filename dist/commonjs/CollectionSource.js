"use strict";
const ModuleWrapper_1 = require("./ModuleWrapper");
class CollectionSource {
    constructor(context) {
        this.context = context;
    }
    get(collection) {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                return resolve(collection.cachedContent);
            });
        }
        let cnt = [];
        collection.dependencies.forEach(file => {
            this.context.dump.log(collection.name, file.info.fuseBoxPath, file.contents);
            let content = ModuleWrapper_1.ModuleWrapper.wrapGeneric(file.info.fuseBoxPath, file.contents);
            cnt.push(content);
        });
        return new Promise((resolve, reject) => {
            let entryFile = collection.entryFile;
            return resolve(ModuleWrapper_1.ModuleWrapper.wrapModule(collection.name, collection.conflictingVersions, cnt.join("\n"), entryFile ? entryFile.info.fuseBoxPath : ""));
        });
    }
}
exports.CollectionSource = CollectionSource;
