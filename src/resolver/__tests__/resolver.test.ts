import * as path from 'path';
import { createRealNodeModule } from '../../utils/test_utils';
import { ImportType, resolveModule } from '../resolver';
const cases = path.join(__dirname, 'cases/');
const customModules = path.join(cases, '_modules');
createRealNodeModule(
  'resolver-test_a',
  {
    main: 'index.js',
    version: '1.0.1',
    browser: 'something-for-browser.js',
  },
  {
    'index.js': 'module.exports = {}',
    'foobar.js': 'module.exports = {}',
    'components/MyComponent.jsx': '',
    'sub/package.json': JSON.stringify({
      main: 'subindex.js',
    }),
    'something-for-browser.js': '',
    'sub/subindex.js': '',
  },
);

createRealNodeModule(
  'resolver-test_b',
  {
    main: 'index.js',
    version: '1.0.1',
    browser: { './foobar': './sub', oops: false },
  },
  {
    'index.js': 'module.exports = {}',
    'foobar.js': 'module.exports = {}',
    'components/MyComponent.jsx': '',
    'sub/package.json': JSON.stringify({
      main: 'subindex.js',
    }),
    'something-for-browser.js': '',
    'sub/subindex.js': '',
  },
);

describe('Resolver test', () => {
  describe('External modules', () => {
    it('Should resolve external target', () => {
      const info = resolveModule({ target: 'http://foo.com/some.js' });
      expect(info).toEqual({ isExternal: true });
    });
  });

  describe('Folder resolution', () => {
    const homeDir = path.join(cases, 'src1');
    const filePath = path.join(homeDir, 'foo.js');

    it('Should resolve index.js', () => {
      const info = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        target: './some1',
      });

      expect(info.extension).toEqual('.js');
      expect(info.fuseBoxPath).toEqual('some1/index.js');
      expect(info.absPath).toContain('cases/src1/some1/index.js');
    });

    it('Should resolve index.jsx', () => {
      const info = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        target: './some2',
      });
      expect(info.extension).toEqual('.jsx');
      expect(info.fuseBoxPath).toEqual('some2/index.jsx');
      expect(info.absPath).toContain('cases/src1/some2/index.jsx');
    });

    it('Should resolve index.ts', () => {
      const info = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        target: './some3',
      });
      expect(info.extension).toEqual('.ts');
      expect(info.fuseBoxPath).toEqual('some3/index.js');
      expect(info.absPath).toContain('cases/src1/some3/index.ts');
    });

    it('Should resolve index.tsx', () => {
      const info = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        target: './some4',
      });
      expect(info.extension).toEqual('.tsx');
      expect(info.fuseBoxPath).toEqual('some4/index.jsx');
      expect(info.absPath).toContain('cases/src1/some4/index.tsx');
    });

    it('Should resolve with importType DYNAMIC', () => {
      const info = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        importType: ImportType.DYNAMIC,
        target: './some4',
      });
      expect(info.forcedStatement).toEqual('~/some4/index.jsx');
      expect(info.extension).toEqual('.tsx');
      expect(info.fuseBoxPath).toEqual('some4/index.jsx');
      expect(info.absPath).toContain('cases/src1/some4/index.tsx');
    });

    it('Should resolve with package override', () => {
      const info = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        target: './some5',
      });

      expect(info.forcedStatement).toEqual('~/some5/foo.js');
      expect(info.fuseBoxPath).toEqual('some5/foo.js');
    });
  });

  describe('Alias replacement', () => {
    const homeDir = path.join(cases, 'src1');
    const filePath = path.join(homeDir, 'foo.js');
    it('Should replace alias 1', () => {
      const info = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        alias: {
          gibberish$: './some5',
        },
        target: 'gibberish',
      });
      expect(info.absPath).toMatchFilePath('cases/src1/some5/foo.js$');

      expect(info.forcedStatement).toEqual('~/some5/foo.js');
    });

    it('Should replace alias 2', () => {
      const info = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        alias: {
          ololo$: './some1',
        },
        target: 'ololo',
      });

      expect(info.absPath).toMatchFilePath('some1/index.js$');
      expect(info.forcedStatement).toEqual('~/some1/index.js');
    });

    it('Should replace alias 3', () => {
      const info = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        alias: {
          react: 'resolver-test_a',
        },
        target: 'react',
      });
      expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/index.js');
      expect(info.forcedStatement).toEqual('resolver-test_a');
    });

    it('Should not Replace alias and have forcedStatement false', () => {
      const info = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        alias: {
          ololo$: './some1',
        },
        target: './some1',
      });
      expect(info.absPath).toMatchFilePath('some1/index.js$');
      expect(info.forcedStatement).toBeFalsy();
    });
  });

  describe('Typescripts paths resolution', () => {
    const homeDir = path.join(cases, 'paths_lookup/src1');
    const filePath = path.join(homeDir, 'Moi.ts');
    it('Should resolve with ts paths and just baseURL', () => {
      const info = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        typescriptPaths: {
          baseURL: homeDir,
        },
        target: 'bar/Bar',
      });

      expect(info.absPath).toMatchFilePath('src1/bar/Bar.tsx$');
      expect(info.forcedStatement).toEqual('~/bar/Bar.jsx');
    });

    it('Should resolve with ts paths and custom paths 1', () => {
      const result = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        typescriptPaths: {
          baseURL: homeDir,
          paths: {
            '@app/*': ['something/app/*'],
          },
        },
        target: '@app/Foo',
      });
      expect(result.extension).toEqual('.tsx');
      expect(result.absPath).toMatchFilePath('something/app/Foo.tsx$');
      expect(result.forcedStatement).toEqual('~/something/app/Foo.jsx');
    });

    it('Should resolve with ts paths and custom paths 2', () => {
      const result = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        typescriptPaths: {
          baseURL: homeDir,
          paths: {
            '@app/*': ['something/app/*', 'something/other/*'],
          },
        },
        target: '@app/AnotherFile',
      });
      expect(result.extension).toEqual('.jsx');
      expect(result.absPath).toMatchFilePath('something/other/AnotherFile.jsx$');
      expect(result.forcedStatement).toEqual('~/something/other/AnotherFile.jsx');
    });
  });

  describe('Package resolution', () => {
    const homeDir = path.join(cases, 'src1');
    const filePath = path.join(homeDir, 'foo.js');
    describe('From the current project', () => {
      it('should resolve a simple package', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: filePath,
          target: 'resolver-test_a',
        });

        const meta = info.package.meta;
        expect(meta.name).toEqual('resolver-test_a');
        expect(meta.packageRoot).toMatchFilePath('node_modules/resolver-test_a$');
        expect(meta.version).toEqual('1.0.1');
        expect(meta.packageJSONLocation).toMatchFilePath('node_modules/resolver-test_a/package.json$');
        expect(meta.entryFuseBoxPath).toEqual('index.js');
        expect(info.package.isEntry).toEqual(true);
        expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/index.js$');
        expect(info.package.targetFuseBoxPath).toEqual('index.js');
      });

      it('should resolve a simple package with browser target', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: filePath,
          buildTarget: 'browser',
          target: 'resolver-test_a',
        });

        const meta = info.package.meta;
        expect(info.forcedStatement).toEqual('resolver-test_a/something-for-browser.js');
        expect(meta.entryFuseBoxPath).toEqual('something-for-browser.js');
        expect(info.package.isEntry).toEqual(true);
        expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/something-for-browser.js$');
        expect(info.package.targetFuseBoxPath).toEqual('something-for-browser.js');
      });

      it('should partially resolve package', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: filePath,
          target: 'resolver-test_a/foobar',
        });

        const meta = info.package.meta;
        expect(meta.name).toEqual('resolver-test_a');
        expect(meta.packageRoot).toMatchFilePath('node_modules/resolver-test_a$');
        expect(meta.version).toEqual('1.0.1');
        expect(meta.packageJSONLocation).toMatchFilePath('node_modules/resolver-test_a/package.json$');
        expect(meta.entryFuseBoxPath).toEqual('index.js');
        expect(info.package.isEntry).toEqual(false);
        expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/foobar.js');
        expect(info.package.targetFuseBoxPath).toEqual('foobar.js');
        expect(info.forcedStatement).toBeFalsy();
      });

      it('should partially resolve package (with ext)', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: filePath,
          target: 'resolver-test_a/foobar.js',
        });

        const meta = info.package.meta;
        expect(meta.name).toEqual('resolver-test_a');
        expect(meta.packageRoot).toMatchFilePath('node_modules/resolver-test_a$');
        expect(meta.version).toEqual('1.0.1');
        expect(meta.packageJSONLocation).toMatchFilePath('node_modules/resolver-test_a/package.json$');
        expect(meta.entryFuseBoxPath).toEqual('index.js');
        expect(info.package.isEntry).toEqual(false);
        expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/foobar.js');
        expect(info.package.targetFuseBoxPath).toEqual('foobar.js');
        expect(info.forcedStatement).toBeFalsy();
      });

      it('should partially resolve package (subfile with package.json)', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: filePath,
          target: 'resolver-test_a/sub',
        });

        const meta = info.package.meta;
        expect(meta.name).toEqual('resolver-test_a');
        expect(meta.packageRoot).toMatchFilePath('node_modules/resolver-test_a$');
        expect(meta.version).toEqual('1.0.1');
        expect(meta.packageJSONLocation).toMatchFilePath('node_modules/resolver-test_a/package.json$');
        expect(meta.entryFuseBoxPath).toEqual('index.js');
        expect(info.package.isEntry).toEqual(false);
        expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/sub/subindex.js');
        expect(info.package.targetFuseBoxPath).toEqual('sub/subindex.js');
        expect(info.forcedStatement).toEqual('resolver-test_a/sub/subindex.js');
      });

      it('should partially resolve package (subfile with package.json) with alias', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: filePath,
          target: 'oi/sub',
          alias: {
            '^oi': 'resolver-test_a',
          },
        });

        const meta = info.package.meta;
        expect(meta.name).toEqual('resolver-test_a');
        expect(meta.packageRoot).toMatchFilePath('node_modules/resolver-test_a$');
        expect(meta.version).toEqual('1.0.1');
        expect(meta.packageJSONLocation).toMatchFilePath('node_modules/resolver-test_a/package.json$');
        expect(meta.entryFuseBoxPath).toEqual('index.js');
        expect(info.package.isEntry).toEqual(false);
        expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/sub/subindex.js');
        expect(info.package.targetFuseBoxPath).toEqual('sub/subindex.js');
        expect(info.forcedStatement).toEqual('resolver-test_a/sub/subindex.js');
      });
    });

    describe('From existing package', () => {
      const packageInfo = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        target: 'resolver-test_a',
      });
      const pkg = packageInfo.package;
      it('should resolve a file being in a package', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: packageInfo.package.targetAbsPath,
          packageMeta: pkg.meta,
          target: './components/MyComponent',
        });

        expect(info.extension).toEqual('.jsx');
        expect(info.absPath).toMatchFilePath('node_modules/resolver-test_a/components/MyComponent.jsx');
        expect(info.fuseBoxPath).toEqual('components/MyComponent.jsx');
      });

      it('should resolve a file being in a package 2', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: packageInfo.package.targetAbsPath,
          packageMeta: pkg.meta,
          target: './sub',
        });

        expect(info.extension).toEqual('.js');
        expect(info.absPath).toMatchFilePath('node_modules/resolver-test_a/sub/subindex.js');
        expect(info.fuseBoxPath).toEqual('sub/subindex.js');
        expect(info.forcedStatement).toEqual('resolver-test_a/sub/subindex.js');
      });
    });

    describe('resolution with browser field', () => {
      const packageInfoB = resolveModule({
        homeDir: homeDir,
        filePath: filePath,
        target: 'resolver-test_b',
      });
      it('should resolve a file being in a package 2 (build target uknown)', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: packageInfoB.package.targetAbsPath,
          packageMeta: packageInfoB.package.meta,
          target: './foobar',
        });

        expect(info.absPath).toMatchFilePath('node_modules/resolver-test_b/foobar.js');
      });

      it('should resolve a file being in a package with browser fields', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: packageInfoB.package.targetAbsPath,
          packageMeta: packageInfoB.package.meta,
          target: './foobar',
          buildTarget: 'browser',
        });

        expect(info.absPath).toMatchFilePath('node_modules/resolver-test_b/sub/subindex.js$');
        expect(info.forcedStatement).toEqual('resolver-test_b/sub/subindex.js');
        expect(info.fuseBoxPath).toEqual('sub/subindex.js');
      });

      it('should replace the file with an empty package', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: packageInfoB.package.targetAbsPath,
          packageMeta: packageInfoB.package.meta,
          target: 'oops',
          modules: [customModules],
          buildTarget: 'browser',
        });

        expect(info.forcedStatement).toEqual('fuse-empty-package');
        expect(info.package.meta.name).toEqual('fuse-empty-package');
        expect(info.package.targetAbsPath).toMatchFilePath('cases/_modules/fuse-empty-package/index.js$');
      });
    });

    describe('Server/electron polyfill should not be bundled', () => {
      const filePath = path.join(homeDir, 'foo.js');
      it('Should skip fs (server)', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: filePath,
          target: 'fs',
          buildTarget: 'server',
        });
        expect(info.skip).toEqual(true);
      });

      it('Should skip fs (electron)', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: filePath,
          target: 'fs',
          buildTarget: 'electron',
        });
        expect(info.skip).toEqual(true);
      });

      it('Should not skip fs (browser)', () => {
        const info = resolveModule({
          homeDir: homeDir,
          filePath: filePath,
          target: 'fs',
          buildTarget: 'browser',
          modules: [customModules],
        });
        expect(info.skip).toBeFalsy();
        expect(info.package.targetAbsPath).toMatchFilePath('cases/_modules/fs/index.js$');
      });
    });
  });
});
