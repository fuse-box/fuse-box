import * as path from 'path';
import { assemble } from '../assemble';
import '../../utils/test_utils';

import { createRequireConst } from '../../utils/utils';
import { devImports } from '../../integrity/devPackage';
import { ImportType } from '../../resolver/resolver';
import { createContext } from '../../core/Context';
import { IConfig } from '../../core/interfaces';
import { createRealNodeModule } from '../../utils/test_utils';
function createProjectContext(folder: string, opts?: IConfig) {
  opts = opts || {};
  return createContext({
    ...{
      modules: [path.resolve(__dirname, 'cases/modules/')],
      homeDir: path.resolve(__dirname, 'cases/projects/', folder),
    },
    ...opts,
  });
}
describe('Assemble test', () => {
  describe('Verify project structure', () => {
    let src1Context, src2Context;
    beforeEach(() => {
      src1Context = createProjectContext('src1');
      src2Context = createProjectContext('src2');
    });
    it('should assemble a default package (ts)', () => {
      const packages = assemble(src1Context, 'index.ts');
      expect(packages).toHaveLength(1);
      const defaultPackage = packages[0];
      expect(defaultPackage.entry.props.absPath).toMatchFilePath('cases/projects/src1/index.ts$');
    });

    it('should assemble a default package (tsx)', () => {
      const packages = assemble(src1Context, 'index.tsx');
      expect(packages).toHaveLength(1);
      const defaultPackage = packages[0];
      expect(defaultPackage.entry.props.absPath).toMatchFilePath('cases/projects/src1/index.tsx$');
    });

    it('should assemble a default package (js)', () => {
      const packages = assemble(src1Context, 'index.js');
      expect(packages).toHaveLength(1);
      const defaultPackage = packages[0];
      expect(defaultPackage.entry.props.absPath).toMatchFilePath('cases/projects/src1/index.js$');
    });

    it('should assemble a default package (jsx)', () => {
      const packages = assemble(src1Context, 'index.jsx');
      expect(packages).toHaveLength(1);
      const defaultPackage = packages[0];
      expect(defaultPackage.entry.props.absPath).toMatchFilePath('cases/projects/src1/index.jsx$');
    });

    it('should contain 1 module', () => {
      const packages = assemble(src1Context, 'index.ts');
      expect(packages).toHaveLength(1);
      const defaultPackage = packages[0];
      expect(defaultPackage.modules).toHaveLength(1);
      expect(defaultPackage.modules[0].props.absPath).toMatchFilePath('cases/projects/src1/index.ts$');
      expect(defaultPackage.modules[0]).toEqual(defaultPackage.entry);
    });

    it('should contain 3 modules', () => {
      const packages = assemble(src2Context, 'index.ts');
      expect(packages).toHaveLength(1);
      const defaultPackage = packages[0];
      expect(defaultPackage.modules).toHaveLength(3);
      expect(defaultPackage.modules[0].props.absPath).toMatchFilePath('cases/projects/src2/index.ts$');
      expect(defaultPackage.modules[0]).toEqual(defaultPackage.entry);

      const expectedModules = ['index.ts$', 'components/Foo.ts$', 'components/Bar.ts$'];
      defaultPackage.modules.forEach((item, index) => {
        expect(item.props.absPath).toMatchFilePath(expectedModules[index]);
      });
    });

    it('should contain 3 modules including css', () => {
      const packages = assemble(src2Context, 'index2.ts');
      expect(packages).toHaveLength(1);
      const defaultPackage = packages[0];
      expect(defaultPackage.modules).toHaveLength(3);
      expect(defaultPackage.modules[0].props.absPath).toMatchFilePath('cases/projects/src2/index2.ts$');
      expect(defaultPackage.modules[0]).toEqual(defaultPackage.entry);

      const expectedModules = ['index2.ts$', 'withstyles/Foo.ts$', 'withstyles/Foo.scss$'];
      defaultPackage.modules.forEach((item, index) => {
        expect(item.props.absPath).toMatchFilePath(expectedModules[index]);
      });
    });

    it('should not load the contents of scss file', () => {
      const packages = assemble(src2Context, 'index2.ts');
      expect(packages).toHaveLength(1);
      const defaultPackage = packages[0];
      const cssModule = defaultPackage.modules.find(item => /scss$/.test(item.props.absPath));
      expect(cssModule.contents).toBeFalsy();
    });
  });

  describe('Handle modules', () => {
    let src3Context;
    beforeEach(() => {
      src3Context = createProjectContext('src3');
    });

    it('should bundle a simple entry', () => {
      const packages = assemble(src3Context, 'a.ts');

      expect(packages).toHaveLength(2);
      const moduleA = packages[1];
      expect(moduleA.modules).toHaveLength(2);
      expect(moduleA.modules[0].props.absPath).toMatchFilePath('module-a/index.js$');
      expect(moduleA.modules[1].props.absPath).toMatchFilePath('module-a/bar.js$');
    });

    it('should bundle second lib which requires first', () => {
      const packages = assemble(src3Context, 'b.ts');

      expect(packages).toHaveLength(3);
      expect(packages.map(pkg => pkg.props.meta.name)).toEqual(['default', 'module-b', 'module-a']);

      const moduleB = packages.find(item => item.props.meta.name === 'module-b');
      expect(moduleB.modules).toHaveLength(2);
      expect(moduleB.modules[0].props.absPath).toMatchFilePath('module-b/index.js$');
      expect(moduleB.modules[1].props.absPath).toMatchFilePath('module-b/bar.js$');

      const moduleA = packages.find(item => item.props.meta.name === 'module-a');
      expect(moduleA.modules).toHaveLength(2);
      expect(moduleA.modules[0].props.absPath).toMatchFilePath('module-a/index.js$');
      expect(moduleA.modules[1].props.absPath).toMatchFilePath('module-a/bar.js$');
    });

    it('should assemble a  package wihtout an entry (skip entry point just a partial require)', () => {
      const src5Context = createProjectContext('src5');
      const packages = assemble(src5Context, 'index.ts');

      expect(packages).toHaveLength(2);
      expect(packages.map(pkg => pkg.props.meta.name)).toEqual(['default', 'module-a']);

      const moduleA = packages.find(item => item.props.meta.name === 'module-a');
      expect(moduleA.modules).toHaveLength(1);
      expect(moduleA.modules[0].props.absPath).toMatchFilePath('module-a/bar.js$');
    });
  });

  describe('Respect browser overrides in packages', () => {
    it('should get the entry right (target unknown)', () => {
      const ctx = createProjectContext('src4');
      const packages = assemble(ctx, 'index.ts');
      expect(packages).toHaveLength(3);

      const moduleC = packages.find(item => item.props.meta.name === 'module-c');
      expect(moduleC.modules).toHaveLength(1);
      expect(moduleC.modules[0].props.absPath).toMatchFilePath('modules/module-c/index.js$');
    });

    it('should get the entry right (target server)', () => {
      const ctx = createProjectContext('src4', { target: 'server' });
      const packages = assemble(ctx, 'index.ts');
      expect(packages).toHaveLength(3);

      const moduleC = packages.find(item => item.props.meta.name === 'module-c');
      expect(moduleC.modules).toHaveLength(1);
      expect(moduleC.modules[0].props.absPath).toMatchFilePath('modules/module-c/index.js$');
    });

    it('should get the entry right (target electron)', () => {
      const ctx = createProjectContext('src4', { target: 'electron' });
      const packages = assemble(ctx, 'index.ts');
      expect(packages).toHaveLength(3);

      const moduleC = packages.find(item => item.props.meta.name === 'module-c');
      expect(moduleC.modules).toHaveLength(1);
      expect(moduleC.modules[0].props.absPath).toMatchFilePath('modules/module-c/index.js$');
    });

    it('should get the entry right (target browser)', () => {
      const ctx = createProjectContext('src4', { target: 'browser' });
      const packages = assemble(ctx, 'index.ts');
      expect(packages).toHaveLength(3);
      const moduleC = packages.find(item => item.props.meta.name === 'module-c');
      expect(moduleC.modules).toHaveLength(1);
      expect(moduleC.modules[0].props.absPath).toMatchFilePath('modules/module-c/browser-entry.js$');
    });
  });

  describe('Expect browser essentials data to be present', () => {
    it('Should have process injected', () => {
      const ctx = createProjectContext('src6', { target: 'browser' });
      const packages = assemble(ctx, 'index.ts');

      expect(packages).toHaveLength(2);

      const processModule = packages.find(item => item.props.meta.name === 'process');
      expect(processModule).toBeDefined();

      const defaultModule = packages.find(item => item.props.meta.name === 'default');

      expect(defaultModule.modules[0].header).toEqual([createRequireConst('process')]);
    });

    it('Should have dev imports', () => {
      const ctx = createProjectContext('src6', { target: 'browser' });
      const packages = assemble(ctx, 'index2.ts');

      expect(packages).toHaveLength(2);

      const devImportsModule = packages.find(item => item.props.meta.name === devImports.packageName);
      expect(devImportsModule).toBeDefined();

      const defaultModule = packages.find(item => item.props.meta.name === 'default');
      expect(defaultModule.modules).toHaveLength(2);

      const mainModule = defaultModule.modules.find(item => item.props.fuseBoxPath === 'index2.js');
      expect(mainModule.header).toEqual([createRequireConst(devImports.packageName, devImports.variable)]);
    });

    it('Should should replace dynamic import statement', () => {
      const ctx = createProjectContext('src6');
      const packages = assemble(ctx, 'index2.ts');

      const defaultModule = packages.find(item => item.props.meta.name === 'default');

      const mainModule = defaultModule.modules.find(item => item.props.fuseBoxPath === 'index2.js');
      expect(mainModule.contents).toContain(`await $fsmp$('./test');`);
      expect(mainModule.contents).toContain(`a:$fsmp$('./test')`);
    });
  });

  describe('Expect modules to have replaceble data for further transformation', () => {
    it('Should not a replacement on index.ts', () => {
      const ctx = createProjectContext('src7', { target: 'server' });
      const packages = assemble(ctx, 'index.ts');

      const defaultModule = packages.find(item => item.props.meta.name === 'default');

      const mainModule = defaultModule.modules.find(item => item.props.fuseBoxPath === 'index.js');
      expect(mainModule.fastAnalysis.replaceable).toEqual([]);
    });
    it('Should have a replacement on index.ts', () => {
      const ctx = createProjectContext('src7', { target: 'browser' });
      const packages = assemble(ctx, 'index.ts');

      const defaultModule = packages.find(item => item.props.meta.name === 'default');

      const mainModule = defaultModule.modules.find(item => item.props.fuseBoxPath === 'index.js');
      expect(mainModule.fastAnalysis.replaceable).toEqual([
        {
          type: ImportType.RAW_IMPORT,
          fromStatement: 'module-c',
          toStatement: 'module-c/browser-entry.js',
        },
      ]);
    });

    it('Should not get processed because it"s cached', () => {
      const ctx = createProjectContext('src7', { target: 'browser' });
      ctx.ict.on('assemble_package_from_project', props => {
        props.pkg.isCached = true;
        return props;
      });
      const packages = assemble(ctx, 'index.ts');
      packages.forEach(pkg => {
        if (!pkg.isDefaultPackage) {
          expect(pkg.isCached).toBe(true);
        }
      });
    });
  });

  describe('Verify flatness', () => {
    createRealNodeModule(
      'fuse-box-flat-assemble-parent',
      {
        name: 'fuse-box-flat-assemble-parent',
        main: 'index.js',
        version: '1.0.1',
      },
      {
        'index.js': 'import "fuse-box-flat-assemble-conflict"',
      },
    );

    createRealNodeModule(
      'fuse-box-flat-assemble-parent/node_modules/fuse-box-flat-assemble-conflict',
      {
        name: 'fuse-box-flat-assemble-conflict',
        main: 'index.js',
        version: '4.0.0',
      },
      {
        'index.js': 'module.exports = {}',
      },
    );

    createRealNodeModule(
      'fuse-box-flat-assemble-conflict',
      {
        name: 'fuse-box-flat-assemble-conflict',
        main: 'index.js',
        version: '5.0.0',
      },
      {
        'index.js': 'module.exports = {}',
      },
    );

    it('Should verify flatness of each package', () => {
      const ctx = createProjectContext('src9_flatness', { target: 'browser' });
      const packages = assemble(ctx, 'index.ts');
      const results = packages.map(pkg => {
        return [pkg.props.meta.name, pkg.props.meta.version, pkg.isFlat];
      });

      expect(results).toEqual([
        ['default', undefined, true],
        ['fuse-box-flat-assemble-parent', '1.0.1', true],
        ['fuse-box-flat-assemble-conflict', '5.0.0', true],
        ['fuse-box-flat-assemble-conflict', '4.0.0', false],
      ]);
    });
  });
});
