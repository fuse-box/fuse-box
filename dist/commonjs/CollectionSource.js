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
        this.context.source.createCollection(collection);
        return this.resolveFiles(collection.dependencies).then(files => {
            this.context.source.startCollection(collection);
            files.forEach(f => {
                this.context.source.addFile(f);
            });
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
            let filtered = [];
            files.forEach(file => {
                if (file.isFuseBoxBundle) {
                    this.context.source.addContentToCurrentCollection(file.contents);
                }
                else {
                    if (!file.info.isRemoteFile) {
                        filtered.push(file);
                    }
                }
            });
            return filtered;
        });
    }
}
exports.CollectionSource = CollectionSource;
