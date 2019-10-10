import { AngularURLTransformer } from '../../compiler/transformers/ts/AngularURLTransformer';
import { Context } from '../../core/Context';

export function pluginAngular(target: string | RegExp) {
  return (ctx: Context) => {
    ctx.transformerAtPath(target, AngularURLTransformer);
  };
}
