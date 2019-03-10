import * as appRoot from 'app-root-path';
import * as path from 'path';
import '../../utils/test_utils';
import { findTargetFolder, isNodeModule, parseAllModulePaths, nodeModuleLookup } from '../nodeModuleLookup';
import { ensureDir } from '../../utils/utils';

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
});

describe('NodeModule lookup', () => {
  const modules = path.join(__dirname, 'cases/_modules');
  const filePath = path.join(cases, 'src2/index.ts');
  it('should fail to look up a module', () => {
    expect(() => {
      nodeModuleLookup({ filePath: filePath, target: '__foo' }, { name: '__foo' });
    }).toThrowError();
  });

  it('should fail to look up a module without package.json', () => {
    expect(() => {
      nodeModuleLookup(
        { modules: [modules], filePath: filePath, target: 'incomplete_module' },
        { name: 'incomplete_module' },
      );
    }).toThrowError();
  });

  it('should extract fuse-box info from package.json', () => {
    const result = nodeModuleLookup(
      { modules: [modules], filePath: filePath, target: 'system_module' },
      { name: 'system_module' },
    );
    expect(result.meta.fusebox.system).toEqual(true);
  });

  it('should throw an error if an entry point is not found', () => {
    expect(() => {
      nodeModuleLookup({ modules: [modules], filePath: filePath, target: 'wrong_entry' }, { name: 'wrong_entry' });
    }).toThrowError();
  });
});

describe('parseAllModulePaths', () => {
  it('Should parse 1', () => {
    const path = 'a/node_modules/@angular/core/node_modules/foo/node_modules/bar/far/woo/index.js';
    const paths = parseAllModulePaths(path);
    expect(paths).toEqual([
      'a/node_modules',
      'a/node_modules/@angular/core/node_modules',
      'a/node_modules/@angular/core/node_modules/foo/node_modules',
      'a/node_modules/@angular/core/node_modules/foo/node_modules/bar/node_modules',
    ]);
  });

  it('Should give a primary path ', () => {
    const path = 'some/user/file';
    const paths = parseAllModulePaths(path);
    expect(paths).toHaveLength(1);
    expect(paths[0]).toMatchFilePath('node_modules$');
  });
});

describe('folder lookup', () => {
  ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-b'));
  ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/b/node_modules/d/'));
  ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/crazy-module/'));
  ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/nm-lookup-test-b'));
  it('case 1', () => {
    const dir = ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/b/node_modules/c/'));
    const target = path.join(dir, 'foo/bar/index.js');
    const targetFolder = findTargetFolder({ target: 'a', filePath: target }, { name: 'd' });
    expect(targetFolder).toMatchFilePath('node_modules/nm-lookup-test-a/node_modules/b/node_modules/d$');
  });

  it('case 2', () => {
    const dir = ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/b/node_modules/c/'));
    const target = path.join(dir, 'foo/bar/index.js');
    const targetFolder = findTargetFolder({ target: 'a', filePath: target }, { name: 'crazy-module' });
    expect(targetFolder).toMatchFilePath('node_modules/nm-lookup-test-a/node_modules/crazy-module$');
  });

  it('case 3', () => {
    const dir = ensureDir(path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/node_modules/b/node_modules/c/'));
    const target = path.join(dir, 'foo/bar/index.js');
    const targetFolder = findTargetFolder({ target: 'a', filePath: target }, { name: 'nm-lookup-test-b' });
    expect(targetFolder).toMatchFilePath('node_modules/nm-lookup-test-a/node_modules/nm-lookup-test-b$');
  });

  it('case 4', () => {
    const target = path.join(PROJECT_NODE_MODULES, 'nm-lookup-test-a/index.js');
    const targetFolder = findTargetFolder({ target: 'a', filePath: target }, { name: 'nm-lookup-test-b' });
    expect(targetFolder).toMatchFilePath('node_modules/nm-lookup-test-b$');
  });

  it('case 5 (not inside node_modules)', () => {
    const target = path.join(__dirname, 'nm-lookup-test-b');
    const targetFolder = findTargetFolder({ target: 'a', filePath: target }, { name: 'nm-lookup-test-b' });
    expect(targetFolder).toMatchFilePath('node_modules/nm-lookup-test-b$');
  });
});
