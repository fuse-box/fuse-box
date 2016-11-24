"use strict";
class CollectionSource {
    constructor(context) {
        this.context = context;
    }
    get(collection, withSourceMaps = false) {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                this.context.source.addContent(collection.cachedContent);
                return resolve(collection.cachedContent);
            });
        }
        this.context.source.startCollection(collection);
        return this.resolveFiles(collection.dependencies).then(cnt => {
            return this.context.source.endCollection(collection);
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
                if (!file.info.isRemoteFile) {
                    this.context.source.addFile(file);
                }
            });
            return cnt;
        });
    }
}
exports.CollectionSource = CollectionSource;
