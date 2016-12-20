"use strict";
let babelCore;
class BabelPluginClass {
    constructor(opts) {
        this.test = /\.js(x)?$/;
        this.limit2project = true;
        this.config = {};
        opts = opts || {};
        if (opts.config !== undefined) {
            this.config = opts.config;
        }
        if (opts.test !== undefined) {
            this.test = opts.test;
        }
        if (opts.limit2project !== undefined) {
            this.limit2project = opts.limit2project;
        }
    }
    init(context) {
        this.context = context;
        context.allowExtension(".jsx");
    }
    transform(file, ast) {
        if (!babelCore) {
            babelCore = require("babel-core");
        }
        if (this.context.useCache) {
            let cached = this.context.cache.getStaticCache(file);
            if (cached) {
                if (cached.sourceMap) {
                    file.sourceMap = cached.sourceMap;
                }
                file.analysis.skip();
                file.analysis.dependencies = cached.dependencies;
                file.contents = cached.contents;
                return;
            }
        }
        let result = babelCore.transform(file.contents, this.config);
        let pass = result.map
            && (this.limit2project && file.collection.name === "default");
        if (pass) {
            file.analysis.loadAst(result.ast);
            file.analysis.analyze();
            file.contents = result.code;
            let sm = result.map;
            sm.file = file.info.fuseBoxPath;
            sm.sources = [file.info.fuseBoxPath];
            file.sourceMap = JSON.stringify(sm);
            if (this.context.useCache) {
                this.context.cache.writeStaticCache(file, file.sourceMap);
            }
        }
    }
}
exports.BabelPluginClass = BabelPluginClass;
;
exports.BabelPlugin = (opts) => {
    return new BabelPluginClass(opts);
};
