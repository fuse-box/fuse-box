import { each } from "realm-utils";
import { Bundle } from "../../core/Bundle";
import { ensureUserPath } from "../../Utils";
import * as fs from "fs";
import { QuantumCore } from "./QuantumCore";
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

    private createBundle(name: string, code: string): Bundle {
        let bundle = new Bundle(name, this.core.producer.fuse.copy(), this.core.producer);
        bundle.generatedCode = new Buffer(code);
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
                this.createBundle("shims.js", shims.join("\n"));
            }
        }
    }



    public process() {
        const producer = this.core.producer;




        this.addShims();

        producer.bundles.forEach(bundle => {
            this.bundles.set(bundle.name, bundle)
        });

        // create api bundle (should be the last)
        let apiName2bake = this.core.opts.shouldBakeApiIntoBundle()
        if (apiName2bake) {
            let targetBundle = producer.bundles.get(apiName2bake);
            if (!targetBundle) {
                this.core.log.echoBoldRed(`  → Error. Can't find bundle name ${targetBundle}`);
            } else {
                targetBundle.generatedCode = new Buffer(this.core.api.render() + "\n" + targetBundle.generatedCode);
            }
        } else {
            this.createBundle("api.js", this.core.api.render());
        }

        producer.bundles = this.bundles;
        return each(producer.bundles, (bundle: Bundle) => {


            if (this.core.opts.shouldUglify()) {
                const UglifyJs = require("uglify-js");
                this.core.log.echoInfo(`Uglifying ${bundle.name}`);
                const result = UglifyJs.minify(bundle.generatedCode.toString(), this.getUglifyJSOptions());
                if (result.error) {
                    this.core.log.echoBoldRed(`  → Error during uglifying ${bundle.name}`);
                    throw result.error;
                }
                bundle.generatedCode = result.code;
                this.core.log.echoInfo(`Done Uglifying ${bundle.name}`)
            }


            return bundle.context.output.writeCurrent(bundle.generatedCode).then(output => {
                // if this bundle belongs to splitting
                // we need to remember the generated file name and store 
                // and then pass to the API
                if (bundle.quantumItem) {

                }

            });
        }).then(() => {

            if (this.core.opts.webIndexPlugin) {
                return this.core.opts.webIndexPlugin.producerEnd(producer)
            }
        })
    }


}