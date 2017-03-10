"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acorn = require("acorn");
const SourceMap = require("source-map");
class SourceMapPlainJsPluginClass {
    constructor(options) {
        this.test = /\.js$/;
        this.ext = ".js";
        options = options || {};
        if ("test" in options)
            this.test = options.test;
        if ("ext" in options)
            this.ext = options.ext;
    }
    init(context) {
        this.context = context;
        context.allowExtension(this.ext);
    }
    transform(file) {
        const tokens = [];
        if (this.context.useCache) {
            const cached = this.context.cache.getStaticCache(file);
            if (cached) {
                if (cached.sourceMap) {
                    file.sourceMap = cached.sourceMap;
                }
                file.analysis.skip();
                file.analysis.dependencies = cached.dependencies;
                file.contents = cached.contents;
                return true;
            }
        }
        file.loadContents();
        if ("sourceMapConfig" in this.context) {
            file.makeAnalysis({ onToken: tokens });
            file.sourceMap = this.getSourceMap(file, tokens);
        }
        else {
            file.makeAnalysis();
        }
    }
    getSourceMap(file, tokens) {
        const fileContent = file.contents;
        const filePath = file.info.fuseBoxPath;
        const smGenerator = new SourceMap.SourceMapGenerator({ file: filePath });
        tokens.some(token => {
            if (token.type.label === "eof")
                return true;
            const lineInfo = acorn.getLineInfo(fileContent, token.start);
            const mapping = {
                original: lineInfo,
                generated: lineInfo,
                source: filePath,
                name: false,
            };
            if (token.type.label === "name")
                mapping.name = token.value;
            smGenerator.addMapping(mapping);
        });
        smGenerator.setSourceContent(filePath, fileContent);
        return JSON.stringify(smGenerator.toJSON());
    }
}
exports.SourceMapPlainJsPluginClass = SourceMapPlainJsPluginClass;
exports.SourceMapPlainJsPlugin = (options) => {
    return new SourceMapPlainJsPluginClass(options);
};
