import { moduleCollector } from "./ModuleCollector";
import { FuseBoxDump } from "./Dump";
import { CollectionSource } from "./CollectionSource";
import { cache } from "./ModuleCache";
import { Arithmetic, BundleData } from "./Arithmetic";
import { ModuleWrapper } from "./ModuleWrapper";
import { Module } from "./Module";
import { ModuleCollection } from "./ModuleCollection";
import * as path from "path";
import * as fs from "fs";
import { each, chain, Chainable } from "realm-utils";
const appRoot = require("app-root-path");



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

    private printLogs: boolean = true;

    private collectionSource: CollectionSource;

    private timeStart;

    private useCache = true;

    /**
     * Creates an instance of FuseBox.
     *
     * @param {*} opts
     *
     * @memberOf FuseBox
     */
    constructor(public opts: any) {
        this.timeStart = process.hrtime();
        this.collectionSource = new CollectionSource(this.dump);
        opts = opts || {};
        if (!opts.homeDir) {
            this.homeDir = appRoot.path;
        } else {
            this.homeDir = path.isAbsolute(opts.homeDir) ? opts.homeDir : path.join(appRoot.path, opts.homeDir);
        }
        if (opts.logs) {
            this.printLogs = opts.logs;
        }
        if (opts.cache !== undefined) {
            this.useCache = opts.cache;
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
                    return self.collectionSource.get(this.defaultCollection, true).then(cnt => {
                        this.globalContents.push(cnt);
                    });
                }
                /**
                 *
                 *
                 * @returns
                 */
                public setNodeModules() {
                    return moduleCollector(bundleCollection).then(data => {
                        return each(data.collections, (collection, name) => {
                            return self.collectionSource.get(collection).then(cnt => {
                                this.globalContents.push(cnt);

                                if (!collection.cachedContent && self.useCache) {
                                    cache.set(name, cnt);
                                }
                            });
                        }).then(() => {
                            if (self.useCache) {
                                // here we store node_module project requirements
                                // for caching
                                cache.storeLocalDependencies(data.projectModules);
                            }
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
                let contents = result.contents.join("\n");
                //fs.writeFileSync(appRoot.path + "out.js", contents);
                if (this.printLogs) {
                    this.dump.printLog(this.timeStart);
                }
                return ModuleWrapper.wrapFinal(contents, bundleData.entry, standalone);
                // return {
                //     dump: this.dump,
                //     contents: ModuleWrapper.wrapFinal(result.contents, bundleData.entry, standalone)
                // };
            });
        });
    }
}
