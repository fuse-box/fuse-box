import { Context } from '../../core/Context';
import { simplifiedRegExp } from '../pluginUtils';
import { angularURLReplacer } from '../../frameworks/angular/angularURLReplacer';
import { Module } from '../../core/Module';

export interface INGPluginOptions {}

export function pluginAngular(target: string | RegExp, options?: INGPluginOptions) {
  let matcher: RegExp;
  if (typeof target === 'string') {
    matcher = simplifiedRegExp(target);
  } else matcher = target;
  options = options || {};

  function handleModule(module: Module): boolean {
    if (!matcher.test(module.props.absPath)) {
      return;
    }
    module.contents = angularURLReplacer({ content: module.read() });
    return true;
  }
  return (ctx: Context) => {
    ctx.ict.on('assemble_module_ftl_init', props => {
      if (handleModule(props.module)) {
        ctx.log.info('angular ftl', props.module.props.absPath);
      }
      return props;
    });

    ctx.ict.on('assemble_module_init', props => {
      if (handleModule(props.module)) {
        ctx.log.info('angular', props.module.props.absPath);
      }
      return props;
    });
  };
}
