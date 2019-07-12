import * as ts from 'typescript';
import '../../utils/test_utils';
import { pathJoin } from '../../utils/utils';
import { initTypescriptConfig, resolveTSConfig } from '../configParser';
import { createConfig } from '../../config/config';
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
      const cfg = createConfig({ tsConfig: { target: 'ES5' } });
      cfg.production = {};
      const result = initTypescriptConfig(cfg);
      expect(result.compilerOptions.target).toEqual(ts.ScriptTarget.ES5);
    });

    it('Module be parsed correctly', () => {
      const cfg = createConfig({ tsConfig: { target: 'ES5' } });
      cfg.production = {};
      const result = initTypescriptConfig(cfg);
      expect(result.compilerOptions.module).toEqual(ts.ModuleKind.CommonJS);
    });

    it('should resolve baseUrl correctly', () => {
      const cfg = createConfig({ tsConfig: { baseUrl: '.' } });
      cfg.production = {};
      const result = initTypescriptConfig(cfg);
      expect(result.compilerOptions.baseUrl).toMatchFilePath('src/tsconfig/__tests__$');
    });
  });

  describe('initTypescriptConfig json', () => {
    it('Should read from a set file', () => {
      const cfg = createConfig({ tsConfig: pathJoin(cases, 'case1/tsconfig.json') });

      const result = initTypescriptConfig(cfg);
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        baseUrl: '.',
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'ESNext',
      });
    });

    it('Should override module to commonjs', () => {
      const cfg = createConfig({ tsConfig: pathJoin(cases, 'case1/tsconfig2.json') });
      const result = initTypescriptConfig(cfg);
      expect(result.basePath).toMatchFilePath('tsconfig/__tests__/cases/case1$');
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        baseUrl: '.',
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'ESNext',
      });
    });

    it('Should respect user jsx', () => {
      const cfg = createConfig({ tsConfig: pathJoin(cases, 'case1/config3.json') });
      const result = initTypescriptConfig(cfg);
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        baseUrl: '.',
        module: 'commonjs',
        jsx: 'react-native',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'ESNext',
      });
    });

    it('Should respect production target', () => {
      const cfg = createConfig({ tsConfig: { target: 'ES5' } });
      cfg.production = {};
      const result = initTypescriptConfig(cfg);
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'ES5',
      });
    });

    it('Should set default production target', () => {
      const cfg = createConfig({ tsConfig: {} });
      cfg.production = {};
      const result = initTypescriptConfig(cfg);
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'ES2017',
      });
    });

    it('Should set default dev target', () => {
      const cfg = createConfig({ tsConfig: {} });

      const result = initTypescriptConfig(cfg);

      expect(result.basePath).toMatchFilePath('__tests__$');
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'ESNext',
      });
    });

    it('Should init from object', () => {
      const cfg = createConfig({ tsConfig: {} });

      const result = initTypescriptConfig(cfg);

      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'ESNext',
      });
    });

    it('Should find config automatically', () => {
      const cfg = createConfig({ homeDir: cases, entry: ['case1/src/index.js'] });

      const result = initTypescriptConfig(cfg);

      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        baseUrl: '.',
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'ESNext',
      });
    });

    it('Should find config and give it a base path', () => {
      const cfg = createConfig({ homeDir: cases, entry: ['case1/src/index.js'] });

      const result = initTypescriptConfig(cfg);

      expect(result.basePath).toMatchFilePath('src/tsconfig/__tests__/cases/case1$');
      expect(result.jsonCompilerOptions).toEqual({
        allowJs: true,
        baseUrl: '.',
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        importHelpers: true,
        experimentalDecorators: true,
        target: 'ESNext',
      });
    });
  });
});
