import { Context } from '../core/Context';

export function attachCache(ctx: Context) {
  const config = ctx.config;
  const ict = ctx.interceptor;

  if (!config.cache) {
    return;
  }
  const cache = ctx.cache;

  ict.on('assemble_module_init', props => {
    const module = props.module;
    const pkg = props.module.pkg;
    const ctx = module.props.ctx;
    if (ctx.cache && pkg.isDefaultPackage && module.isExecutable()) {
      // restores module from cache
      cache.restoreModule(module);
    }
    return props;
  });

  ict.on('after_dev_module_inflate', props => {
    const module = props.module;
    const pkg = props.module.pkg;
    const ctx = module.props.ctx;
    if (ctx.cache && pkg.isDefaultPackage && module.isExecutable()) {
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
    const response = cache.getPackage(props.pkg);
    if (!response.abort) {
      ctx.log.info('Cached $name:$version', {
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

  ict.on('complete', props => {
    cache.sync();
    return props;
  });
}
