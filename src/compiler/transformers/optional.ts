import { ICompilerOptionTransformer } from '../../compilerOptions/interfaces';
import { ITransformer } from '../interfaces/ITransformer';
import { CSSInJSXTransformer } from './shared/CSSinJSXTransformer';
import { AngularURLTransformer } from './ts/AngularURLTransformer';

const OptionalCoreTransformers: Record<
  string,
  { options: ICompilerOptionTransformer; transformer: (props: any) => ITransformer }
> = {
  angular: {
    options: { name: 'angular' },
    transformer: AngularURLTransformer,
  },
  css_in_jsx: {
    options: { name: 'css_in_jsx' },
    transformer: CSSInJSXTransformer,
  },
};

export function createCoreTransformerOption(name: string, opts: any): ICompilerOptionTransformer {
  if (OptionalCoreTransformers[name]) {
    const record = OptionalCoreTransformers[name];
    return { name: record.options.name, opts };
  }
}

export function getCoreTransformer(props: ICompilerOptionTransformer): ITransformer {
  if (props.transformer) return props.transformer(props.opts);
  if (props.name) {
    const target = OptionalCoreTransformers[props.name];
    if (target) {
      return target.transformer(props.opts);
    }
  } else if (props.script) {
    const transformerModule = require(props.script);
    if (transformerModule.default) {
      return transformerModule.default(props.opts);
    }
  }
}
