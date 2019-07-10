import { BundleType, createBundle } from '../../bundle/Bundle';
import { beautifyBundleName, fastHash } from '../../utils/utils';
import { IProductionFlow } from '../main';
import { ProductionModule } from '../ProductionModule';
import { ESLink } from '../structure/ESLink';

interface ICodeSplittingStageProps {
  flow: IProductionFlow;
}

function trace2entry(props: IProductionFlow, target: ProductionModule, rootLink: ESLink) {
  let traced = false;
  const root = rootLink.dynamicImportTarget;
  for (const dependant of target.dependants) {
    if (dependant === rootLink) {
      traced = true;
    } else {
      traced = trace2entry(props, dependant.productionModule, rootLink);
      if (!traced) return;
    }
  }
  if (traced) root.dynamicDependencies.push(target);
  return traced;
}

function traceDependencies(props: IProductionFlow, productionModule: ProductionModule, rootLink: ESLink) {
  productionModule.structure.findFromLinks().forEach(fromLink => {
    trace2entry(props, fromLink.fromSourceTarget, rootLink);
  });
}
function processEntry(props: IProductionFlow, rootLink: ESLink) {
  const entry = rootLink.dynamicImportTarget;

  trace2entry(props, entry, rootLink);
  traceDependencies(props, entry, rootLink);
}
export function codeSplittingStage(props: IProductionFlow) {
  const { productionContext } = props;

  const log = props.ctx.log;

  const opts: ICodeSplittingStageProps = {
    flow: props,
  };

  if (productionContext.dynamicLinks.length === 0) {
    return;
  }

  log.progress('<dim><bold>- Code splitting stage </bold></dim>');
  productionContext.dynamicLinks.forEach(link => {
    const root = link.dynamicImportTarget;
    processEntry(props, link);

    if (root.dynamicDependencies.length > 0) {
      const bundle = createBundle({
        ctx: props.ctx,
        name: fastHash(root.module.props.absPath) + '-' + beautifyBundleName(root.module.props.absPath),
        webIndexed: false,
        type: BundleType.SPLIT_JS,
      });
      bundle.noHash = true;
      props.ctx.log.progressFormat(
        'Code splitting',
        'Created bundle <magenta>$name</magenta> with entry <green>$entry</green>',
        {
          name: bundle.name,
          entry: root.getShortPath(),
        },
      );
      for (const pm of root.dynamicDependencies) {
        props.ctx.log.progressFormat('Code splitting', '<magenta>$name</magenta> <- <green>$path</green>', {
          name: bundle.name,
          path: pm.getShortPath(),
        });
        pm.splitBundle = bundle;
      }
    }
  });

  log.progressEnd('<green><bold>$checkmark Code splitting stage completed</bold></green>');
}
