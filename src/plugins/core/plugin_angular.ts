import { AngularURLTransformer } from '../../compiler/transformers/ts/AngularURLTransformer';
import { Context } from '../../core/Context';
import { path2RegexPattern } from '../../utils/utils';

export function pluginAngular(target: string | RegExp) {
  return (ctx: Context) => {
    const rex = path2RegexPattern(target);
    ctx.addTransformer(AngularURLTransformer(rex));
  };
}
