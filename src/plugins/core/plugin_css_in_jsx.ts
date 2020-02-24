import { CSSInJSXTransformer } from '../../compiler/transformers/shared/CSSInJSXTransformer';
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
    return ctx.registerTransformer(CSSInJSXTransformer(options));
  };
}
