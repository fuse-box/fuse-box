import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { wrapContents } from '../pluginStrings';
import { parsePluginOptions } from '../pluginUtils';

export interface IJSONPluginProps {
  useDefault?: boolean;
  path?: string;
}

export function pluginJSONHandler(module: Module, opts: IJSONPluginProps) {
  module.captured = true;
  module.props.ctx.log.info('json', ' Captured $file with pluginJSON', {
    file: module.props.absPath,
  });
  module.read();
  module.contents = wrapContents(module.contents, opts.useDefault);
}

export function pluginJSON(a?: IJSONPluginProps | string | RegExp, b?: IJSONPluginProps) {
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      if (!props.module.captured && props.module.props.extension === '.json') {
        // filter out options
        const [opts, matcher] = parsePluginOptions<IJSONPluginProps>(a, b, ctx.config.json);
        if (matcher && !matcher.test(props.module.props.absPath)) {
          return;
        }
        pluginJSONHandler(props.module, opts);
      }
      return props;
    });
  };
}
