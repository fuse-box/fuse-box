"use strict";
const FileAST_1 = require('./FileAST');
const fs = require("fs");
const realm_utils_1 = require("realm-utils");
class File {
    constructor(context, info) {
        this.context = context;
        this.info = info;
        this.isLoaded = false;
        this.isNodeModuleEntry = false;
        this.isTypeScript = false;
        this.resolving = [];
        this.absPath = info.absPath;
    }
    getCrossPlatormPath() {
        let name = this.absPath;
        if (!name) {
            return;
        }
        name = name.replace(/\\/g, "/");
        return name;
    }
    tryPlugins(_ast) {
        if (this.context.plugins) {
            let target;
            let index = 0;
            while (!target && index < this.context.plugins.length) {
                let plugin = this.context.plugins[index];
                if (plugin.test.test(this.absPath)) {
                    target = plugin;
                }
                index++;
            }
            if (target) {
                if (realm_utils_1.utils.isFunction(target.transform)) {
                    let response = target.transform.apply(target, [this, _ast]);
                    if (realm_utils_1.utils.isPromise(response)) {
                        this.resolving.push(response);
                    }
                }
            }
        }
    }
    addHeaderContent(str) {
        if (!this.headerContent) {
            this.headerContent = [];
        }
        this.headerContent.push(str);
    }
    consume() {
        if (!this.absPath) {
            return [];
        }
        if (!fs.existsSync(this.info.absPath)) {
            this.contents = "";
            return [];
        }
        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;
        if (this.absPath.match(/\.ts$/)) {
            return this.handleTypescript();
        }
        if (this.absPath.match(/\.js$/)) {
            let fileAst = new FileAST_1.FileAST(this);
            fileAst.consume();
            this.tryPlugins(fileAst.ast);
            return fileAst.dependencies;
        }
        this.tryPlugins();
        return [];
    }
    handleTypescript() {
        if (this.context.useCache) {
            let cached = this.context.cache.getStaticCache(this);
            if (cached) {
                this.sourceMap = cached.sourceMap;
                this.contents = cached.contents;
                this.tryPlugins();
                return cached.dependencies;
            }
        }
        const ts = require("typescript");
        let result = ts.transpileModule(this.contents, this.context.getTypeScriptConfig());
        if (result.sourceMapText && this.context.sourceMapConfig) {
            let jsonSourceMaps = JSON.parse(result.sourceMapText);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = [this.info.fuseBoxPath.replace(/\.js$/, ".ts")];
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }
        this.contents = result.outputText;
        let fileAst = new FileAST_1.FileAST(this);
        fileAst.consume();
        if (this.context.useCache) {
            this.context.cache.writeStaticCache(this, fileAst.dependencies, this.sourceMap);
        }
        this.tryPlugins(fileAst.ast);
        return fileAst.dependencies;
    }
}
exports.File = File;
