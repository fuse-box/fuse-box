import { PluginChain } from '../PluginChain';
import { File } from '../File';
import { WorkFlowContext } from '../WorkflowContext';
import { Plugin } from '../WorkflowContext';

export class RawPluginClass implements Plugin {
	public test: RegExp = /.*/;

	init (context: WorkFlowContext): void {}

	transform (file: File) {
		file.loadContents();

		file.contents = `module.exports = ${JSON.stringify(file.contents)}`;
	}
}

export const RawPlugin = () => {
	return new RawPluginClass();
}