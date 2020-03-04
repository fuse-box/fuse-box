import { createStylesheetProps } from '../../config/createStylesheetProps';
import { LINK_ASSUMPTION_EXTENSIONS, TEXT_EXTENSIONS } from '../../config/extensions';
import { Context } from '../../core/context';
import { pluginJSONHandler } from './plugin_json';
import { pluginLessCapture } from './plugin_less';
import { pluginLinkHandler } from './plugin_link';
import { pluginNodeNativeHandler } from './plugin_node_native';
import { pluginRawHandler } from './plugin_raw';
import { pluginStylusCapture } from './plugin_stylus';

export function pluginAssumption() {
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      if (!props.module.captured) {
        const ext = props.module.extension;
        if (ext === '.json') {
          // json handler
          pluginJSONHandler(props.module, {});
        } else if (LINK_ASSUMPTION_EXTENSIONS.indexOf(ext) > -1) {
          // Copy files and give it a link.
          // e.g import foo from "./foo.svg"
          pluginLinkHandler(props.module, {});
        } else if (ext === '.less') {
          // CSS: Less extension
          pluginLessCapture({
            ctx,
            module: props.module,
            opts: {
              stylesheet: createStylesheetProps({ ctx, stylesheet: {} }),
            },
          });
        } else if (ext === '.styl') {
          // CSS: stylus
          pluginStylusCapture({
            ctx,
            module: props.module,
            opts: {
              stylesheet: createStylesheetProps({ ctx, stylesheet: {} }),
            },
          });
        } else if (TEXT_EXTENSIONS.indexOf(ext) > -1) {
          // Text extensions (like .md or text)
          pluginRawHandler({ ctx, module: props.module, opts: {} });
        } else if (ext === '.node') {
          // Node native
          pluginNodeNativeHandler(props.module);
        }
      }
      return props;
    });
  };
}
