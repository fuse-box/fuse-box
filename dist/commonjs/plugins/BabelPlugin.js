"use strict";
let babelCore;
class BabelPluginClass {
    constructor(opts) {
        this.test = /(\.js|\.jsx)$/;
        this.config = {};
        opts = opts || {};
        if (opts.config !== undefined) {
            this.config = opts.config;
        }
        if (opts.test !== undefined) {
            this.test = opts.test;
        }
    }
    init(context) {
        this.context = context;
        context.allowExtension(".jsx");
    }
    transform(file, ast) {
        return new Promise((resolve, reject) => {
            if (!babelCore) {
                babelCore = require("babel-core");
            }
            if (this.context.useCache) {
                let cached = this.context.cache.getStaticCache(file);
                if (cached) {
                    if (cached.sourceMap) {
                        file.sourceMap = cached.sourceMap;
                    }
                    file.contents = cached.contents;
                    return resolve();
                }
            }
            let result = babelCore.transform(file.contents, this.config);
            if (result.map && file.collection.name === "default") {
                file.contents = result.code;
                let sm = result.map;
                sm.file = file.info.fuseBoxPath;
                sm.sources = [file.info.fuseBoxPath];
                file.sourceMap = JSON.stringify(sm);
            }
            if (this.context.useCache) {
                this.context.cache.writeStaticCache(file, file.sourceMap);
            }
            return resolve();
        });
    }
}
exports.BabelPluginClass = BabelPluginClass;
;
exports.BabelPlugin = (opts) => {
    return new BabelPluginClass(opts);
};
