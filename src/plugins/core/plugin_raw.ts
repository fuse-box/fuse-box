import { Context } from '../../core/context';
import { IModule } from '../../moduleResolver/module';
import { wrapContents } from '../pluginStrings';
import { parsePluginOptions } from '../pluginUtils';

export type IPluginRawProps = { useDefault?: boolean };

export function pluginRawHandler(props: { ctx: Context; module: IModule; opts: IPluginRawProps }) {
  if (!props.module.captured) {
    const module = props.module;

    // read the contents
    module.read();
    module.contents = wrapContents(JSON.stringify(module.contents), props.opts.useDefault);
  }
}
export function pluginRaw(a?: IPluginRawProps | RegExp | string, b?: IPluginRawProps) {
  let [opts, matcher] = parsePluginOptions<IPluginRawProps>(a, b, {
    useDefault: false,
  });
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      if (!matcher || (matcher && matcher.test(props.module.absPath))) {
        pluginRawHandler({ ctx, module: props.module, opts });
        return;
      }
      return props;
    });
  };
}
