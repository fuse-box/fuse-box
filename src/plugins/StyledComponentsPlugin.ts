import { WorkFlowContext } from "./../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";

const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

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
  public tempTransformer() {
    return null
  }

  public init(context: WorkFlowContext) {
    context.allowExtension(".tsx");
    const styledComponentsTransformer = createStyledComponentsTransformer(this.options);
    context.fuse.opts.transformers = {
      before: [styledComponentsTransformer]
    }
  }
}

export const StyledComponentsPlugin = (options) => {
	return new StyledComponentsPluginClass(options);
};