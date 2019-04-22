import * as ts from 'typescript';
import '../../utils/test_utils';
import { pathJoin } from '../../utils/utils';
import { initTypescriptConfig, resolveTSConfig } from '../configParser';
const cases = pathJoin(__dirname, 'cases');
const case1 = pathJoin(cases, 'case1');

describe('tsconfig', () => {
  describe('resolve tsconfig file', () => {
    it('Should find by directory', () => {
      const data = resolveTSConfig({
        root: cases,
        directory: pathJoin(cases, 'case1/src/foo/bar'),
      });
      expect(data.iterations).toBeGreaterThanOrEqual(0);
      expect(data.filePath).toMatchFilePath('tsconfig/__tests__/cases/case1/tsconfig.json$');
    });

    it('Should find by fileName', () => {
      const data = resolveTSConfig({
        root: cases,
        fileName: pathJoin(cases, 'case1/src/foo/bar/hello.js'),
      });
      expect(data.iterations).toBeGreaterThanOrEqual(0);
      expect(data.filePath).toMatchFilePath('tsconfig/__tests__/cases/case1/tsconfig.json$');
    });

    it('Should not find', () => {
      const data = resolveTSConfig({
        root: pathJoin(cases, 'case1/src'),
        directory: pathJoin(cases, 'case1/src/foo/bar'),
      });

      expect(data.iterations).toBeGreaterThanOrEqual(0);
      expect(data.filePath).toBeUndefined();
    });

    it('Should not find (max iterations reached)', () => {
      const directories = [cases];
      for (let i = 0; i <= 30; i++) {
        directories.push(`dir_${i}`);
      }
      const data = resolveTSConfig({
        root: cases,
        directory: pathJoin(...directories),
      });
      expect(data.filePath).toBeUndefined();
      expect(data.iterations).toEqual(20);
    });
  });

  describe('initTypescriptConfig real compiler options', () => {
    it('Target be parsed correctly', () => {
      const result = initTypescriptConfig({
        production: {},
        tsConfig: {
          target: 'es5',
        },
      });
      expect(result.compilerOptions.target).toEqual(ts.ScriptTarget.ES5);
    });

    it('Module be parsed correctly', () => {
      const result = initTypescriptConfig({
        production: {},
        tsConfig: {},
      });
      expect(result.compilerOptions.module).toEqual(ts.ModuleKind.CommonJS);
    });

    it('should resolve baseUrl correctly', () => {
      const result = initTypescriptConfig({
        production: {},
        tsConfig: {
          baseUrl: '.',
        },
      });
      expect(result.compilerOptions.baseUrl).toMatchFilePath('src/tsconfig/__tests__$');
    });
  });

  describe('initTypescriptConfig json', () => {
    it('Should read from a set file', () => {
      const result = initTypescriptConfig({
        tsConfig: pathJoin(cases, 'case1/tsconfig.json'),
      });
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        baseUrl: '.',
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'esnext',
      });
    });

    it('Should override module to commonjs', () => {
      const result = initTypescriptConfig({
        tsConfig: pathJoin(cases, 'case1/tsconfig2.json'),
      });
      expect(result.basePath).toMatchFilePath('tsconfig/__tests__/cases/case1$');
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        baseUrl: '.',
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'esnext',
      });
    });

    it('Should respect user jsx', () => {
      const result = initTypescriptConfig({
        tsConfig: pathJoin(cases, 'case1/config3.json'),
      });
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        baseUrl: '.',
        module: 'commonjs',
        jsx: 'react-native',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'esnext',
      });
    });

    it('Should respect production target', () => {
      const result = initTypescriptConfig({
        production: {},
        tsConfig: {
          target: 'es5',
        },
      });
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'es5',
      });
    });

    it('Should set default production target', () => {
      const result = initTypescriptConfig({
        production: {},
        tsConfig: {},
      });
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'es2017',
      });
    });

    it('Should set default dev target', () => {
      const result = initTypescriptConfig({
        production: false,
        tsConfig: {},
      });

      expect(result.basePath).toMatchFilePath('__tests__$');
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'esnext',
      });
    });

    it('Should init from object', () => {
      const result = initTypescriptConfig({
        tsConfig: {},
      });
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'esnext',
      });
    });

    it('Should find config automatically', () => {
      const result = initTypescriptConfig({
        homeDir: cases,
        entries: ['case1/src/index.js'],
      });
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        baseUrl: '.',
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'esnext',
      });
    });

    it('Should find config and give it a base path', () => {
      const result = initTypescriptConfig({
        homeDir: cases,
        entries: ['case1/src/index.js'],
      });

      expect(result.basePath).toMatchFilePath('src/tsconfig/__tests__/cases/case1$');
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        baseUrl: '.',
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'esnext',
      });
    });
  });
});
