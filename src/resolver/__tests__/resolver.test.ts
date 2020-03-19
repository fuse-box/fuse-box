import * as path from 'path';
import { ImportType } from '../../compiler/interfaces/ImportType';
import { createRealNodeModule } from '../../utils/test_utils';
import { resolveModule } from '../resolver';
const cases = path.join(__dirname, 'cases/');
const customModules = path.join(cases, '_modules');
createRealNodeModule(
  'resolver-test_a',
  {
    browser: 'something-for-browser.js',
    main: 'index.js',
    version: '1.0.1',
  },
  {
    'components/MyComponent.jsx': '',
    'foobar.js': 'module.exports = {}',
    'index.js': 'module.exports = {}',
    'something-for-browser.js': '',
    'sub/package.json': JSON.stringify({
      main: 'subindex.js',
    }),
    'sub/subindex.js': '',
  },
);

createRealNodeModule(
  'resolver-test_b',
  {
    browser: { './foobar.js': './sub/subindex.js', oops: false },
    main: 'index.js',
    version: '1.0.1',
  },
  {
    'components/MyComponent.jsx': '',
    'deepa/index.js': `require('../foobar')`,
    'foobar.js': 'module.exports = {}',
    'index.js': 'module.exports = {}',
    'something-for-browser.js': '',
    'sub/package.json': JSON.stringify({
      main: 'subindex.js',
    }),
    'sub/subindex.js': '',
  },
);

createRealNodeModule(
  'resolver-test_cc',
  {
    browser: { './index.js': './browser-index.js' },
    main: 'index.js',
    version: '1.0.1',
  },
  {
    'browser-index.js': 'module.exports = { browser : true }',
    'index.js': 'module.exports = { main : true }',
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
        filePath: filePath,

        target: './some1',
      });

      expect(info.extension).toEqual('.js');
      expect(info.absPath).toMatchFilePath('cases/src1/some1/index.js');
    });

    it('Should resolve index.jsx', () => {
      const info = resolveModule({
        filePath: filePath,

        target: './some2',
      });
      expect(info.extension).toEqual('.jsx');
      expect(info.absPath).toMatchFilePath('cases/src1/some2/index.jsx');
    });

    it('Should resolve index.ts', () => {
      const info = resolveModule({
        filePath: filePath,

        target: './some3',
      });
      expect(info.extension).toEqual('.ts');
      expect(info.absPath).toMatchFilePath('cases/src1/some3/index.ts');
    });

    it('Should resolve index.tsx', () => {
      const info = resolveModule({
        filePath: filePath,

        target: './some4',
      });
      expect(info.extension).toEqual('.tsx');
      expect(info.absPath).toMatchFilePath('cases/src1/some4/index.tsx');
    });

    it('Should resolve with importType DYNAMIC', () => {
      const info = resolveModule({
        filePath: filePath,

        importType: ImportType.DYNAMIC,
        target: './some4',
      });

      expect(info.extension).toEqual('.tsx');

      expect(info.absPath).toMatchFilePath('cases/src1/some4/index.tsx');
    });
  });

  describe('Alias replacement', () => {
    const homeDir = path.join(cases, 'src1');
    const filePath = path.join(homeDir, 'foo.js');
    it('Should replace alias 1', () => {
      const info = resolveModule({
        alias: {
          gibberish$: './some5',
        },
        filePath: filePath,

        target: 'gibberish',
      });
      expect(info.absPath).toMatchFilePath('cases/src1/some5/foo.js$');
    });

    it('Should replace alias 2', () => {
      const info = resolveModule({
        alias: {
          ololo$: './some1',
        },
        filePath: filePath,

        target: 'ololo',
      });

      expect(info.absPath).toMatchFilePath('some1/index.js$');
    });

    it('Should replace alias 3', () => {
      const info = resolveModule({
        alias: {
          react: 'resolver-test_a',
        },
        filePath: filePath,

        target: 'react',
      });
      expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/index.js');
    });

    it('Should not Replace alias and have forcedStatement false', () => {
      const info = resolveModule({
        alias: {
          ololo$: './some1',
        },
        filePath: filePath,

        target: './some1',
      });
      expect(info.absPath).toMatchFilePath('some1/index.js$');
    });
  });

  describe('Typescripts paths resolution', () => {
    const homeDir = path.join(cases, 'paths_lookup/src1');
    const filePath = path.join(homeDir, 'Moi.ts');
    it('Should resolve with ts paths and just baseURL', () => {
      const info = resolveModule({
        filePath: filePath,

        target: 'bar/Bar',
        typescriptPaths: {
          baseURL: homeDir,
        },
      });

      expect(info.absPath).toMatchFilePath('src1/bar/Bar.tsx$');
    });

    it('Should resolve with ts paths and custom paths 1', () => {
      const result = resolveModule({
        filePath: filePath,

        target: '@app/Foo',
        typescriptPaths: {
          baseURL: homeDir,
          paths: {
            '@app/*': ['something/app/*'],
          },
        },
      });
      expect(result.extension).toEqual('.tsx');
      expect(result.absPath).toMatchFilePath('something/app/Foo.tsx$');
    });

    it('Should resolve with ts paths and custom paths 2', () => {
      const result = resolveModule({
        filePath: filePath,

        target: '@app/AnotherFile',
        typescriptPaths: {
          baseURL: homeDir,
          paths: {
            '@app/*': ['something/app/*', 'something/other/*'],
          },
        },
      });
      expect(result.extension).toEqual('.jsx');
      expect(result.absPath).toMatchFilePath('something/other/AnotherFile.jsx$');
    });
  });

  describe('Package resolution', () => {
    const homeDir = path.join(cases, 'src1');
    const filePath = path.join(homeDir, 'foo.js');
    describe('From the current project', () => {
      it('should resolve a simple package', () => {
        const info = resolveModule({
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
          buildTarget: 'browser',
          filePath: filePath,

          target: 'resolver-test_a',
        });

        const meta = info.package.meta;

        expect(meta.entryFuseBoxPath).toEqual('something-for-browser.js');
        expect(info.package.isEntry).toEqual(true);
        expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/something-for-browser.js$');
        expect(info.package.targetFuseBoxPath).toEqual('something-for-browser.js');
      });

      it('should partially resolve package', () => {
        const info = resolveModule({
          filePath: filePath,

          target: 'resolver-test_a/foobar',
        });

        const meta = info.package.meta;
        expect(meta.name).toEqual('resolver-test_a');
        expect(meta.packageRoot).toMatchFilePath('node_modules/resolver-test_a$');
        expect(meta.version).toEqual('1.0.1');
        expect(meta.packageJSONLocation).toMatchFilePath('node_modules/resolver-test_a/package.json$');

        expect(info.package.isEntry).toEqual(false);
        expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/foobar.js');
        expect(info.package.targetFuseBoxPath).toEqual('foobar.js');
      });

      it('should partially resolve package (with ext)', () => {
        const info = resolveModule({
          filePath: filePath,

          target: 'resolver-test_a/foobar.js',
        });

        const meta = info.package.meta;
        expect(meta.name).toEqual('resolver-test_a');
        expect(meta.packageRoot).toMatchFilePath('node_modules/resolver-test_a$');
        expect(meta.version).toEqual('1.0.1');
        expect(meta.packageJSONLocation).toMatchFilePath('node_modules/resolver-test_a/package.json$');
        expect(info.package.isEntry).toEqual(false);
        expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/foobar.js');
        expect(info.package.targetFuseBoxPath).toEqual('foobar.js');
      });

      it('should partially resolve package (subfile with package.json)', () => {
        const info = resolveModule({
          filePath: filePath,

          target: 'resolver-test_a/sub',
        });

        const meta = info.package.meta;
        expect(meta.name).toEqual('resolver-test_a');
        expect(meta.packageRoot).toMatchFilePath('node_modules/resolver-test_a$');
        expect(meta.version).toEqual('1.0.1');
        expect(meta.packageJSONLocation).toMatchFilePath('node_modules/resolver-test_a/package.json$');

        expect(info.package.isEntry).toEqual(false);
        expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/sub/subindex.js');
        expect(info.package.targetFuseBoxPath).toEqual('sub/subindex.js');
      });

      it('should partially resolve package (subfile with package.json) with alias', () => {
        const info = resolveModule({
          alias: {
            '^oi': 'resolver-test_a',
          },
          filePath: filePath,

          target: 'oi/sub',
        });

        const meta = info.package.meta;
        expect(meta.name).toEqual('resolver-test_a');
        expect(meta.packageRoot).toMatchFilePath('node_modules/resolver-test_a$');
        expect(meta.version).toEqual('1.0.1');
        expect(meta.packageJSONLocation).toMatchFilePath('node_modules/resolver-test_a/package.json$');

        expect(info.package.isEntry).toEqual(false);
        expect(info.package.targetAbsPath).toMatchFilePath('node_modules/resolver-test_a/sub/subindex.js');
        expect(info.package.targetFuseBoxPath).toEqual('sub/subindex.js');
      });
    });

    describe('From existing package', () => {
      const packageInfo = resolveModule({
        filePath: filePath,

        target: 'resolver-test_a',
      });

      const pkg = packageInfo.package;
      it('should resolve a file being in a package', () => {
        const info = resolveModule({
          filePath: packageInfo.package.targetAbsPath,

          packageMeta: pkg.meta,
          target: './components/MyComponent',
        });

        expect(info.extension).toEqual('.jsx');
        expect(info.absPath).toMatchFilePath('node_modules/resolver-test_a/components/MyComponent.jsx');
      });

      it('should resolve a file being in a package 2', () => {
        const info = resolveModule({
          filePath: packageInfo.package.targetAbsPath,

          packageMeta: pkg.meta,
          target: './sub',
        });

        expect(info.extension).toEqual('.js');
        expect(info.absPath).toMatchFilePath('node_modules/resolver-test_a/sub/subindex.js');
      });
    });

    describe('resolution with browser field', () => {
      const packageInfoB = resolveModule({
        filePath: filePath,

        target: 'resolver-test_b',
      });
      it('should resolve a file being in a package 2 (build target uknown)', () => {
        const info = resolveModule({
          filePath: packageInfoB.package.targetAbsPath,

          packageMeta: packageInfoB.package.meta,
          target: './foobar',
        });

        expect(info.absPath).toMatchFilePath('node_modules/resolver-test_b/foobar.js');
      });

      it('should override an entry point', () => {
        const info = resolveModule({
          buildTarget: 'browser',
          filePath: __dirname,

          target: 'resolver-test_cc',
        });
        expect(info.package.targetAbsPath).toMatchFilePath('browser-index.js');
        expect(info.package.targetFuseBoxPath).toEqual('browser-index.js');
        expect(info.package.meta.entryAbsPath).toMatchFilePath('browser-index.js');
      });

      it('should resolve a file being in a package with browser fields', () => {
        const info = resolveModule({
          buildTarget: 'browser',
          filePath: packageInfoB.package.targetAbsPath,

          packageMeta: packageInfoB.package.meta,
          target: './foobar',
        });

        expect(info.absPath).toMatchFilePath('node_modules/resolver-test_b/sub/subindex.js$');
      });

      it('should resolve a file being in a package with browser fields 2', () => {
        const filePath = path.join(path.dirname(packageInfoB.package.targetAbsPath), 'deepa/index.js');

        const info = resolveModule({
          buildTarget: 'browser',
          filePath: filePath,

          packageMeta: packageInfoB.package.meta,
          target: '../foobar',
        });

        expect(info.absPath).toMatchFilePath('resolver-test_b/sub/subindex.js$');
      });

      it('should resolve a file being in a package with browser fields 3', () => {
        const info = resolveModule({
          buildTarget: 'browser',
          filePath: __filename,

          packageMeta: packageInfoB.package.meta,
          target: 'resolver-test_b/foobar',
        });

        expect(info.package.targetAbsPath).toMatchFilePath('resolver-test_b/sub/subindex.js$');

        expect(info.package.targetFuseBoxPath).toEqual('sub/subindex.js');
      });

      it('should replace the file with an empty package', () => {
        const info = resolveModule({
          buildTarget: 'browser',
          filePath: packageInfoB.package.targetAbsPath,

          modules: [customModules],
          packageMeta: packageInfoB.package.meta,
          target: 'oops',
        });

        expect(info.package.meta.name).toEqual('fuse-empty-package');
        expect(info.package.targetAbsPath).toMatchFilePath('cases/_modules/fuse-empty-package/index.js$');
      });
    });
  });
});
