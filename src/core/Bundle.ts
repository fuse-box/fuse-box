import { FuseBox } from "./FuseBox";
import { WorkFlowContext } from "./WorkflowContext";
import { BundleProducer } from "./BundleProducer";
import { FuseProcess } from "../FuseProcess";
import { HotReloadPlugin } from "../plugins/HotReloadPlugin";
import { SocketServer } from "../devServer/SocketServer";
import { utils } from "realm-utils";
import { File } from "./File";
import { BundleSplit } from "./BundleSplit";


export class Bundle {


    public context: WorkFlowContext;
    public watchRule: string;
    public arithmetics: string;
    public process: FuseProcess = new FuseProcess(this);
    public onDoneCallback: any;

    public splitFiles: Map<string, File>;
    public bundleSplit: BundleSplit;



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

    /** Enable HMR in this bundle and inject HMR plugin */
    public hmr(opts?: any): Bundle {

        /** Only one is allowed to hava HMR related code */
        if (!this.producer.hmrInjected) {
            opts = opts || {};
            opts.port = this.producer.devServerOptions && this.producer.devServerOptions.port || 4444;
            let plugin = HotReloadPlugin({ port: opts.port, uri: opts.socketURI });
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

        if (!this.bundleSplit) {
            this.bundleSplit = new BundleSplit(this);
        }
        this.bundleSplit.getFuseBoxInstance(bundleName, mainFile);
        this.bundleSplit.addRule(rule, bundleName);
        return this;
    }


    /** Override cache option */
    public cache(cache: boolean): Bundle {
        this.context.useCache = cache;
        return this;
    }

    public splitConfig(opts: any): Bundle {
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
        return this;
    }

    /** Log */
    public log(log: boolean): Bundle {
        this.context.doLog = log;
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

    public sourceMaps(params: any): Bundle {
        if (typeof params === "boolean") {
            this.context.sourceMapsProject = params;
        } else {
            if (utils.isPlainObject(params)) {
                this.context.sourceMapsProject = params.project === true;
                this.context.sourceMapsVendor = params.vendor === true;
            }
        }
        if (this.context.sourceMapsProject || this.context.sourceMapsVendor) {
            this.context.useSourceMaps = true;
        }
        return this;
    }

    public exec(): Promise<Bundle> {
        return new Promise((resolve, reject) => {

            this.fuse
                .initiateBundle(this.arithmetics || "", () => {
                    this.process.setFilePath(this.fuse.context.output.lastWrittenPath);
                    if (this.onDoneCallback) {
                        this.onDoneCallback(this.process)
                    }
                    return resolve(this);
                }).then(source => {
                }).catch(e => {
                    console.error(e);
                    return resolve(reject);
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

}

