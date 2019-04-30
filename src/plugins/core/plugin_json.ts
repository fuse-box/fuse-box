import { Context } from '../../core/Context';
import { wrapContents } from '../pluginStrings';
import { parsePluginOptions } from '../pluginUtils';

export interface IJSONPluginProps {
  useDefault?: boolean;
  path?: string;
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

        const { module } = props;
        module.captured = true;
        ctx.log.verbose('<cyan><bold>JSON:</bold> Captured $file with <bold>pluginJSON</bold></cyan>', {
          file: module.props.absPath,
        });

        module.read();

        module.contents = wrapContents(module.contents, opts.useDefault);
      }
      return props;
    });
  };
}
