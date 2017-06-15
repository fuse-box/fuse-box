import { FuseBox } from "./FuseBox";
import { Bundle } from "./Bundle";
import { each } from "realm-utils";

export class BundleRunner {
    private topTasks = [];
    private bundles: Bundle[] = [];
    private bottomTasks = [];

    constructor(public fuse: FuseBox) { }

    public top(fn: any) {
        this.topTasks.push(fn);
    }

    public bottom(fn: any) {
        this.bottomTasks.push(fn);
    }

    public bundle(bundle: Bundle) {
        this.bundles.push(bundle);
    }
    /** Execute top priority tasks */
    public executeTop() {
        return Promise.all(this.topTasks.map(fn => fn()));
    }

    public executeBottom() {
        return Promise.all(this.bottomTasks.map(fn => fn()));
    }

    public executeBundles(runType: string) {
        if (runType === "waterall ") {
            return each(this.bundles, bundle => bundle.exec());
        }
        return Promise.all(this.bundles.map(bundle => bundle.exec()));
    }

    /** Run all tasks */
    public run(opts: { runType?: string } = { runType: "waterall" }): Promise<any> {
        return this.executeTop()
            .then(() => this.executeBundles(opts.runType))
            .then(() => this.executeBottom())
    }
}
