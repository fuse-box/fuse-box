import { JSONPlugin } from "./plugins/JSONplugin";
import { PathMaster } from "./PathMaster";
import { WorkFlowContext } from './WorkflowContext';
import { CollectionSource } from "./CollectionSource";
import { Arithmetic, BundleData } from "./Arithmetic";
import { ModuleCollection } from "./ModuleCollection";
import * as path from "path";
import { each, utils, chain, Chainable } from "realm-utils";
const appRoot = require("app-root-path");
const watch = require("watch");
const DEFAULT_EXTENSIONS = ['.ts', '.js', '.jsx', '.html', '.xml', '.json', '.css'];

/**
 *
 *
 * @export
 * @class FuseBox
 */
export class FuseBox {

    public static init(opts?: any) {
        return new FuseBox(opts);
    }

    public virtualFiles: any;

    private collectionSource: CollectionSource;

    private context: WorkFlowContext;

    /**
     * Creates an instance of FuseBox.
     *
     * @param {*} opts
     *
     * @memberOf FuseBox
     */
    constructor(public opts: any) {
        this.context = new WorkFlowContext();
        this.collectionSource = new CollectionSource(this.context);
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

        this.context.plugins = opts.plugins || [JSONPlugin()];

        if (opts.extensions) {
            this.context.setAllowExtensions(opts.extensions);
        }

        if (opts.package) {
            this.context.defaultPackageName = opts.package;
        }
        if (opts.cache !== undefined) {
            this.context.useCache = opts.cache ? true : false;
        }

        if (opts.log !== undefined) {
            this.context.doLog = opts.log ? true : false;
        }

        if (opts.globals) {
            this.context.globals = opts.globals;
        }

        if (opts.standalone !== undefined) {
            this.context.standaloneBundle = opts.standaloneBundle;
        }

        if (opts.sourceMap) {
            this.context.sourceMapConfig = opts.sourceMap;
        }

        if (opts.ignoreGlobal) {
            this.context.ignoreGlobal = opts.ignoreGlobal;
        }

        if (opts.outFile) {
            this.context.outFile = opts.outFile;
        }
        this.context.setHomeDir(homeDir);
        if (opts.cache !== undefined) {
            this.context.setUseCache(opts.cache);
        }
        // In case of additional resources (or resourses to use with gulp)
        this.virtualFiles = opts.files;

        this.context.initCache();
    }

    public triggerStart() {
        this.context.plugins.forEach(plugin => {
            if (utils.isFunction(plugin.bundleStart)) {
                plugin.bundleStart(this.context);
            }
        });
    }

    public triggerEnd() {
        this.context.plugins.forEach(plugin => {
            if (utils.isFunction(plugin.bundleEnd)) {
                plugin.bundleEnd(this.context);
            }
        });
    }


    /**
     * Make  a Bundle 
     * 
     * @param {string} str
     * @param {boolean} [daemon] string to a daemon (watching)
     * 
     * @memberOf FuseBox
     */
    public bundle(str: string, daemon?: boolean) {
        if (daemon) {
            watch.watchTree(this.context.homeDir, { interval: 0.2 }, () => {
                this.initiateBundle(str);
            });
        } else {
            return this.initiateBundle(str);
        }
    }

    public process(bundleData: BundleData, standalone?: boolean) {
        let bundleCollection = new ModuleCollection(this.context, this.context.defaultPackageName);
        bundleCollection.pm = new PathMaster(this.context, bundleData.homeDir);

        // swiching on typescript compiler
        if (bundleData.typescriptMode) {
            this.context.tsMode = true;
            bundleCollection.pm.setTypeScriptMode();
        }

        let self = this;
        return bundleCollection.collectBundle(bundleData).then(module => {

            return chain(class extends Chainable {
                public defaultCollection: ModuleCollection;
                public nodeModules: Map<string, ModuleCollection>;
                public defaultContents: string;
                public globalContents = [];
                public setDefaultCollection() {
                    return bundleCollection;
                }

                public addDefaultContents() {
                    return self.collectionSource.get(this.defaultCollection).then((cnt: string) => {
                        self.context.log.echoDefaultCollection(this.defaultCollection, cnt);
                    });
                }

                public addNodeModules() {
                    return each(self.context.nodeModules, (collection: ModuleCollection) => {
                        if (collection.cached || (collection.info && !collection.info.missing)) {
                            return self.collectionSource.get(collection).then((cnt: string) => {
                                self.context.log.echoCollection(collection, cnt);
                                if (!collection.cachedName) {
                                    self.context.cache.set(collection.info, cnt);
                                }
                                this.globalContents.push(cnt);
                            });
                        }
                    });
                }

                public format() {
                    return {
                        contents: this.globalContents,
                    };
                }

            }).then(result => {
                self.context.log.end();
                this.triggerEnd();
                self.context.source.finalize(bundleData);
                this.context.writeOutput();
                return self.context.source.getResult();
            });
        });
    }

    private initiateBundle(str: string) {
        this.context.reset();
        this.triggerStart();
        let parser = Arithmetic.parse(str);
        let bundle: BundleData;
        return Arithmetic.getFiles(parser, this.virtualFiles, this.context.homeDir).then(data => {

            bundle = data;
            return this.process(data);
        }).then((contents) => {
            bundle.finalize(); // Clean up temp folder if required

            return contents;
        }).catch(e => {
            console.log(e.stack || e);
        });
    }
}
