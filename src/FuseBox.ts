import { Arithmetic, BundleData } from "./Arithmetic";
import { ModuleWrapper } from "./ModuleWrapper";
import { Module } from "./Module";
import { ModuleCollection } from "./ModuleCollection";
import * as path from "path";
import { each, chain, Chainable } from "realm-utils";
const appRoot = require("app-root-path");

const ansi = require("ansi");
const cursor = ansi(process.stdout);
const prettysize = require("prettysize");


/**
 *
 *
 * @export
 * @class FuseBox
 */
export class FuseBox {

    /**
     * Home directly, usually should be set by user
     *
     * @type {string}
     * @memberOf FuseBox
     */
    public homeDir: string;

    /**
     * An object where we collect logs
     *
     * @type {FuseBoxDump}
     * @memberOf FuseBox
     */
    public dump: FuseBoxDump = new FuseBoxDump();

    /**
     * If set, home folder is ignored and we use the object as references to files
     *
     * @type {*}
     * @memberOf FuseBox
     */
    public virtualFiles: any;

    /**
     * Creates an instance of FuseBox.
     *
     * @param {*} opts
     *
     * @memberOf FuseBox
     */
    constructor(public opts: any) {
        opts = opts || {};
        if (!opts.homeDir) {
            this.homeDir = appRoot.path;
        } else {
            this.homeDir = path.isAbsolute(opts.homeDir) ? opts.homeDir : path.join(appRoot.path, opts.homeDir);
        }
        // In case of additional resources (or resourses to use with gulp)
        this.virtualFiles = opts.fileCollection;
    }

    /**
     * Start Arithmetic bundling
     *
     * @param {string} str
     * @param {boolean} [standalone]
     * @returns
     *
     * @memberOf FuseBox
     */
    public bundle(str: string, standalone?: boolean) {
        let parser = Arithmetic.parse(str);
        let bundle: BundleData;
        return Arithmetic.getFiles(parser, this.virtualFiles, this.homeDir).then(data => {
            bundle = data;
            return this.process(data, standalone);
        }).then((contents) => {
            bundle.finalize(); // Clean up temp folder if required
            return contents;
        }).catch(e => {
            console.log(e.stack || e);
        });
    }

    /**
     *
     *
     * @param {BundleData} bundleData
     * @param {boolean} [standalone]
     * @returns
     *
     * @memberOf FuseBox
     */
    public process(bundleData: BundleData, standalone?: boolean) {
        let bundleCollection = new ModuleCollection("default");
        let self = this;
        return bundleCollection.collectBundle(bundleData).then(module => {
            return chain(class extends Chainable {
                /**
                 *
                 *
                 * @type {Module}
                 */
                public entry: Module;
                /**
                 *
                 *
                 * @type {ModuleCollection}
                 */
                public defaultCollection: ModuleCollection;
                /**
                 *
                 *
                 * @type {Map<string, ModuleCollection>}
                 */
                public nodeModules: Map<string, ModuleCollection>;
                /**
                 *
                 *
                 * @type {string}
                 */
                public defaultContents: string;
                /**
                 *
                 */
                public globalContents = [];

                /**
                 *
                 *
                 * @returns
                 */
                public setDefaultCollection() {
                    let defaultCollection = new ModuleCollection("default", module);
                    return defaultCollection;
                }
                /**
                 *
                 *
                 * @returns
                 */
                public addDefaultContents() {
                    return self.getCollectionSource(this.defaultCollection, true).then(cnt => {
                        this.globalContents.push(cnt);
                    });
                }
                /**
                 *
                 *
                 * @returns
                 */
                public setNodeModules() {
                    return self.collectNodeModules(bundleCollection).then(nodeModules => {
                        return each(nodeModules, (collection, name) => {
                            return self.getCollectionSource(collection).then(cnt => {
                                this.globalContents.push(cnt);
                            });
                        });
                    });
                }
                /**
                 *
                 *
                 * @returns
                 */
                public format() {
                    return {
                        contents: this.globalContents,
                    };
                }

            }).then(result => {
                this.dump.printLog();
                return ModuleWrapper.wrapFinal(result.contents, bundleData.entry, standalone);

            });
        })
    }

    /**
     *
     *
     * @param {ModuleCollection} collection
     * @param {boolean} [depsOnly]
     * @param {string} [entryPoint]
     * @returns {Promise<string>}
     *
     * @memberOf FuseBox
     */
    public getCollectionSource(collection: ModuleCollection, depsOnly?: boolean, entryPoint?: string): Promise<string> {
        let entry: Module = collection.entry;

        if (!entry) {
            return new Promise((resolve, reject) => {
                return resolve(ModuleWrapper.wrapModule(collection.name, "", collection.name));
            });
        }
        let visited: any = {};
        let cnt = [];
        /**
         *
         *
         * @param {Module} module
         * @param {string} [projectPath]
         * @returns
         */
        let collectionResources = (module: Module, projectPath?: string) => {

            return new Promise((resolve, reject) => {
                if (!module) {
                    return resolve();
                }
                let rpath = module.getProjectPath(entry, entry.dir);

                if (!visited[rpath]) {
                    visited[rpath] = true;
                    let content = ModuleWrapper.wrapGeneric(rpath, module.contents);
                    this.dump.log(collection.name, rpath, content);
                    cnt.push(content);
                    return each(module.dependencies, dep => {
                        return collectionResources(dep);
                    }).then(resolve).catch(reject);
                }
                return resolve();
            });
        };

        if (depsOnly) { // bundle might not have an entry point. Instead we just process dependencies
            return each(entry.dependencies, dep => {
                return collectionResources(dep, entry.dir);
            }).then(result => {
                return ModuleWrapper.wrapModule(collection.name, cnt.join("\n"), entryPoint);
            });
        }
        return collectionResources(entry).then(result => {
            return ModuleWrapper.wrapModule(collection.name, cnt.join("\n"), entry.getProjectPath());
        });
    }


    /**
     *
     *
     * @param {ModuleCollection} defaultCollection
     * @returns {Promise<Map<string, ModuleCollection>>}
     *
     * @memberOf FuseBox
     */
    public collectNodeModules(defaultCollection: ModuleCollection): Promise<Map<string, ModuleCollection>> {
        let modules: Map<string, ModuleCollection> = new Map();
        /**
         *
         *
         * @param {Map<string, ModuleCollection>} nodeModules
         * @returns
         */
        let collect = (nodeModules: Map<string, ModuleCollection>) => {
            return each(nodeModules, (collection, name) => {
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

/**
 *
 *
 * @export
 * @class FuseBoxDump
 */
export class FuseBoxDump {
    /**
     *
     *
     *
     * @memberOf FuseBoxDump
     */
    public modules = {};
    /**
     *
     *
     * @param {string} moduleName
     * @param {string} file
     * @param {string} contents
     *
     * @memberOf FuseBoxDump
     */
    public log(moduleName: string, file: string, contents: string) {
        if (!this.modules[moduleName]) {
            this.modules[moduleName] = [];
        }
        let byteAmount = Buffer.byteLength(contents, "utf8");
        this.modules[moduleName].push({
            name: file,
            bytes: byteAmount
        });
    }

    /**
     *
     *
     *
     * @memberOf FuseBoxDump
     */
    public printLog() {
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
        cursor.white().write(`Total: ${prettysize(total)}`).write("\n").reset();
        console.log("");
    }
}