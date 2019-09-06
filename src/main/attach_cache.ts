import { Context } from '../core/Context';
import { attachFTL } from '../FTL/FasterThanLightReload';

export function attachCache(ctx: Context) {
  const config = ctx.config;
  const ict = ctx.ict;

  if (!config.cache.enabled) {
    return;
  }

  if (config.cache.FTL) {
    attachFTL(ctx);
  }
  const cache = ctx.cache;

  ict.on('assemble_module_init', props => {
    const module = props.module;
    const pkg = props.module.pkg;
    const ctx = module.props.ctx;
    if (ctx.cache && pkg.isDefaultPackage) {
      // restores module from cache
      cache.restoreModule(module);
    }
    return props;
  });

  ict.on('after_dev_module_inflate', props => {
    const module = props.module;
    const pkg = props.module.pkg;
    const ctx = module.props.ctx;

    if (ctx.cache && pkg.isDefaultPackage && !module.errored) {
      cache.saveModule(module, { contents: props.concat.content.toString(), sourceMap: props.concat.sourceMap });
    }
    return props;
  });

  ict.on('after_dev_package_inflate', props => {
    const pkg = props.pkg;
    const ctx = pkg.props.ctx;

    if (!pkg.isDefaultPackage && ctx.cache) {
      cache.savePackage(pkg, { sourceMap: props.concat.sourceMap, contents: props.concat.content.toString() });
    }
    return props;
  });

  ict.on('assemble_package_from_project', props => {
    const assembleContext = props.assembleContext;
    const response = cache.getPackage(props.pkg, props.userModules);

    if (!response.abort) {
      ctx.log.info('cached', 'loaded $name:$version', {
        name: props.pkg.props.meta.name,
        version: props.pkg.props.meta.version,
      });
      if (response.dependants) {
        response.dependants.forEach(item => {
          if (!assembleContext.collection.packages.get(item.props.meta.name, item.props.meta.version)) {
            assembleContext.collection.packages.add(item);
          }
        });
      }
    }
    return props;
  });

  ict.on('rebundle_complete', props => {
    cache.sync();
    return props;
  });
  ict.on('complete', props => {
    cache.sync();
    return props;
  });
}
