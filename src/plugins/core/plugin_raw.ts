import { Context } from '../../core/Context';
import { parsePluginOptions } from '../pluginUtils';
import { wrapContents } from '../pluginStrings';
import { Module } from '../../core/Module';

export type IPluginRawProps = { useDefault?: boolean };

export function pluginRawHandler(props: { ctx: Context; module: Module; opts: IPluginRawProps }) {
  if (!props.module.captured) {
    const module = props.module;

    // read the contents
    module.read();
    module.contents = wrapContents(JSON.stringify(module.contents), props.opts.useDefault);
  }
}
export function pluginRaw(a?: IPluginRawProps | string | RegExp, b?: IPluginRawProps) {
  let [opts, matcher] = parsePluginOptions<IPluginRawProps>(a, b, {
    useDefault: false,
  });
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      if (!matcher || (matcher && matcher.test(props.module.props.absPath))) {
        pluginRawHandler({ ctx, module: props.module, opts });
        return;
      }
      return props;
    });
  };
}
