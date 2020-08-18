import { CustomTransformers } from 'typescript';
import { Context } from '../../core/context';

export function pluginCustomTransform(customTransformers: CustomTransformers) {
  return (ctx: Context) => {
    ctx.customTransformers = customTransformers;
  };
}
