import { IProductionFlow } from '../main';
import { ProductionModule } from '../ProductionModule';
import { truncate } from 'fs';
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

  if (traced) {
    props.ctx.log.progressFormat('Code splitting', 'entry of <green>$entry</green> added <magenta>$path</magenta>', {
      entry: root.module.getShortPath(),
      path: target.module.getShortPath(),
    });
    root.dynamicDependencies.push(target);
    //   const sourceLinks = target.structure.findFromLinks();
    //   sourceLinks.forEach(dep => {
    //     trace2entry(props, dep.productionModule, rootLink);
    //   });
    // }
  }

  return traced;
}

function traceDependencies(props: IProductionFlow, productionModule: ProductionModule, rootLink: ESLink) {
  console.log('trace deps of ', productionModule.module.getShortPath());
  productionModule.structure.findFromLinks().forEach(fromLink => {
    const dependency = fromLink.fromSourceTarget;
    trace2entry(props, dependency, rootLink);
  });
  console.log('**********');
}
function processEntry(props: IProductionFlow, rootLink: ESLink) {
  console.log('>>>>', rootLink.productionModule.module.getShortPath());

  const entry = rootLink.dynamicImportTarget;

  traceDependencies(props, entry, rootLink);

  //trace2entry(props, productionModule, rootLink);
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

    root.dynamicDependencies.forEach(dep => {
      console.log('>>', dep.module.getShortPath());
    });
    console.log('------------');
  });

  log.progressEnd('<green><bold>$checkmark Code splitting stage completed</bold></green>');
}
