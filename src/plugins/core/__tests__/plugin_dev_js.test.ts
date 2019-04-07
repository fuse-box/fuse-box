import { mockModule } from '../../../utils/test_utils';
import { pluginDevJs } from '../plugin_dev_js';
import { ImportType } from '../../../resolver/resolver';

describe('Plugin dev js test', () => {
  it('should skip transfrom 1', () => {
    const mock = mockModule({});
    const module = mock.module;
    pluginDevJs()(mock.ctx);

    mock.ctx.ict.sync('bundle_resolve_js_module', { module });
    expect(module.fastAnalysis).toEqual(undefined);
  });

  it('should skip transfrom 2', () => {
    const mock = mockModule({});
    const module = mock.module;
    module.fastAnalysis = { report: {} };
    pluginDevJs()(mock.ctx);

    mock.ctx.ict.sync('bundle_resolve_js_module', { module });
    expect(module.fastAnalysis).toEqual({
      report: {
        statementsReplaced: false,
        transpiled: false,
      },
    });
  });

  it('should skip transfrom 3', () => {
    const mock = mockModule({});
    const module = mock.module;
    module.fastAnalysis = { report: { es6Syntax: false } };
    pluginDevJs()(mock.ctx);

    mock.ctx.ict.sync('bundle_resolve_js_module', { module });
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
      packageProps: {
        isDefaultPackage: true,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { es6Syntax: true } };
    pluginDevJs()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_js_module', { module });
    expect(module.contents).toContain('module.exports.foo');
  });

  it('should continue (default package and sourcemaps are not required) 2', () => {
    const mock = mockModule({
      config: {
        sourceMap: { project: false },
      },
      packageProps: {
        isDefaultPackage: true,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { es6Syntax: true } };
    pluginDevJs()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_js_module', { module });
    expect(module.contents).toContain('module.exports.foo');
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
      packageProps: {
        isDefaultPackage: true,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { es6Syntax: true } };
    pluginDevJs()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_js_module', { module });

    expect(module.contents).toContain('module.exports.foo = function foo() {};');
    expect(module.sourceMap).toBeTruthy();
  });

  it('should continue (node module package and sourcemaps are not required for vendor by default)', () => {
    const mock = mockModule({
      config: {
        sourceMap: true,
      },
      packageProps: {
        isDefaultPackage: false,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { es6Syntax: true } };
    pluginDevJs()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_js_module', { module });

    expect(module.contents).toContain('module.exports.foo');
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
      packageProps: {
        isDefaultPackage: false,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { es6Syntax: true } };
    pluginDevJs()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_js_module', { module });
    expect(module.contents).toContain('module.exports.foo = function foo() {};');
    expect(module.sourceMap).toBeTruthy();
  });

  it('should not continue contains jsx', () => {
    const mock = mockModule({
      packageProps: {
        isDefaultPackage: false,
      },
    });
    const module = mock.module;
    module.contents = 'export function foo(){}';
    module.fastAnalysis = { report: { containsJSX: true } };
    pluginDevJs()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_js_module', { module });
    expect(module.contents).toContain('export function foo');
  });

  it('should respect replacements from analysis', () => {
    const mock = mockModule({
      config: {
        sourceMap: true,
      },
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
    pluginDevJs()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_js_module', { module });
    expect(module.contents).toContain(`require("./bar");`);
  });

  it('should respect replacements from analysis (return the same value)', () => {
    const mock = mockModule({
      config: {
        sourceMap: true,
      },
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
    pluginDevJs()(mock.ctx);
    mock.ctx.ict.sync('bundle_resolve_js_module', { module });
    expect(module.contents).toContain(`require("./foo");`);
  });
});
