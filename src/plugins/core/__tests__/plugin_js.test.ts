import { mockModule } from '../../../utils/test_utils';
import { pluginJS } from '../plugin_js';
import { ImportType } from '../../../resolver/resolver';

describe('Plugin dev js test', () => {
  it('should skip transfrom 1', () => {
    const mock = mockModule({});
    const module = mock.module;
    pluginJS()(mock.ctx);

    mock.ctx.ict.sync('bundle_resolve_module', { module });
    expect(module.fastAnalysis).toEqual(undefined);
  });

  it('should skip transfrom 2', () => {
    const mock = mockModule({ moduleProps: { extension: '.js' } });
    const module = mock.module;
    module.fastAnalysis = { report: {} };
    pluginJS()(mock.ctx);

    mock.ctx.ict.sync('bundle_resolve_module', { module });
    expect(module.fastAnalysis).toEqual({
      report: {
        statementsReplaced: false,
        transpiled: false,
      },
    });
  });

  it('should skip transfrom 3', () => {
    const mock = mockModule({ moduleProps: { extension: '.js' } });
    const module = mock.module;
    module.fastAnalysis = { report: { es6Syntax: false } };
    pluginJS()(mock.ctx);

    mock.ctx.ict.sync('bundle_resolve_module', { module });
    expect(module.fastAnalysis).toEqual({
      report: {
        es6Syntax: false,
        statementsReplaced: false,
        transpiled: false,
      },
    });
  });

  it('should continue (default package and sourcemaps are not required', () => {
    const mock = mockModule({
      config: {
        sourceMap: false,
      },
      moduleProps: { extension: '.js' },
      packageProps: {
        isDefaultPackage: true,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { es6Syntax: true } };
    pluginJS()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_module', { module });
    expect(module.contents).toContain('exports.foo');
  });

  it('should continue (default package and sourcemaps are not required) 2', () => {
    const mock = mockModule({
      config: {
        sourceMap: { project: false },
      },
      moduleProps: { extension: '.js' },
      packageProps: {
        isDefaultPackage: true,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { es6Syntax: true } };
    pluginJS()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_module', { module });
    expect(module.contents).toContain('exports.foo');
    expect(module.fastAnalysis).toEqual({
      report: {
        es6Syntax: true,
        statementsReplaced: true,
        transpiled: true,
      },
    });
  });

  it('should continue (default package and sourcemaps are required', () => {
    const mock = mockModule({
      config: {
        sourceMap: true,
      },
      moduleProps: { extension: '.js' },
      packageProps: {
        isDefaultPackage: true,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { es6Syntax: true } };
    pluginJS()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_module', { module });

    expect(module.contents).toContain('exports.foo = foo;');
    expect(module.sourceMap).toBeTruthy();
  });

  it('should continue (node module package and sourcemaps are not required for vendor by default)', () => {
    const mock = mockModule({
      config: {
        sourceMap: true,
      },
      moduleProps: { extension: '.js' },
      packageProps: {
        isDefaultPackage: false,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { es6Syntax: true } };
    pluginJS()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_module', { module });

    expect(module.contents).toContain('exports.foo');
    expect(module.fastAnalysis).toEqual({
      report: {
        es6Syntax: true,
        statementsReplaced: true,
        transpiled: true,
      },
    });
  });

  it('should continue (node module package and sourcemaps are required for vendor)', () => {
    const mock = mockModule({
      config: {
        sourceMap: { vendor: true },
      },
      moduleProps: { extension: '.js' },
      packageProps: {
        isDefaultPackage: false,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { es6Syntax: true } };
    pluginJS()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_module', { module });
    expect(module.contents).toContain('exports.foo = foo;');
    expect(module.sourceMap).toBeTruthy();
  });

  it('should not continue contains jsx', () => {
    const mock = mockModule({
      moduleProps: { extension: '.js' },
      packageProps: {
        isDefaultPackage: false,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { containsJSX: true } };
    pluginJS()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_module', { module });
    expect(module.contents).toContain('export function foo');
  });

  it('should respect replacements from analysis', () => {
    const mock = mockModule({
      config: {
        sourceMap: true,
      },
      moduleProps: { extension: '.js' },
      packageProps: {
        isDefaultPackage: false,
      },
    });
    const module = mock.module;
    module.contents = 'import "./foo"';
    module.fastAnalysis = {
      report: { es6Syntax: true },
      replaceable: [{ type: ImportType.RAW_IMPORT, fromStatement: './foo', toStatement: './bar' }],
    };
    pluginJS()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_module', { module });
    expect(module.contents).toContain(`require("./bar");`);
  });

  it('should respect replacements from analysis (return the same value)', () => {
    const mock = mockModule({
      config: {
        sourceMap: true,
      },
      moduleProps: { extension: '.js' },
      packageProps: {
        isDefaultPackage: false,
      },
    });
    const module = mock.module;
    module.contents = 'import "./foo"';
    module.fastAnalysis = {
      report: { es6Syntax: true },
      replaceable: [],
    };
    pluginJS()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_module', { module });
    expect(module.contents).toContain(`require("./foo");`);
  });
});
