import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import { each, utils, chain, Chainable } from "realm-utils";
import { ensureUserPath, contains } from "./../Utils";
import { ShimCollection } from "./../ShimCollection";
import { Server, ServerOptions } from "./../devServer/Server";
import { JSONPlugin } from "./../plugins/JSONplugin";
import { PathMaster } from "./PathMaster";
import { WorkFlowContext, Plugin } from "./WorkflowContext";
import { CollectionSource } from "./../CollectionSource";
import { Arithmetic, BundleData } from "./../arithmetic/Arithmetic";
import { ModuleCollection } from "./ModuleCollection";
import { MagicalRollup } from "../rollup/MagicalRollup";
import { UserOutput } from "./UserOutput";
import { BundleProducer } from "./BundleProducer";
import { Bundle } from "./Bundle";
import { SplitConfig } from "./BundleSplit";

const isWin = /^win/.test(process.platform);
const appRoot = require("app-root-path");

export interface FuseBoxOptions {
    homeDir?: string;
    modulesFolder?: string;
    tsConfig?: string;
    package?: any;
    cache?: boolean;
    log?: boolean;
    globals?: { [packageName: string]: /** Variable name */ string };
    plugins?: Plugin[];
    autoImport?: any;
    natives?: any;
    shim?: any;
    standalone?: boolean;
    sourceMaps?: any;
    serverBundle?: boolean;
    rollup?: any;
    hash?: string | Boolean;
    customAPIFile?: string;
    output?: string;
    debug?: boolean;
    files?: any;
    alias?: any;
    transformTypescript?: (contents: string) => string;
}

/**
 *
 *
 * @export
 * @class FuseBox
 */
export class FuseBox {
    public static init(opts?: FuseBoxOptions) {
        return new FuseBox(opts);
    }
    public virtualFiles: any;

    public collectionSource: CollectionSource;

    public context: WorkFlowContext;

    public producer = new BundleProducer(this);

    /**
     * Creates an instance of FuseBox.
     *
     * @param {*} opts
     *
     * @memberOf FuseBox
     */
    constructor(public opts?: FuseBoxOptions) {
        this.context = new WorkFlowContext();
        this.context.fuse = this;
        this.collectionSource = new CollectionSource(this.context);
        opts = opts || {};
        let homeDir = appRoot.path;
        if (opts.homeDir) {
            homeDir = ensureUserPath(opts.homeDir)
        }
        if (opts.debug !== undefined) {
            this.context.debugMode = opts.debug;
        }



        this.context.debugMode = opts.debug !== undefined ? opts.debug : contains(process.argv, "--debug");

        if (opts.modulesFolder) {
            this.context.customModulesFolder =
                ensureUserPath(opts.modulesFolder);
        }

        if (opts.tsConfig) {
            this.context.tsConfig = opts.tsConfig;
        }

        if (opts.serverBundle !== undefined) {
            this.context.serverBundle = opts.serverBundle;
        }

        this.context.plugins = opts.plugins || [JSONPlugin()];

        if (opts.package) {
            if (utils.isPlainObject(opts.package)) {
                const packageOptions: any = opts.package;
                this.context.defaultPackageName = packageOptions.name || "default";
                this.context.defaultEntryPoint = packageOptions.main;
            } else {
                this.context.defaultPackageName = opts.package;
            }

        }

        if (opts.cache !== undefined) {
            this.context.useCache = opts.cache ? true : false;
        }

        if (opts.log !== undefined) {
            this.context.doLog = opts.log ? true : false;
        }

        if (opts.hash !== undefined) {
            this.context.hash = opts.hash;
        }

        if (opts.alias) {
            this.context.addAlias(opts.alias);
        }

        this.context.initAutoImportConfig(opts.natives, opts.autoImport)


        if (opts.globals) {
            this.context.globals = opts.globals;
        }

        if (opts.shim) {
            this.context.shim = opts.shim;
        }

        if (opts.standalone !== undefined) {
            this.context.standaloneBundle = opts.standalone;
        }

        if (opts.rollup) {
            this.context.rollupOptions = opts.rollup;
        }

        if (opts.customAPIFile) {
            this.context.customAPIFile = opts.customAPIFile;
        }

        this.context.setHomeDir(homeDir);
        if (opts.cache !== undefined) {
            this.context.setUseCache(opts.cache);
        }
        // In case of additional resources (or resourses to use with gulp)
        this.virtualFiles = opts.files;
        if (opts.output) {
            this.context.output = new UserOutput(this.context, opts.output);
        }
        this.compareConfig(this.opts);
    }

    public triggerPre() {
        this.context.triggerPluginsMethodOnce("preBundle", [this.context]);
    }

    public triggerStart() {
        this.context.triggerPluginsMethodOnce("bundleStart", [this.context]);
    }

    public triggerEnd() {
        this.context.triggerPluginsMethodOnce("bundleEnd", [this.context]);
    }

    public triggerPost() {
        this.context.triggerPluginsMethodOnce("postBundle", [this.context]);
    }


    public bundle(name: string, arithmetics?: string): Bundle {
        const config = Object.assign({}, this.opts);
        config.plugins = [].concat(config.plugins || [])
        let fuse = FuseBox.init(config);
        const bundle = new Bundle(name, fuse, this.producer);

        bundle.arithmetics = arithmetics;
        this.producer.add(name, bundle);
        return bundle;
    }




    /** Starts the dev server and returns it */
    public dev(opts?: ServerOptions) {
        opts = opts || {};
        opts.port = opts.port || 4444;
        this.producer.devServerOptions = opts;
        this.producer.runner.bottom(() => {
            let server = new Server(this);
            return server.start(opts);
        });
    }

    /** Top priority is to register packages first */
    public register(packageName: string, opts: any) {
        this.producer.runner.top(() => {
            return this.producer.register(packageName, opts);
        });
    }

    public run(opts?: any) {
        return this.producer.run(opts);
    }

    /**
     * @description if configs diff, clear cache
     * @see constructor
     * @see WorkflowContext
     *
     * if caching is disabled, ignore
     * if already stored, compare
     * else, write the config for use later
     */
    public compareConfig(config: FuseBoxOptions): void {
        if (!this.context.useCache) return;
        const mainStr = fs.readFileSync(require.main.filename, "utf8");

        if (this.context.cache) {
            const configPath = path.resolve(this.context.cache.cacheFolder, "config.json");

            if (fs.existsSync(configPath)) {
                const storedConfigStr = fs.readFileSync(configPath, "utf8");
                if (storedConfigStr !== mainStr) this.context.nukeCache();
            }

            if (isWin) fs.writeFileSync(configPath, mainStr);
            else fs.writeFile(configPath, mainStr, () => { });
        }
    }
    /**
     * Bundle files only
     * @param files File[]
     */
    public createSplitBundle(conf: SplitConfig): Promise<SplitConfig> {
        let files = conf.files;
        let defaultCollection = new ModuleCollection(this.context, this.context.defaultPackageName);
        defaultCollection.pm = new PathMaster(this.context, this.context.homeDir);
        this.context.reset();
        const bundleData = new BundleData();
        this.context.source.init();
        bundleData.entry = "";
        //this.context.output.setName()
        return defaultCollection.resolveSplitFiles(files).then(() => {
            return this.collectionSource.get(defaultCollection).then((cnt: string) => {
                this.context.log.echoDefaultCollection(defaultCollection, cnt);
            });
        }).then(() => {
            return new Promise((resolve, reject) => {
                this.context.source.finalize(bundleData);
                this.triggerEnd();
                this.triggerPost();
                this.context.writeOutput(() => {
                    return resolve(conf);
                });
            });
        });
    }

    public process(bundleData: BundleData, bundleReady?: () => any) {
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
                                if (!collection.cachedName && self.context.useCache) {
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

            }).then(() => {
                if (self.context.bundle && self.context.bundle.bundleSplit) {
                    return self.context.bundle.bundleSplit.beforeMasterWrite(self.context);
                }
            }).then(result => {
                let self = this;

                const rollup = this.handleRollup();
                if (rollup) {
                    self.context.source.finalize(bundleData);
                    rollup().then(() => {
                        self.context.log.end();
                        this.triggerEnd();
                        this.triggerPost();
                        this.context.writeOutput(bundleReady);
                        return self.context.source.getResult();
                    });
                } else {

                    self.context.log.end();
                    this.triggerEnd();
                    self.context.source.finalize(bundleData);
                    this.triggerPost();
                    this.context.writeOutput(bundleReady);
                    return self.context.source.getResult();
                }
            });
        });
    }

    public handleRollup() {
        if (this.context.rollupOptions) {
            return () => {
                let rollup = new MagicalRollup(this.context);
                return rollup.parse();
            };
        } else {
            return false;
        }
    }

    public addShims() {
        // add all shims
        let shim = this.context.shim;
        if (shim) {
            for (let name in shim) {
                if (shim.hasOwnProperty(name)) {
                    let data = shim[name];
                    if (data.exports) {
                        // creating a fake collection
                        let shimedCollection
                            = ShimCollection.create(this.context, name, data.exports);
                        this.context.addNodeModule(name, shimedCollection);

                        if (data.source) {
                            let source = ensureUserPath(data.source);
                            let contents = fs.readFileSync(source).toString();
                            this.context.source.addContent(contents);
                        }
                    }
                }
            }
        }
    }

    // public test(str: string = "**/*.test.ts", opts: any) {
    //     opts = opts || {};
    //     opts.reporter = opts.reporter || "fuse-test-reporter";
    //     opts.exit = true;

    //     // include test files to the bundle
    //     const clonedOpts = Object.assign({}, this.opts);
    //     const testBundleFile = path.join(Config.TEMP_FOLDER, "tests", new Date().getTime().toString(), "/$name.js");
    //     clonedOpts.output = testBundleFile;

    //     // adding fuse-test dependency to be bundled
    //     str += ` +fuse-test-runner ${opts.reporter} -ansi`;
    //     return FuseBox.init(clonedOpts).bundle(str, () => {
    //         const bundle = require(testBundleFile);
    //         let runner = new BundleTestRunner(bundle, opts);
    //         return runner.start();
    //     });
    // }

    public initiateBundle(str: string, bundleReady?: any) {
        this.context.reset();
        // Locking deferred calls until everything is written
        this.context.defer.lock();
        this.triggerPre();
        this.context.source.init();
        this.addShims();
        this.triggerStart();

        let parser = Arithmetic.parse(str);
        let bundle: BundleData;
        return Arithmetic.getFiles(parser, this.virtualFiles, this.context.homeDir).then(data => {
            bundle = data;
            if (bundle.tmpFolder) {
                this.context.homeDir = bundle.tmpFolder;
            }
            if (bundle.standalone !== undefined) {
                this.context.debug("Arithmetic", `Override standalone ${bundle.standalone}`);

                this.context.standaloneBundle = bundle.standalone;
            }
            if (bundle.cache !== undefined) {
                this.context.debug("Arithmetic", `Override cache ${bundle.cache}`);
                this.context.useCache = bundle.cache;
            }

            return this.process(data, bundleReady);
        }).then((contents) => {
            bundle.finalize(); // Clean up temp folder if required
            return contents;
        }).catch(e => {
            console.log(e.stack || e);
        });
    }
}
