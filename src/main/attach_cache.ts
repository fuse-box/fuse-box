import { Context } from '../core/Context';
import { measureTime } from '../utils/utils';

export function attachCache(ctx: Context) {
  const config = ctx.config;
  const ict = ctx.interceptor;

  if (!config.cache) {
    return;
  }
  const cache = ctx.cache;

  ict.on('after_dev_package_inflate', props => {
    const pkg = props.pkg;
    if (!pkg.isDefaultPackage) {
      cache.savePackage(pkg, { sourceMap: props.concat.sourceMap, contents: props.concat.content.toString() });
    }
    return props;
  });

  ict.on('assemble_package_from_project', props => {
    const time = measureTime();
    const pkg = props.pkg;
    const assembleContext = props.assembleContext;
    const response = cache.getPackage(props.pkg);
    if (!response.abort) {
      if (response.dependants) {
        response.dependants.forEach(item => {
          if (!assembleContext.collection.packages.get(item.props.meta.name, item.props.meta.version)) {
            assembleContext.collection.packages.add(item);
          }
        });
      }
    }

    time.end();

    return props;
  });

  ict.on('complete', props => {
    cache.sync();
    return props;
  });
}
