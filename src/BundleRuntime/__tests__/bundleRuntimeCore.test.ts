import { bundleRuntimeCore, BUNDLE_RUNTIME_NAMES } from '../bundleRuntimeCore';

describe('Bundle runtime core test', () => {
  function run(code: string, expose: 'window' | 'global'): any {
    const obj = { __env: expose };
    var res = new Function(expose, code);
    res(obj);

    return obj;
  }

  function runIsolated(code: string): any {
    const obj = {};
    code += `\n__injected.exposed = ${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ}`;
    var res = new Function('__injected', code);
    res(obj);
    return obj;
  }
  const Name = BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ;

  describe('Target integrity', () => {
    it('should create browser env ', () => {
      const code = bundleRuntimeCore({ target: 'browser', isIsolated: false });

      const result = run(code, 'window');

      expect(result[Name]).toBeTruthy();
      expect(result[Name].modules).toEqual({});
    });

    it('should create electron env ', () => {
      const code = bundleRuntimeCore({ target: 'electron', isIsolated: false });
      const result = run(code, 'window');

      expect(result[Name]).toBeTruthy();
      expect(result[Name].modules).toEqual({});
    });

    it('should create server env', () => {
      const code = bundleRuntimeCore({ target: 'server', isIsolated: false });
      const result = run(code, 'global');

      expect(result[Name]).toBeTruthy();
      expect(result[Name].modules).toEqual({});
    });

    it('should create an isolated browser env ', () => {
      const code = bundleRuntimeCore({ target: 'browser', isIsolated: true });
      const result = runIsolated(code);
      expect(result.exposed.modules).toBeTruthy();
    });

    it('should create an isolated env despite isIsolated false', () => {
      const code = bundleRuntimeCore({ target: 'web-worker', isIsolated: false });
      const result = runIsolated(code);
      expect(result.exposed.modules).toBeTruthy();
    });
  });
});
