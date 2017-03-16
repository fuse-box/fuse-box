import { FuseBox } from "./FuseBox";
import { WorkFlowContext } from "./WorkflowContext";
import { BundleFactory } from "./BundleFactory";
import { FuseProcess } from "../FuseProcess";

export class Bundle {


    public context: WorkFlowContext;
    public watchRule: string;
    public arithmetics: string;
    public process: FuseProcess = new FuseProcess​​(this);


    constructor(public name: string, public fuse: FuseBox, public factory: BundleFactory) {
        this.context = fuse.context;
        this.setup();
    }

    public watch(rules?: string): Bundle {
        this.watchRule = rules ? rules : "**";
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

    public exec(arithmetics: string, done?: any): Promise<Bundle> {
        this.arithmetics = arithmetics;
        return new Promise((resolve, reject) => {
            this.fuse
                .initiateBundle(arithmetics, () => {
                    this.process.setFilePath(this.fuse.context.output.lastWrittenPath);
                    return resolve(this);
                }).then(source => {
                    if (done) {
                        return done(source);
                    }
                }).catch(e => {
                    console.error(e)
                    return resolve(reject);
                });
            return this;
        });
    }

    private setup() {
        // modifying the output name
        this.context.output.setName(this.name);
    }
}