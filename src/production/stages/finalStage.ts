import { BundleType, IBundleWriteResponse } from '../../bundle/Bundle';
import { renderProductionAPI } from '../api/renderProductionAPI';
import { IProductionFlow } from '../main';
import * as CleanCSS from 'clean-css';
import * as Terser from 'terser';
interface IFinalStageProps {
  flow: IProductionFlow;
}

function findEntryIds(props: IProductionFlow): Array<number> {
  const ids = [];
  props.productionContext.getProjectEntries().forEach(entry => {
    ids.push(entry.productionModule.getId());
  });
  return ids;
}

function minifyCSS(props: IProductionFlow) {
  const { productionContext, ctx } = props;
  const log = props.ctx.log;
  const cssBundles = productionContext.bundles.filter(b => b.props.type === BundleType.CSS);

  cssBundles.forEach(cssBundle => {
    let sourceMap;
    if (cssBundle.contents.sourceMap) {
      sourceMap = cssBundle.contents.sourceMap.toString();
    }
    log.progressFormat('css optimize', 'Optimising css bundlde "$bundle"', { bundle: cssBundle.props.name });
    const response = new CleanCSS(
      Object.assign({} || {}, {
        sourceMap: true,
        sourceMapInlineSources: true,
      }),
    ).minify(cssBundle.contents.content.toString(), sourceMap);
    cssBundle.override(response.styles, response.sourceMap.toString());
  });
}

/**
 * Uglify bundles
 * @param props
 */
function uglifyBundles(props: IProductionFlow) {
  const config = props.ctx.config.production;
  if (!config.uglify) return;

  const log = props.ctx.log;

  const { productionContext } = props;
  const jsBundles = productionContext.bundles.filter(b => b.isJavascriptType());

  jsBundles.forEach(bundle => {
    log.progressFormat('uglify', 'Uglifying js bundle "$bundle"', { bundle: bundle.props.name });
    const opts: any = typeof config.uglify === 'object' ? config.uglify : {};
    if (bundle.needsSourceMaps()) {
      opts.sourceMap = {
        includeSources: true,
        content: bundle.contents.sourceMap,
        //url: bundle.generatedSourceMapsPath,
      };
    }
    const result = Terser.minify(bundle.contents.content.toString(), opts);
    if (result.error) {
      log.warn(`Error during uglifying ${bundle.props.name} ${result.error}`);
      return;
    }
    bundle.override(result.code, result.map);
  });
}

export async function finalStage(props: IProductionFlow) {
  const { productionContext, ctx } = props;
  const wrapper = ctx.productionApiWrapper;

  const config = props.ctx.config;
  const log = props.ctx.log;

  const opts: IFinalStageProps = {
    flow: props,
  };

  log.progress('<dim><bold>- Entering final stage </bold></dim>');

  // get all webindexed js bundles
  const webIndexJSBundles = productionContext.bundles.filter(
    b => b.props.webIndexed && b.props.type !== BundleType.CSS,
  );

  // sort them
  const sorted = webIndexJSBundles.sort((a, b) => a.props.priority - b.props.priority);
  const fistBundle = sorted[0];
  const lastBundle = sorted[sorted.length - 1];

  if (productionContext.dynamicLinks.length) {
    const splitConfig: any = {
      entries: {},
    };
    // dynamic links contain ESLink that represent a dynamic import (import())
    // each link has dynamicImportTarget which is in fact an entry to the split bundle
    productionContext.dynamicLinks.forEach(l => {
      if (l.dynamicImportTarget && l.dynamicImportTarget.splitBundle) {
        splitConfig.entries[l.dynamicImportTarget.getId()] = l.dynamicImportTarget.splitBundle.getFileName();
      }
    });
    //console.log(splitConfig);
  }

  // render production api ***************
  const api = renderProductionAPI({
    browser: ctx.config.target === 'browser',
    webworker: ctx.config.target === 'web-worker',
    server: ctx.config.target === 'server',
    allowSyntheticDefaultImports: config.allowSyntheticDefaultImports,
  });
  log.progressFormat('API', `Injecting production api into <magenta>${fistBundle.name}</magenta> bundle`);
  fistBundle.prependContent(api);

  // add entry points *********************
  wrapper.addEntries(findEntryIds(props), lastBundle);

  if (props.ctx.config.target === 'web-worker') {
    fistBundle.prependContent('(function(){');
    fistBundle.addContent('})()');
  }

  // minifyCSS
  minifyCSS(props);

  uglifyBundles(props);

  const bundleResponses: Array<IBundleWriteResponse> = [];
  for (const bundle of productionContext.bundles) {
    bundleResponses.push(await bundle.generate().write());
  }

  log.progressEnd('<green><bold>$checkmark Success!</bold></green>');
  return bundleResponses;
}
