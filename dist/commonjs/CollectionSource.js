"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CollectionSource {
    constructor(context) {
        this.context = context;
    }
    get(collection) {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                this.context.source.addContent(collection.cachedContent);
                return resolve(collection.cachedContent);
            });
        }
        this.context.source.createCollection(collection);
        let files = this.filterFiles(collection.dependencies);
        this.context.source.startCollection(collection);
        files.forEach(f => {
            this.context.source.addFile(f);
        });
        return Promise.resolve(this.context.source.endCollection(collection));
    }
    filterFiles(files) {
        let filtered = [];
        files.forEach(file => {
            if (file.isFuseBoxBundle) {
                this.context.source.addContentToCurrentCollection(file.contents);
            }
            if (!file.info.isRemoteFile) {
                filtered.push(file);
            }
        });
        return filtered;
    }
}
exports.CollectionSource = CollectionSource;
