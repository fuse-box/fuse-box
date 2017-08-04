import { Bundle } from "./Bundle";
import { FuseBox } from "./FuseBox";
import { string2RegExp, ensureUserPath, ensureFuseBoxPath } from "../Utils";
import { EventEmitter } from "events";
import { Arithmetic, BundleData } from "../arithmetic/Arithmetic";
import { SharedCustomPackage } from "./SharedCustomPackage";
import { BundleRunner } from "./BundleRunner";
import { ServerOptions } from "../devServer/Server";
import * as chokidar from "chokidar";
import { utils, each } from "realm-utils";
import { ProducerAbstraction, ProducerAbtractionOptions } from "../quantum/core/ProducerAbstraction";
import { BundleAbstraction } from "../quantum/core/BundleAbstraction";

export class BundleProducer {
    public bundles = new Map<string, Bundle>();
    public hmrInjected = false;
    public hmrAllowed = true;

    public sharedEvents = new EventEmitter();
    public writeBundles = true;
    public sharedCustomPackages: Map<string, SharedCustomPackage​>;
    public runner: BundleRunner;
    public userEnvVariables: any = Object.assign(process.env, { NODE_ENV: "production" });
    public devServerOptions: ServerOptions;

    public entryPackageName: string;
    public entryPackageFile: string;
    private injectedCode = new Map<string, string>();
    private chokidarOptions: any;
    private warnings = new Map<string, string[]>();
    constructor(public fuse: FuseBox) {
        this.runner = new BundleRunner(this.fuse);
    }

    public run(opts: { chokidar?: any, runType?: string }): Promise<BundleProducer> {
        if (opts) {
            this.chokidarOptions = opts.chokidar;
        }
        /** Collect information about watchers and start watching */
        this.watch();

        return this.runner.run(opts).then(() => {

            this.sharedEvents.emit("producer-done");
            this.printWarnings();
            return each(this.fuse.context.plugins, plugin => {
                if (plugin && utils.isFunction(plugin.producerEnd)) {
                    return plugin.producerEnd(this);
                }
            });
        }).then(() => this);
    }

    public addUserProcessEnvVariables(data: any) {
        this.userEnvVariables = Object.assign(this.userEnvVariables, data);
    }
    public printWarnings() {
        if (this.warnings.size > 0 && this.fuse.context.showWarnings) {
            this.fuse.context.log.echoBreak();
            this.warnings.forEach(warnings => {
                warnings.forEach(list => {
                    this.fuse.context.log.echoWarning(list);
                });
            });
            this.fuse.context.log.echoBreak();
        }
    }

    public addWarning(key: string, message: string) {
        let list;
        if (!this.warnings.has(key)) {
            list = []
            this.warnings.set(key, list)
        } else {
            list = this.warnings.get(key)
        }
        list.push(message);
    }

    public devCodeHasBeenInjected(key: string) {
        return this.injectedCode.has(key);
    }

    public getDevInjections(): Map<string, string> {
        return this.injectedCode;
    }

    public injectDevCode(key: string, code: string) {
        if (!this.injectedCode.has(key)) {
            this.injectedCode.set(key, code)
        }
    }

    public sortBundles(): Bundle[] {
        let bundles = [...this.bundles.values()];
        bundles = bundles.sort((a, b) => {
            if (a.webIndexPriority < b.webIndexPriority) {
                return 1;
            }
            if (a.webIndexPriority > b.webIndexPriority) {
                return -1;
            }
            return 0;
        });
        return bundles;
    }

    public generateAbstraction(opts?: ProducerAbtractionOptions): Promise<ProducerAbstraction> {
        const abstraction = new ProducerAbstraction(opts);

        return each(this.bundles, (bundle: Bundle) => {
            const bundleAbstraction = new BundleAbstraction(bundle.name);
            abstraction.registerBundleAbstraction(bundleAbstraction);
            return bundleAbstraction.parse(bundle.generatedCode.toString());
        }).then(() => {
            return abstraction;
        });
    }

    public register(packageName: string, opts: any) {
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
        // Initiate watch if any of the bundles within producer requires a watcher
        if (!isRequired) {
            return;
        }

        let ready = false;
        chokidar.watch(this.fuse.context.homeDir, this.chokidarOptions || {})
            .on('all', (event, fp) => {
                if (ready) {
                    this.onChanges(settings, fp)
                }
            }).on('ready', () => {
                ready = true;
            });
    }

    /** Trigger bundles that are affected */
    protected onChanges(settings: Map<string, RegExp>, path: string) {
        path = ensureFuseBoxPath​​(path);
        settings.forEach((expression, bundleName) => {
            if (expression.test(path)) {
                const bundle = this.bundles.get(bundleName);

                const defer = bundle.fuse.context.defer;
                bundle.lastChangedFile = path;
                // to ensure new process is not kicked in before the previous has completed
                defer.queue(bundleName, () => {
                    return bundle.exec().then(result => {
                        this.sharedEvents.emit("file-changed", [bundle, path]);
                        return result;
                    });
                });
            }
        });
    }
}
