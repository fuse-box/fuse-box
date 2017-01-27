import { FuseAPI } from "../lib/FuseApi";
export class BundleTestRunner {
    public fuse: FuseAPI;
    constructor(public bundle: any, opts?: any) {
        this.fuse = bundle.FuseBox;
    }

    public start() {
        const FuseBoxTestRunner = this.fuse.import("fuse-test").FuseBoxTestRunner;
        const runner = new FuseBoxTestRunner();
        runner.start();
    }
}