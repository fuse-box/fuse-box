import * as path from "path";
import { File } from "../../core/File";
import { Plugin, WorkFlowContext } from "../../core/WorkflowContext";
import { isStylesheetExtension } from "../../Utils";

export interface CSSPluginOptions {}

const ensureCSSExtension = (file: File | string): string => {
	let str = file instanceof File ? file.info.fuseBoxPath : file;
	const ext = path.extname(str);
	if (ext !== ".css") {
		return str.replace(ext, ".css");
	}
	return str;
};
/**
 *
 *
 * @export
 * @class FuseBoxCSSPlugin
 * @implements {Plugin}
 */
export class CSSPluginClass implements Plugin {
	/**
	 *
	 *
	 * @type {RegExp}
	 * @memberOf FuseBoxCSSPlugin
	 */
	public test: RegExp = /\.css$/;
	private minify = false;
	public options: CSSPluginOptions;

	public dependencies: ["fuse-box-css"];

	constructor(opts: CSSPluginOptions = {}) {
		this.options = opts;
	}

	public injectFuseModule(file: File) {
		file.addStringDependency("fuse-box-css");
	}
	/**
	 *
	 *
	 * @param {WorkFlowContext} context
	 *
	 * @memberOf FuseBoxCSSPlugin
	 */
	public init(context: WorkFlowContext) {
		context.allowExtension(".css");
	}

	public getFunction() {
		return `require("fuse-box-css")`;
	}

	public emitHMR(file: File, resolvedPath?: string) {
		let emitRequired = false;
		const bundle = file.context.bundle;
		// We want to emit CSS Changes only if an actual CSS file was changed.
		if (bundle && bundle.lastChangedFile) {
			const lastFile = file.context.convertToFuseBoxPath(bundle.lastChangedFile);
			if (isStylesheetExtension(bundle.lastChangedFile)) {
				if (
					lastFile === file.info.fuseBoxPath ||
					file.context.getItem("HMR_FILE_REQUIRED", []).indexOf(file.info.fuseBoxPath) > -1
				) {
					emitRequired = true;
				}

				if (file.subFiles.find(subFile => subFile.info.fuseBoxPath === bundle.lastChangedFile)) {
					emitRequired = true;
				}
			}
		}

		if (emitRequired) {
			if (resolvedPath) {
				file.context.hmrEmitter.emit({
					event: "soruce-changed",
					data: {
						type: "hosted-css",
						resolvedPath,
					},
				});
			} else {
				file.context.hmrEmitter.emit({
					event: "source-changed",
					data: {
						type: "css",
						content: file.alternativeContent,
						path: file.info.fuseBoxPath,
					},
				});
			}
		}
	}
	/**
	 *
	 *
	 * @param {File} file
	 *
	 * @memberOf FuseBoxCSSPlugin
	 */
	public async transform(file: File) {
		if (!file.context.sourceMapsProject) {
			file.sourceMap = undefined;
		}

		this.injectFuseModule(file);

		file.loadContents();

		let filePath = file.info.fuseBoxPath;
		file.contents = file.contents;
		if (typeof file.sourceMap === "string") {
			file.sourceMap = file.generateCorrectSourceMap();
		}

		if (file.sourceMap && file.context.useSourceMaps) {
			file.generateInlinedCSS();
		}
		let safeContents = JSON.stringify(file.contents);
		file.sourceMap = undefined;

		const fullPath = `${(file.collection && file.collection.name) || "default"}/${filePath}`;
		file.addAlternativeContent(`${this.getFunction()}("${fullPath}", ${safeContents})`);

		// We want to emit CSS Changes only if an actual CSS file was changed.
		this.emitHMR(file);
	}
}

export const CSSPlugin = (opts?: CSSPluginOptions) => {
	return new CSSPluginClass(opts);
};
