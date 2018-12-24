import * as fs from "fs";
import * as path from "path";
import { File } from "../../core/File";
import { string2RegExp } from "../../Utils";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";

let babel7Core;

/**
 * @export
 * @class FuseBoxBabel7Plugin
 * @implements {Plugin}
 */
export class Babel7PluginClass implements Plugin {
	/**
	 * We can add tsx and ts here as well
	 * Because Babel won't capture it just being a Plugin
	 * Typescript files are handled before any external plugin is executed
	 */
	public extensions: Array<string> = [".jsx"];
	public test: RegExp = /\.(j|t)s(x)?$/;
	public context: WorkFlowContext;
	private limit2project: boolean = true;

	private config?: any = {};
	private configPrinted = false;
	private configLoaded = false;

	constructor(opts: any = { ast: true }) {
		// if it is an object containing only a babel config
		if (
			opts.config === undefined &&
			opts.test === undefined &&
			opts.limit2project === undefined &&
			opts.extensions === undefined &&
			Object.keys(opts).length
		) {
			this.config = opts;
			return;
		}

		if (opts.config) {
			this.config = Object.assign({ ast: true }, opts.config);
		}
		if (opts.extensions !== undefined) {
			this.extensions = opts.extensions;
			if (opts.test === undefined) {
				this.test = string2RegExp(opts.extensions.join("|"));
			}
		}
		if (opts.test !== undefined) {
			this.test = opts.test;
		}
		if (opts.limit2project !== undefined) {
			this.limit2project = opts.limit2project;
		}
	}

	/**
	 * @see this.init
	 */
	private handleBabelRc() {
		if (this.configLoaded) return;

		let babelRcConfig;
		let babelRcPath = path.join(this.context.appRoot, `.babelrc`);

		if (fs.existsSync(babelRcPath)) {
			babelRcConfig = fs.readFileSync(babelRcPath).toString();

			if (babelRcConfig) {
				babelRcConfig = Object.assign({}, JSON.parse(babelRcConfig), this.config);
			}
		}

		if (babelRcConfig) {
			this.config = babelRcConfig;
		}

		this.configLoaded = true;
	}

	/**
	 * @param {WorkFlowContext} context
	 */
	public init(context: WorkFlowContext) {
		this.context = context;
		if (Array.isArray(this.extensions)) {
			this.extensions.forEach(ext => context.allowExtension(ext));
		}
		this.handleBabelRc();
	}

	/**
	 * @param {File} file
	 */
	public transform(file: File) {
		file.wasTranspiled = true;
		if (!babel7Core) {
			babel7Core = require("@babel/core");
		}
		if (this.configPrinted === false && this.context.doLog === true) {
			file.context.debug("Babel7Plugin", `\n\tConfiguration: ${JSON.stringify(this.config)}`);
			this.configPrinted = true;
		}

		if (this.context.useCache) {
			if (file.loadFromCache()) {
				return;
			}
		}

		// contents might not be loaded if using a custom file extension
		file.loadContents();

		// whether we should transform the contents
		// @TODO needs improvement for the regex matching of what to include
		//       with globs & regex
		if (this.limit2project === false || file.collection.name === file.context.defaultPackageName) {
			let result;
			try {
				result = babel7Core.transformSync(file.contents, Object.assign({ ast: true }, this.config));
			} catch (e) {
				file.analysis.skip();
				console.error(e);
				return;
			}

			// By default we would want to limit the babel
			// And use acorn instead (it's faster)
			if (result.ast) {
				file.analysis.loadAst(result.ast);
				let sourceMaps = result.map;

				// escodegen does not really like babel
				// so a custom function handles transformation here if needed
				// This happens only when the code is required regeneration
				// for example with aliases -> in any cases this will stay untouched
				file.context.setCodeGenerator(ast => {
					const result = babel7Core.transformFromAstSync(ast);
					sourceMaps = result.map;
					return result.code;
				});

				file.contents = result.code;
				file.analysis.analyze();

				if (sourceMaps) {
					sourceMaps.file = file.info.fuseBoxPath;
					sourceMaps.sources = [file.context.sourceMapsRoot + "/" + file.info.fuseBoxPath];
					if (!file.context.inlineSourceMaps) {
						delete sourceMaps.sourcesContent;
					}

					file.sourceMap = JSON.stringify(sourceMaps);
				}

				if (this.context.useCache) {
					this.context.emitJavascriptHotReload(file);
					this.context.cache.writeStaticCache(file, file.sourceMap);
				}
			}
		}
	}
}

export const Babel7Plugin = (opts: any = {}) => {
	return new Babel7PluginClass(opts);
};
