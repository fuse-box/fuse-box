import { Context } from '../../core/context';
import { IModule } from '../../moduleResolver/module';
import { wrapContents } from '../pluginStrings';
import { parsePluginOptions } from '../pluginUtils';

export interface IJSONPluginProps {
  path?: string;
  useDefault?: boolean;
}

export function pluginJSONHandler(module: IModule, opts: IJSONPluginProps) {
  module.captured = true;
  module.ctx.log.info('json', ' Captured $file with pluginJSON', {
    file: module.absPath,
  });
  module.read();
  module.contents = wrapContents(module.contents, opts.useDefault);
}

export function pluginJSON(a?: IJSONPluginProps | RegExp | string, b?: IJSONPluginProps) {
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      if (!props.module.captured && props.module.extension === '.json') {
        // filter out options
        const [opts, matcher] = parsePluginOptions<IJSONPluginProps>(a, b, ctx.config.json);
        if (matcher && !matcher.test(props.module.absPath)) {
          return;
        }
        pluginJSONHandler(props.module, opts);
      }
      return props;
    });
  };
}
