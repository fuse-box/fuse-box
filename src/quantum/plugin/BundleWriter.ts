import { each } from "realm-utils";
import { Bundle } from "../../core/Bundle";
import { ensureUserPath, uglify } from "../../Utils";
import { QuantumCore } from "./QuantumCore";
import * as fs from "fs";
import { QuantumSplitConfig } from "./QuantumSplit";
import { ScriptTarget } from "../../core/File";
import { CSSOptimizer } from './CSSOptimizer';

export class BundleWriter {
    private bundles = new Map<string, Bundle>();
    constructor(public core: QuantumCore) { }

    private getUglifyJSOptions(): any {
        const opts = this.core.opts.shouldUglify() || {};
        const useUglifyEs = this.core.context.languageLevel > ScriptTarget.ES5 || !!opts.es6;
        if ( useUglifyEs ){
            this.core.context.log.echoInfo("Using uglify-es because the target is greater than ES5 or es6 option is set")
        } else {
            this.core.context.log.echoInfo("Using uglify-js because the target is set to ES5 and no es6 option is set")
        }
        return {
            ...opts,
            es6 : useUglifyEs
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
                        console.warn(`Shim error: Not found: ${shimPath}`);
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
        this.core.log.echoInfo(`Done uglifying ${bundle.name}`)
        this.core.log.echoGzip(result.code);
    }

    public async process() {
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
        if (this.core.opts.shouldCreateApiBundle()) {
            this.createBundle("api.js");
        }

        producer.bundles = this.bundles;

        let splitFileOptions: any;
        if (this.core.context.quantumBits.size > 0) {
            const splitConf : QuantumSplitConfig = this.core.context.quantumSplitConfig;
            splitFileOptions = {
                c: {
                    b: splitConf.getBrowserPath(),
                    s: splitConf.getServerPath()},
                i: {}
            };
            this.core.api.setBundleMapping(splitFileOptions);
        }

        let index = 1;
        const writeBundle = (bundle: Bundle) => {
            return bundle.context.output.writeCurrent(bundle.generatedCode).then(output => {
                let entryString;
                if( bundle.quantumBit && bundle.quantumBit.entry){
                    entryString = bundle.quantumBit.entry.getFuseBoxFullPath();
                }
                bundleManifest[bundle.name] = {
                    fileName: output.filename,
                    hash: output.hash,
                    type : "js",
                    entry : entryString,
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
        const cssCollection = this.core.cssCollection;
        const cssData = cssCollection.collection;

        if( this.core.opts.shouldGenerateCSS() && cssData.size > 0 ) {
            const output = this.core.producer.fuse.context.output;
            const name = this.core.opts.getCSSPath();
            cssCollection.render(name);
            let useSourceMaps = cssCollection.useSourceMaps;

            const cleanCSSOptions = this.core.opts.getCleanCSSOptions();
            if( cleanCSSOptions){
                const optimer = new CSSOptimizer(this.core);
                optimer.optimize(cssCollection, cleanCSSOptions);
            }
            //output.write(this.core.opts.getCSSPath(), cssString)
            const cssResultData = await output.writeToOutputFolder(name, cssCollection.getString(), true);
            bundleManifest["css"] = {
                filename : cssResultData.filename,
                type : "css",
                hash : cssResultData.hash,
                absPath : cssResultData.path,
                relativePath : cssResultData.relativePath,
                webIndexed : true
            }
            this.core.producer.injectedCSSFiles.add(cssResultData.filename);
            if ( useSourceMaps ) {
                output.writeToOutputFolder(this.core.opts.getCSSSourceMapsPath(), cssCollection.sourceMap);
            }
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
            
            if (!this.core.opts.shouldBakeApiIntoBundle(bundle.name)) {
                if (this.core.opts.shouldUglify()) {
                    this.uglifyBundle(bundle);
                }
                index++;
                return writeBundle(bundle);
            }
        }).then(async () => {
            if (!this.core.opts.shouldCreateApiBundle()) {
                this.core.opts
                    .getMissingBundles(producer.bundles)
                    .forEach(bundle => {
                        this.core.log.echoBoldRed(`  → Error. Can't find bundle name ${bundle}`);
                    });

                for(const [name, bundle] of producer.bundles){
                    if (this.core.opts.shouldBakeApiIntoBundle(name)){
                        const generatedAPIBundle = this.core.api.render();
                        if (this.core.opts.isContained()) {
                            bundle.generatedCode = new Buffer(bundle.generatedCode.toString().replace("/*$$CONTAINED_API_PLACEHOLDER$$*/", generatedAPIBundle.toString()));
                        } else {
                            bundle.generatedCode = new Buffer(generatedAPIBundle + "\n" + bundle.generatedCode);
                        }
                        if (this.core.opts.shouldUglify()) {
                            this.uglifyBundle(bundle);
                        }

                        await writeBundle(bundle);
                    }
                }
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