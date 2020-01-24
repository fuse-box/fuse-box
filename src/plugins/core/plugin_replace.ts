import { Context } from '../../core/context';
import { safeRegex } from '../../utils/utils';
import { parsePluginOptions } from '../pluginUtils';

export type IPluginReplaceProps = { [key: string]: any };
export function pluginReplace(a?: IPluginReplaceProps | RegExp | string, b?: IPluginReplaceProps) {
  const [opts, matcher] = parsePluginOptions<IPluginReplaceProps>(a, b, {});

  const expressions = [];
  for (let key in opts) {
    expressions.push([safeRegex(key), opts[key]]);
  }
  return (ctx: Context) => {
    ctx.ict.on('module_init', props => {
      // filter out options

      if (matcher && !matcher.test(props.module.absPath)) {
        return;
      }

      const { module } = props;

      ctx.log.info('pluginReplace', 'replacing in $file', {
        file: module.absPath,
      });

      module.read();
      for (const items of expressions) {
        module.contents = module.contents.replace(items[0], items[1]);
      }
      return props;
    });
  };
}
