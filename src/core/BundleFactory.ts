import { Bundle } from "./Bundle";
import { FuseBox } from "./FuseBox";
import * as chokidar from "chokidar";
import { string2RegExp } from "../Utils";

export class BundleFactory {
    public bundles = new Map<string, Bundle>();

    constructor(public fuse: FuseBox) {
        // to make sure that all bundle are set up
        // we will make desicion on the next tick
        process.nextTick(() => this.watch())
    }

    public add(name: string, bundle: Bundle) {
        this.bundles.set(name, bundle)
    }

    public watch() {
        let settings = new Map<string, RegExp>();
        let isRequired = false;
        // collecting paths and bundles name
        this.bundles.forEach(bundle => {
            if (bundle.watchRule) {
                isRequired = true;
                settings.set(bundle.name, string2RegExp(bundle.watchRule));
            }
        });
        // Initiate watch if any of the bundles within factory requires a watcher
        if (!isRequired) {
            return;
        }
        const watcher = chokidar.watch(this.fuse.context.homeDir);
        watcher.on('ready', () =>
            watcher.on("all", (event, path) => this.onChanges(settings, event, path))
        );
    }
    /** Trigger bundles that are affected */
    private onChanges(settings: Map<string, RegExp>, event: string, path: string) {
        settings.forEach((expression, bundleName) => {
            if (expression.test(path)) {
                const bundle = this.bundles.get(bundleName);
                const defer = bundle.fuse.context.defer;
                // to ensure new process is not kicked in before the previous has completed
                defer.queue(bundleName, () => bundle.exec(bundle.arithmetics));
            }
        });
    }
}