import { createCoreTransformerOption } from '../../compiler/transformers/optional';
import { Context } from '../../core/context';
import { path2RegexPattern } from '../../utils/utils';

export function pluginAngular(target: RegExp | string) {
  return (ctx: Context) => {
    const rex = path2RegexPattern(target);

    const angularTransformerOption = createCoreTransformerOption('angular', rex);
    ctx.compilerOptions.transformers.push(angularTransformerOption);
  };
}
