"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileAnalysis_1 = require("../analysis/FileAnalysis");
const SourceMapGenerator_1 = require("./SourceMapGenerator");
const realm_utils_1 = require("realm-utils");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
class File {
    constructor(context, info) {
        this.context = context;
        this.info = info;
        this.isFuseBoxBundle = false;
        this.isLoaded = false;
        this.isNodeModuleEntry = false;
        this.isTypeScript = false;
        this.properties = new Map();
        this.analysis = new FileAnalysis_1.FileAnalysis(this);
        this.resolving = [];
        this.subFiles = [];
        this.groupMode = false;
        if (info.params) {
            this.params = info.params;
        }
        this.absPath = info.absPath;
    }
    static createByName(collection, name) {
        let info = {
            fuseBoxPath: name,
            absPath: name,
        };
        let file = new File(collection.context, info);
        file.collection = collection;
        return file;
    }
    static createModuleReference(collection, packageInfo) {
        let info = {
            fuseBoxPath: name,
            absPath: name,
            isNodeModule: true,
            nodeModuleInfo: packageInfo,
        };
        let file = new File(collection.context, info);
        file.collection = collection;
        return file;
    }
    addProperty(key, obj) {
        this.properties.set(key, obj);
    }
    getProperty(key) {
        return this.properties.get(key);
    }
    hasSubFiles() {
        return this.subFiles.length > 0;
    }
    addSubFile(file) {
        this.subFiles.push(file);
    }
    getCrossPlatormPath() {
        let name = this.absPath;
        if (!name) {
            return;
        }
        name = name.replace(/\\/g, "/");
        return name;
    }
    tryTypescriptPlugins() {
        if (this.context.plugins) {
            this.context.plugins.forEach((plugin) => {
                if (realm_utils_1.utils.isFunction(plugin.onTypescriptTransform)) {
                    plugin.onTypescriptTransform(this);
                }
            });
        }
    }
    tryPlugins(_ast) {
        if (this.context.plugins) {
            let target;
            let index = 0;
            while (!target && index < this.context.plugins.length) {
                let item = this.context.plugins[index];
                let itemTest;
                if (Array.isArray(item)) {
                    let el = item[0];
                    if (el && typeof el.test === "function") {
                        itemTest = el;
                    }
                    else {
                        itemTest = el.test;
                    }
                }
                else {
                    itemTest = item.test;
                }
                if (itemTest && realm_utils_1.utils.isFunction(itemTest.test) && itemTest.test(path.relative(appRoot.path, this.absPath))) {
                    target = item;
                }
                index++;
            }
            const tasks = [];
            if (target) {
                if (Array.isArray(target)) {
                    target.forEach(plugin => {
                        if (realm_utils_1.utils.isFunction(plugin.transform)) {
                            this.context.debugPlugin(plugin, `Captured ${this.info.fuseBoxPath}`);
                            tasks.push(() => plugin.transform.apply(plugin, [this]));
                        }
                    });
                }
                else {
                    if (realm_utils_1.utils.isFunction(target.transform)) {
                        this.context.debugPlugin(target, `Captured ${this.info.fuseBoxPath}`);
                        tasks.push(() => target.transform.apply(target, [this]));
                    }
                }
            }
            return this.context.queue(realm_utils_1.each(tasks, promise => promise()));
        }
    }
    addHeaderContent(str) {
        if (!this.headerContent) {
            this.headerContent = [];
        }
        this.headerContent.push(str);
    }
    loadContents() {
        if (this.isLoaded) {
            return;
        }
        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;
    }
    makeAnalysis(parserOptions) {
        if (!this.analysis.astIsLoaded()) {
            this.analysis.parseUsingAcorn(parserOptions);
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
            this.context.debug("Typescript", `Captured  ${this.info.fuseBoxPath}`);
            return this.handleTypescript();
        }
        if (/\.js(x)?$/.test(this.absPath)) {
            this.loadContents();
            this.tryPlugins();
            const vendorSourceMaps = this.context.sourceMapConfig
                && this.context.sourceMapConfig.vendor === true && this.collection.name !== this.context.defaultPackageName;
            if (vendorSourceMaps) {
                this.loadVendorSourceMap();
            }
            else {
                this.makeAnalysis();
            }
            return;
        }
        this.tryPlugins();
        if (!this.isLoaded) {
            throw { message: `File contents for ${this.absPath} were not loaded. Missing a plugin?` };
        }
    }
    loadVendorSourceMap() {
        const key = `vendor/${this.collection.name}/${this.info.fuseBoxPath}`;
        this.context.debug("File", `Vendor sourcemap ${key}`);
        let cachedMaps = this.context.cache.getPermanentCache(key);
        if (cachedMaps) {
            this.sourceMap = cachedMaps;
            this.makeAnalysis();
        }
        else {
            const tokens = [];
            this.makeAnalysis({ onToken: tokens });
            SourceMapGenerator_1.SourceMapGenerator.generate(this, tokens);
            this.generateCorrectSourceMap(key);
            this.context.cache.setPermanentCache(key, this.sourceMap);
        }
    }
    handleTypescript() {
        const debug = (str) => this.context.debug("TypeScript", str);
        if (this.context.useCache) {
            let cached = this.context.cache.getStaticCache(this);
            if (cached) {
                this.isLoaded = true;
                this.sourceMap = cached.sourceMap;
                this.contents = cached.contents;
                if (cached.headerContent) {
                    this.headerContent = cached.headerContent;
                }
                debug(`From cache ${this.info.fuseBoxPath}`);
                this.analysis.dependencies = cached.dependencies;
                this.tryPlugins();
                return;
            }
        }
        const ts = require("typescript");
        this.loadContents();
        this.tryTypescriptPlugins();
        debug(`Transpile ${this.info.fuseBoxPath}`);
        let result = ts.transpileModule(this.contents, this.getTranspilationConfig());
        if (result.sourceMapText && this.context.sourceMapConfig) {
            let jsonSourceMaps = JSON.parse(result.sourceMapText);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = [this.info.fuseBoxPath.replace(/\.js(x?)$/, ".ts$1")];
            result.outputText = result.outputText.replace("//# sourceMappingURL=module.js.map", "");
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }
        this.contents = result.outputText;
        this.makeAnalysis();
        this.tryPlugins();
        if (this.context.useCache) {
            this.context.emitJavascriptHotReload(this);
            this.context.cache.writeStaticCache(this, this.sourceMap);
        }
    }
    generateCorrectSourceMap(fname) {
        if (this.sourceMap) {
            let jsonSourceMaps = JSON.parse(this.sourceMap);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = [fname || this.info.fuseBoxPath];
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }
        return this.sourceMap;
    }
    getTranspilationConfig() {
        return Object.assign({}, this.context.getTypeScriptConfig(), {
            fileName: this.info.absPath,
        });
    }
}
exports.File = File;
