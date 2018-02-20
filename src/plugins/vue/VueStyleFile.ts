import { VueBlockFile } from './VueBlockFile'
import { CSSPluginClass } from "../stylesheet/CSSplugin";
import { TrimPlugin, AddScopeIdPlugin } from './PostCSSPlugins';

export class VueStyleFile extends VueBlockFile {
  public fixSourceMapName () {
    if (this.context.useSourceMaps && this.sourceMap) {
      const jsonSourceMaps = JSON.parse(this.sourceMap);

      jsonSourceMaps.sources = jsonSourceMaps.sources.map((source) => {
        const fileName = source.substr(source.lastIndexOf('/') + 1);
        const dirPath = this.relativePath.substr(0, this.relativePath.lastIndexOf('/') + 1);
        return `${dirPath}${fileName}`;
      });

      this.sourceMap = JSON.stringify(jsonSourceMaps);
    }
  }

  private async applyScopeIdToStyles(scopeId: string) {
    const postcss = require('postcss');

    const plugins = [
      TrimPlugin(),
      AddScopeIdPlugin({ id: scopeId })
    ];

    return postcss(plugins).process(this.contents, {
      map: false,
      from: this.file.info.absPath
    }).then((result) => {
      this.contents = result.css;
    });
  }

  public async process() {
    this.loadContents();

    if (!this.contents) {
      return Promise.resolve();
    }

    const pluginChainString = this.pluginChain.map((plugin) => plugin.constructor.name).join(' → ');
    this.context.debug('VueComponentClass', `using ${pluginChainString} for ${this.info.fuseBoxPath}`);

    return this.pluginChain.reduce((chain, plugin) => {
      return chain.then(() => {
        if (plugin instanceof CSSPluginClass && this.block.scoped) {
          return this.applyScopeIdToStyles(this.scopeId);
        }

        return Promise.resolve();
      })
      .then(() => {
        const promise = plugin.transform(this);
        return (promise || Promise.resolve());
      });
    }, Promise.resolve(this))
    .then(() => {
      this.fixSourceMapName();
      return Promise.resolve();
    });
  }
}
