import { Context } from '../../core/Context';
import { parsePluginOptions } from '../pluginUtils';

export type IPluginReplaceProps = { [key: string]: any };
export function pluginReplace(a?: IPluginReplaceProps | string | RegExp, b?: IPluginReplaceProps) {
  const [opts, matcher] = parsePluginOptions<IPluginReplaceProps>(a, b, {});
  return (ctx: Context) => {
    ctx.ict.on('assemble_fast_analysis', props => {
      // filter out options

      if (matcher && !matcher.test(props.module.props.absPath)) {
        return;
      }

      const { module } = props;

      ctx.log.info('pluginReplace', 'replacing in $file', {
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
