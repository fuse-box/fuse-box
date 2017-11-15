import * as fs from "fs";
import * as process from "process";
import { each, utils, chain, Chainable } from "realm-utils";
import { CustomTransformers } from "typescript";
import { ensureUserPath, contains } from "./../Utils";
import { ShimCollection } from "./../ShimCollection";
import { Server, ServerOptions } from "./../devServer/Server";
import { JSONPlugin } from "./../plugins/JSONplugin";
import { PathMaster } from "./PathMaster";
import { WorkFlowContext, Plugin } from "./WorkflowContext";
import { CollectionSource } from "./../CollectionSource";
import { Arithmetic, BundleData } from "./../arithmetic/Arithmetic";
import { ModuleCollection } from "./ModuleCollection";
import { UserOutput } from "./UserOutput";
import { BundleProducer } from "./BundleProducer";
import { Bundle } from "./Bundle";
import { File, ScriptTarget } from "./File";
import { ExtensionOverrides } from "./ExtensionOverrides";
import { TypescriptConfig } from "./TypescriptConfig";

const appRoot = require("app-root-path");

export interface FuseBoxOptions {
    homeDir?: string;
    modulesFolder?: string;
    tsConfig?: string;
    package?: any;
    dynamicImportsEnabled ?: boolean;
    cache?: boolean;
    /**
     * "browser" | "server" | "universal" | "electron"
     *
     * Combine target and language version with an '@'
     *
     * eg. server@es2017
     *
     * default: "universal@es5"
     */
    target?: string,
    log?: boolean;
    globals?: { [packageName: string]: /** Variable name */ string };
    plugins?: Array<Plugin | Plugin[]>;
    autoImport?: any;
    natives?: any;
    warnings?: boolean,
    shim?: any;
    writeBundles?: boolean;
    useTypescriptCompiler?: boolean;
    standalone?: boolean;
    sourceMaps?: boolean | { vendor?: boolean, inline?: boolean, project?: boolean, sourceRoot?: string };
    hash?: string | Boolean;
    ignoreModules?: string[],
    customAPIFile?: string;
    output?: string;
    emitHMRDependencies?: boolean;
    filterFile? : {(file : File) : boolean}
    debug?: boolean;
    files?: any;
    alias?: any;
    useJsNext?: boolean | string[],
    runAllMatchedPlugins?: boolean;
    showErrors?: boolean
    showErrorsInBrowser?: boolean
    polyfillNonStandardDefaultUsage?: boolean | string[];
    transformers?: CustomTransformers;
    extensionOverrides?: string[];
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
        if (opts.writeBundles !== undefined) {
            this.context.userWriteBundles = opts.writeBundles;
        }

        if (opts.target !== undefined) {
            const [target, languageLevel] = opts.target.toLowerCase().split('@')
            this.context.target = target
            const level = languageLevel && Object.keys(ScriptTarget)
                .find(t => t.toLowerCase() === languageLevel)
            this.context.languageLevel = ScriptTarget[level] || ScriptTarget.ES5
        }
        if (opts.polyfillNonStandardDefaultUsage !== undefined) {
            this.context.polyfillNonStandardDefaultUsage = opts.polyfillNonStandardDefaultUsage;
        }

        if (opts.useJsNext !== undefined) {
            this.context.useJsNext = opts.useJsNext;
        }
        if( opts.dynamicImportsEnabled !== undefined){
            this.context.dynamicImportsEnabled = opts.dynamicImportsEnabled;
        }

        if (opts.useTypescriptCompiler !== undefined) {
            this.context.useTypescriptCompiler = opts.useTypescriptCompiler;
        }

        if( opts.emitHMRDependencies === true){
            this.context.emitHMRDependencies = true;
        }
        if (opts.homeDir) {
            homeDir = ensureUserPath(opts.homeDir)
        }
        if (opts.debug !== undefined) {
            this.context.debugMode = opts.debug;
        }

        if (opts.debug !== undefined) {
            this.context.debugMode = opts.debug;
        }

        if (opts.warnings !== undefined) {
            this.context.showWarnings = opts.warnings;
        }

        if (opts.showErrors !== undefined) {
            this.context.showErrors = opts.showErrors;

            if (opts.showErrorsInBrowser === undefined) {
                this.context.showErrorsInBrowser = opts.showErrors
            }
        }

        if (opts.showErrorsInBrowser !== undefined) {
            this.context.showErrorsInBrowser = opts.showErrorsInBrowser;
        }

        if (opts.ignoreModules) {
            this.context.ignoreGlobal = opts.ignoreModules;
        }

        this.context.debugMode = opts.debug !== undefined ? opts.debug : contains(process.argv, "--debug");

        if (opts.modulesFolder) {
            this.context.customModulesFolder =
                ensureUserPath(opts.modulesFolder);
        }

        if (opts.sourceMaps) {
            this.context.setSourceMapsProperty(opts.sourceMaps);
        }

        this.context.runAllMatchedPlugins = !!opts.runAllMatchedPlugins
        this.context.plugins = opts.plugins as Plugin[] || [JSONPlugin()];

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
            if( typeof opts.cache === "string" ){
                this.context.cache = opts.cache;
            }
            this.context.useCache = opts.cache ? true : false;
        }

        if ( opts.filterFile){

            this.context.filterFile = opts.filterFile;
        }

        if (opts.log !== undefined) {
            this.context.doLog = opts.log;
            this.context.log.printLog = opts.log;
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

        if (opts.extensionOverrides) {
          this.context.extensionOverrides = new ExtensionOverrides(opts.extensionOverrides);
        }

        const tsConfig = new TypescriptConfig(this.context);;
        tsConfig.setConfigFile(opts.tsConfig);
        this.context.tsConfig = tsConfig;
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

    public copy(): FuseBox {
        const config = Object.assign({}, this.opts);
        config.plugins = [].concat(config.plugins || [])
        return FuseBox.init(config);
    }

    public bundle(name: string, arithmetics?: string): Bundle {
        let fuse = this.copy();
        const bundle = new Bundle(name, fuse, this.producer);

        bundle.arithmetics = arithmetics;
        this.producer.add(name, bundle);
        return bundle;
    }



    /** Starts the dev server and returns it */
    public dev(opts?: ServerOptions, fn?: { (server: Server): void }) {
        opts = opts || {};
        opts.port = opts.port || 4444;
        this.producer.devServerOptions = opts;
        this.producer.runner.bottom(() => {
            let server = new Server(this);
            server.start(opts);
            if (opts.open) {
                try {
                    const opn = require('opn');
                    opn(typeof opts.open === 'string' ? opts.open : `http://localhost:${opts.port}`);
                } catch (e) {
                    this.context.log.echoRed('If you want to open the browser, please install "opn" package. "npm install opn --save-dev"')
                }

            }
            if (fn) {
                fn(server);
            }
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
            if( this.context.emitHMRDependencies){
                this.context.emitter.emit("bundle-collected");
            }
            this.context.log.bundleStart(this.context.bundle.name);
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
                let self = this;
                // @NOTE: content is here, but this is not the uglified content
                // self.context.source.getResult().content.toString()
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

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason.stack);
});
