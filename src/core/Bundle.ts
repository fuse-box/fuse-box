import { FuseBox } from "./FuseBox";
import { WorkFlowContext } from "./WorkflowContext";
import { BundleProducer } from "./BundleProducer";
import { FuseProcess } from "../FuseProcess";
import { HotReloadPlugin } from "../plugins/HotReloadPlugin";
import { SocketServer } from "../devServer/SocketServer";
import { File } from "./File";
import { BundleSplit } from "./BundleSplit";
import * as path from "path";
import { BundleTestRunner } from "../BundleTestRunner";
import { Config } from "../Config";
import { QuantumItem, QuantumSplitResolveConfiguration } from "../quantum/plugin/QuantumSplit";
import { BundleAbstraction } from "../quantum/core/BundleAbstraction";
import { PackageAbstraction } from "../quantum/core/PackageAbstraction";
import { EventEmitter } from '../EventEmitter';
import { ExtensionOverrides } from "./ExtensionOverrides";

export interface HMROptions {
    port?: number;
    socketURI? : string;
    reload?: boolean;
}
export class Bundle {
    public context: WorkFlowContext;
    public watchRule: string;
    public arithmetics: string;
    public process: FuseProcess = new FuseProcess(this);
    public onDoneCallback: any;
    public webIndexPriority = 0;
    public generatedCode: Buffer;
    public bundleAbstraction: BundleAbstraction;
    public packageAbstraction: PackageAbstraction;
    public lastChangedFile: string;
    public webIndexed = true;
    public splitFiles: Map<string, File>;
    private errors: string[] = [];
    private errorEmitter = new EventEmitter<string>()
    private clearErrorEmitter = new EventEmitter<null>()

    public bundleSplit: BundleSplit;
    public quantumItem: QuantumItem;

    constructor(public name: string, public fuse: FuseBox, public producer: BundleProducer) {
        this.context = fuse.context;
        this.context.bundle = this;
        // re-assign the parent producer
        fuse.producer = producer;
        this.setup();
    }

    public watch(rules?: string): Bundle {
        this.watchRule = rules ? rules : "**";
        return this;
    }

    public globals(globals: any): Bundle {
        this.context.globals = globals;
        return this;
    }

    public tsConfig(fpath: string): Bundle {
        this.context.tsConfig = fpath;
        return this;
    }


    public shim(shimConfig: any): Bundle {
        this.context.shim = shimConfig;
        return this;
    }
    /** Enable HMR in this bundle and inject HMR plugin */
    public hmr(opts?: HMROptions): Bundle {
        if (!this.producer.hmrAllowed) {
            return this;
        }
        /** Only one is allowed to hava HMR related code */
        if (!this.producer.hmrInjected) {
            opts = opts || {};
            opts.port = this.producer.devServerOptions && this.producer.devServerOptions.port || 4444;
            let plugin = HotReloadPlugin({ port: opts.port, uri: opts.socketURI, reload : opts.reload });
            this.context.plugins = this.context.plugins || [];
            this.context.plugins.push(plugin);

            // Should happen only once!
            this.producer.hmrInjected = true;
        }
        /**
         * Whenever socket server is initialized
         * This will allow use to enable HMR on any bundle within current producer
        */
        this.producer.sharedEvents.on("SocketServerReady", (server: SocketServer) => {
            this.fuse.context.sourceChangedEmitter.on((info) => {
                if (this.fuse.context.isFirstTime() === false) {
                    this.fuse.context.log.echo(`Source changed for ${info.path}`);
                    server.send("source-changed", info);
                }
            });

            if (this.context.showErrorsInBrowser) {
                const type = "update-bundle-errors",
                    getData = () => ({
                        bundleName: this.name,
                        messages: this.errors
                    })

                this.errorEmitter.on(message => {
                    server.send("bundle-error", {
                        bundleName: this.name,
                        message
                    })
                })

                this.clearErrorEmitter.on(() => {
                    server.send(type, getData())
                })

                server.server.on("connection", client => {
                    client.send(JSON.stringify({
                        type,
                        data: getData()
                    }))
                })
            }
        });
        return this;
    }

    public alias(key: any, value: any): Bundle {
        this.context.addAlias(key, value);
        return this;
    }

    public split(rule: string, str: string): Bundle {

        const arithmetics = str.match(/(\S+)\s*>\s(\S+)/i)
        if (!arithmetics) {
            throw new Error("Can't parse split arithmetics. Should look like:")
        }
        const bundleName = arithmetics[1];
        const mainFile = arithmetics[2];

        if (this.context.experimentalFeaturesEnabled) {
            this.producer.fuse.context.quantumSplit(rule, bundleName, mainFile);
        } else {
            this.producer.addWarning("deprecation", "The old code splitting will be deprecated very soon! Make sure you have migrated to Quantum splitting with experimentalFeaturesEnabled: true! They will be enabled by default in 2.3.2");
            if (!this.bundleSplit) {
                this.bundleSplit = new BundleSplit(this);
            }

            this.bundleSplit.getFuseBoxInstance(bundleName, mainFile);
            this.bundleSplit.addRule(rule, bundleName);
        }
        return this;
    }


    /** Override cache option */
    public cache(cache: boolean): Bundle {
        this.context.useCache = cache;
        return this;
    }

    public splitConfig(opts: QuantumSplitResolveConfiguration): Bundle {
        if (this.context.experimentalFeaturesEnabled) {
            this.producer.fuse.context.configureQuantumSplitResolving(opts);
        } else {
            if (!this.bundleSplit) {
                this.bundleSplit = new BundleSplit(this);
            }

            if (opts.browser) {
                this.bundleSplit.browserPath = opts.browser;
            }
            if (opts.server) {
                this.bundleSplit.serverPath = opts.server;
            }

            if (opts.dest) {
                this.bundleSplit.dest = opts.dest;
            }
        }
        return this;
    }

    /** Log */
    public log(log: boolean): Bundle {
        this.context.doLog = log;
        this.context.log.printLog = log;
        return this;
    }

    public extensionOverrides(...overrides: string[]) {
      if (!this.context.extensionOverrides) {
        this.context.extensionOverrides = new ExtensionOverrides(overrides);
      } else {
        overrides.forEach((override) => this.context.extensionOverrides.add(override));
      }

      return this;
    }

    /**
     * Adds a plugin or a chain of plugins
     * e.g
     * in case of one plugin
     * plugin(HTMLPlugin())
     * In case of a chain:
     *
     * plugin("*.html", HTMLPlugin())
     * @param args Plugin
     */
    public plugin(...args): Bundle {
        this.context.plugins = this.context.plugins || [];
        this.context.plugins.push(args.length === 1 ? args[0] : args);
        return this;
    }

    /**
     * natives({ process : false })
     * @param opts
     */
    public natives(opts: any): Bundle {
        this.context.natives = opts;
        return this;
    }

    public instructions(arithmetics: string): Bundle {
        this.arithmetics = arithmetics;
        return this;
    }

    public target(target: string): Bundle {
        this.context.target = target;
        return this;
    }

    public sourceMaps(params: any): Bundle {
        this.context.setSourceMapsProperty(params);
        return this;
    }

    public test(str: string = "**/*.test.ts", opts: any) {
        opts = opts || {};
        opts.reporter = opts.reporter || "fuse-test-reporter";
        opts.exit = true;

        // include test files to the bundle
        const clonedOpts = Object.assign({}, this.fuse.opts);
        const testBundleFile = path.join(Config.TEMP_FOLDER, "tests", new Date().getTime().toString(), "/$name.js");
        clonedOpts.output = testBundleFile;

        // adding fuse-test dependency to be bundled
        str += ` +fuse-test-runner ${opts.reporter} -ansi`;
        const fuse = FuseBox.init(clonedOpts);
        fuse.bundle("test")
            .instructions(str)
            .completed(proc => {
                const bundle = require(proc.filePath);
                let runner = new BundleTestRunner(bundle, opts);
                runner.start();
            });
        fuse.run();
    }

    public exec(): Promise<Bundle> {
        return new Promise((resolve, reject) => {
            this.clearErrors()
            this.fuse
                .initiateBundle(this.arithmetics || "", () => {
                    const output = this.fuse.context.output;
                    this.process.setFilePath(output.lastPrimaryOutput ? output.lastPrimaryOutput.path : output.lastGeneratedFileName);
                    if (this.onDoneCallback && this.producer.writeBundles === true) {
                        this.onDoneCallback(this.process);
                    }
                    this.printErrors()
                    return resolve(this);
                }).then(source => {
                }).catch(e => {
                    console.error(e);
                    return reject(reject);
                });
            return this;
        });
    }

    public completed(fn: (process: FuseProcess) => void): Bundle {
        this.onDoneCallback = fn;
        return this;
    }

    private setup() {
        // modifying the output name
        this.context.output.setName(this.name);
        if (this.context.useCache) {
            this.context.initCache();
            this.context.cache.initialize();
        }
    }

    private clearErrors() {
        this.errors = []
        this.clearErrorEmitter.emit(null)
    }

    public addError(message: string) {
        this.errors.push(message)
        this.errorEmitter.emit(message)
    }

    public getErrors() {
        return this.errors.slice()
    }

    public printErrors() {
        if (this.errors.length && this.fuse.context.showErrors) {
            this.fuse.context.log.echoBreak()
            this.fuse.context.log.echoBoldRed(`Errors for ${this.name} bundle`)
            this.errors.forEach(error => this.fuse.context.log.echoError(error))
            this.fuse.context.log.echoBreak()
        }
    }
}
