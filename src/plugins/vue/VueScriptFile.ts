import { VueBlockFile } from './VueBlockFile';

export class VueScriptFile extends VueBlockFile {
  public async process() {
    const typescriptTranspiler = require("typescript");
    this.loadContents();

    if (this.pluginChain.length > 1) {
      const message = 'VueComponentClass - only one script transpiler can be used in the plugin chain';
      this.context.log.echoError(message);
      return Promise.reject(new Error(message));
    }

    if (this.pluginChain[0] === null) {
      const transpiled = typescriptTranspiler.transpileModule(this.contents.trim(), this.context.tsConfig.getConfig());

      if (this.context.useSourceMaps && transpiled.sourceMapText) {
        const jsonSourceMaps = JSON.parse(transpiled.sourceMapText);
        jsonSourceMaps.sources = [this.context.sourceMapsRoot + "/" + this.relativePath.replace(/\.js(x?)$/, ".ts$1")];
        this.sourceMap = JSON.stringify(jsonSourceMaps);
      }

      this.contents = transpiled.outputText;
      this.context.debug('VueComponentClass', `using TypeScript for ${this.info.fuseBoxPath}`);
      return Promise.resolve();
    }

    // TODO: 2 big hacks here - needs a proper solution going forward
    this.pluginChain[0].init(this.context);
    (this.collection as any) = { name: 'default' };
    return this.pluginChain[0].transform(this);
  }
}
