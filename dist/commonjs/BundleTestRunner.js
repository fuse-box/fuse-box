"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BundleTestRunner {
    constructor(bundle, opts) {
        this.bundle = bundle;
        this.opts = opts || {};
        this.reporter = opts.reporter || "fuse-test-reporter";
        this.fuse = bundle.FuseBox;
    }
    start() {
        const FuseBoxTestRunner = this.fuse.import("fuse-test-runner").FuseBoxTestRunner;
        const runner = new FuseBoxTestRunner(this.opts);
        runner.start();
    }
}
exports.BundleTestRunner = BundleTestRunner;
