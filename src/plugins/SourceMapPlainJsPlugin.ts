import { File } from "../core/File";
import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";

import * as acorn from "acorn";
import * as SourceMap from "source-map";

export interface SourceMapPlainJsPluginOptions {
    ext?: string;
    test?: RegExp;
}

/**
 * @export
 * @class SourceMapPlainJsPluginClass
 * @implements {Plugin}
 */
export class SourceMapPlainJsPluginClass implements Plugin {
	/**
	 * @type {RegExp}
	 * @memberOf SourceMapPlainJsPluginClass
	 */
    public test: RegExp = /\.js$/;
	/**
	 * @type {string}
	 * @memberOf SourceMapPlainJsPluginClass
	 */
    public ext: string = ".js";
	/**
	 * @type {WorkFlowContext}
	 * @memberOf SourceMapPlainJsPluginClass
	 */
    private context: WorkFlowContext;

    constructor(options: SourceMapPlainJsPluginOptions = {}) {
        if (options.test) {
            this.test = options.test;
        }
        if (options.ext) {
            this.ext = options.ext;
        }
    }

    init(context: WorkFlowContext) {
        this.context = context;

        context.allowExtension(this.ext);
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

        if ("sourceMapConfig" in this.context) {
            file.makeAnalysis({ onToken: tokens });
            file.sourceMap = this.getSourceMap(file, tokens);
        } else {
            file.makeAnalysis();
        }
    }

    private getSourceMap(file: File, tokens: Array<any>): string {
        const fileContent = file.contents;
        const filePath = file.info.fuseBoxPath;
        const smGenerator = new SourceMap.SourceMapGenerator({ file: filePath });

        tokens.some(token => {
            if (token.type.label === "eof") return true;

            const lineInfo = acorn.getLineInfo(fileContent, token.start);
            const mapping = {
                original: lineInfo,
                generated: lineInfo,
                source: filePath,
                name: false,
            };

            if (token.type.label === "name") mapping.name = token.value;

            smGenerator.addMapping(mapping);
        });

        smGenerator.setSourceContent(filePath, fileContent);

        return JSON.stringify(smGenerator.toJSON());
    }
}

export const SourceMapPlainJsPlugin = (options?: SourceMapPlainJsPluginOptions) => {
    return new SourceMapPlainJsPluginClass(options);
};
