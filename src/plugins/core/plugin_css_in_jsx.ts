import { createCoreTransformerOption } from '../../compiler/transformers/optional';
import { Context } from '../../core/context';

export interface PluginCSSInJSXOptions {
  autoInject?: boolean;
  autoLabel?: boolean;
  cssPropOptimization?: boolean;
  emotionCoreAlias?: string;
  jsxFactory?: string;
  labelFormat?: string;
  sourceMap?: boolean;
  test?: RegExp | string;
}

export function pluginCSSInJSX(options?: PluginCSSInJSXOptions) {
  return function(ctx: Context) {
    const plugin = createCoreTransformerOption('css_in_jsx', options);
    ctx.compilerOptions.transformers.push(plugin);
  };
}
