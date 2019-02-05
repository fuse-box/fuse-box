import { WorkFlowContext } from "./../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";

/**
 * @export
 * @class StyledComponentsPluginClass
 * @implements {Plugin}
 */
export class StyledComponentsPluginClass implements Plugin {
	public options;
	constructor(options = {}) {
		this.options = options;
	}

	public init(context: WorkFlowContext) {
		if (typeof require.resolve === "function") {
			try {
				require.resolve("typescript-plugin-styled-components");
			} catch (e) {
				throw new Error(
					`Cannot find module 'typescript-plugin-styled-components', install it to devDependency\nnpm install --save-dev typescript-plugin-styled-components`,
				);
			}
		}
		const createStyledComponentsTransformer = require("typescript-plugin-styled-components").default;
		context.allowExtension(".tsx");
		const styledComponentsTransformer = createStyledComponentsTransformer(this.options);
		context.fuse.opts.transformers = {
			before: [styledComponentsTransformer],
		};
	}
}

export const StyledComponentsPlugin = options => {
	return new StyledComponentsPluginClass(options);
};
