import * as path from 'path';

import { IPublicConfig } from '../../config/IPublicConfig';
import { createContext } from '../../core/Context';
import { createModule } from '../../core/Module';
import { createPackage, Package } from '../../core/Package';
import { env } from '../../env';
import { ImportType } from '../../resolver/resolver';
import { mockModule, mockWriteFile } from '../../utils/test_utils';
import { createCache } from '../cache';

const fileMock = mockWriteFile();

function mockCache(config?: IPublicConfig) {
  const ctx = createContext(config);
  const cache = createCache({ ctx });
  return { ctx, cache };
}

const createFakePackage = (props: {
  name: string;
  version: string;
  moduleAmount: number;
  dependencies?: Array<Package>;
}) => {
  const data = mockModule({
    config: {},
    moduleProps: {},
    packageProps: { isDefaultPackage: false, name: props.name },
  });
  data.pkg.isDefaultPackage = false;
  data.pkg.externalPackages = props.dependencies || [];
  const root = path.join(__dirname, `packages/${props.name}`);
  const packageJSON = path.join(root, 'package.json');
  data.pkg.props.meta = { packageJSONLocation: packageJSON, name: props.name, version: props.version };
  for (let i = 0; i < props.moduleAmount; i++) {
    const f = `index${i}.js`;
    data.pkg.modules.push(
      createModule(
        {
          ctx: data.ctx,
          absPath: path.join(root, f),
          extension: '.js',
          fuseBoxPath: f,
        },
        data.pkg,
      ),
    );
  }
  return data.pkg;
};

describe('FileCache test', () => {
  beforeEach(() => {
    fileMock.flush();
  });

  afterAll(() => {
    fileMock.unmock();
  });

  describe('clearing cache', () => {
    it('should nuke all', () => {
      const { cache } = mockCache({ cache: { root: path.join(__dirname, '.cache') } });
      cache.nukeAll();
      expect(fileMock.findRemovedFolder(`.cache/${env.VERSION}`)).toBe(true);
    });
    it('should nukeProjectCache', () => {
      const { cache } = mockCache({ cache: { root: path.join(__dirname, '.cache') } });
      cache.nukeProjectCache();
      expect(fileMock.findRemovedFolder(`.cache/${env.VERSION}/${env.CACHE.PROJET_FILES}`)).toBe(true);
    });
    it('should nukePackageCache', () => {
      const { cache } = mockCache({ cache: { root: path.join(__dirname, '.cache') } });
      cache.nukePackageCache();
      expect(fileMock.findRemovedFolder(`.cache/${env.VERSION}/${env.CACHE.PACKAGES}`)).toBe(true);
    });
  });

  describe('Getting and saving modules', () => {
    it('should save file', async () => {
      const rootFile = path.join(__dirname, 'cases/module-a/file1.ts');
      fileMock.addFile(
        rootFile,
        `
      import './foo';
      console.log(process);
      `,
      );
      const { cache } = mockCache({ cache: { root: path.join(__dirname, '.cache') } });
      const { module } = mockModule({ config: {} });
      module.props.fuseBoxPath = 'file1.ts';
      module.props.absPath = rootFile;
      cache.saveModule(module, { contents: 'aa', sourceMap: 'a' });
      await cache.sync();
      expect(fileMock.findFile('prj_02be82728.cache')).toBeTruthy();
    });

    it('Should get module', async () => {
      const { cache } = mockCache({ cache: { root: path.join(__dirname, '.cache') } });
      const { module } = mockModule({ config: {} });
      module.props.absPath = path.join(__dirname, 'cases/module-a/file1.ts');
      fileMock.addFile(module.props.absPath, 'require("./foo")');
      module.props.extension = '.ts';
      module.read();

      module.analysis = { imports: [] };
      cache.saveModule(module, { contents: 'aa', sourceMap: 'a' });

      expect(module.props.fuseBoxPath).toBeTruthy();
      expect(module.props.extension).toBe('.ts');

      await cache.sync();

      const cachedModule = cache.restoreModule(module);
      expect(cachedModule.props.fuseBoxPath).toBeTruthy();
      expect(cachedModule.props.extension).toBe('.ts');
    });

    it('Should not restore module (timestamp mismatch)', async () => {
      const { cache } = mockCache({ cache: { root: path.join(__dirname, '.cache') } });
      const { module } = mockModule({ config: {} });
      module.props.absPath = path.join(__dirname, 'cases/module-a/file1.ts');
      fileMock.addFile(module.props.absPath, 'require("./foo")');
      module.props.extension = '.ts';
      module.read();

      cache.saveModule(module, { contents: 'aa', sourceMap: 'a' });
      await cache.sync();

      const thatFile = fileMock.findFile('file1.ts');
      // modify stat time
      thatFile.stat.mtime = new Date(1);
      const cachedModule = cache.restoreModule(module);
      expect(cachedModule).toBeUndefined();
    });
  });
  describe('Getting and saving packages', () => {
    it('should init cache in a custom folder', () => {
      const x = mockCache({ cache: { root: path.join(__dirname, '.cache') } });
      x.cache.init();

      expect(fileMock.getEnsureDir()[0]).toMatchFilePath(`__tests__/.cache/${env.VERSION}/${env.CACHE.PACKAGES}$`);
      expect(fileMock.getEnsureDir()[1]).toMatchFilePath(`__tests__/.cache/${env.VERSION}/${env.CACHE.PROJET_FILES}`);
    });

    it('should init cache in a default folder', () => {
      const x = mockCache({ cache: true });
      x.cache.init();
      expect(fileMock.getEnsureDir()[0]).toMatchFilePath(`node_modules/.fusebox/${env.VERSION}/${env.CACHE.PACKAGES}$`);
      expect(fileMock.getEnsureDir()[1]).toMatchFilePath(
        `node_modules/.fusebox/${env.VERSION}/${env.CACHE.PROJET_FILES}`,
      );
    });

    it('should force sync on key', async () => {
      const { cache } = mockCache({ cache: true });
      const obj = { foo: 1 };
      cache.set('foo', obj);
      await cache.sync();
      obj.foo = 2;
      cache.forceSyncOnKey('foo');

      expect(cache['synced'].has('foo.cache')).toBe(false);
    });

    it('should get the tree', () => {
      const { cache } = mockCache({ cache: true });
      const tree = cache.getTree();
      expect(tree).toEqual({ packages: {} });
      expect(cache['synced'].has('tree.json.cache')).toEqual(false);

      expect(cache['unsynced'].get('tree.json.cache')).toBeTruthy();
    });

    it('should get the tree', () => {
      const { cache } = mockCache({ cache: true });
      const tree = cache.getTree();
      expect(tree).toEqual({ packages: {} });
    });

    it('should get the tree from the file cache', () => {
      const x = mockCache({ cache: true });
      const fakeContent = { packages: { foo: { '1.0.0': {} } } };
      fileMock.addFile(path.join(env.CACHE.ROOT, 'tree.json.cache'), JSON.stringify(fakeContent));
      const tree = x.cache.getTree();
      expect(fileMock.getFileReads()).toHaveLength(1);
      expect(tree).toEqual(fakeContent);
    });

    it('should sync the tree', async () => {
      const x = mockCache({ cache: true });
      const tree = x.cache.getTree();

      tree.packages.foo = { '1.3.3': { name: 'fop', modules: [], version: '1.3.1' } };

      expect(fileMock.getFileReads()).toEqual([]);
      await x.cache.sync();

      expect(fileMock.findFile('tree.json.cache$')).toBeTruthy();
      expect(fileMock.findFile('tree.json.cache$').contents).toContain('fop');

      const sameTree = x.cache.getTree();
      expect(fileMock.getFileReads()).toEqual([]);

      expect(sameTree).toEqual(tree);
    });

    it('should sync and store', async () => {
      const { cache } = mockCache({ cache: true });

      cache.set('foo', { bar: 1 });
      await cache.sync();

      expect(cache['synced'].get('foo.cache')).toEqual({ bar: 1 });
    });

    it('should unset', async () => {
      const { cache } = mockCache({ cache: true });

      cache.set('foo', { bar: 1 });
      cache.unset('foo');

      expect(cache['synced'].get('foo.cache')).toBe(undefined);
      expect(cache['unsynced'].get('foo.cache')).toBe(undefined);
    });

    it('should set a few files but write only after sync', async () => {
      const x = mockCache({ cache: true });

      x.cache.set('foo', { foo: 'foo' });
      x.cache.set('bar', { bar: 'bar' });
      expect(fileMock.getFileReads()).toEqual([]);
      expect(fileMock.getFileAmount()).toEqual(0);

      expect(x.cache.get('foo')).toEqual({ foo: 'foo' });
      expect(x.cache.get('bar')).toEqual({ bar: 'bar' });

      expect(fileMock.getFileReads()).toEqual([]);
      expect(fileMock.getFileAmount()).toEqual(0);

      await x.cache.sync();
      expect(fileMock.getFileAmount()).toEqual(2);
    });
  });

  describe('package get and set', () => {
    it('should sync a mocked package', async () => {
      const pkg = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2 });
      const x = mockCache({ cache: true });
      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      x.cache.savePackage(pkg, basics);

      expect(x.cache['unsynced'].get('pkg_foo-2.0.0.cache')).toBeTruthy();

      await x.cache.sync();

      const tree = x.cache.getTree();
      expect(tree.packages.foo).toBeTruthy();
      expect(tree.packages.foo['2.0.0']).toBeTruthy();

      const data = tree.packages.foo['2.0.0'];
      expect(data.name).toEqual('foo');
      expect(data.version).toEqual('2.0.0');
      expect(data.modules).toEqual(['index0.js', 'index1.js']);

      expect(fileMock.getFileAmount()).toEqual(2);

      const fooCache = fileMock.findFile('pkg_foo-2.0.0.cache$');
      expect(JSON.parse(fooCache.contents)).toEqual(basics);
    });

    it('should sync 2 packages', async () => {
      const bar = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 1 });
      const foo = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2, dependencies: [bar] });

      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      const basics2 = { contents: 'foobar2', sourceMap: 'sourcemap2' };

      const x = mockCache({ cache: true });

      x.cache.savePackage(foo, basics);

      x.cache.savePackage(bar, basics2);

      await x.cache.sync();

      const tree = x.cache.getTree();

      expect(tree.packages.bar).toBeTruthy();
      expect(tree.packages.foo).toBeTruthy();

      const fooData = tree.packages.foo['2.0.0'];
      expect(fooData.dependencies).toEqual([{ name: 'bar', version: '5.0.0' }]);

      expect(fileMock.getFileAmount()).toEqual(3);
    });

    it('should not find a package a clean everything', async () => {
      const bar = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 1 });
      const foo = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2, dependencies: [bar] });
      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      const { ctx, cache } = mockCache({ cache: true });

      cache.savePackage(foo, basics);
      cache.savePackage(bar, basics);

      await cache.sync();

      const tree = cache.getTree();

      expect(Object.keys(tree.packages)).toEqual(['foo', 'bar']);

      const response = cache.getPackage(createPackage({ ctx: ctx, meta: { name: 'oi', version: '1.1.0' } }));
      expect(response).toEqual({ abort: true });

      expect(Object.keys(tree.packages)).toEqual([]);
    });

    it('should not find a package version and clean everything', async () => {
      const bar = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 1 });
      const foo = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2, dependencies: [bar] });
      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      const { ctx, cache } = mockCache({ cache: true });

      cache.savePackage(foo, basics);
      cache.savePackage(bar, basics);

      await cache.sync();

      const tree = cache.getTree();

      expect(Object.keys(tree.packages)).toEqual(['foo', 'bar']);

      const response = cache.getPackage(createPackage({ ctx: ctx, meta: { name: 'bar', version: '5.0.1' } }));
      expect(response).toEqual({ abort: true });

      expect(Object.keys(tree.packages)).toEqual([]);
    });

    it('should resolve package correctly', async () => {
      const bar = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 1 });
      const foo = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2, dependencies: [bar] });
      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      const { ctx, cache } = mockCache({ cache: true });

      cache.savePackage(foo, basics);
      cache.savePackage(bar, basics);

      await cache.sync();

      const tree = cache.getTree();

      expect(Object.keys(tree.packages)).toEqual(['foo', 'bar']);

      const thatPackage = createPackage({ ctx: ctx, meta: { name: 'bar', version: '5.0.0' } });

      const response = cache.getPackage(thatPackage, thatPackage.modules);
      expect(response.target.moduleMismatch).toEqual(false);
      expect(response.target.pkg.props.meta.name).toEqual('bar');
      expect(response.target.pkg.props.meta.version).toEqual('5.0.0');

      expect(Object.keys(tree.packages)).toEqual(['foo', 'bar']);
    });

    it('should resolve package correctly with nested deps', async () => {
      const woo = createFakePackage({ name: 'woo', version: '3.0.0', moduleAmount: 2 });
      const bar = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 1, dependencies: [woo] });
      const foo = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2, dependencies: [bar] });
      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      const { ctx, cache } = mockCache({ cache: true });

      cache.savePackage(foo, basics);
      cache.savePackage(bar, basics);
      cache.savePackage(woo, basics);

      await cache.sync();

      const response = cache.getPackage(createPackage({ ctx: ctx, meta: { name: 'foo', version: '2.0.0' } }));
      expect(response.dependants).toHaveLength(2);

      expect(response.dependants.map(item => item.props.meta.name)).toEqual(['bar', 'woo']);
    });

    it('should  not resolve package correctly with nested deps (one is not synced)', async () => {
      const woo = createFakePackage({ name: 'woo', version: '3.0.0', moduleAmount: 2 });
      const bar = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 1, dependencies: [woo] });
      const foo = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2, dependencies: [bar] });
      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      const { ctx, cache } = mockCache({ cache: true });

      cache.savePackage(foo, basics);
      cache.savePackage(bar, basics);

      await cache.sync();

      const response = cache.getPackage(createPackage({ ctx: ctx, meta: { name: 'foo', version: '2.0.0' } }));
      expect(response.abort).toEqual(true);
    });

    it('should resolve package correctly after a memory clean', async () => {
      const bar = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 1 });
      const foo = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2, dependencies: [bar] });
      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      const { ctx, cache } = mockCache({ cache: true });

      cache.savePackage(foo, basics);
      cache.savePackage(bar, basics);

      await cache.sync();

      cache.clearMemory();

      const tree = cache.getTree();

      expect(Object.keys(tree.packages)).toEqual(['foo', 'bar']);

      const response = cache.getPackage(createPackage({ ctx: ctx, meta: { name: 'bar', version: '5.0.0' } }));
      expect(response.target.moduleMismatch).toEqual(false);
      expect(response.target.pkg.props.meta.name).toEqual('bar');
      expect(response.target.pkg.props.meta.version).toEqual('5.0.0');

      expect(Object.keys(tree.packages)).toEqual(['foo', 'bar']);
    });

    it('should abort because a file not found', async () => {
      const bar = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 1 });
      const foo = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2, dependencies: [bar] });
      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      const { ctx, cache } = mockCache({ cache: true });

      cache.savePackage(foo, basics);
      cache.savePackage(bar, basics);

      await cache.sync();

      const tree = cache.getTree();

      expect(Object.keys(tree.packages)).toEqual(['foo', 'bar']);

      cache.clearMemory();
      // delete all files
      fileMock.flush();

      const response = cache.getPackage(createPackage({ ctx: ctx, meta: { name: 'bar', version: '5.0.0' } }));

      expect(response).toEqual({ abort: true });
    });

    it('should not resolve package correctly with nested deps (one is not present)', async () => {
      const woo = createFakePackage({ name: 'woo', version: '3.0.0', moduleAmount: 2 });
      const bar = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 1, dependencies: [woo] });
      const foo = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2, dependencies: [bar] });
      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      const { ctx, cache } = mockCache({ cache: true });

      cache.savePackage(foo, basics);
      cache.savePackage(bar, basics);
      cache.savePackage(woo, basics);

      await cache.sync();

      cache.clearMemory();

      fileMock.deleteFile('woo-3.0.0.cache');

      const response = cache.getPackage(createPackage({ ctx: ctx, meta: { name: 'foo', version: '2.0.0' } }));

      expect(response.abort).toEqual(true);
    });

    it('should not resolve package because the parent version doesnt have file cache', async () => {
      const woo = createFakePackage({ name: 'woo', version: '3.0.0', moduleAmount: 2 });
      const bar = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 1, dependencies: [woo] });
      const foo = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2, dependencies: [bar] });
      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      const { ctx, cache } = mockCache({ cache: true });

      cache.savePackage(foo, basics);
      cache.savePackage(bar, basics);
      cache.savePackage(woo, basics);

      await cache.sync();

      cache.clearMemory();

      fileMock.deleteFile('foo-2.0.0.cache');

      const response = cache.getPackage(createPackage({ ctx: ctx, meta: { name: 'foo', version: '2.0.0' } }));

      expect(response.abort).toEqual(true);
    });

    it('should abort because a module mismatch', async () => {
      const bar = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 1 });
      const foo = createFakePackage({ name: 'foo', version: '2.0.0', moduleAmount: 2, dependencies: [bar] });
      const basics = { contents: 'foobar', sourceMap: 'sourcemap' };
      const { cache } = mockCache({ cache: true });

      cache.savePackage(foo, basics);
      cache.savePackage(bar, basics);

      await cache.sync();

      const bar2 = createFakePackage({ name: 'bar', version: '5.0.0', moduleAmount: 4 });

      const response = cache.getPackage(bar2);

      expect(response.abort).toEqual(true);
    });
  });
});
