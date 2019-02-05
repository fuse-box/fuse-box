import * as fs from "fs";
import * as path from "path";
import { File } from "../../core/File";
import { string2RegExp } from "../../Utils";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
import { ASTTraverse } from "../../ASTTraverse";
import { ImportDeclaration } from "../../analysis/plugins/ImportDeclaration";

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
	public extensions: Array<string> = [".js", ".jsx", ".ts", ".tsx"];
	public test: RegExp = /\.(j|t)s(x)?$/;
	public context: WorkFlowContext;
	private limit2project: boolean = true;
	private configPrinted = false;
	private configLoaded = false;
	private configFile: string | false;

	private configRequired = {
		ast: true,
		code: true,
		babelrc: false,
		configFile: false,
		sourceType: "module",
		filenameRelative: "", // homeDir
		root: "", // homeDir
	};
	private config = Object.assign({}, this.configRequired);

	constructor(opts: any) {
		if (
			typeof opts === "object" &&
			opts.config === undefined &&
			opts.test === undefined &&
			opts.limit2project === undefined &&
			opts.extensions === undefined &&
			opts.configFile === undefined &&
			Object.keys(opts).length
		) {
			Object.assign(this.config, opts, this.configRequired);
			return;
		}

		if (typeof opts === "object" && opts !== null) {
			if (opts.limit2project) {
				this.limit2project = !!opts.limit2project;
			}
			if (opts.test) {
				this.test = opts.test;
			}
			if (opts.extensions) {
				this.extensions = opts.extensions;
				if (opts.test === undefined) {
					this.test = string2RegExp(opts.extensions.join("|"));
				}
			}
			if (opts.config) {
				if (typeof opts.config !== "object") {
					throw new Error("Babel7Plugin - `config` property must be null | undefined | plain object");
				}
				Object.assign(this.config, opts.config, this.configRequired);
			}
			if (opts.configFile) {
				this.configFile = opts.configFile;
			}
		} else if (opts !== null || opts !== undefined) {
			throw new Error(`Babel7Plugin - Invalid options provided.`);
		}
	}

	/**
	 * @see this.init
	 */
	private loadOptionsAndValidate() {
		if (this.configLoaded) return;

		if (typeof this.configFile === "undefined" || this.configFile === null || this.configFile === true) {
			this.configFile = [
				path.join(this.context.homeDir, ".babelrc"),
				path.join(this.context.homeDir, "babel.config.js"),
			].find(path => {
				if (fs.existsSync(path)) return true;
				return false;
			});
		} else if (typeof this.configFile === "string") {
			const configPath = path.join(this.context.homeDir, this.configFile);
			if (!fs.existsSync(configPath)) {
				throw new Error(`Babel7Plugin - configuration file not found on path ${configPath}`);
			}
			this.configFile = configPath;
		}

		if (typeof this.configFile === "string") {
			let configFileContents;

			const ext = path.extname(this.configFile);

			if (ext === "" || ext === ".json") {
				configFileContents = JSON.parse(fs.readFileSync(this.configFile).toString());
			} else if ([".js", ".jsx", ".mjs", ".ts", ".tsx"].includes(ext)) {
				configFileContents = require(this.configFile);
				if (typeof configFileContents !== "object") {
					throw new Error(
						"Babel7Plugin - your configuration file must have an object as default export./n	e.g: module.exports = { presets: ['@babel/preset-env'] }",
					);
				}
			}

			configFileContents.filenameRelative = this.context.homeDir;

			// Load partial config and validate options
			const partialConfig = babel7Core.loadPartialConfig(configFileContents);
			Object.assign(this.config, partialConfig.options, this.config);
		}

		// Flatten presets into plugins and validate over-all configuration
		this.config.root = this.context.homeDir;
		this.config.filenameRelative = this.context.homeDir;
		this.config = babel7Core.loadOptions(this.config);

		this.configLoaded = true;
	}

	/**
	 * @param {WorkFlowContext} context
	 */
	public init(context: WorkFlowContext) {
		// Ensure babel7 is installed
		try {
			babel7Core = require("@babel/core");
		} catch (error) {
			if (error.code === "MODULE_NOT_FOUND") {
				const message = "Babel7Plugin - requires @babel/core to be installed";
				throw new Error(message);
			}
			throw error;
		}
		this.context = context;
		if (Array.isArray(this.extensions)) {
			this.extensions.forEach(ext => context.allowExtension(ext));
		}
		this.loadOptionsAndValidate();
	}

	/**
	 * @param {File} file
	 */
	public transform(file: File) {
		file.wasTranspiled = true;

		if (this.configPrinted === false && this.context.doLog === true) {
			file.context.debug("Babel7Plugin", `\n\tConfiguration: ${JSON.stringify(this.config, null, 2)}`);
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
			const fileConfig = Object.assign({ filename: file.relativePath }, this.config);
			let result;
			try {
				result = babel7Core.transformSync(file.contents, fileConfig);
			} catch (e) {
				file.analysis.skip();
				this.context.log.error(e);
				return;
			}

			// By default we would want to limit the babel
			// And use acorn instead (it"s faster)
			if (result.ast) {
				// When using @babel/preset-env with, for example, useBuiltIns: 'entry' | 'usage'
				// It adds `require` statements to core-js or @babel/polyfill
				// So transverse and resolve import declarations if any found
				ASTTraverse.traverse(result.ast, {
					pre: (node, parent, prop, idx) => ImportDeclaration.onNode(file, node, parent),
				});
				ImportDeclaration.onEnd(file);

				file.analysis.loadAst(result.ast);
				let sourceMaps = result.map;

				// escodegen does not really like babel
				// so a custom function handles transformation here if needed
				// This happens only when the code is required regeneration
				// for example with aliases -> in any cases this will stay untouched
				file.context.setCodeGenerator(ast => {
					const result = babel7Core.transformFromAstSync(
						ast,
						void 0,
						Object.assign({ filename: file.relativePath }, this.config),
					);
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
