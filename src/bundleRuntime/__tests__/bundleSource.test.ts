import { BUNDLE_RUNTIME_NAMES, bundleRuntimeCore, IBundleRuntimeCore } from '../bundleRuntimeCore';
import { createBundleSource } from '../bundleSource';

const Fuse = BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ;
const RequireFunc = BUNDLE_RUNTIME_NAMES.REQUIRE_FUNCTION;

function createInteropCall(args) {
  return Fuse + '.' + BUNDLE_RUNTIME_NAMES.INTEROP_REQUIRE_DEFAULT_FUNCTION + '(' + JSON.stringify(args) + ');';
}
describe('Bundle source test', () => {
  function runWithoutApi(code: string, props?: IBundleRuntimeCore): any {
    props = props || { target: 'browser' };

    const globalObj = props.target === 'browser' || props.target === 'electron' ? 'window' : 'global';
    const serverExports = {};
    const obj = {};
    const api = bundleRuntimeCore(props);
    code = api + `\n var ${Fuse} = ${globalObj}.${Fuse};\n` + code;

    var res = new Function(globalObj, 'exports', code);
    res(obj, props.target === 'server' ? serverExports : undefined);
    return {
      obj,
      serverExports,
      req: (num: number) => {
        return obj[Fuse][RequireFunc](num);
      },
    };
  }

  describe('Generic require', () => {
    it('should execute 1 file', () => {
      const source = createBundleSource({ target: 'browser' });
      source.modules = [{ contents: 'exports.Foo = "bar"', id: 1 }];
      const result = source.generate({ runtimeCore: null });
      const { req } = runWithoutApi(result.content.toString());
      expect(req(1)).toEqual({ Foo: 'bar' });
    });

    it('should execute first file having 2 files', () => {
      const source = createBundleSource({ target: 'browser' });
      source.modules = [
        { contents: 'exports.Foo = "bar"', id: 1 },
        { contents: 'exports.Second = true', id: 2 },
      ];
      const result = source.generate({ runtimeCore: null });
      const { req } = runWithoutApi(result.content.toString());
      expect(req(1)).toEqual({ Foo: 'bar' });
      expect(req(2)).toEqual({ Second: true });
    });

    it('should execute 1 file only once', () => {
      const source = createBundleSource({ target: 'browser' });
      source.modules = [
        {
          contents: `
            let counter = 0;
            exports.counter = ++counter`,
          id: 1,
        },
      ];
      const result = source.generate({ runtimeCore: null });
      const { req } = runWithoutApi(result.content.toString());
      expect(req(1)).toEqual({ counter: 1 });
      expect(req(1)).toEqual({ counter: 1 });
    });
  });

  describe('Bundle entries', () => {
    it('should call entry 1', () => {
      const source = createBundleSource({ target: 'browser' });

      source.modules = [
        {
          contents: `window.wasCalled = true;`,
          id: 1,
        },
      ];
      source.entries = [{ id: 1 }];
      const result = source.generate({ runtimeCore: null });
      const { obj } = runWithoutApi(result.content.toString());
      expect(obj.wasCalled).toEqual(true);
    });

    it('should call 2 entries', () => {
      const source = createBundleSource({ target: 'browser' });

      source.modules = [
        {
          contents: `window.FirstCalled = true;`,
          id: 1,
        },
        {
          contents: `window.SecondCalled = true;`,
          id: 2,
        },
      ];
      source.entries = [{ id: 1 }, { id: 2 }];
      const result = source.generate({ runtimeCore: null });
      const { obj } = runWithoutApi(result.content.toString());
      expect(obj.FirstCalled).toEqual(true);
      expect(obj.SecondCalled).toEqual(true);
    });

    it('should polyfil default', () => {
      const source = createBundleSource({ target: 'browser' });

      source.modules = [
        {
          contents: `window.FirstCalled = ${createInteropCall({ foo: 'bar' })}`,
          id: 1,
        },
      ];
      source.entries = [{ id: 1 }];
      const result = source.generate({ runtimeCore: null });
      const { obj } = runWithoutApi(result.content.toString(), { interopRequireDefault: true, target: 'browser' });
      expect(obj.FirstCalled.default).toEqual({ foo: 'bar' });
    });

    it('should take the existing default (obj)', () => {
      const source = createBundleSource({ target: 'browser' });

      source.modules = [
        {
          contents: `window.FirstCalled = ${createInteropCall({ __esModule: true, default: 'bar' })}`,
          id: 1,
        },
      ];
      source.entries = [{ id: 1 }];
      const result = source.generate({ runtimeCore: null });
      const { obj } = runWithoutApi(result.content.toString(), { interopRequireDefault: true, target: 'browser' });

      expect(obj.FirstCalled).toEqual({ __esModule: true, default: 'bar' });
    });

    it('should take  default (number)', () => {
      const source = createBundleSource({ target: 'browser' });

      source.modules = [
        {
          contents: `window.FirstCalled = ${createInteropCall(1)}`,
          id: 1,
        },
      ];
      source.entries = [{ id: 1 }];
      const result = source.generate({ runtimeCore: null });
      const { obj } = runWithoutApi(result.content.toString(), { interopRequireDefault: true, target: 'browser' });
      expect(obj.FirstCalled.default).toEqual(1);
    });
  });

  describe('Bundle expose', () => {
    it('should expose on window with target browser', () => {
      const source = createBundleSource({ target: 'browser' });

      source.modules = [
        {
          contents: `exports.Foo = "bar"`,
          id: 1,
        },
      ];
      source.entries = [{ id: 1 }];
      source.exported = true;
      const result = source.generate({ runtimeCore: null });

      const { obj } = runWithoutApi(result.content.toString());

      expect(obj['Foo']).toEqual('bar');
    });

    it('should expose on window with target electron', () => {
      const target = 'electron';
      const source = createBundleSource({ target: target });

      source.modules = [
        {
          contents: `exports.Foo = "bar"`,
          id: 1,
        },
      ];
      source.entries = [{ id: 1 }];
      source.exported = true;
      const result = source.generate({ runtimeCore: null });

      const { obj } = runWithoutApi(result.content.toString(), { target });
      expect(obj['Foo']).toEqual('bar');
    });

    it('should expose using "exports" for server', () => {
      const target = 'server';
      const source = createBundleSource({ target: target });

      source.modules = [
        {
          contents: `exports.Foo = "bar"`,
          id: 1,
        },
      ];
      source.entries = [{ id: 1 }];
      source.exported = true;
      const result = source.generate({ runtimeCore: null });
      const { serverExports } = runWithoutApi(result.content.toString(), { target });
      expect(serverExports['Foo']).toEqual('bar');
    });
  });

  describe('Source maps', () => {
    it('should write source maps', () => {
      const target = 'server';
      const source = createBundleSource({ target: target });

      const sourceMapObject = {
        mappings: ';;;AAEAA,QAAQC,IAAIC,WAAKC;AAEjBH,QAAQC,IAAI;;AAEZD,QAAQC,IAAI',
        names: ['console', 'log', 'foo_1', 'oi_2'],
        sources: ['first.js'],
        sourcesContent: ['console.log(foo)'],
        version: 3,
      };
      const sourceMapObject2 = {
        mappings: ';;;AAEAA,QAAQC,IAAIC,WAAKC;AAEjBH,QAAQC,IAAI;;AAEZD,QAAQC,IAAI',
        names: ['console', 'log', 'foo_1', 'oi_2'],
        sources: ['second/index.js'],
        sourcesContent: ['console.log(foo)'],
        version: 3,
      };
      source.modules = [
        {
          contents: `exports.Foo = "bar"`,
          id: 1,
          isSourceMapRequired: true,
          sourceMap: JSON.stringify(sourceMapObject),
        },
        {
          contents: `exports.Foo = "bar"`,
          id: 1,
          isSourceMapRequired: true,
          sourceMap: JSON.stringify(sourceMapObject2),
        },
      ];
      source.expose = [{ moduleId: 1, name: 'FooLib' }];
      const result = source.generate({ runtimeCore: null });

      expect(result.sourceMap).toMatchSnapshot();
    });
  });
});
