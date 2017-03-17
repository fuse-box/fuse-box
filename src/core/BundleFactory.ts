import { Bundle } from "./Bundle";
import { FuseBox } from "./FuseBox";
import * as chokidar from "chokidar";
import { string2RegExp, ensureUserPath } from "../Utils";
import { EventEmitter } from "events";
import { Arithmetic, BundleData } from "../arithmetic/Arithmetic";
import { SharedCustomPackage } from "./SharedCustomPackage";
import { BundleRunner } from "./BundleRunner";

export class BundleFactory {
    public bundles = new Map<string, Bundle>();
    public hmrInjected = false;
    public sharedEvents = new EventEmitter();
    public sharedCustomPackages: Map<string, SharedCustomPackage​>;
    public runner: BundleRunner;
    constructor(public fuse: FuseBox) {
        this.runner = new BundleRunner(this.fuse);
        // to make sure that all bundle are set up
        // we will make decision on the next tick
        //process.nextTick(() => this.watch())
    }

    public run(opts: any) {
        /** Collect information about watchers and start watching */
        this.watch();
        return this.runner.run(opts);
    }

    public register(packageName: string, opts: any) {
        /**
        * Possible options:
        * main : "index.js"
        * homeDir : "blabla/"
        * exec : 
        */

        let instructions = opts.instructions;
        if (!packageName) {
            throw new Error("Package name is required");
        }
        if (!opts.homeDir) {
            throw new Error("Register requires homeDir!");
        }
        let homeDir = ensureUserPath(opts.homeDir);

        if (!instructions) {
            throw new Error("Register requires opts.instructions!");
        }
        let parser = Arithmetic.parse(instructions);
        // doing the arithmetic magic here
        if (!this.sharedCustomPackages) {
            this.sharedCustomPackages = new Map<string, SharedCustomPackage​>();
        }

        return Arithmetic.getFiles(parser, false, homeDir).then((data: BundleData) => {
            let pkg = new SharedCustomPackage​​(packageName, data);
            pkg.init(homeDir, opts.main || "index.js");
            this.sharedCustomPackages.set(packageName, pkg);
        });
    }

    public isShared(name: string) {
        return this.sharedCustomPackages && this.sharedCustomPackages.get(name);
    }

    public getSharedPackage(name: string): SharedCustomPackage {
        return this.sharedCustomPackages.get(name);
    }

    public add(name: string, bundle: Bundle) {
        this.bundles.set(name, bundle);
        /** Add bundle to the runner */
        this.runner.bundle(bundle);
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
                defer.queue(bundleName, () => bundle.exec());
            }
        });
    }
}