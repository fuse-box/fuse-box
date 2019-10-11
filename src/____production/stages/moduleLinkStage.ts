import { IProductionFlow } from '../main';
import { ProductionModule } from '../ProductionModule';
import { createESModuleStructure } from '../structure/ESModuleStructure';

function linkModule(productionModule: ProductionModule, props: IProductionFlow) {
  const log = props.ctx.log;
  productionModule.structure = createESModuleStructure(productionModule, productionModule.file);
  const module = productionModule.module;

  const fromLinks = productionModule.structure.findFromLinks();
  const imports = module.fastAnalysis.imports;

  fromLinks.forEach(link => {
    const info = imports.find(imp => imp.statement === link.fromSource);
    if (!info || !info.link) return;
    if (info.link.package && info.link.resolver) {
      const packageTargetAbsPath = info.link.resolver.package.targetAbsPath;
      const targetProductionPackage = info.link.package.productionPackage;

      const targetModule = targetProductionPackage.pkg.modules.find(mod => mod.props.absPath === packageTargetAbsPath);
      if (targetModule) {
        link.fromSourceTarget = targetModule.productionModule;
      }
      if (targetModule && targetModule.isExecutable()) {
        log.verbose(
          'Link package',
          `<cyan>$fromSource</cyan> from <magenta>$origin</magenta> to <green>$target</green>`,
          {
            fromSource: link.fromSource,
            origin: module.getShortPath(),
            target: targetModule.getShortPath(),
          },
        );

        const targetProductionModule = targetModule.productionModule;
        // linking reference
        link.productionModule = productionModule;
        targetProductionModule.dependants.push(link);
      }
    }

    if (info.link.module) {
      const target = info.link.module.productionModule;
      if (link.isDynamicImport) {
        link.dynamicImportTarget = target;
      }
      link.fromSourceTarget = info.link.module.productionModule;
      if (target.module.isExecutable()) {
        log.verbose('Link module', `<cyan>$fromSource</cyan> from <magenta>$from</magenta> to <green>$to</green>`, {
          fromSource: link.fromSource,
          from: module.getShortPath(),
          to: target.module.getShortPath(),
        });
        target.dependants.push(link);
        link.productionModule = productionModule;
      }
    }
  });
}

export function moduleLinkStage(props: IProductionFlow) {
  const { productionContext } = props;

  const log = props.ctx.log;
  log.info('module link', '<dim><bold>Module Link stage - linking modules and packages</bold></dim>');

  productionContext.productionPackages.forEach(pkg => {
    pkg.productionModules.forEach(mod => {
      if (mod.module.isExecutable()) {
        linkModule(mod, props);
      }
    });
  });

  log.info('module link', '<green><bold>$checkmark Module Link stage completed</bold></green>');
}
