import { File } from '../File';
import { WorkFlowContext } from '../WorkflowContext';
import { Plugin } from '../WorkflowContext';

/**
 * @export
 * @class RawPluginClass
 * @implements {Plugin}
 */
export class RawPluginClass implements Plugin {
	/**
	 * @type {RegExp}
	 * @memberOf RawPluginClass
	 */
	public test: RegExp = /.*/;
	/**
	 * @type {Array<string>}
	 * @memberOf RawPluginClass
	 */
	public extensions: Array<string>;

	constructor(options: any) {
		if ('extensions' in (options || {})) this.extensions = options.extensions;
	}

	init(context: WorkFlowContext) {
		if (Array.isArray(this.extensions)) {
			return this.extensions.forEach(ext => context.allowExtension(ext));
		}
	}

	transform(file: File) {
		file.loadContents();
		file.contents = `module.exports = ${JSON.stringify(file.contents)}`;
	}
}

export const RawPlugin = (options) => {
	return new RawPluginClass(options);
}