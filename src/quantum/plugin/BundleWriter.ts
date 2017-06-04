import { OptimisedCore } from "./OptimisedCore";
import { each } from "realm-utils";
import { Bundle } from "../../core/Bundle";
import { ensureUserPath } from "../../Utils";
import * as fs from "fs";
export class BundleWriter {
    private bundles = new Map<string, Bundle>();
    constructor(public core: OptimisedCore) { }

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


        // create api bundle

        this.createBundle("api.js", this.core.api.render());
        this.addShims();

        producer.bundles.forEach(bundle => {
            this.bundles.set(bundle.name, bundle)
        });
        producer.bundles = this.bundles;
        return each(producer.bundles, (bundle: Bundle) => {
            if (this.core.opts.shouldUglify()) {
                const UglifyJs = require("uglify-js");
                this.core.log.echoInfo(`Uglifying ${bundle.name}`);
                const result = UglifyJs.minify(bundle.generatedCode.toString(), this.getUglifyJSOptions());
                bundle.generatedCode = result.code;
                this.core.log.echoInfo(`Done Uglifying ${bundle.name}`)
            }
            return bundle.context.output.writeCurrent(bundle.generatedCode);
        }).then(() => {
            if (this.core.opts.webIndexPlugin) {
                return this.core.opts.webIndexPlugin.producerEnd(producer)
            }
        })
    }
}