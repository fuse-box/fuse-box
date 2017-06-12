import { FuseAPI } from "./lib/FuseApi";

export class BundleTestRunner {
    public fuse: FuseAPI;
    public reporter: string;
    public opts: any;

    constructor(public bundle: any, opts?: any) {
        this.opts = opts || {};
        this.reporter = opts.reporter || "fuse-test-reporter";
        this.fuse = bundle.FuseBox;
    }

    public start() {
        if (this.bundle.registerGlobals) {
            this.bundle.registerGlobals();
        }
        const FuseBoxTestRunner = this.fuse.import("fuse-test-runner").FuseBoxTestRunner;
        const runner = new FuseBoxTestRunner(this.opts);
        runner.start();
    }
}
