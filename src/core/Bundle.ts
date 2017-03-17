import { FuseBox } from "./FuseBox";
import { WorkFlowContext } from "./WorkflowContext";
import { BundleFactory } from "./BundleFactory";
import { FuseProcess } from "../FuseProcess";
import { HotReloadPlugin } from "../plugins/HotReloadPlugin";
import { SocketServer } from "../devServer/SocketServer";

export class Bundle {


    public context: WorkFlowContext;
    public watchRule: string;
    public arithmetics: string;
    public process: FuseProcess = new FuseProcess(this);
    public onDoneCallback: any;

    constructor(public name: string, public fuse: FuseBox, public factory: BundleFactory) {
        this.context = fuse.context;
        // re-assign the parent factory
        fuse.factory = factory;
        this.setup();
    }

    public watch(rules?: string): Bundle {
        this.watchRule = rules ? rules : "**";
        return this;
    }

    /** Enable HMR in this bundle and inject HMR plugin */
    public hmr(opts: any): Bundle {

        /** Only one is allowed to hava HMR related code */
        if (!this.factory.hmrInjected) {
            opts = opts || {};
            opts.port = opts.port || 4445;
            let plugin = HotReloadPlugin({ port: opts.port, uri: opts.socketURI });
            this.context.plugins = this.context.plugins || [];
            this.context.plugins.push(plugin);

            // Should happen only once!
            this.factory.hmrInjected = true;
        }
        /** 
         * Whenever socket server is initialized 
         * This will allow use to enable HMR on any bundle within current factory
        */
        this.factory.sharedEvents.on("SocketServerReady", (server: SocketServer) => {
            this.fuse.context.sourceChangedEmitter.on((info) => {
                if (this.fuse.context.isFirstTime() === false) {
                    this.fuse.context.log.echo(`Source changed for ${info.path}`);
                    server.send("source-changed", info);
                }
            });
        });
        return this;
    }

    /** Override cache option */
    public cache(cache: boolean): Bundle {
        this.context.useCache = cache;
        return this;
    }

    /** Log */
    public log(log: boolean): Bundle {
        this.context.doLog = log;
        return this;
    }

    public instructions(arithmetics: string): Bundle {
        this.arithmetics = arithmetics;
        return this;
    }

    public exec(): Promise<Bundle> {
        return new Promise((resolve, reject) => {
            this.fuse
                .initiateBundle(this.arithmetics, () => {
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
    }
}