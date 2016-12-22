import { PluginChain } from '../PluginChain';
import { File } from '../File';
import { WorkFlowContext } from '../WorkflowContext';
import { Plugin } from '../WorkflowContext';
import * as fs from 'fs';

export interface PluginConfig {
	type?: string;
	test?: RegExp;
	ext?: string;
	options: Object;
	render?: Function;
}

const predefinedExt: Map<string, string> = new Map([
	['less', '.less'],
	['stylus', '.styl'],
	['sass', '.scss']
]);

export class PreCSSPluginClass implements Plugin {
	private processorType: string = 'less';
	private processor: Function;

	public test: RegExp = this.createRegExpFromExt(predefinedExt.get(this.processorType));
	public ext: string = predefinedExt.get(this.processorType);

	constructor (public opts: PluginConfig) {
		this.opts = opts;
		
		if (opts.type) {
			this.processorType = opts.type;

			if (predefinedExt.has(this.processorType)) {
				this.ext = predefinedExt.get(this.processorType);
				this.test = this.createRegExpFromExt(predefinedExt.get(this.processorType));
			}
		}

		if (opts.test) this.test = opts.test;
		if (opts.ext) this.ext = opts.ext;

		this.processor = this.prepareProcessor();
	}

	init (context: WorkFlowContext) {
		context.allowExtension(this.ext);
	}

	transform (file: File): Promise<PluginChain> {
		file.loadContents();

		return this.compile(file.contents).then(content => {
			file.contents = content;

			return file.createChain('style', file);
		});
	}

	private prepareProcessor (): Function {
		if (this.opts.render) return this.opts.render;

		return require(`./precss/${this.processorType}`).render;
	}

	private compile (content: string): Promise<string> {
		return this.processor(content, this.opts.options);
	}

	private createRegExpFromExt (ext: string): RegExp {
		return new RegExp(`\\${ext}$`);
	}
}

export const PreCSSPlugin = (options: PluginConfig) => {
	return new PreCSSPluginClass(options);
}