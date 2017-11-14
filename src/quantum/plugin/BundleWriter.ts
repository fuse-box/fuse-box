import { each } from "realm-utils";
import { Bundle } from "../../core/Bundle";
import { ensureUserPath, uglify } from "../../Utils";
import { QuantumCore } from "./QuantumCore";
import * as fs from "fs";
import { QuantumSplitConfig } from "./QuantumSplit";

export class BundleWriter {
    private bundles = new Map<string, Bundle>();
    constructor(public core: QuantumCore) { }

    private getUglifyJSOptions(): any {
        const mainOptions: any = {

        };
        return {
            ...this.core.opts.shouldUglify() || {},
            ...mainOptions
        }
    }

    private createBundle(name: string, code?: string): Bundle {
        let bundle = new Bundle(name, this.core.producer.fuse.copy(), this.core.producer);
        if (code) {
            bundle.generatedCode = new Buffer(code);
        }

        this.bundles.set(bundle.name, bundle);
        return bundle;
    }

    private addShims() {
        const producer = this.core.producer;
        // check for shims
        if (producer.fuse.context.shim) {
            const shims = [];
            for (let name in producer.fuse.context.shim) {
                let item = producer.fuse.context.shim[name];
                if (item.source) {
                    let shimPath = ensureUserPath(item.source);
                    if (!fs.existsSync(shimPath)) {
                        console.warn(`Shim erro: Not found: ${shimPath}`);
                    } else {
                        shims.push(fs.readFileSync(shimPath).toString())
                    }
                }
            }
            if (shims.length) {
                this.createBundle(this.core.opts.shimsPath, shims.join("\n"));
            }
        }
    }

    private uglifyBundle(bundle: Bundle) {
        this.core.log.echoInfo(`Uglifying ${bundle.name}...`);

        const result = uglify(bundle.generatedCode, this.getUglifyJSOptions());
        if (result.error) {
            this.core.log
                .echoBoldRed(`  → Error during uglifying ${bundle.name}`)
                .error(result.error);
            throw result.error;
        }
        bundle.generatedCode = result.code;
        this.core.log.echoInfo(`Done Uglifying ${bundle.name}`)
        this.core.log.echoGzip(result.code);
    }

    public process() {
        const producer = this.core.producer;
        const bundleManifest: any = {};
        this.addShims();

        producer.bundles.forEach(bundle => {
            this.bundles.set(bundle.name, bundle)
        });

        if (this.core.opts.isContained() && producer.bundles.size > 1) {
            this.core.opts.throwContainedAPIError();
        }

        // create api bundle (should be the last)
        let apiName2bake = this.core.opts.shouldBakeApiIntoBundle()
        if (!apiName2bake) {
            this.createBundle("api.js");
        }

        producer.bundles = this.bundles;
        
        let splitFileOptions: any;
        if (this.core.context.quantumBits.size > 0) {
            const splitConf : QuantumSplitConfig = this.core.context.quantumSplitConfig;
            splitFileOptions = {
                c: { 
                    b: splitConf.getBrowserPath(), 
                    s:  splitConf.getServerPath()},
                i: {}
            };
            this.core.api.setBundleMapping(splitFileOptions);
        }

        let index = 1;
        const writeBundle = (bundle: Bundle) => {
            return bundle.context.output.writeCurrent(bundle.generatedCode).then(output => {
                bundleManifest[bundle.name] = {
                    fileName: output.filename,
                    hash: output.hash,
                    absPath: output.path,
                    webIndexed: !bundle.quantumBit,
                    relativePath: output.relativePath
                };
                // if this bundle belongs to splitting
                // we need to remember the generated file name and store 
                // and then pass to the API
                if (bundle.quantumBit) {
                    splitFileOptions.i[bundle.quantumBit.name] = [output.relativePath, bundle.quantumBit.entry.getID()];
                }
            });
        }

        return each(producer.bundles, (bundle: Bundle) => {
            if (bundle.name === "api.js") {
                // has to be the highest priority
                // assuming that u user won't make more than 1000 bundles...
                bundle.webIndexPriority = 1000;
                if (this.core.opts.isContained()) {
                    this.core.opts.throwContainedAPIError();
                }
                bundle.generatedCode = new Buffer(this.core.api.render());
            } else {
                bundle.webIndexPriority = 1000 - index;
            }

            // if the api wants to be  baked it, we have to skip generation now

            if (apiName2bake !== bundle.name) {
                if (this.core.opts.shouldUglify()) {
                    this.uglifyBundle(bundle);
                }
                index++;
                return writeBundle(bundle);
            }
        }).then(() => {
            if (apiName2bake) {
                let targetBundle = producer.bundles.get(apiName2bake);
                if (!targetBundle) {
                    this.core.log.echoBoldRed(`  → Error. Can't find bundle name ${targetBundle}`);
                } else {
                    const generatedAPIBundle = this.core.api.render();
                    if (this.core.opts.isContained()) {
                        targetBundle.generatedCode = new Buffer(targetBundle.generatedCode.toString().replace("/*$$CONTAINED_API_PLACEHOLDER$$*/", generatedAPIBundle.toString()));
                    } else {
                        targetBundle.generatedCode = new Buffer(generatedAPIBundle + "\n" + targetBundle.generatedCode);
                    }
                    if (this.core.opts.shouldUglify()) {
                        this.uglifyBundle(targetBundle);
                    }
                }
                return writeBundle(targetBundle);
            }
        }).then(() => {
            const manifestPath = this.core.opts.getManifestFilePath();
            if (manifestPath) {
                this.core.producer.fuse.context.output.writeToOutputFolder(manifestPath,
                    JSON.stringify(bundleManifest, null, 2));
            }
            if (this.core.opts.webIndexPlugin) {
                return this.core.opts.webIndexPlugin.producerEnd(producer)
            }
        }).then(() => {
            // calling completed()
            this.core.producer.bundles.forEach(bundle => {
                if (bundle.onDoneCallback) {
                    bundle.process.setFilePath(bundle.fuse.context.output.lastWrittenPath);
                    bundle.onDoneCallback(bundle.process);
                }
            })
        })
    }


}
