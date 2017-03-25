import { WorkFlowContext } from "../core/WorkflowContext";

export class OptimizeJSClass {
  public test: RegExp = /\.(j|t)s(x)?$/;
  public config?: Object | any = null;
  public context: WorkFlowContext;

  public static init(config: any) {
      return new OptimizeJSClass(config);
  };

  constructor(config: any) {
    if (config !== null) this.config = config
  }

  public init(context: WorkFlowContext) {
    this.context = context
  }

  public transform(file, ast) {
    const optimizeJs = require('optimize-js')
    let output
    try {
      output = optimizeJs(file.contents, this.config)
      if (this.context.doLog === true) {
        file
          .context
          .debug("OptimizeJSPlugin",
            `\n\tOptimized: ${JSON.stringify(this.config)}`);
      }
      file.contents = output
    } catch (error) {
      this.context.log.echoWarning('error in OptimizeJSPlugin')
    }
    file.analysis.analyze()
  }
};

export const OptimizeJSPlugin = OptimizeJSClass.init
