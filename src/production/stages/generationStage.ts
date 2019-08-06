import { Bundle, BundleType, createBundle } from '../../bundle/Bundle';
import { IProductionFlow } from '../main';
import { ProductionModule } from '../ProductionModule';

interface IBundleGenerationStageProps {
  flow: IProductionFlow;
}

function getCorrespondingBundle(props: IBundleGenerationStageProps, pm: ProductionModule) {
  let bundle: Bundle;
  const bundles = props.flow.productionContext.bundles;

  if (props.flow.ctx.useSingleBundle) {
    bundle = bundles.find(bundle => bundle.props.type === BundleType.PROJECT_JS);
    if (!bundle) {
      bundle = createBundle({
        ctx: props.flow.ctx,
        name: 'app',
        priority: 10,
        webIndexed: true,
        type: BundleType.PROJECT_JS,
      });
      bundles.push(bundle);
    }
    return bundle;
  }
  if (pm.module.isStylesheet()) {
    bundle = bundles.find(bundle => bundle.props.type === BundleType.CSS);
    if (!bundle) {
      bundle = createBundle({
        ctx: props.flow.ctx,
        name: 'styles',
        priority: 10,
        webIndexed: true,
        type: BundleType.CSS,
      });
      bundles.push(bundle);
    }
    return bundle;
  } else if (pm.splitBundle) {
    // a module can belond to a split bundle
    // it is defined ealier at the code splitting stage
    // in this case we should check if the bundle was added to the list
    bundle = pm.splitBundle;
    if (!bundles.find(b => b.name === pm.splitBundle.name)) {
      bundles.push(bundle);
    }
  } else if (pm.module.pkg.isDefaultPackage) {
    bundle = bundles.find(bundle => bundle.props.type === BundleType.PROJECT_JS);
    if (!bundle) {
      bundle = createBundle({
        ctx: props.flow.ctx,
        name: 'app',
        priority: 10,
        webIndexed: true,
        type: BundleType.PROJECT_JS,
      });
      bundles.push(bundle);
    }
  } else {
    bundle = bundles.find(bundle => bundle.props.type === BundleType.VENDOR_JS);
    if (!bundle) {
      bundle = createBundle({
        ctx: props.flow.ctx,
        name: 'vendor',
        priority: 2,
        webIndexed: true,
        type: BundleType.VENDOR_JS,
      });
      bundles.push(bundle);
    }
  }
  return bundle;
}

function acceptStylesheet(props: IBundleGenerationStageProps, pm: ProductionModule) {
  const log = props.flow.ctx.log;
  const bundle = getCorrespondingBundle(props, pm);
  if (!pm.module.css) {
    log.warn(
      'Failed to retreive css property in $file. Make sure the plugin sets IStylesheetModuleResponse to "css" property on the module',
      {
        file: pm.module.props.absPath,
      },
    );
    return;
  }
  const data = pm.module.css;
  log.progressFormat('CSS', 'Adding css from <green>$from</green> to bundle <magenta>"$bundle"</magenta>', {
    bundle: bundle.props.name,
    from: pm.module.getShortPath(),
  });
  bundle.addContent(data.css, data.map);
}

function acceptModule(props: IBundleGenerationStageProps, pm: ProductionModule) {
  const log = props.flow.ctx.log;
  const wrapper = props.flow.ctx.productionApiWrapper;
  props.flow.ctx.productionApiWrapper.wrapModule;

  if (pm.module.isStylesheet()) {
    if (pm.ctx.config.supportsStylesheet()) {
      acceptStylesheet(props, pm);
    }
  } else {
    pm.productionContent = wrapper.wrapModule(pm);
    const bundle = getCorrespondingBundle(props, pm);
    bundle.addConcat(pm.productionContent);
  }
}

export function generationStage(props: IProductionFlow) {
  const { productionContext } = props;

  const log = props.ctx.log;

  const opts: IBundleGenerationStageProps = {
    flow: props,
  };

  log.progress('<dim><bold>- Bundle generation stage </bold></dim>');
  productionContext.schema.forEach(pm => acceptModule(opts, pm));

  log.progressEnd('<green><bold>$checkmark Bundles are ready</bold></green>');
}
