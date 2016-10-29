"use strict";
const Arithmetic_1 = require("./Arithmetic");
const ModuleWrapper_1 = require("./ModuleWrapper");
const ModuleCollection_1 = require("./ModuleCollection");
const path = require("path");
const realm_utils_1 = require("realm-utils");
const appRoot = require("app-root-path");
const prettyTime = require("pretty-time");
const ansi = require("ansi");
const cursor = ansi(process.stdout);
const prettysize = require("prettysize");
class FuseBox {
    constructor(opts) {
        this.opts = opts;
        this.dump = new FuseBoxDump();
        this.printLogs = true;
        this.timeStart = process.hrtime();
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
                    return self.getCollectionSource(this.defaultCollection, true).then(cnt => {
                        this.globalContents.push(cnt);
                    });
                }
                setNodeModules() {
                    return self.collectNodeModules(bundleCollection).then(nodeModules => {
                        return realm_utils_1.each(nodeModules, (collection, name) => {
                            return self.getCollectionSource(collection).then(cnt => {
                                this.globalContents.push(cnt);
                            });
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
                return ModuleWrapper_1.ModuleWrapper.wrapFinal(result.contents, bundleData.entry, standalone);
            });
        });
    }
    getCollectionSource(collection, depsOnly, entryPoint) {
        let entry = collection.entry;
        if (!entry) {
            return new Promise((resolve, reject) => {
                return resolve(ModuleWrapper_1.ModuleWrapper.wrapModule(collection.name, "", collection.name));
            });
        }
        let visited = {};
        let cnt = [];
        let collectionResources = (module, projectPath) => {
            return new Promise((resolve, reject) => {
                if (!module) {
                    return resolve();
                }
                let rpath = module.getProjectPath(entry, entry.dir);
                if (!visited[rpath]) {
                    visited[rpath] = true;
                    let content = ModuleWrapper_1.ModuleWrapper.wrapGeneric(rpath, module.contents);
                    this.dump.log(collection.name, rpath, content);
                    cnt.push(content);
                    return realm_utils_1.each(module.dependencies, dep => {
                        return collectionResources(dep);
                    }).then(resolve).catch(reject);
                }
                return resolve();
            });
        };
        if (depsOnly) {
            return realm_utils_1.each(entry.dependencies, dep => {
                return collectionResources(dep, entry.dir);
            }).then(result => {
                return ModuleWrapper_1.ModuleWrapper.wrapModule(collection.name, cnt.join("\n"), entryPoint);
            });
        }
        return collectionResources(entry).then(result => {
            return ModuleWrapper_1.ModuleWrapper.wrapModule(collection.name, cnt.join("\n"), entry.getProjectPath());
        });
    }
    collectNodeModules(defaultCollection) {
        let modules = new Map();
        let collect = (nodeModules) => {
            return realm_utils_1.each(nodeModules, (collection, name) => {
                if (!modules.has(name)) {
                    modules.set(name, collection);
                    if (collection.nodeModules.size > 0) {
                        return new Promise((resolve, reject) => {
                            process.nextTick(() => {
                                return resolve(collect(collection.nodeModules));
                            });
                        });
                    }
                }
            });
        };
        return collect(defaultCollection.nodeModules).then(x => modules);
    }
}
exports.FuseBox = FuseBox;
class FuseBoxDump {
    constructor() {
        this.modules = {};
    }
    log(moduleName, file, contents) {
        if (!this.modules[moduleName]) {
            this.modules[moduleName] = [];
        }
        let byteAmount = Buffer.byteLength(contents, "utf8");
        this.modules[moduleName].push({
            name: file,
            bytes: byteAmount,
        });
    }
    printLog(endTime) {
        let total = 0;
        for (let name in this.modules) {
            if (this.modules.hasOwnProperty(name)) {
                cursor.green().write(name).write("\n").reset();
                for (let i = 0; i < this.modules[name].length; i++) {
                    let item = this.modules[name][i];
                    total += item.bytes;
                    cursor.grey().write(`  ${item.name} (${prettysize(item.bytes)})`).write("\n").reset();
                }
            }
        }
        cursor.white().write("-------------").write("\n").reset();
        cursor.white()
            .write(`Total: ${prettysize(total)} in ${prettyTime(process.hrtime(endTime))}`).write("\n").reset();
        console.log("");
    }
}
exports.FuseBoxDump = FuseBoxDump;
