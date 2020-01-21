import { CustomTransformers } from 'typescript';
import { Context } from '../../core/Context';

export function pluginCustomTransform(customTransformers: CustomTransformers) {
  return (ctx: Context) => {
    ctx.customTransformers = customTransformers;
  };
}
