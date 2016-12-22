"use strict";
const PluginChain_1 = require("./PluginChain");
const FileAnalysis_1 = require("./FileAnalysis");
const fs = require("fs");
const realm_utils_1 = require("realm-utils");
class File {
    constructor(context, info) {
        this.context = context;
        this.info = info;
        this.isFuseBoxBundle = false;
        this.isLoaded = false;
        this.isNodeModuleEntry = false;
        this.isTypeScript = false;
        this.analysis = new FileAnalysis_1.FileAnalysis(this);
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
    createChain(name, file, opts) {
        return new PluginChain_1.PluginChain(name, file, opts);
    }
    tryPlugins(_ast) {
        if (this.context.plugins) {
            let target;
            let index = 0;
            while (!target && index < this.context.plugins.length) {
                let plugin = this.context.plugins[index];
                if (plugin.test && plugin.test.test(this.absPath)) {
                    target = plugin;
                }
                index++;
            }
            let tranformationResult;
            if (target) {
                if (realm_utils_1.utils.isFunction(target.transform)) {
                    tranformationResult = target.transform.apply(target, [this, _ast]);
                }
            }
            if (realm_utils_1.utils.isPromise(tranformationResult)) {
                this.resolving.push(new Promise((resolve, reject) => {
                    tranformationResult.then(res => {
                        if (res instanceof PluginChain_1.PluginChain) {
                            this.chainPlugins(index, res);
                        }
                        return resolve(res);
                    }).catch(reject);
                }));
            }
            else {
                if (tranformationResult instanceof PluginChain_1.PluginChain) {
                    this.chainPlugins(index, tranformationResult);
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
    loadContents() {
        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;
    }
    makeAnalysis() {
        if (!this.analysis.astIsLoaded()) {
            this.analysis.parseUsingAcorn();
        }
        this.analysis.analyze();
    }
    consume() {
        if (this.info.isRemoteFile) {
            return;
        }
        if (!this.absPath) {
            return;
        }
        if (!fs.existsSync(this.info.absPath)) {
            this.notFound = true;
            return;
        }
        if (/\.ts(x)?$/.test(this.absPath)) {
            return this.handleTypescript();
        }
        if (/\.js(x)?$/.test(this.absPath)) {
            this.loadContents();
            this.tryPlugins();
            this.makeAnalysis();
            return;
        }
        this.tryPlugins();
    }
    handleTypescript() {
        if (this.context.useCache) {
            let cached = this.context.cache.getStaticCache(this);
            if (cached) {
                this.isLoaded = true;
                this.sourceMap = cached.sourceMap;
                this.contents = cached.contents;
                this.analysis.dependencies = cached.dependencies;
                this.tryPlugins();
                return;
            }
        }
        const ts = require("typescript");
        this.loadContents();
        let result = ts.transpileModule(this.contents, this.context.getTypeScriptConfig());
        if (result.sourceMapText && this.context.sourceMapConfig) {
            let jsonSourceMaps = JSON.parse(result.sourceMapText);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = [this.info.fuseBoxPath.replace(/\.js$/, ".ts")];
            result.outputText = result.outputText.replace("//# sourceMappingURL=module.js.map", "");
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }
        this.contents = result.outputText;
        this.makeAnalysis();
        if (this.context.useCache) {
            this.context.cache.writeStaticCache(this, this.sourceMap);
        }
        this.tryPlugins();
    }
    chainPlugins(start, chain) {
        chain.setContext(this.context);
        let total = this.context.plugins.length;
        for (let i = start; i < total; i++) {
            let plugin = this.context.plugins[i];
            if (realm_utils_1.utils.isFunction(plugin[chain.methodName])) {
                plugin[chain.methodName](chain);
            }
        }
    }
}
exports.File = File;
