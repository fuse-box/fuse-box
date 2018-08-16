import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
import * as postcss from "postcss";
import * as log from "fliplog";

export interface CSSModulesOptions {
	useDefault?: boolean;
	scopedName?: string;
	paths?: string[];
	root?: string;
}

export class CSSModulesClass implements Plugin {
	public test: RegExp = /\.css$/;
	public options: CSSModulesOptions;
	public useDefault = true;
	public scopedName;

	constructor(options: CSSModulesOptions = {}) {
		this.options = options;
		if (this.options.useDefault !== undefined) {
			this.useDefault = this.options.useDefault;
		}
		if (this.options.scopedName !== undefined) {
			this.scopedName = this.options.scopedName;
		}
	}

	public init(context: WorkFlowContext) {
		context.allowExtension(".css");
	}

	public transform(file: File): Promise<any> {
		file.addStringDependency("fuse-box-css");

		if (file.isCSSCached("cssmodules")) {
			return;
		}
		file.bustCSSCache = true;

		return new Promise((resolve, reject) => {
			file.loadContents();
			const context = file.context;

			const paths = [file.info.absDir, ...(this.options.paths || [])];

			const cssDependencies = context.extractCSSDependencies(file, {
				paths,
				content: file.contents,
				extensions: ["css"],
			});
			file.cssDependencies = cssDependencies;

			return postcss([
				require("postcss-modules")({
					root: this.options.root || file.info.absDir,
					getJSON: (cssFileName, json) => {
						const exportsKey = this.useDefault ? "module.exports.default" : "module.exports";
						const cnt = [];
						if (this.useDefault) {
							cnt.push(`Object.defineProperty(exports, "__esModule", { value: true });`);
						}
						cnt.push(`${exportsKey} = ${JSON.stringify(json)};`);
						file.addAlternativeContent(cnt.join("\n"));
					},
					generateScopedName: this.scopedName ? this.scopedName : "_[local]___[hash:base64:5]",
				}),
			])
				.process(file.contents, {})
				.then(result => {
					file.contents = result.css;
					if (context.useCache) {
						file.analysis.dependencies = cssDependencies;
						context.cache.writeStaticCache(file, file.sourceMap, "cssmodules");
						file.analysis.dependencies = [];
					}
					return resolve();
				});
		});
	}
}

export const CSSModulesPlugin = (options?: CSSModulesOptions) => new CSSModulesClass(options);

export const CSSModules: typeof CSSModulesPlugin = options => {
	log
		.preset("warning")
		.data("CSSModulesPlugin deprecation notice: please rename your CSSModules imports to CSSModulesPlugin")
		.echo();

	return CSSModulesPlugin(options);
};
