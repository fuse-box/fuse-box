import * as prettyTime from 'pretty-time';
import { BundleType, IBundleWriteResponse } from '../bundle/Bundle';
import { inflateBundle } from '../bundle/createDevBundles';
import { Context } from '../core/Context';
import { Package } from '../core/Package';
import { bundleResolveModule } from '../main/process_plugins';
import { Module } from '../core/Module';
import { createConcat } from '../utils/utils';
import { devStrings } from '../bundle/bundleStrings';
import * as convertSourceMap from 'convert-source-map';

export interface IFasterThanLightProps {
  ctx: Context;
  bundleWriters: Array<IBundleWriteResponse>;
  filePath: string;
}

function createFTLContent(module: Module) {
  const requireSourceMaps = module.props.ctx.config.sourceMap.project;
  module.generate();
  const concat = createConcat(requireSourceMaps, '', '\n');
  concat.add(null, devStrings.openPackage(module.pkg, {}));
  concat.add(null, module.contents, module.sourceMap);
  concat.add(null, devStrings.closePackage());
  let stringContent = concat.content.toString();
  if (requireSourceMaps && module.sourceMap) {
    let json = JSON.parse(module.sourceMap);

    const sm = convertSourceMap.fromObject(json).toComment();
    stringContent += '\n' + sm;
  }
  return stringContent;
}

export function fasterThanLight(props: IFasterThanLightProps): Promise<Boolean> {
  const { ctx, bundleWriters, filePath } = props;
  if (!ctx.config.cache.enabled || !ctx.devServer) {
    return;
  }
  const cache = ctx.cache;
  const defaultPackage = ctx.packages.find(pkg => pkg.isDefaultPackage);
  const targetModule = defaultPackage.modules.find(item => item.props.absPath === filePath);
  if (targetModule && targetModule.isExecutable()) {
    // get the current cache (even if it's broken already)
    // we need to check if external dependencies didn't change
    const data = cache.getModuleCacheData(targetModule);
    if (!data) return;

    if (!data.fastAnalysis) {
      return;
    }
    ctx.ict.sync('assemble_module_init', { module: targetModule });

    const targetBundle = bundleWriters.find(item => item.bundle.props.type === BundleType.PROJECT_JS);

    if (!targetBundle) return;
    // it may happen that user just hit "save" without doing anything
    // isCached is set in attach_cache.ts in cache.restoreModule(module);
    // that's why this check followed by "assemble_module_init" it cannot happen earlier

    const oldAnalysis = data.fastAnalysis;
    targetModule.read(true);

    const newAnalysis = targetModule.fastAnalyse();

    // if there is a length difference - that's to continue
    if (oldAnalysis.imports.length !== newAnalysis.imports.length) return;

    // stop the difference
    // if arrays don't match we have some something changed
    for (let i = 0; i < oldAnalysis.imports.length; i++) {
      if (newAnalysis.imports[i].statement !== oldAnalysis.imports[i].statement) return;
    }

    // restore replaceable, since we skip the assemble part + resolving the statements
    targetModule.fastAnalysis.replaceable = oldAnalysis.replaceable;
    targetModule.fastAnalysis.report.transpiled = false;
    ctx.ict.sync('assemble_fast_analysis', { module: targetModule });

    targetModule.isCached = false;
    // manually triger the resolution for this module
    // skipping EVERYTHING else
    bundleResolveModule(targetModule);
    return ctx.ict.resolve().then(() => {
      const stringContent = createFTLContent(targetModule);
      ctx.assembleContext.addFTL(targetModule.getHasedPath(), stringContent);
      return true;
    });
  }
}

export function attachFTL(ctx: Context) {
  let bundles: Array<IBundleWriteResponse>;
  let packages: Array<Package>;
  ctx.ict.on('soft_relod', props => {
    if (!bundles) return;

    const response = fasterThanLight({ ctx, filePath: props.info.filePath, bundleWriters: bundles });
    if (response) {
      props.info.FTL = true;
      ctx.ict.sync('rebundle_complete', {
        bundles,
        packages,
        ctx,
        watcherAction: props.info.watcherProps.action,
        file: props.info.filePath,
      });
      response.then(bundeResponse => {
        ctx.log.print(`<green>✔</green> <green><bold> FTL Completed in $time</bold></green>`, {
          time: prettyTime(process.hrtime(props.info.timeStart)),
        });
      });
    }

    return props;
  });

  ctx.ict.on('rebundle_complete', props => {
    bundles = props.bundles;
    packages = props.packages;
    return props;
  });
  ctx.ict.on('complete', props => {
    bundles = props.bundles;
    packages = props.packages;
    return props;
  });
}
