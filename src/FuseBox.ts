import * as fs from 'fs';
import { ensureUserPath } from './Utils';
import { ShimCollection } from './ShimCollection';
import { Server } from './devServer/Server';
import { JSONPlugin } from "./plugins/JSONplugin";
import { PathMaster } from "./PathMaster";
import { WorkFlowContext } from "./WorkflowContext";
import { CollectionSource } from "./CollectionSource";
import { Arithmetic, BundleData } from "./Arithmetic";
import { ModuleCollection } from "./ModuleCollection";
import * as path from "path";
import { each, utils, chain, Chainable } from "realm-utils";
import { Config } from './Config';
import { BundleTestRunner } from './testRunner/BundleTestRunner';
const appRoot = require("app-root-path");
const watch = require("watch");
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

    public collectionSource: CollectionSource;

    public context: WorkFlowContext;


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

        if (opts.shim) {
            this.context.shim = opts.shim;
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



    /**
     * Make  a Bundle 
     * 
     * @param {string} str
     * @param {boolean} [daemon] string to a daemon (watching)
     * 
     * @memberOf FuseBox
     */
    public bundle(str: string, bundleReady?: any) {
        return this.initiateBundle(str, bundleReady);
    }



    /**
     * 
     * 
     * @param {string} str
     * @param {*} opts
     * 
     * @memberOf FuseBox
     */
    public devServer(str: string, opts: any) {
        let server = new Server(this);
        return server.start(str, opts);
    }

    public process(bundleData: BundleData, bundleReady?: any) {
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

            }).then(result => {
                self.context.log.end();
                this.triggerEnd();
                self.context.source.finalize(bundleData);
                this.triggerPost();
                this.context.writeOutput(bundleReady);
                return self.context.source.getResult();
            });
        });
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

    public test(str: string = "**/*.test.ts") {
        // include test files to the bundle
        const clonedOpts = Object.assign({}, this.opts);
        const testBundleFile = path.join(Config.TEMP_FOLDER, "tests", decodeURIComponent(this.opts.outFile));
        clonedOpts.outFile = testBundleFile;

        // adding fuse-test dependency to be bundled
        str += " +fuse-test";
        return FuseBox.init(clonedOpts).bundle(str, () => {
            const bundle = require(testBundleFile);
            let runner = new BundleTestRunner(bundle);
            return runner.start();
        });
    }


    public initiateBundle(str: string, bundleReady?: any) {
        this.context.reset();
        this.triggerPre();
        this.context.source.init();
        this.addShims();
        this.triggerStart();

        let parser = Arithmetic.parse(str);
        let bundle: BundleData;
        return Arithmetic.getFiles(parser, this.virtualFiles, this.context.homeDir).then(data => {

            bundle = data;
            return this.process(data, bundleReady);
        }).then((contents) => {
            bundle.finalize(); // Clean up temp folder if required

            return contents;
        }).catch(e => {
            console.log(e.stack || e);
        });
    }
}
