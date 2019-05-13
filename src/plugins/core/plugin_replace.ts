import { Context } from '../../core/Context';
import { parsePluginOptions } from '../pluginUtils';

export type IJSONPluginProps = { [key: string]: any };
export function pluginReplace(a?: IJSONPluginProps | string | RegExp, b?: IJSONPluginProps) {
  const [opts, matcher] = parsePluginOptions<IJSONPluginProps>(a, b, {});
  return (ctx: Context) => {
    ctx.ict.on('assemble_fast_analysis', props => {
      // filter out options

      if (matcher && !matcher.test(props.module.props.absPath)) {
        return;
      }

      const { module } = props;

      ctx.log.verbose('<cyan><bold>pluginReplace:</bold> Captured $file with <bold>pluginReplace</bold></cyan>', {
        file: module.props.absPath,
      });

      module.read();
      for (let key in opts) {
        module.contents = module.contents.replace(key, opts[key]);
      }
      return props;
    });
  };
}
