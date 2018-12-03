import { File } from "../../core/File";
import { WorkFlowContext } from "./../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
import * as path from "path";
let less;

export interface LESSPluginOptions {
	sourceMap?: any;
	relativeUrls?: boolean;
}

export interface LESSPluginInternalOpts {
	filename?: string;
	paths?: string[];
}

/**
 * @export
 * @class LESSPluginClass
 * @implements {Plugin}
 */
export class LESSPluginClass implements Plugin {
	/**
	 * @type {RegExp}
	 * @memberOf LESSPluginClass
	 */
	public test: RegExp = /\.less$/;
	public options: LESSPluginOptions & LESSPluginInternalOpts;

	constructor(options: LESSPluginOptions = {}) {
		this.options = options;
	}

	public init(context: WorkFlowContext) {
		context.allowExtension(".less");
	}

	/**
	 * @param {File} file
	 * @memberOf LESSPluginClass
	 */
	public transform(file: File) {
		file.addStringDependency("fuse-box-css");
		if (file.isCSSCached("less")) {
			return;
		}
		const context: WorkFlowContext = file.context;
		const options = { ...this.options };

		file.loadContents();

		const sourceMapDef = {
			sourceMapBasepath: ".",
			sourceMapRootpath: file.info.absDir,
		};

		if (!less) {
			less = require("less");
		}

		options.filename = options.filename ? path.join(file.context.homeDir, options.filename) : file.info.absPath;

		if ("sourceMapConfig" in context) {
			options.sourceMap = { ...sourceMapDef, ...(options.sourceMap || {}) };
		}
		let paths = [file.info.absDir];
		if (Array.isArray(options.paths)) {
			paths = options.paths.concat(paths);
		}
		options.paths = paths;

		const cssDependencies = file.context.extractCSSDependencies(file, {
			paths: options.paths,
			content: file.contents,
			sassStyle: true,
			extensions: ["less", "css"],
		});

		file.cssDependencies = cssDependencies;

		return less
			.render(file.contents, options)
			.then(output => {
				if (output.map) {
					file.sourceMap = output.map;
				}

				file.contents = output.css;

				if (context.useCache) {
					file.bustCSSCache = true;
					file.analysis.dependencies = cssDependencies;
					context.cache.writeStaticCache(file, file.sourceMap, "less");
					file.analysis.dependencies = [];
				}
			})
			.catch(err => {
				file.contents = "";
				file.addError(`${err.message}\n      at ${err.filename}:${err.line}:${err.column}`);
			});
	}
}

export const LESSPlugin = (opts?: LESSPluginOptions) => {
	return new LESSPluginClass(opts);
};
