import * as convertSourceMap from 'convert-source-map';
import * as prettyTime from 'pretty-time';
import { BundleType, IBundleWriteResponse } from '../bundle/Bundle';
import { devStrings } from '../bundle/bundleStrings';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Package } from '../core/Package';
import { bundleResolveModule } from '../main/process_plugins';
import { createConcat } from '../utils/utils';
import { TEXT_EXTENSIONS, FTL_ELIGIBLE_EXTENSIONS } from '../config/extensions';

export interface IFasterThanLightProps {
  ctx: Context;
  bundleWriters: Array<IBundleWriteResponse>;
  filePath: string;
}

const MAX_FTL_MODULES = 5;
export function generateFTLJavaScript(modules: Array<Module>) {
  const concat = createConcat(true, '', '\n');
  concat.add(null, devStrings.openPackage('default', {}));
  for (const m of modules) {
    concat.add(null, devStrings.openFile(m.props.fuseBoxPath));
    concat.add(null, m.contents, m.sourceMap);
    concat.add(null, devStrings.closeFile());
  }
  concat.add(null, devStrings.closePackage());
  let stringContent = concat.content.toString();
  let json = JSON.parse(concat.sourceMap);
  const sm = convertSourceMap.fromObject(json).toComment();
  stringContent += '\n' + sm;
  return stringContent;
}

export function fasterThanLight(props: IFasterThanLightProps): Promise<Boolean> {
  const { ctx, bundleWriters, filePath } = props;
  if (ctx.config.target === 'server') {
    return;
  }
  if (!ctx.config.cache.enabled || !ctx.devServer) {
    return;
  }
  const cache = ctx.cache;
  const defaultPackage = ctx.packages.find(pkg => pkg.isDefaultPackage);
  const targetModule = defaultPackage.modules.find(item => item.props.absPath === filePath);

  if (targetModule) {
    // get the current cache (even if it's broken already)
    // we need to check if external dependencies didn't change
    const data = cache.getModuleCacheData(targetModule);
    if (!data) return;

    // check for FTL eligible extensions like CSS html and such
    if (FTL_ELIGIBLE_EXTENSIONS.indexOf(targetModule.props.extension) > -1) {
      // peform a full cylcle here
      ctx.log.info('FTL', `Entering FTL mode`);
      targetModule.read(true);
      targetModule.isCached = false;
      targetModule.captured = false;
      ctx.ict.sync('assemble_module_init', { module: targetModule });
      // reset data so it can be read again an being not captured too.

      const ftlModules = ctx.assembleContext.getFTLModules();
      if (ftlModules.length > MAX_FTL_MODULES) return;

      bundleResolveModule(targetModule);
      return ctx.ict.resolve().then(() => {
        ctx.assembleContext.setFTLModule(targetModule);
        return true;
      });
    }

    // stop from accidentally working with a non-executable file
    if (!targetModule.isExecutable()) {
      return;
    }

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

    ctx.ict.sync('assemble_module_ftl_init', { module: targetModule });

    const newAnalysis = targetModule.fastAnalyse();

    // if there is a length difference - that's to continue
    if (oldAnalysis.imports.length !== newAnalysis.imports.length) return;

    // stop the difference
    // if arrays don't match we have some something changed
    for (let i = 0; i < oldAnalysis.imports.length; i++) {
      if (newAnalysis.imports[i].statement !== oldAnalysis.imports[i].statement) return;
    }
    const ftlModules = ctx.assembleContext.getFTLModules();
    if (ftlModules.length > MAX_FTL_MODULES) return;

    ctx.log.info('FTL', `Entering FTL mode`);
    // restore replaceable,  since we skip the assemble part + resolving the statements
    targetModule.fastAnalysis.replaceable = oldAnalysis.replaceable;
    targetModule.fastAnalysis.report.transpiled = false;
    ctx.ict.sync('assemble_fast_analysis', { module: targetModule });

    targetModule.isCached = false;
    // manually triger the resolution for this module
    // skipping EVERYTHING else
    bundleResolveModule(targetModule);
    return ctx.ict.resolve().then(() => {
      ctx.assembleContext.setFTLModule(targetModule);
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

      response.then(bundeResponse => {
        ctx.ict.sync('rebundle_complete', {
          bundles,
          packages,
          ctx,
          watcherAction: props.info.watcherProps.action,
          file: props.info.filePath,
        });
        const l = ctx.assembleContext.getFTLModules().length;
        ctx.log.line();
        ctx.log.echo(
          ctx.log.indent +
            '<bold><white><bgGreen> FTL SUCCESS </bgGreen></bold></white> in <bold>$time</bold> <dim>$total/$max in-memory</dim>',
          {
            time: prettyTime(process.hrtime(props.info.timeStart)),
            total: l,
            max: MAX_FTL_MODULES,
          },
        );
        ctx.log.line();
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
