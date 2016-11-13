"use strict";
const PathMaster_1 = require("./PathMaster");
const WorkflowContext_1 = require("./WorkflowContext");
const CollectionSource_1 = require("./CollectionSource");
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
        if (opts.plugins) {
            this.context.plugins = opts.plugins;
        }
        this.context.setHomeDir(homeDir);
        if (opts.cache !== undefined) {
            this.context.setUseCache(opts.cache);
        }
        this.virtualFiles = opts.fileCollection;
    }
    bundle(str, standalone) {
        this.context.reset();
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
                        self.context.log.echoCollection(this.defaultCollection, cnt);
                        this.globalContents.push(cnt);
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
                let contents = result.contents.join("\n");
                console.log("");
                if (this.context.printLogs) {
                    self.context.log.end();
                }
                return ModuleWrapper_1.ModuleWrapper.wrapFinal(contents, bundleData.entry, standalone);
            });
        });
    }
}
exports.FuseBox = FuseBox;
