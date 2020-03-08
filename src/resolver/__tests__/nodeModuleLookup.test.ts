import * as appRoot from 'app-root-path';
import * as path from 'path';
import '../../utils/test_utils';
import { findTargetFolder, isNodeModule, parseAllModulePaths, nodeModuleLookup } from '../nodeModuleLookup';
import { ensureDir, ensurePackageJson } from '../../utils/utils';
import { createRealNodeModule } from '../../utils/test_utils';
import { resolve as pathResolve } from 'path'

const cases = path.join(__dirname, 'cases');

const PROJECT_NODE_MODULES = path.join(appRoot.path, 'node_modules');
describe('isNodeModule', () => {
  it('case 1', () => {
    const res = isNodeModule('foo');
    expect(res).toEqual({ name: 'foo' });
  });

  it('case 2', () => {
    const res = isNodeModule('foo/');
    expect(res).toEqual({ name: 'foo' });
  });
  it('case 3', () => {
    const res = isNodeModule('foo/some.js');
    expect(res).toEqual({ name: 'foo', target: 'some.js' });
  });
  it('case 4', () => {
    const res = isNodeModule('foo/some');
    expect(res).toEqual({ name: 'foo', target: 'some' });
  });

  it('case 4', () => {
    const res = isNodeModule('@core/foo');
    expect(res).toEqual({ name: '@core/foo' });
  });

  it('case 5', () => {
    const res = isNodeModule('@core/foo/');
    expect(res).toEqual({ name: '@core/foo' });
  });

  it('case 6', () => {
    const res = isNodeModule('@core/foo/something');
    expect(res).toEqual({ name: '@core/foo', target: 'something' });
  });

  it('case 9', () => {
    const res = isNodeModule('some-stuff-here');
    expect(res).toEqual({ name: 'some-stuff-here' });
  });

  it('case 10', () => {
    const res = isNodeModule('some-stuff_here');
    expect(res).toEqual({ name: 'some-stuff_here' });
  });

  it('case 11', () => {
    const res = isNodeModule('@angular/platform-browser-dynamic');
    expect(res).toEqual({ name: '@angular/platform-browser-dynamic' });
  });

  it('case 12', () => {
    const res = isNodeModule('@angular/platform-browser-dynamic/bar');
    expect(res).toEqual({ name: '@angular/platform-browser-dynamic', target: 'bar' });
  });

  it('case 13', () => {
    const res = isNodeModule('lodash.isNull');
    expect(res).toEqual({ name: 'lodash.isNull' });
  });

  it('case 14', () => {
    const res = isNodeModule('chart.js');
    expect(res).toEqual({ name: 'chart.js' });
  });

  it('case 15', () => {
    const res = isNodeModule('validate.io-undefined');
    expect(res).toEqual({ name: 'validate.io-undefined' });
  });
});

describe('NodeModule lookup', () => {
  const modules = path.join(__dirname, 'cases/_modules');
  const filePath = path.join(cases, 'src2/index.ts');
  it('should fail to look up a module', () => {
    const res = nodeModuleLookup({ filePath: filePath, target: '__foo' }, { name: '__foo' });
    expect(res && res.error).toContain('Cannot resolve "__foo"');
  });

  it('should fail to look up a module without package.json', () => {
    const res = nodeModuleLookup(
      { modules: [modules], filePath: filePath, target: 'incomplete_module' },
      { name: 'incomplete_module' },
    );

    expect(res.error).toBeTruthy();
  });

  it('should extract fuse-box info from package.json', () => {
    const result = nodeModuleLookup(
      { modules: [modules], filePath: filePath, target: 'system_module' },
      { name: 'system_module' },
    );
    expect(result.meta.fusebox.system).toEqual(true);
  });

  it('should throw an error if an entry point is not found', () => {
    //expect(() => {
    const res = nodeModuleLookup(
      { modules: [modules], filePath: filePath, target: 'wrong_entry' },
      { name: 'wrong_entry' },
    );
    expect(res.error).toContain('Failed to resolve an entry point in package');
  });
});

describe('parseAllModulePaths', () => {
  it('Should skip node_modules directories', () => {
    const path = pathResolve('/a/node_modules/@angular/core/node_modules/foo/node_modules/bar/far/woo/index.js');
    const actual = parseAllModulePaths(path);
    const expected = [
      '/node_modules',
      '/a/node_modules',
      '/a/node_modules/@angular/node_modules',
      '/a/node_modules/@angular/core/node_modules',
      '/a/node_modules/@angular/core/node_modules/foo/node_modules',
      '/a/node_modules/@angular/core/node_modules/foo/node_modules/bar/node_modules',
      '/a/node_modules/@angular/core/node_modules/foo/node_modules/bar/far/node_modules',
      '/a/node_modules/@angular/core/node_modules/foo/node_modules/bar/far/woo/node_modules',
    ].map(p => pathResolve(p));
    expect(actual).toStrictEqual(expected)
  });

  it('Should give all node_modules paths ', () => {
    const path = pathResolve('/some/user/file');
    const actual = parseAllModulePaths(path);
    const expected = [
      '/node_modules',
      '/some/node_modules',
      '/some/user/node_modules',
    ].map(p => pathResolve(p));
    expect(actual).toStrictEqual(expected)
  });
});

describe('folder lookup', () => {
  ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-b'));
  ensurePackageJson(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/b/node_modules/d/'));
  ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/crazy-module/'));
  ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/nm-lookup-test-b'));
  it('case 1', () => {
    const dir = ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/b/node_modules/c/'));
    const target = path.join(dir, 'foo/bar/index.js');
    const targetFolder = findTargetFolder({ target: 'a', filePath: target }, 'd');
    expect(targetFolder).toMatchFilePath('node_modules/nm-lookup-test-a/node_modules/b/node_modules/d$');
  });

  it('case 2', () => {
    const dir = ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/b/node_modules/c/'));
    ensurePackageJson(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/crazy-module/'));
    const target = path.join(dir, 'foo/bar/index.js');
    const targetFolder = findTargetFolder({ target: 'a', filePath: target }, 'crazy-module');
    expect(targetFolder).toMatchFilePath('node_modules/nm-lookup-test-a/node_modules/crazy-module$');
  });

  it('case 3', () => {
    const dir = ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/b/node_modules/c/'));
    ensurePackageJson(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/nm-lookup-test-b'));
    const target = path.join(dir, 'foo/bar/index.js');
    const targetFolder = findTargetFolder({ target: 'a', filePath: target }, 'nm-lookup-test-b');
    expect(targetFolder).toMatchFilePath('node_modules/nm-lookup-test-a/node_modules/nm-lookup-test-b$');
  });

  it('case 4', () => {
    const target = path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/index.js');
    const targetFolder = findTargetFolder({ target: 'a', filePath: target }, 'nm-lookup-test-b');
    expect(targetFolder).toMatchFilePath('node_modules/nm-lookup-test-b$');
  });

  it('case 5 (not inside node_modules)', () => {
    const target = path.join(__dirname, 'nm-lookup-test-b');
    ensurePackageJson(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-b'));
    const targetFolder = findTargetFolder({ target: 'a', filePath: target }, 'nm-lookup-test-b');
    expect(targetFolder).toMatchFilePath('node_modules/nm-lookup-test-b$');
  });

  it('case 6 (only package.json)', () => {
    // this one should not match (has no package.json)
    const deep = ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/b'))
    ensureDir(path.join(deep, 'b/node_modules/c/'));
    // this one should match (has package.json)
    const shallow = ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/c'));
    ensurePackageJson(shallow);
    const target = path.join(deep, 'foo/bar/index.js');
    const targetFolder = findTargetFolder({ target: 'a', filePath: target }, 'c');
    expect(targetFolder).toMatchFilePath('nm-lookup-test-a/node_modules/c$');
  });

  describe('Nested lookup', () => {
    createRealNodeModule(
      'fuse-box-resolver-parent',
      {
        main: 'index.js',
        version: '1.0.1',
      },
      {
        'index.js': 'import "fuse-box-resolver-conflict"',
      },
    );

    createRealNodeModule(
      'fuse-box-flat-parent/node_modules/fuse-box-resolver-conflict',
      {
        main: 'index.js',
        version: '4.0.0',
      },
      {
        'index.js': 'module.exports = {}',
      },
    );

    createRealNodeModule(
      'fuse-box-resolver-conflict',
      {
        main: 'index.js',
        version: '5.0.0',
      },
      {
        'index.js': 'module.exports = {}',
      },
    );

    it('should look up nested with src/index.js', () => {
      const targetFolder = findTargetFolder(
        {
          target: 'fuse-box-resolver-conflict',
          filePath: path.join(appRoot.path, 'node_modules/fuse-box-flat-parent/src/index.js'),
        },
        'fuse-box-resolver-conflict',
      );
      expect(targetFolder).toMatchFilePath('fuse-box-flat-parent/node_modules/fuse-box-resolver-conflict$');
    });

    it('should look up nested with index.js (direct)', () => {
      const targetFolder = findTargetFolder(
        {
          target: 'fuse-box-resolver-conflict',
          filePath: path.join(appRoot.path, 'node_modules/fuse-box-flat-parent/index.js'),
        },
        'fuse-box-resolver-conflict',
      );
      expect(targetFolder).toMatchFilePath('fuse-box-flat-parent/node_modules/fuse-box-resolver-conflict$');
    });
  });
});
