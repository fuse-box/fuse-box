import { Context } from '../../core/Context';
import { CustomTransformers } from 'typescript';

export function pluginCustomTransform(customTransformers: CustomTransformers) {
  return (ctx: Context) => {
    ctx.customTransformers = customTransformers;
  };
}
