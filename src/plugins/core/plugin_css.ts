import { createStylesheetProps } from '../../config/createStylesheetProps';
import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { Context } from '../../core/Context';
import { ImportType } from '../../resolver/resolver';
import { cssResolveURL } from '../../stylesheet/cssResolveURL';
import { parsePluginOptions } from '../pluginUtils';
import { cssContextHandler } from './shared';

export interface ICSSPluginProps {
  stylesheet?: IStyleSheetProps;
  asText?: boolean;
}
export function pluginCSS(a?: ICSSPluginProps | string | RegExp, b?: ICSSPluginProps) {
  let [opts, matcher] = parsePluginOptions<ICSSPluginProps>(a, b, {});
  if (!matcher) matcher = /\.(css)$/;
  return (ctx: Context) => {
    opts.stylesheet = createStylesheetProps({ ctx, stylesheet: opts.stylesheet || {} });
    if (!ctx.config.production && ctx.config.supportsStylesheet()) {
      ctx.ict.on('assemble_module_init', props => {
        const { module } = props;
        if (module.isStylesheet()) {
          module.fastAnalysis = { imports: [] };
          module.fastAnalysis.imports.push({ type: ImportType.REQUIRE, statement: 'fuse-box-css' });
        }
        return props;
      });
    }

    ctx.ict.on('bundle_resolve_module', props => {
      const { module } = props;
      if (props.module.captured) {
        return;
      }

      if (!matcher.test(module.props.absPath)) return;
      ctx.log.progressFormat('pluginCss', module.props.absPath);
      module.read();

      cssContextHandler({
        ctx,
        module: module,
        options: opts.stylesheet,
        processor: {
          render: async () => {
            const urlResolver = cssResolveURL({
              filePath: module.props.absPath,
              ctx: ctx,
              contents: module.contents,
              options: ctx.config.stylesheet,
            });
            return { css: urlResolver.contents };
          },
        },
        shared: { asText: opts.asText },
      });

      return props;
    });
  };
}
