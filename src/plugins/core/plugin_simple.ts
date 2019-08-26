import { Context } from '../../core/Context';
import { wrapContents } from '../pluginStrings';
import { parsePluginOptions } from '../pluginUtils';

export interface IPluginProps {
  useDefault?: boolean;
}

export function pluginFoo(a: string | RegExp, b?: IPluginProps) {
  let [opts, matcher] = parsePluginOptions<IPluginProps>(a, b, {
    useDefault: true,
  });
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      if (!props.module.captured) {
        const module = props.module;

        if (!matcher.test(module.props.absPath)) {
          return;
        }
        // read the contents
        module.read();
        module.contents = wrapContents('module.contents = foo', opts.useDefault);
      }
      return props;
    });
  };
}
