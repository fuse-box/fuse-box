import { WorkFlowContext } from "./../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";

const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

// additional options for StyledComponents
export interface StyledComponentsPluginOptions {
	getDisplayName?: (filename: string, bindingName: string | undefined) => string;
  identifiers?: CustomStyledIdentifiers;
  ssr?: boolean;
  displayName?: boolean;
}

// allows to customize identifiers used by styled-components API functions
interface CustomStyledIdentifiers {
  styled: string[];
  attrs: string[];
}

/**
 * @export
 * @class StyledComponentsPluginClass
 * @implements {Plugin}
 */
export class StyledComponentsPluginClass implements Plugin {
	/**
	 * @type {any}
	 * @memberOf StyledComponentsPluginClass
	 */
  public options: StyledComponentsPluginOptions;
  public getDisplayName(filename: string, bindingName: string | undefined): string | undefined {
    // if not bindingName, then filename in PascalCase
    return bindingName || filename;
  };
  public identifiers;
  public ssr = false;
  public displayName = true;
	constructor(options: StyledComponentsPluginOptions = {}) {
    this.options = options;
    if (this.options.getDisplayName !== undefined) {
			this.getDisplayName = this.options.getDisplayName;
		}
    if (this.options.identifiers !== undefined) {
			this.identifiers = this.options.identifiers;
		}
    if (this.options.identifiers !== undefined) {
			this.identifiers = this.options.identifiers;
		}
    if (this.options.ssr !== undefined) {
			this.ssr = this.options.ssr;
		}
		if (this.options.displayName !== undefined) {
			this.displayName = this.options.displayName;
    }
  }
  public tempTransformer() {
    return null
  }

  public init(context: WorkFlowContext) {
    context.allowExtension(".jsx");
    const styledComponentsTransformer = createStyledComponentsTransformer(this.options);
    context.fuse.opts.transformers = {
      before: [styledComponentsTransformer]
    }
  }
}

export const StyledComponentsPlugin = (options?: StyledComponentsPluginOptions) => {
	return new StyledComponentsPluginClass(options);
};