"use strict";
const WorkflowContext_1 = require("./WorkflowContext");
const ModuleCollector_1 = require("./ModuleCollector");
const CollectionSource_1 = require("./CollectionSource");
const ModuleCache_1 = require("./ModuleCache");
const Arithmetic_1 = require("./Arithmetic");
const ModuleWrapper_1 = require("./ModuleWrapper");
const ModuleCollection_1 = require("./ModuleCollection");
const path = require("path");
const realm_utils_1 = require("realm-utils");
const appRoot = require("app-root-path");
class FuseBox {
    constructor(opts) {
        this.opts = opts;
        this.context = new WorkflowContext_1.WorkFlowContext();
        this.timeStart = process.hrtime();
        this.collectionSource = new CollectionSource_1.CollectionSource(this.context);
        opts = opts || {};
        let homeDir = appRoot.path;
        if (opts.homeDir) {
            homeDir = path.isAbsolute(opts.homeDir) ? opts.homeDir : path.join(appRoot.path, opts.homeDir);
        }
        this.context.setHomeDir(homeDir);
        if (opts.logs) {
            this.context.setPrintLogs(opts.logs);
        }
        if (opts.cache !== undefined) {
            this.context.setUseCache(opts.cache);
        }
        this.virtualFiles = opts.fileCollection;
    }
    bundle(str, standalone) {
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
        let self = this;
        return bundleCollection.collectBundle(bundleData).then(module => {
            return realm_utils_1.chain(class extends realm_utils_1.Chainable {
                constructor() {
                    super(...arguments);
                    this.globalContents = [];
                }
                setDefaultCollection() {
                    let defaultCollection = new ModuleCollection_1.ModuleCollection(self.context, "default", module);
                    return defaultCollection;
                }
                addDefaultContents() {
                    return self.collectionSource.get(this.defaultCollection, true).then(cnt => {
                        this.globalContents.push(cnt);
                    });
                }
                setNodeModules() {
                    return ModuleCollector_1.moduleCollector(bundleCollection).then(data => {
                        return realm_utils_1.each(data.collections, (collection, name) => {
                            return self.collectionSource.get(collection).then(cnt => {
                                this.globalContents.push(cnt);
                                if (!collection.cachedContent && self.context.useCache) {
                                    ModuleCache_1.cache.set(name, cnt);
                                }
                            });
                        }).then(() => {
                            if (self.context.useCache) {
                                ModuleCache_1.cache.storeLocalDependencies(data.projectModules);
                            }
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
                let contents = result.contents.join("\n");
                if (this.context.printLogs) {
                    self.context.dump.printLog(this.timeStart);
                }
                return ModuleWrapper_1.ModuleWrapper.wrapFinal(contents, bundleData.entry, standalone);
            });
        });
    }
}
exports.FuseBox = FuseBox;
