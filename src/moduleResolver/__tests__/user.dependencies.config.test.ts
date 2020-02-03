import { EnvironmentType } from '../../config/EnvironmentType';
import {
  EnvironmentTypesTestable,
  createTestWorkspace,
  testBrowser,
  testServer,
  ITestWorkspace,
} from '../../testUtils/integrationTest';

describe('User dependencies test', () => {
  describe('Manually including dependencies', () => {
    let workspace: ITestWorkspace;

    afterEach(() => workspace && workspace.destroy());

    it('should include package foo', async () => {
      workspace = createTestWorkspace({
        files: {
          'index.ts': `export function something(){}`,
        },
        modules: {
          foo: {
            'index.ts': `export function that_external_package(){}`,
            'package.json': JSON.stringify({ main: 'index.ts', name: 'foo', version: '1.0.0' }),
          },
        },
      });
      const response = await testBrowser({
        workspace,
        type: EnvironmentType.DEVELOPMENT,
        config: {
          dependencies: { include: ['foo'] },
        },
      });

      const packagePresent = response.runResponse.modules.find(m => /that_external_package/.test(m.contents));
      expect(packagePresent).toBeTruthy();
    });

    it('should include an extra file that is relative', async () => {
      workspace = createTestWorkspace({
        files: {
          'index.ts': `export function something(){}`,
          'oi.ts': `export function that_new_oi_file()`,
        },
      });

      const response = await testBrowser({
        workspace,
        type: EnvironmentType.DEVELOPMENT,
        config: {
          dependencies: { include: ['./oi'] },
        },
      });

      const packagePresent = response.runResponse.modules.find(m => /that_new_oi_file/.test(m.contents));
      expect(packagePresent).toBeTruthy();
    });

    for (const env of EnvironmentTypesTestable) {
      it(`should exlude and ignore all external deps env :[ ${EnvironmentType[env]} ] `, async () => {
        workspace = createTestWorkspace({
          files: {
            'foo.ts': 'export const foo = "foo"',
            'index.ts': `
              import { oi} from "some_server_package"
              import {foo} from "./foo"
              console.log(oi, foo)
            `,
          },
          modules: {
            some_server_package: {
              'index.ts': `export function something(){}`,
              'package.json': JSON.stringify({ main: 'index.ts', name: 'some_server_package', version: '1.0.0' }),
            },
          },
        });

        const x = await testServer({
          workspace,
          type: env,
          config: {
            dependencies: { serverIgnoreExternals: true },
          },
        });

        // index and foo
        expect(x.runResponse.modules).toHaveLength(2);

        const requires = [];
        x.eval({
          onServerRequre: args => {
            // this should be called on a "real" nodejs require module which is mocked
            // we're jsut returning some object
            requires.push(args);
            return { real: true };
          },
        });

        expect(requires).toEqual([['some_server_package']]);
      });

      it('Should exclude specific module', async () => {
        workspace = createTestWorkspace({
          files: {
            'foo.ts': 'export const foo = "foo"',
            'index.ts': `
              import * as some_server_package from "some_server_package"
              import * as second_package from "second_package"
              console.log(some_server_package, second_package)
            `,
          },
          modules: {
            second_package: {
              'index.ts': `export const res = "second_package"`,
              'package.json': JSON.stringify({ main: 'index.ts', name: 'second_package', version: '1.0.0' }),
            },
            some_server_package: {
              'index.ts': `export const res = "some_server_package"`,
              'package.json': JSON.stringify({ main: 'index.ts', name: 'some_server_package', version: '1.0.0' }),
            },
          },
        });

        const x = await testServer({
          workspace,
          type: env,
          config: {
            dependencies: { serverIgnore: ['second_package'], serverIgnoreExternals: false },
          },
        });
        const logs = [];
        x.eval({
          onConsoleLog: args => logs.push(args),
          onServerRequre: args => {
            // this should be called on a "real" nodejs require module which is mocked
            // we're jsut returning some object
            if (args[0] === 'second_package') return { native_second_package: true };
          },
        });
        expect(logs).toEqual([[{ __esModule: true, res: 'some_server_package' }, { native_second_package: true }]]);
      });
    }
  });
});
