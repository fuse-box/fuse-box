import { bundleSource } from '../bundleSource';
import { bundleRuntimeCore, BUNDLE_RUNTIME_NAMES } from '../bundleRuntimeCore';
import { ITarget } from '../../config/PrivateConfig';

const Fuse = BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ;
const RequireFunc = BUNDLE_RUNTIME_NAMES.REQUIRE_FUNCTION;

describe('Bundle source test', () => {
  function runWithoutApi(code: string, target?: ITarget): any {
    target = target || 'browser';

    const globalObj = target === 'browser' || target === 'electron' ? 'window' : 'global';
    const serverExports = {};
    const obj = {};
    const api = bundleRuntimeCore({ target: target });
    code = api + `\n var ${Fuse} = ${globalObj}.${Fuse};\n` + code;
    var res = new Function(globalObj, 'exports', code);
    res(obj, target === 'server' ? serverExports : undefined);
    return {
      serverExports,
      obj,
      req: (num: number) => {
        return obj[Fuse][RequireFunc](num);
      },
    };
  }

  describe('Generic require', () => {
    it('should execute 1 file', () => {
      const source = bundleSource({ target: 'browser' });
      source.modules = [{ id: 1, contents: 'exports.Foo = "bar"' }];
      const result = source.generate();
      const { req } = runWithoutApi(result.content.toString());
      expect(req(1)).toEqual({ Foo: 'bar' });
    });

    it('should execute first file having 2 files', () => {
      const source = bundleSource({ target: 'browser' });
      source.modules = [
        { id: 1, contents: 'exports.Foo = "bar"' },
        { id: 2, contents: 'exports.Second = true' },
      ];
      const result = source.generate();
      const { req } = runWithoutApi(result.content.toString());
      expect(req(1)).toEqual({ Foo: 'bar' });
      expect(req(2)).toEqual({ Second: true });
    });

    it('should execute 1 file only once', () => {
      const source = bundleSource({ target: 'browser' });
      source.modules = [
        {
          id: 1,
          contents: `
            let counter = 0;
            exports.counter = ++counter`,
        },
      ];
      const result = source.generate();
      const { req } = runWithoutApi(result.content.toString());
      expect(req(1)).toEqual({ counter: 1 });
      expect(req(1)).toEqual({ counter: 1 });
    });
  });

  describe('Bundle entries', () => {
    it('should call entry 1', () => {
      const source = bundleSource({ target: 'browser' });

      source.modules = [
        {
          id: 1,
          contents: `window.wasCalled = true;`,
        },
      ];
      source.entries = [{ id: 1 }];
      const result = source.generate();
      const { obj } = runWithoutApi(result.content.toString());
      expect(obj.wasCalled).toEqual(true);
    });

    it('should call 2 entries', () => {
      const source = bundleSource({ target: 'browser' });

      source.modules = [
        {
          id: 1,
          contents: `window.FirstCalled = true;`,
        },
        {
          id: 2,
          contents: `window.SecondCalled = true;`,
        },
      ];
      source.entries = [{ id: 1 }, { id: 2 }];
      const result = source.generate();
      const { obj } = runWithoutApi(result.content.toString());
      expect(obj.FirstCalled).toEqual(true);
      expect(obj.SecondCalled).toEqual(true);
    });
  });

  describe('Bundle expose', () => {
    it('should expose on window with target browser', () => {
      const source = bundleSource({ target: 'browser' });

      source.modules = [
        {
          id: 1,
          contents: `exports.Foo = "bar"`,
        },
      ];
      source.expose = [{ name: 'FooLib', moduleId: 1 }];
      const result = source.generate();

      const { obj } = runWithoutApi(result.content.toString());
      expect(obj['FooLib']).toEqual({ Foo: 'bar' });
    });

    it('should expose on window with target electron', () => {
      const target = 'electron';
      const source = bundleSource({ target: target });

      source.modules = [
        {
          id: 1,
          contents: `exports.Foo = "bar"`,
        },
      ];
      source.expose = [{ name: 'FooLib', moduleId: 1 }];
      const result = source.generate();

      const { obj } = runWithoutApi(result.content.toString(), target);
      expect(obj['FooLib']).toEqual({ Foo: 'bar' });
    });

    it('should expose using "exports" for server', () => {
      const target = 'server';
      const source = bundleSource({ target: target });

      source.modules = [
        {
          id: 1,
          contents: `exports.Foo = "bar"`,
        },
      ];
      source.expose = [{ name: 'FooLib', moduleId: 1 }];
      const result = source.generate();
      const { serverExports } = runWithoutApi(result.content.toString(), target);
      expect(serverExports['FooLib']).toEqual({ Foo: 'bar' });
    });
  });
});
