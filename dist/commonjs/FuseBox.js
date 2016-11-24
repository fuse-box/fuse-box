"use strict";
const HTMLplugin_1 = require("./plugins/HTMLplugin");
const JSONplugin_1 = require("./plugins/JSONplugin");
const PathMaster_1 = require("./PathMaster");
const WorkflowContext_1 = require("./WorkflowContext");
const CollectionSource_1 = require("./CollectionSource");
const Arithmetic_1 = require("./Arithmetic");
const ModuleCollection_1 = require("./ModuleCollection");
const path = require("path");
const realm_utils_1 = require("realm-utils");
const appRoot = require("app-root-path");
class FuseBox {
    constructor(opts) {
        this.opts = opts;
        this.context = new WorkflowContext_1.WorkFlowContext();
        this.collectionSource = new CollectionSource_1.CollectionSource(this.context);
        opts = opts || {};
        let homeDir = appRoot.path;
        if (opts.homeDir) {
            homeDir = path.isAbsolute(opts.homeDir) ? opts.homeDir : path.join(appRoot.path, opts.homeDir);
        }
        if (opts.modulesFolder) {
            this.context.customModulesFolder =
                path.isAbsolute(opts.modulesFolder)
                    ? opts.modulesFolder : path.join(appRoot.path, opts.modulesFolder);
        }
        if (opts.tsConfig) {
            this.context.tsConfig = opts.tsConfig;
        }
        this.context.plugins = opts.plugins || [HTMLplugin_1.HTMLPlugin, JSONplugin_1.JSONPlugin];
        if (opts.cache !== undefined) {
            this.context.useCache = opts.cache ? true : false;
        }
        if (opts.log !== undefined) {
            this.context.doLog = opts.log ? true : false;
        }
        if (opts.globals) {
            this.context.globals = [].concat(opts.globals);
        }
        if (opts.standaloneBundle !== undefined) {
            this.context.standaloneBundle = opts.standaloneBundle;
        }
        if (opts.sourceMap) {
            this.context.sourceMapConfig = opts.sourceMap;
        }
        if (opts.outFile) {
            this.context.outFile = opts.outFile;
        }
        this.context.setHomeDir(homeDir);
        if (opts.cache !== undefined) {
            this.context.setUseCache(opts.cache);
        }
        this.virtualFiles = opts.files;
    }
    triggerStart() {
        this.context.plugins.forEach(plugin => {
            if (realm_utils_1.utils.isFunction(plugin.bundleStart)) {
                plugin.bundleStart(this.context);
            }
        });
    }
    triggerEnd() {
        this.context.plugins.forEach(plugin => {
            if (realm_utils_1.utils.isFunction(plugin.bundleEnd)) {
                plugin.bundleEnd(this.context);
            }
        });
    }
    bundle(str, standalone) {
        this.context.reset();
        this.triggerStart();
        let parser = Arithmetic_1.Arithmetic.parse(str);
        let bundle;
        return Arithmetic_1.Arithmetic.getFiles(parser, this.virtualFiles, this.context.homeDir).then(data => {
            bundle = data;
            return this.process(data, standalone);
        }).then((contents) => {
            bundle.finalize();
            return contents;
        }).catch(e => {
            console.log(e.stack || e);
        });
    }
    process(bundleData, standalone) {
        let bundleCollection = new ModuleCollection_1.ModuleCollection(this.context, "default");
        bundleCollection.pm = new PathMaster_1.PathMaster(this.context, bundleData.homeDir);
        if (bundleData.typescriptMode) {
            this.context.tsMode = true;
            bundleCollection.pm.setTypeScriptMode();
        }
        let self = this;
        return bundleCollection.collectBundle(bundleData).then(module => {
            return realm_utils_1.chain(class extends realm_utils_1.Chainable {
                constructor() {
                    super(...arguments);
                    this.globalContents = [];
                }
                setDefaultCollection() {
                    return bundleCollection;
                }
                addDefaultContents() {
                    return self.collectionSource.get(this.defaultCollection).then((cnt) => {
                        self.context.log.echoDefaultCollection(this.defaultCollection, cnt);
                    });
                }
                addNodeModules() {
                    return realm_utils_1.each(self.context.nodeModules, (collection) => {
                        return self.collectionSource.get(collection).then((cnt) => {
                            self.context.log.echoCollection(collection, cnt);
                            if (!collection.cachedName) {
                                self.context.cache.set(collection.info, cnt);
                            }
                            this.globalContents.push(cnt);
                        });
                    });
                }
                format() {
                    return {
                        contents: this.globalContents,
                    };
                }
            }
            ).then(result => {
                self.context.log.end();
                this.triggerEnd();
                self.context.source.finalize(bundleData);
                this.context.writeOutput();
                return self.context.source.getResult();
            });
        });
    }
}
exports.FuseBox = FuseBox;
