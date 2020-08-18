import { Context } from '../../../src/core/context';
import MyAwesomeTransformer from './MyAwesomeTransformer';

export function MyAwesomePlugin(target: RegExp | string) {
  return (ctx: Context) => {
    const transformers = ctx.compilerOptions.transformers;
    transformers.push({ opts: { myOptions: 'foo' }, script: __filename });
  };
}

export { MyAwesomeTransformer };
