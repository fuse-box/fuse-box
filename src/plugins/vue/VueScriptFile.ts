import { VueBlockFile } from './VueBlockFile';
const typescriptTranspiler = require("typescript");

export class VueScriptFile extends VueBlockFile {
  public async process() {
    this.loadContents();

    if (this.pluginChain.length > 1) {
      return Promise.reject('VueComponentPlugin - only one script transpiler can be used in the plugin chain');
    }

    if (this.pluginChain.length === 0) {
      const transpiled = typescriptTranspiler.transpileModule(this.contents.trim(), this.context.getTypeScriptConfig());

      if (this.context.useSourceMaps && transpiled.sourceMapText) {
        const jsonSourceMaps = JSON.parse(transpiled.sourceMapText);
        jsonSourceMaps.sources = [this.context.sourceMapsRoot + "/" + this.relativePath.replace(/\.js(x?)$/, ".ts$1")];
        this.sourceMap = JSON.stringify(jsonSourceMaps);
      }

      this.contents = transpiled.outputText;

      return Promise.resolve();
    }

    // TODO: 2 big hacks here - needs a proper solution going forward
    this.pluginChain[0].init(this.context);
    (this.collection as any) = { name: 'default' };
    return this.pluginChain[0].transform(this);
  }
}
