import { Context } from '../../core/Context';
import { Concat, createConcat } from '../../utils/utils';
import { ProductionModule } from '../ProductionModule';
import { Bundle } from '../../bundle/Bundle';

export class ProductionAPIWrapper {
  constructor(public ctx: Context) {}

  public wrapModule(pm: ProductionModule): Concat {
    const prodConf = this.ctx.config.production;
    const funcKey = prodConf.screwIE ? '(module, exports) => {' : 'function(module, exports){';

    let outputContent = pm.transpiledContent;
    let outputSourcemap = pm.transpiledSourceMap;
    if (!outputContent) {
      outputContent = pm.module.contents;
      outputSourcemap = pm.module.sourceMap;
    }
    const concat = createConcat(true, '', '\n');
    concat.add(null, `// ${pm.module.getShortPath()}`);
    concat.add(null, `$fsx.f[${pm.getId()}] = ${funcKey}`);
    concat.add(pm.module.getShortPath(), outputContent, outputSourcemap);
    concat.add(null, '}');
    return concat;
  }

  public addEntries(ids: Array<number>, bundle: Bundle) {
    if (ids.length === 1) {
      bundle.addContent('// Importing a single entry');
      bundle.addContent(`$fsx.r(${ids[0]})`);
    } else {
      bundle.addContent('// Importing multiple entries');
      bundle.addContent(`${JSON.stringify(ids)}.map(function(n){ $fsx.r(n)})`);
    }
  }
}
