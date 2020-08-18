import { EnvironmentType } from '../config/EnvironmentType';
import { runBrowserTest, runServerTest } from '../testUtils/integrationHelper';
import { EnvironmentTypesTestable } from '../testUtils/integrationTest';

describe('User dependencies test', () => {
  describe('Electron cases', () => {
    for (const env of EnvironmentTypesTestable) {
      it(`should polyfill path depenedency [ ${EnvironmentType[env]} ] `, async () => {
        const { response } = await runBrowserTest({
          config: {
            target: 'electron',
          },
          env,
          files: {
            'index.ts': `
            import * as path from "path"
            export function test(){
              return path.join("a", "b")
            }
          `,
          },
        });

        const data = response.eval();
        const fnRes = data.entry().test();
        expect(fnRes).toEqual('a/b');
      });

      it(`should not polyfill path depenedency [ ${EnvironmentType[env]} ] `, async () => {
        const { response } = await runBrowserTest({
          config: {
            target: 'electron',
            electron: { nodeIntegration: true },
          },
          env,
          files: {
            'index.ts': `
            import * as path from "path"
            export function test(){
              return path.join("a", "b")
            }
          `,
          },
        });

        const data = response.eval({
          extendGlobal: {
            require: target => {
              if (target === 'path') return { join: () => 'mocked' };
              return {};
            },
          },
        });
        const fnRes = data.entry().test();
        expect(fnRes).toEqual('mocked');
      });
    }
  });
  describe('Manually including dependencies', () => {
    it('should include package foo', async () => {
      const { response } = await runBrowserTest({
        config: {
          dependencies: { include: ['foo'] },
        },
        env: EnvironmentType.DEVELOPMENT,
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
      const packagePresent = response.runResponse.modules.find(m => /that_external_package/.test(m.contents));
      expect(packagePresent).toBeTruthy();
    });

    it('should include an extra file that is relative', async () => {
      const { response } = await runBrowserTest({
        config: {
          dependencies: { include: ['./oi'] },
        },
        env: EnvironmentType.DEVELOPMENT,
        files: {
          'index.ts': `export function something(){}`,
          'oi.ts': `export function that_new_oi_file()`,
        },
      });

      const packagePresent = response.runResponse.modules.find(m => /that_new_oi_file/.test(m.contents));
      expect(packagePresent).toBeTruthy();
    });

    for (const env of EnvironmentTypesTestable) {
      it(`should exlude and ignore all external deps env :[ ${EnvironmentType[env]} ] `, async () => {
        const { response } = await runServerTest({
          config: {
            dependencies: { serverIgnoreExternals: true },
          },
          env: env,
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

        // index and foo
        expect(response.runResponse.modules).toHaveLength(2);

        const requires = [];
        response.eval({
          onServerRequire: args => {
            // this should be called on a "real" nodejs require module which is mocked
            // we're jsut returning some object
            requires.push(args);
            return { real: true };
          },
        });

        expect(requires).toEqual([['some_server_package']]);
      });

      it('Should exclude specific module', async () => {
        const { response } = await runServerTest({
          config: {
            dependencies: { ignore: ['second_package'], serverIgnoreExternals: false },
          },
          env: env,
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

        const logs = [];
        response.eval({
          onConsoleLog: args => logs.push(args),
          onServerRequire: args => {
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
