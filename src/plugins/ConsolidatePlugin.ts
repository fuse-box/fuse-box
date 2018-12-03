import { Plugin, WorkFlowContext } from "../core/WorkflowContext";
import { File } from "../core/File";

export interface IConsolidatePluginOptions {
	engine: string;
	extension?: string;
	useDefault?: boolean;
	baseDir?: string;
	includeDir?: string;
}

export class ConsolidatePluginClass implements Plugin {
	public test: RegExp;
	private extension: string;
	private engine: string;
	private useDefault: boolean;
	private baseDir: string;
	private includeDir: string;

	constructor(options: IConsolidatePluginOptions) {
		if (!options.engine) {
			const message = "ConsolidatePlugin - requires an engine to be provided in the options";
			throw new Error(message);
		}

		this.engine = options.engine;
		this.extension = options.extension || `.${options.engine}`;
		this.useDefault = options.useDefault !== undefined ? options.useDefault : true;
		this.baseDir = options.baseDir;
		this.includeDir = options.includeDir;
		this.test = new RegExp(this.extension);
	}

	public init(context: WorkFlowContext) {
		context.allowExtension(this.extension);
	}

	public async transform(file: File) {
		const consolidate = require("consolidate");

		if (file.context.useCache) {
			const cached = file.context.cache.getStaticCache(file);

			if (cached) {
				file.isLoaded = true;
				file.contents = cached.contents;
				return Promise.resolve();
			}
		}

		file.loadContents();

		if (!consolidate[this.engine]) {
			const message = `ConsolidatePlugin - consolidate did not recognise the engine "${this.engine}"`;
			file.context.log.echoError(message);
			return Promise.reject(new Error(message));
		}

		try {
			file.contents = await consolidate[this.engine].render(file.contents, {
				cache: false,
				filename: "base",
				basedir: this.baseDir || file.context.homeDir,
				includeDir: this.includeDir || file.context.homeDir,
			});

			if (this.useDefault) {
				file.contents = `module.exports.default = ${JSON.stringify(file.contents)}`;
			} else {
				file.contents = `module.exports = ${JSON.stringify(file.contents)}`;
			}
		} catch (e) {
			file.context.log.echoError(`ConsolidatePlugin - could not process template, ${e}`);
			return Promise.reject(e);
		}

		if (file.context.useCache) {
			file.context.emitJavascriptHotReload(file);
			file.context.cache.writeStaticCache(file, file.sourceMap);
		}
	}
}

export const ConsolidatePlugin = (options: IConsolidatePluginOptions) => {
	return new ConsolidatePluginClass(options);
};
