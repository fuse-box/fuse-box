import * as path from 'path';
import { Context } from '../../core/Context';
import { pluginJSONHandler } from './plugin_json';
import { pluginLinkHandler } from './plugin_link';
import { pluginLessCapture } from './plugin_less';
import { createStylesheetProps } from '../../config/createStylesheetProps';
import { LINK_ASSUMPTION_EXTENSIONS, TEXT_EXTENSIONS } from '../../config/extensions';
import { pluginStylusCapture } from './plugin_stylus';
import { pluginRawHandler } from './plugin_raw';

export function pluginAssumption() {
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      if (!props.module.captured) {
        const ext = path.extname(props.module.props.absPath);
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
        }
      }
      return props;
    });
  };
}
