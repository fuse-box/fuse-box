import { File } from "../File";
import { WorkFlowContext } from "../WorkflowContext";
import { Plugin } from "../WorkflowContext";

import * as acorn from "acorn";
import * as SourceMap from "source-map";

/**
 * @export
 * @class SourceMapPluginClass
 * @implements {Plugin}
 */
export class SourceMapPluginClass implements Plugin {
	/**
	 * @type {RegExp}
	 * @memberOf SourceMapPluginClass
	 */
	public test: RegExp = /\.js$/;
	/**
	 * @type {WorkFlowContext}
	 * @memberOf SourceMapPluginClass
	 */
	private context: WorkFlowContext;

	constructor(options?: any) {
		options = options || {};

		if ('test' in options) this.test = options.test;
	}

	init(context: WorkFlowContext) {
		this.context = context;

		context.allowExtension(".js");
	}

	transform(file: File) {
		const tokens = [];
		
		if (this.context.useCache) {
		    const cached = this.context.cache.getStaticCache(file);

		    if (cached) {
		        if (cached.sourceMap) {
		            file.sourceMap = cached.sourceMap;
		        }

		        file.analysis.skip();
		        file.analysis.dependencies = cached.dependencies;
		        file.contents = cached.contents;

		        return true;
		    }
		}

		file.loadContents();

		if ('sourceMapConfig' in this.context) {
			file.makeAnalysis({onToken: tokens});
			file.sourceMap = this.getSourceMap(file, tokens);
		} else {
			file.makeAnalysis();
		}
	}

	private getSourceMap(file: File, tokens: Array<any>): string {
		const fileContent = file.contents;
		const filePath = file.info.fuseBoxPath
		const smGenerator = new SourceMap.SourceMapGenerator({file: filePath});

		tokens.some(token => {
			if (token.type.label === "eof") return true;

			const lineInfo = acorn.getLineInfo(fileContent, token.start);
			const mapping = {
				original: lineInfo,
				generated: lineInfo,
				source: filePath,
				name: false
			};

			if (token.type.label === "name") mapping.name = token.value;

			smGenerator.addMapping(mapping);
		});

		smGenerator.setSourceContent(filePath, fileContent);

		return JSON.stringify(smGenerator.toJSON());
	}
}

export const SourceMapPlugin = (options?:any) => {
	return new SourceMapPluginClass(options);
}