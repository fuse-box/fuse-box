import { createContext } from '../Context';
import * as path from 'path';
import { assemble } from '../assemble';
import '../../utils/test_utils';
import { IConfig } from '../interfaces';
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
});
