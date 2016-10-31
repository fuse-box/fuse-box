"use strict";
const ModuleCollector_1 = require("./ModuleCollector");
const Dump_1 = require("./Dump");
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
        this.dump = new Dump_1.FuseBoxDump();
        this.printLogs = true;
        this.timeStart = process.hrtime();
        this.collectionSource = new CollectionSource_1.CollectionSource(this.dump);
        opts = opts || {};
        if (!opts.homeDir) {
            this.homeDir = appRoot.path;
        }
        else {
            this.homeDir = path.isAbsolute(opts.homeDir) ? opts.homeDir : path.join(appRoot.path, opts.homeDir);
        }
        if (opts.logs) {
            this.printLogs = opts.logs;
        }
        this.virtualFiles = opts.fileCollection;
    }
    ;
    bundle(str, standalone) {
        let parser = Arithmetic_1.Arithmetic.parse(str);
        let bundle;
        return Arithmetic_1.Arithmetic.getFiles(parser, this.virtualFiles, this.homeDir).then(data => {
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
        let bundleCollection = new ModuleCollection_1.ModuleCollection("default");
        let self = this;
        return bundleCollection.collectBundle(bundleData).then(module => {
            return realm_utils_1.chain(class extends realm_utils_1.Chainable {
                constructor() {
                    super(...arguments);
                    this.globalContents = [];
                }
                setDefaultCollection() {
                    let defaultCollection = new ModuleCollection_1.ModuleCollection("default", module);
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
                            });
                        }).then(() => {
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
                if (this.printLogs) {
                    this.dump.printLog(this.timeStart);
                }
                return ModuleWrapper_1.ModuleWrapper.wrapFinal(result.contents.join("\n"), bundleData.entry, standalone);
            });
        });
    }
}
exports.FuseBox = FuseBox;
