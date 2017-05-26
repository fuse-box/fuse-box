import { OptimisedCore } from "./OptimisedCore";
import { each } from "realm-utils";
import { Bundle } from "../../core/Bundle";

export class BundleWriter {
    constructor(public core: OptimisedCore) { }

    private getUglifyJSOptions(): any {
        const mainOptions: any = {

        };
        return {
            ...this.core.opts.shouldUglify() || {},
            ...mainOptions
        }
    }
    public process() {
        const producer = this.core.producer;
        // create api bundle
        let bundle = new Bundle("api.js", this.core.producer.fuse, producer);

        bundle.generatedCode = new Buffer(this.core.api.render());
        // api.js has to come first, therefore we need to re-initialise the map
        let newMap = new Map<string, Bundle>();
        newMap.set(bundle.name, bundle)

        producer.bundles.forEach(bundle => {
            newMap.set(bundle.name, bundle)
        });
        producer.bundles = newMap;
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