import { Plugin } from "../core/WorkflowContext";
import { BundleSource } from "../BundleSource";

// TODO get typings for Terser opts
export interface TerserPluginOptions {
	[key: string]: any;
}

/**
 * @export
 * @class TerserPluginClass
 * @implements {Plugin}
 */
export class TerserPluginClass implements Plugin {
	/**
	 * @type {any}
	 * @memberOf TerserPluginClass
	 */

	constructor(public options: TerserPluginOptions = {}) {}

	public postBundle(context) {
		const mainOptions: any = {};
		const Terser = require("terser");
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

		const result = Terser.minify(source, {
			...this.options,
			...mainOptions,
		});

		let took = process.hrtime(timeStart);
		let bytes = Buffer.byteLength(result.code, "utf8");

		context.log.echoBundleStats("Bundle (Uglified)", bytes, took);

		newConcat.add(null, result.code, result.map || sourceMap);
	}
}

export const TerserPlugin = (options?: TerserPluginOptions) => {
	return new TerserPluginClass(options);
};
