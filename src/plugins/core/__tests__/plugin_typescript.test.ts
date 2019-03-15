import { mockModule, IMockModuleProps, IMockModuleResponse } from '../../../utils/test_utils';
import { pluginTypescript } from '../plugin_typescript';

type IPluginTest = IMockModuleProps & {
  setup?: (data: IMockModuleResponse) => void;
  afterPluginInit?: (data: IMockModuleResponse) => void;
  afterResolve?: (data: IMockModuleResponse) => void;
};
async function evaluate(props: IPluginTest) {
  const data = mockModule(props);
  if (props.setup) {
    props.setup(data);
  }
  pluginTypescript()(data.ctx);
  data.ctx.interceptor.sync('bundle_resolve_module', { module: data.module });
  if (props.afterPluginInit) props.afterPluginInit(data);
  await data.ctx.interceptor.resolve();
  if (props.afterResolve) props.afterResolve(data);
  return data;
}

describe('Typescript plugin', () => {
  it('should not transpile 1', async () => {
    await evaluate({
      afterPluginInit: props => {
        expect(props.ctx.interceptor.getPromises()).toHaveLength(0);
      },
    });
  });

  it('should not transpile 2', async () => {
    await evaluate({
      setup: props => {
        props.module.fastAnalysis = {};
      },
      afterPluginInit: props => {
        expect(props.ctx.interceptor.getPromises()).toHaveLength(0);
      },
    });
  });

  it('should not transpile 3 (was transpiled)', async () => {
    await evaluate({
      setup: props => {
        props.module.fastAnalysis = {
          report: {
            transpiled: true,
          },
        };
      },
      afterPluginInit: props => {
        expect(props.ctx.interceptor.getPromises()).toHaveLength(0);
      },
    });
  });

  it('should not transpile no contents loaded', async () => {
    await evaluate({
      setup: props => {
        props.module.fastAnalysis = {
          report: {
            transpiled: false,
          },
        };
      },
      afterPluginInit: data => {
        expect(data.ctx.interceptor.getPromises()).toHaveLength(0);
      },
    });
  });

  it('should transpile with default config ( on the project )', async () => {
    const data = await evaluate({
      packageProps: { isDefaultPackage: true },
      setup: props => {
        props.module.contents = 'export function foo(){}';
        props.module.fastAnalysis = {
          report: {},
        };
      },
      afterPluginInit: props => {
        expect(props.ctx.interceptor.getPromises()).toHaveLength(1);
      },
    });

    expect(data.module.contents).toContain('exports.foo = foo;');
    expect(data.module.sourceMap).toBeTruthy();
  });

  it('should update the report', async () => {
    const data = await evaluate({
      packageProps: { isDefaultPackage: true },
      setup: props => {
        props.module.contents = 'export function foo(){}';
        props.module.fastAnalysis = {
          report: {},
        };
      },
    });

    expect(data.module.fastAnalysis.report.statementsReplaced).toEqual(true);
    expect(data.module.fastAnalysis.report.transpiled).toEqual(true);
  });

  it('should transpile with default config ( on the project ) without sourcemaps', async () => {
    const data = await evaluate({
      config: { sourceMap: false },
      packageProps: { isDefaultPackage: true },
      setup: props => {
        props.module.contents = 'export function foo(){}';
        props.module.fastAnalysis = {
          report: {},
        };
      },
      afterPluginInit: props => {
        expect(props.ctx.interceptor.getPromises()).toHaveLength(1);
      },
    });

    expect(data.module.contents).toContain('exports.foo = foo;');
    expect(data.module.sourceMap).toBeUndefined();
  });

  it('should transpile node module without sourcemaps', async () => {
    const data = await evaluate({
      config: { sourceMap: true },
      packageProps: { isDefaultPackage: false },
      setup: props => {
        props.module.contents = 'export function foo(){}';
        props.module.fastAnalysis = {
          report: {},
        };
      },
    });

    expect(data.module.contents).toContain('exports.foo = foo;');
    expect(data.module.sourceMap).toBeUndefined();
  });

  it('should transpile node module with sourcemaps', async () => {
    const data = await evaluate({
      config: { sourceMap: { vendor: true } },
      packageProps: { isDefaultPackage: false },
      setup: props => {
        props.module.contents = 'export function foo(){}';
        props.module.fastAnalysis = {
          report: {},
        };
      },
    });

    expect(data.module.contents).toContain('exports.foo = foo;');
    expect(data.module.sourceMap).toBeTruthy();
  });
});
