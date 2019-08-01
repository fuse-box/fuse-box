import * as path from 'path';
import { Context } from '../../core/Context';
import { pluginJSONHandler } from './plugin_json';
import { pluginLinkHandler } from './plugin_link';

const LINK_ASSUMPTION_EXTENSIONS = [
  '.ttf',
  '.otf',
  '.woff',
  '.woff2',
  '.eot',
  '.png',
  '.jpeg',
  '.jpg',
  '.gif',
  '.bmp',
  '.svg',
];

export function pluginAssumption() {
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      if (!props.module.captured) {
        const ext = path.extname(props.module.props.absPath);
        if (ext === '.json') {
          pluginJSONHandler(props.module, {});
        } else if (LINK_ASSUMPTION_EXTENSIONS.indexOf(ext) > -1) {
          pluginLinkHandler(props.module, {});
        }
      }
      return props;
    });
  };
}
