import * as path from 'path';
import { EnvironmentType } from '../../config/EnvironmentType';
import { ITestBrowserResponse } from '../../testUtils/browserEnv/testBrowserEnv';
import { createIntegrationTest, createTestWorkspace, ITestWorkspace } from '../../testUtils/integrationTest';

describe('Cache intergation test', () => {
  const test = async (workspace): Promise<ITestBrowserResponse> => {
    const test = createIntegrationTest({
      config: {
        cache: { enabled: true, strategy: 'fs' },
        entry: path.join(workspace.sourceDir, 'index.ts'),
        target: 'browser',
      },
      envType: EnvironmentType.DEVELOPMENT,
      workspace,
    });

    const response = await test.runDev();
    return await response.runBrowser();
  };

  describe(`[ FS ] Workspace simple manupulations`, () => {
    let workspace: ITestWorkspace;

    function initWorkspace() {
      return (workspace = createTestWorkspace({
        files: {
          'foo.ts': 'export const foo = "foo"',
          'index.ts': `
            import * as foo from "./foo"
            const data = { foo }
            export { data }`,
        },
      }));
    }

    it('should give the initial data', async () => {
      await initWorkspace();
      const result = await test(workspace);

      expect(result.eval().entry().data).toEqual({ foo: { __esModule: true, foo: 'foo' } });
    });

    it('after adding a new file should remain the same', async () => {
      workspace.setFile('bar.ts', 'export const bar = "bar"');
      const result = await test(workspace);
      expect(result.eval().entry().data.foo).toBeTruthy();
    });

    it('include bar into foo', async () => {
      workspace.setFile(
        'foo.ts',
        `
          export { bar } from "./bar";
          export const foo = "foo"
      `,
      );
      const result = await test(workspace);

      expect(result.eval().entry().data).toEqual({ foo: { __esModule: true, bar: 'bar', foo: 'foo' } });
    });

    it('removing bar should yield an error', async () => {
      workspace.removeFile('bar.ts');
      const result = await test(workspace);
      expect(() => result.eval()).toThrowError();
    });

    it('bringing back bar', async () => {
      workspace.setFile('bar.ts', 'export const bar = "bar"');
      const result = await test(workspace);
      expect(result.eval().entry().data).toEqual({ foo: { __esModule: true, bar: 'bar', foo: 'foo' } });
    });

    it('Should modify bar', async () => {
      workspace.setFile('bar.ts', 'export const bar = "new_bar"');
      const result = await test(workspace);
      expect(result.eval().entry().data).toEqual({ foo: { __esModule: true, bar: 'new_bar', foo: 'foo' } });
    });

    it('Should handle recursion', async () => {
      workspace.setFile(
        'bar.ts',
        `
        import { mod_1 } from "./mod_1";
        export const bar = mod_1()
      `,
      );
      workspace.setFile(
        'mod_1.ts',
        `
        import { mod_2 } from "./mod_2";
        export function mod_1(){
          return "mod_1"+ mod_2();
        }
      `,
      );

      workspace.setFile(
        'mod_2.ts',
        `
        import "./mod_1"
        export function mod_2(){
          return "mod_2";
        }
      `,
      );

      const result = await test(workspace);
      expect(result.eval().entry().data).toEqual({ foo: { __esModule: true, bar: 'mod_1mod_2', foo: 'foo' } });
    });

    it('Should handle recursion (removing 1)', async () => {
      workspace.removeFile('mod_2.ts');
      const result = await test(workspace);
      expect(() => result.eval()).toThrowError();
    });

    it('Should handle recursion (reverting mode_2)', async () => {
      workspace.setFile(
        'mod_2.ts',
        `
        import "./mod_1"
        export function mod_2(){
          return "mod_2";
        }
      `,
      );
      const result = await test(workspace);
      expect(result.eval().entry().data).toEqual({ foo: { __esModule: true, bar: 'mod_1mod_2', foo: 'foo' } });
    });
  });

  describe(`[ FS ] Workspace module manupulation`, () => {
    let workspace: ITestWorkspace;

    function initWorkspace() {
      workspace = createTestWorkspace({
        files: {
          'index.ts': 'export const foo = require("foo")',
        },
        modules: {
          foo: {
            'index.ts': `export const fooPackage = 1`,
            'package.json': JSON.stringify({ main: 'index.ts', name: 'foo', version: '1.0.0' }),
          },
        },
      });
    }

    it('should get package foo', async () => {
      initWorkspace();
      const result = await test(workspace);
      expect(result.eval().entry()).toEqual({ __esModule: true, foo: { __esModule: true, fooPackage: 1 } });
    });

    it('should update package foo', async () => {
      workspace.setModuleFile('foo/package.json', JSON.stringify({ main: 'index.ts', name: 'foo', version: '2.0.0' }));
      workspace.setModuleFile('foo/index.ts', `export const fooPackage = 2`);
      const result = await test(workspace);
      expect(result.eval().entry()).toEqual({ __esModule: true, foo: { __esModule: true, fooPackage: 2 } });
    });

    it('should change package foo entry', async () => {
      workspace.setModuleFile(
        'foo/package.json',
        JSON.stringify({ main: 'new_index.ts', name: 'foo', version: '3.0.0' }),
      );
      workspace.setModuleFile('foo/new_index.ts', `export const fooPackage = 'new_foo'`);
      const result = await test(workspace);
      expect(result.eval().entry()).toEqual({ __esModule: true, foo: { __esModule: true, fooPackage: 'new_foo' } });
    });

    it('should introduce a new package within', async () => {
      workspace.setModuleFile('foo/package.json', JSON.stringify({ main: 'index.ts', name: 'foo', version: '4.0.0' }));
      workspace.setModuleFile('foo/index.ts', `export const fooPackage = require("bar")`);

      workspace.setModuleFile('bar/package.json', JSON.stringify({ main: 'index.ts', name: 'bar', version: '1.0.0' }));
      workspace.setModuleFile('bar/index.ts', `export const barPackage = "bar"`);

      const result = await test(workspace);

      expect(result.eval().entry()).toEqual({
        __esModule: true,
        foo: { __esModule: true, fooPackage: { __esModule: true, barPackage: 'bar' } },
      });
    });
  });
});
