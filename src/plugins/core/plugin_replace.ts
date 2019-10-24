import { Context } from '../../core/Context';
import { parsePluginOptions } from '../pluginUtils';
import { safeRegex } from '../../utils/utils';

export type IPluginReplaceProps = { [key: string]: any };
export function pluginReplace(a?: IPluginReplaceProps | string | RegExp, b?: IPluginReplaceProps) {
  const [opts, matcher] = parsePluginOptions<IPluginReplaceProps>(a, b, {});

  const expressions = [];
  for (let key in opts) {
    expressions.push([safeRegex(key), opts[key]]);
  }
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
      for (const items of expressions) {
        module.contents = module.contents.replace(items[0], items[1]);
      }
      return props;
    });
  };
}
