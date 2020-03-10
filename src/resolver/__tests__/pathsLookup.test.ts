import * as path from 'path';
import '../../utils/test_utils';
import { pathsLookup } from '../pathsLookup';
const CASE1 = path.join(__dirname, 'cases/paths_lookup/src1');

describe('Paths lookup', () => {
  describe('Basic lookup based on listing', () => {
    it('Should lookup and resolve baseURL . (tsx)', () => {
      const result = pathsLookup({ baseURL: CASE1, target: 'bar/Bar' });

      expect(result.fileExists).toBe(true);
      expect(result.absPath).toMatch(/Bar\.tsx$/);
      expect(result.absPath).toMatchFilePath('Bar.tsx$');
    });

    it('Should lookup and resolve baseURL . (foo/index.ts)', () => {
      const result = pathsLookup({ baseURL: CASE1, target: 'foo' });
      expect(result.fileExists).toBe(true);

      expect(result.absPath).toMatchFilePath('foo/index.ts$');
    });

    it('Should lookup and resolve baseURL . (foo/index.ts) with slash', () => {
      const result = pathsLookup({ baseURL: CASE1, target: 'foo/' });
      expect(result.fileExists).toBe(true);
      expect(result.absPath).toMatchFilePath('foo/index.ts$');
    });

    it('Should fail to resolve', () => {
      const result = pathsLookup({ baseURL: CASE1, target: 'foosome/' });
      expect(result).toBe(undefined);
    });

    it('Should result just a file name Moi.ts', () => {
      const result = pathsLookup({ baseURL: CASE1, target: 'Moi' });
      expect(result.fileExists).toBe(true);

      expect(result.absPath).toMatchFilePath('Moi.ts$');
    });
  });

  describe('Lookup based on paths', () => {
    it('should look up an find @app', () => {
      const result = pathsLookup({
        baseURL: CASE1,
        paths: {
          '@app/*': ['something/app/*'],
        },
        target: '@app/Foo',
      });
      expect(result.fileExists).toBe(true);
      expect(result.extension).toEqual('.tsx');
      expect(result.absPath).toMatchFilePath('something/app/Foo.tsx$');
    });

    it('should look up and find in 2 directories', () => {
      const result = pathsLookup({
        baseURL: CASE1,

        paths: {
          '@app/*': ['something/app/*', 'something/other/*'],
        },
        target: '@app/AnotherFile',
      });
      expect(result.fileExists).toBe(true);
      expect(result.extension).toEqual('.jsx');
      expect(result.absPath).toMatchFilePath('something/other/AnotherFile.jsx$');
    });

    it('should look up and find @app/*/foo (middle star)', () => {
      const result = pathsLookup({
        baseURL: CASE1,

        paths: {
          '@app/*/foo': ['something/*/Foo'],
        },
        target: '@app/app/foo',
      });
      expect(result.fileExists).toBe(true);
      expect(result.extension).toEqual('.tsx');
      expect(result.absPath).toMatchFilePath('something/app/Foo.tsx$');
    });

    it('should look up and find @app/* (key with star | dir no star)', () => {
      const result = pathsLookup({
        baseURL: CASE1,

        paths: {
          '@app/*': ['foo'],
        },
        target: '@app/anything',
      });
      expect(result.fileExists).toBe(true);
      expect(result.extension).toEqual('.ts');
      expect(result.absPath).toMatchFilePath('foo/index.ts$');
    });

    it('should look up and find @app* (key with star, no slash)', () => {
      const result = pathsLookup({
        baseURL: CASE1,

        paths: {
          '@app*': ['foo'],
        },
        target: '@appFindFoo',
      });
      expect(result.fileExists).toBe(true);
      expect(result.extension).toEqual('.ts');
      expect(result.absPath).toMatchFilePath('foo/index.ts$');
    });

    it("should look up and find 'path' (alias to foo/index.js)", () => {
      const result = pathsLookup({
        baseURL: CASE1,

        paths: {
          path: ['foo'],
        },
        target: 'path',
      });
      expect(result.fileExists).toBe(true);
      expect(result.extension).toEqual('.ts');
      expect(result.absPath).toMatchFilePath('foo/index.ts$');
    });
  });
});
