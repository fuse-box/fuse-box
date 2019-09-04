import { Context } from '../../core/Context';
import { simplifiedRegExp } from '../pluginUtils';
import { angularURLReplacer } from '../../frameworks/angular/angularURLReplacer';

export interface INGPluginOptions {}

export function pluginAngular(target: string | RegExp, options?: INGPluginOptions) {
  let matcher: RegExp;
  if (typeof target === 'string') {
    matcher = simplifiedRegExp(target);
  } else matcher = target;
  options = options || {};

  return (ctx: Context) => {
    ctx.ict.on('assemble_module_init', props => {
      if (!matcher.test(props.module.props.absPath)) {
        return;
      }
      props.module.contents = angularURLReplacer({ content: props.module.read() });
      return props;
    });
  };
}
