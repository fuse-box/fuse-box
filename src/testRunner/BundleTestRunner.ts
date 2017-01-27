import { FuseAPI } from "../lib/FuseApi";
export class BundleTestRunner {
    public fuse: FuseAPI;
    public reporter: string;
    constructor(public bundle: any, opts?: any) {
        opts = opts || {};
        this.reporter = opts.reporter || "fuse-test-reporter";
        this.fuse = bundle.FuseBox;
    }

    public start() {
        const FuseBoxTestRunner = this.fuse.import("fuse-test").FuseBoxTestRunner;
        const runner = new FuseBoxTestRunner({
            reporter: this.reporter
        });
        runner.start();
    }
}