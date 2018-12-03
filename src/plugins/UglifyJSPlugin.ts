import { Plugin, WorkFlowContext } from "../core/WorkflowContext";
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

	public postBundle(context: WorkFlowContext) {
		const mainOptions: any = {};
		const UglifyJs = require("uglify-js");
		//TODO: there may be a better way to test for v2
		if (UglifyJs.mangle_properties !== undefined) {
			mainOptions.fromString = true;
		}

		const includeSourceMaps = context.source.includeSourceMaps;
		const concat = context.source.getResult();
		const source = concat.content.toString();
		const sourceMap = concat.sourceMap;

		const newSource = new BundleSource(context);
		newSource.includeSourceMaps = includeSourceMaps;
		context.source = newSource;

		const newConcat = context.source.getResult();

		if ("sourceMapConfig" in context) {
			if ((context as any).sourceMapConfig.bundleReference) {
				mainOptions.inSourceMap = JSON.parse(sourceMap);
				mainOptions.outSourceMap = (context as any).sourceMapConfig.bundleReference;
			}
		}

		if (includeSourceMaps) {
			mainOptions.inSourceMap = JSON.parse(sourceMap);
			mainOptions.outSourceMap = `${context.output.filename}.js.map`;
		}

		let timeStart = process.hrtime();

		var opt = {
			...this.options,
			...mainOptions,
		};

		const result = UglifyJs.minify(source, opt);

		if (result.error) {
			const message = `UglifyJSPlugin - ${result.error.message}`;
			context.log.echoError(message);
			return Promise.reject(result.error);
		}

		let took = process.hrtime(timeStart);
		let bytes = Buffer.byteLength(result.code, "utf8");

		context.log.echoBundleStats("Bundle (Uglified)", bytes, took);
		newConcat.add(null, result.code, result.map || sourceMap);
	}
}

export const UglifyJSPlugin = (options?: UglifyJSPluginOptions) => {
	return new UglifyJSPluginClass(options);
};
