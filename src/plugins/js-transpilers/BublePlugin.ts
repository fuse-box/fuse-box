import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";

let bubleCore;

/**
 * @tutorial https://buble.surge.sh/guide/#options
 * @export
 * @class FuseBoxBublePlugin
 * @implements {Plugin}
 */
export class BublePluginClass implements Plugin {
  public test: RegExp = /\.(j|t)s(x)?$/;
  public context: WorkFlowContext;
  private config?: any = {};
  private configPrinted = false;

  /**
   * @param {any} config BubleOptions + .test
   */
  constructor(config: any) {
    this.config = config || {};

    // so we do not pass it to buble, yet can use a flat config
    if (config.test !== undefined) {
      this.test = config.test;
      delete config.test;
    }
  }

  /**
   * @param {WorkFlowContext} context
   */
  public init(context: WorkFlowContext) {
    this.context = context;
    context.allowExtension('.jsx');
  }

  /**
   * @param {File} file
   */
  public transform(file: File, ast: any) {
    if (!bubleCore) {
      bubleCore = require('buble');
    }
    if (this.configPrinted === false && this.context.doLog === true) {
      file.context.debug(
        'BublePlugin',
        `\n\tConfiguration: ${JSON.stringify(this.config)}`,
      );
      this.configPrinted = true;
    }

    if (this.context.useCache) {
      if (file.loadFromCache()) {
        return
      }
    }

    let result;

    try {
      const config = {
        ...this.config,
        output: file.info.fuseBoxPath,
        source: file.info.absPath,
      }
      result = bubleCore.transform(file.contents, config);
    } catch (e) {
      file.analysis.skip();
      console.error(e);
      return
    }

    if (result.ast) {
      file.analysis.loadAst(result.ast);
      let sourceMaps = result.map;
      file.contents = result.code;
      file.analysis.analyze();

      if (sourceMaps) {
        sourceMaps.file = file.info.fuseBoxPath;
        sourceMaps.sources = [file.info.fuseBoxPath];
        file.sourceMap = JSON.stringify(sourceMaps);
      }

      if (this.context.useCache) {
        this.context.emitJavascriptHotReload(file);
        this.context.cache.writeStaticCache(file, file.sourceMap);
      }
    }
  }
}

export const BublePlugin = (opts: any) => {
  return new BublePluginClass(opts);
};
