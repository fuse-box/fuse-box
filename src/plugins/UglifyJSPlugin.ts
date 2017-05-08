import { Plugin } from "../core/WorkflowContext";
import { BundleSource } from "../BundleSource";

// TODO get typings for UglifyJS opts
export interface UglifyJSPluginOptions {
    [key: string]: any;
}

/**
 * @export
 * @class UglifyJSPluginClass
 * @implements {Plugin}
 */
export class UglifyJSPluginClass implements Plugin {
	/**
	 * @type {any}
	 * @memberOf UglifyJSPluginClass
	 */

    constructor(public options: UglifyJSPluginOptions = {}) {}

    public postBundle(context) {
        const mainOptions : any = {
        };
        const UglifyJs = require("uglify-js");
		//TODO: there may be a better way to test for v2
		if(UglifyJs.mangle_properties !== undefined) {
			mainOptions.fromString = true;
		}

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

        const result = UglifyJs.minify(source, {
            ...this.options,
            ...mainOptions,
        });

        let took = process.hrtime(timeStart);
        let bytes = Buffer.byteLength(result.code, "utf8");

        context.log.echoBundleStats("Bundle (Uglified)", bytes, took);

        newConcat.add(null, result.code, result.map || sourceMap);
    }
}

export const UglifyJSPlugin = (options?: UglifyJSPluginOptions) => {
    return new UglifyJSPluginClass(options);
};
