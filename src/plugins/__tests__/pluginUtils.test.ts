import { testPath, parsePluginOptions } from '../pluginUtils';

describe('Plugin utils test', () => {
  describe('testPath', () => {
    it('should pass 1', () => {
      const res = testPath('hello.json', '*.json');

      expect(res).toEqual(true);
    });
    it('should pass 2', () => {
      const res = testPath('foo/hello.json', 'foo/*.json');
      expect(res).toEqual(true);
    });

    it('should pass 3', () => {
      const res = testPath('foo\\hello.json', 'foo/*.json');
      expect(res).toEqual(true);
    });

    it('should not pass 3', () => {
      const res = testPath('foo\\hello.json', 'foo/*.js$');
      expect(res).toEqual(false);
    });
  });

  describe('parsePluginOptions', () => {
    it('should parse 1 argument', () => {
      const [opts, matcher] = parsePluginOptions<any>({ foo: 'bar' });
      expect(opts).toEqual({ foo: 'bar' });
      expect(matcher).toBeUndefined();
    });

    it('should parse 2 arguments', () => {
      const [opts, matcher] = parsePluginOptions<any>('*.json', { foo: 'bar' });
      expect(opts).toEqual({ foo: 'bar' });
      expect(matcher).toBeInstanceOf(RegExp);
    });

    it('should parse 2 args and give a default value', () => {
      const [opts, matcher] = parsePluginOptions<any>(undefined, undefined, { foo: 'bar' });
      expect(opts).toEqual({ foo: 'bar' });
      expect(matcher).toBeUndefined();
    });

    it('should parse 2 args and give a default value with a matcher', () => {
      const [opts, matcher] = parsePluginOptions<any>('*.json', undefined, { foo: 'bar' });
      expect(opts).toEqual({ foo: 'bar' });
      expect(matcher).toBeInstanceOf(RegExp);
    });
  });
});
