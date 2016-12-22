import { PluginChain } from '../PluginChain';
import { File } from '../File';
import { WorkFlowContext } from '../WorkflowContext';
import { Plugin } from '../WorkflowContext';

let stylus;

export class StylusPluginClass implements Plugin {
	public test: RegExp = /\.styl$/;
	public options: any;

	constructor (options: any) {
		this.options = options || {};
	}

	public init (context: WorkFlowContext) {
		context.allowExtension('.styl');
	}

	public transform (file: File): Promise<any> {
		file.loadContents();

		if (!stylus) stylus = require('stylus');

		return new Promise((res, rej) => {
			return stylus.render(file.contents, this.options, (err, css) => {
				if (err) return rej(err);

				file.contents = css;

				return res(true);
			});
		});
	}
}

export const StylusPlugin = (options: any) => {
	return new StylusPluginClass(options);
}