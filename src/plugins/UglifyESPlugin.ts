import { Plugin } from "../core/WorkflowContext";
import { BundleSource } from "../BundleSource";

// TODO get typings for UglifyES opts
export interface UglifyESPluginOptions {
    [key: string]: any;
}

/**
 * @export
 * @class UglifyESPluginClass
 * @implements {Plugin}
 */
export class UglifyESPluginClass implements Plugin {
	/**
	 * @type {any}
	 * @memberOf UglifyESPluginClass
	 */

    constructor(public options: UglifyESPluginOptions = {}) {}

    public postBundle(context) {
        const mainOptions : any = {
        };
        const UglifyES = require("uglify-es");
        const concat = context.source.getResult();
        const source = concat.content.toString();
        const sourceMap = concat.sourceMap;

        const newSource = new BundleSource(context);
        context.source = newSource;

        const newConcat = context.source.getResult();

        if ("sourceMapConfig" in context) {
            if (context.sourceMapConfig.bundleReference) {
                mainOptions.inSourceMap = JSON.parse(sourceMap);
                mainOptions.outSourceMap = context.sourceMapConfig.bundleReference;
            }
        }

        let timeStart = process.hrtime();

        const result = UglifyES.minify(source, {
            ...this.options,
            ...mainOptions,
        });

        let took = process.hrtime(timeStart);
        let bytes = Buffer.byteLength(result.code, "utf8");

        context.log.echoBundleStats("Bundle (Uglified)", bytes, took);

        newConcat.add(null, result.code, result.map || sourceMap);
    }
}

export const UglifyESPlugin = (options?: UglifyESPluginOptions) => {
    return new UglifyESPluginClass(options);
};
