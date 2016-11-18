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
        return this.resolveFiles(collection.dependencies).then(cnt => {
            let entryFile = collection.entryFile;
            return ModuleWrapper_1.ModuleWrapper.wrapModule(collection.name, collection.conflictingVersions, cnt.join("\n"), entryFile ? entryFile.info.fuseBoxPath : "");
        });
    }
    resolveFiles(files) {
        let cnt = [];
        let promises = [];
        files.forEach(file => {
            file.resolving.forEach(p => {
                promises.push(p);
            });
        });
        return Promise.all(promises).then(() => {
            files.forEach(file => {
                let content = ModuleWrapper_1.ModuleWrapper.wrapFile(file);
                cnt.push(content);
            });
            return cnt;
        });
    }
}
exports.CollectionSource = CollectionSource;
