import { WorkFlowContext } from "../core/WorkflowContext";

// interface OptimizeJSPluginOptions {

// }

export class OptimizeJSClass {
  public test: RegExp = /\.(j|t)s(x)?$/;
  public opts?: Object | any = null;
  public context: WorkFlowContext;

  public static init(config: any) {
      return new OptimizeJSClass(config);
  };

  constructor(opts?: any) {
    if (opts !== null) this.opts = opts
  }

  public init(context: WorkFlowContext) {
    this.context = context
  }

  public transform(file, ast) {
    const optimizeJs = require('optimize-js')
    let output
    try {
      output = optimizeJs(file.contents, this.opts)
      if (this.context.doLog === true) {
        file
          .context
          .debug("OptimizeJSPlugin",
            `\n\tOptimized: ${JSON.stringify(this.opts)}`);
      }
      file.contents = output
    } catch (error) {
      this.context.log.echoWarning('error in OptimizeJSPlugin')
    }
    file.analysis.analyze()
  }
};

export const OptimizeJSPlugin = OptimizeJSClass.init
