import { File } from "../core/File";
import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";
import { utils } from "realm-utils";
import { extractExtension, string2RegExp, isStylesheetExtension } from "../Utils";

export interface RawPluginOptionsObj {
	extensions: string[];
}

export type RawPluginOptions = RawPluginOptionsObj | string[];

/**
 * @export
 * @class RawPluginClass
 * @implements {Plugin}
 */
export class RawPluginClass implements Plugin {
	/**
	 * @type {RegExp}
	 * @memberOf RawPluginClass
	 */
	public test: RegExp = /.*/;
	/**
	 * @type {Array<string>}
	 * @memberOf RawPluginClass
	 */
	public extensions: Array<string>;

	constructor(options: RawPluginOptions | string[] = []) {
		if (utils.isPlainObject(options)) {
			if ("extensions" in (options || {})) this.extensions = (options as RawPluginOptionsObj).extensions;
		}
		if (utils.isArray(options)) {
			this.extensions = [];
			options.forEach(str => {
				this.extensions.push("." + extractExtension(str));
			});
			this.test = string2RegExp(options.join("|"));
		}
	}

	init(context: WorkFlowContext) {
		if (Array.isArray(this.extensions)) {
			return this.extensions.forEach(ext => context.allowExtension(ext));
		}
	}

	isRefreshRequired(file: File): boolean {
		const bundle = file.context.bundle;
		if (bundle && bundle.lastChangedFile) {
			const lastFile = file.context.convertToFuseBoxPath(bundle.lastChangedFile);
			if (isStylesheetExtension(bundle.lastChangedFile)) {
				return (
					lastFile === file.info.fuseBoxPath ||
					file.context.getItem("HMR_FILE_REQUIRED", []).indexOf(file.info.fuseBoxPath) > -1 ||
					!!file.subFiles.find(subFile => subFile.info.fuseBoxPath === bundle.lastChangedFile)
				);
			}
		}
	}

	transform(file: File) {
		const context = file.context;
		if (context.useCache && !this.isRefreshRequired(file)) {
			let cached = context.cache.getStaticCache(file);
			if (cached) {
				file.isLoaded = true;
				file.analysis.skip();
				file.sourceMap = undefined;
				file.contents = cached.contents;
				return;
			}
		}
		file.loadContents();
		file.sourceMap = undefined;
		file.contents = `module.exports = ${JSON.stringify(file.contents)}`;
		if (context.useCache) {
			context.emitJavascriptHotReload(file);
			context.cache.writeStaticCache(file, file.sourceMap);
		}
	}
}

export const RawPlugin = (options?: RawPluginOptions) => {
	return new RawPluginClass(options);
};
