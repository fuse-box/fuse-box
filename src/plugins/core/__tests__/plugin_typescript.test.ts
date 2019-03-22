import { mockModule, IMockModuleProps, IMockModuleResponse } from '../../../utils/test_utils';
import { pluginTypescript } from '../plugin_typescript';
import { ImportType } from '../../../resolver/resolver';

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

  it('should not transpile (not executable)', async () => {
    await evaluate({
      setup: props => {
        props.module.props.extension = '.json';
        props.module.fastAnalysis = {};
      },
      afterPluginInit: props => {
        expect(props.ctx.interceptor.getPromises()).toHaveLength(0);
      },
    });
  });

  it('should not transpile (not typescript, no jsx to es6 imports)', async () => {
    await evaluate({
      setup: props => {
        props.module.props.extension = '.js';
        props.module.contents = 'oi';
        props.module.fastAnalysis = {
          report: {},
        };
      },
      afterPluginInit: props => {
        expect(props.ctx.interceptor.getPromises()).toHaveLength(0);
      },
    });
  });

  it('should not transpile (not typescript, no jsx to es6 imports) no replacable', async () => {
    await evaluate({
      setup: props => {
        props.module.props.extension = '.js';
        props.module.contents = 'oi';
        props.module.fastAnalysis = {
          replaceable: [],
          report: {},
        };
      },
      afterPluginInit: props => {
        expect(props.ctx.interceptor.getPromises()).toHaveLength(0);
      },
    });
  });

  it('should continue since there are replaceable', async () => {
    await evaluate({
      setup: props => {
        props.module.contents = 'require("./foo")';
        props.module.props.absPath = '/foo';
        props.module.props.fuseBoxPath = 'foo.ts';
        props.module.props.extension = '.ts';
        props.module.fastAnalysis = {
          report: {},
          replaceable: [{ type: ImportType.RAW_IMPORT, fromStatement: './foo', toStatement: './bar' }],
        };
      },
      afterPluginInit: props => {
        expect(props.ctx.interceptor.getPromises()).toHaveLength(1);
      },
      afterResolve: props => {
        expect(props.module.contents).toContain('require("./bar");');
      },
    });
  });

  it('should transpile with default config ( on the project )', async () => {
    const data = await evaluate({
      packageProps: { isDefaultPackage: true },
      setup: props => {
        props.module.props.absPath = '/foo';
        props.module.props.fuseBoxPath = 'foo.ts';
        props.module.props.extension = '.ts';
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
        props.module.props.absPath = '/foo';
        props.module.props.fuseBoxPath = 'foo.ts';
        props.module.props.extension = '.ts';
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
        props.module.props.absPath = '/foo';
        props.module.props.fuseBoxPath = 'foo.ts';
        props.module.props.extension = '.ts';
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
        props.module.props.absPath = '/foo';
        props.module.props.fuseBoxPath = 'foo.ts';
        props.module.props.extension = '.ts';
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
        props.module.props.absPath = '/foo';
        props.module.props.fuseBoxPath = 'foo.ts';
        props.module.props.extension = '.ts';
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
