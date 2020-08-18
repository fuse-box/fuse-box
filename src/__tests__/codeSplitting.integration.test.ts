import { EnvironmentType } from '../config/EnvironmentType';
import { pluginSass } from '../plugins/core/plugin_sass';
import { runBrowserTest, runServerTest } from '../testUtils/integrationHelper';
describe('Code splitting integration test', () => {
  describe('JS + CSS code splitting', () => {
    describe('Browser', () => {
      it('should load a file + css', async () => {
        const env = await runBrowserTest({
          env: EnvironmentType.PRODUCTION,
          files: {
            'index.ts': `
            export async function test(){
              return import("./foo")
            }
          `,
            'foo.ts': `
              import "./foo.css";
              const foo = 'foo_module'
              export { foo };
            `,
            'foo.css': `body { color: red}`,
          },
        });

        const scope = await env.response.eval();
        const entry = scope.entry();

        expect(scope.$loadedCSSFiles).toHaveLength(0);
        const result = await entry.test();
        expect(scope.$loadedCSSFiles).toHaveLength(1);
        expect(result.foo).toEqual('foo_module');
      });

      it('should load a file + css module', async () => {
        const env = await runBrowserTest({
          env: EnvironmentType.PRODUCTION,
          config: {
            plugins: [pluginSass('foo.scss', { asModule: {} })],
          },
          files: {
            'index.ts': `
            export async function test(){
              return import("./foo")
            }
          `,
            'foo.ts': `
              import * as foo from "./foo.scss";
              export { foo };
            `,
            'foo.scss': `.item { color: red}`,
          },
        });

        const scope = await env.response.eval();
        const entry = scope.entry();

        expect(scope.$loadedCSSFiles).toHaveLength(0);
        const result = await entry.test();
        expect(scope.$loadedCSSFiles).toHaveLength(1);
        expect(result.foo.item).toBeTruthy();
      });
    });

    describe('Server', () => {
      it('should load a JS module and ignore the css', async () => {
        const env = await runServerTest({
          env: EnvironmentType.PRODUCTION,
          files: {
            'index.ts': `
            export async function test(){
              return import("./foo")
            }
          `,
            'foo.ts': `
              import "./foo.css";
              const foo = 'foo_module'
              export { foo };
            `,
            'foo.css': `body { color: red}`,
          },
        });

        const scope = await env.response.eval();
        const entry = scope.entry();
        const result = await entry.test();
        expect(result.foo).toEqual('foo_module');
      });

      it('should load a file + css module', async () => {
        const env = await runServerTest({
          env: EnvironmentType.PRODUCTION,
          config: {
            plugins: [pluginSass('foo.scss', { asModule: {} })],
          },
          files: {
            'index.ts': `
            export async function test(){
              return import("./foo")
            }
          `,
            'foo.ts': `
              import * as foo from "./foo.scss";
              export { foo };
            `,
            'foo.scss': `.item { color: red}`,
          },
        });

        const scope = await env.response.eval();
        const entry = scope.entry();

        const result = await entry.test();

        expect(result.foo.item).toBeTruthy();
      });
    });
  });
  describe('javascript code splitting', () => {
    describe('Browser', () => {
      it('should load a file', async () => {
        const env = await runBrowserTest({
          env: EnvironmentType.PRODUCTION,
          files: {
            'index.ts': `
            export async function test(){
              return import("./foo")
            }
          `,
            'foo.ts': `
              const foo = 'foo_module'
              export {foo};
            `,
          },
        });

        const scope = await env.response.eval();
        const entry = scope.entry();

        const result = await entry.test();

        expect(result.foo).toEqual('foo_module');
      });

      it('should load 2 files', async () => {
        const env = await runBrowserTest({
          env: EnvironmentType.PRODUCTION,
          files: {
            'index.ts': `
            export async function test(){
              const {foo} = await import("./foo")
              const {bar} = await import("./bar")
              return [foo, bar]
            }
          `,
            'foo.ts': `
              const foo = 'foo_module'
              export {foo};
            `,
            'bar.ts': `
              const bar = 'bar_module'
              export {bar};
            `,
          },
        });

        const scope = await env.response.eval();
        const entry = scope.entry();

        const result = await entry.test();

        expect(result).toEqual(['foo_module', 'bar_module']);
      });
    });

    describe('Server', () => {
      it('should load a file', async () => {
        const env = await runServerTest({
          env: EnvironmentType.PRODUCTION,
          files: {
            'index.ts': `
            export async function test(){
              return import("./foo")
            }
          `,
            'foo.ts': `
              const foo = 'foo_module'
              export {foo};
            `,
          },
        });

        const scope = await env.response.eval();
        const entry = scope.entry();

        const result = await entry.test();

        expect(result.foo).toEqual('foo_module');
      });

      it('should load 2 files', async () => {
        const env = await runServerTest({
          env: EnvironmentType.PRODUCTION,
          files: {
            'index.ts': `
            export async function test(){
              const {foo} = await import("./foo")
              const {bar} = await import("./bar")
              return [foo, bar]
            }
          `,
            'foo.ts': `
              const foo = 'foo_module'
              export {foo};
            `,
            'bar.ts': `
              const bar = 'bar_module'
              export {bar};
            `,
          },
        });

        const scope = await env.response.eval();
        const entry = scope.entry();

        const result = await entry.test();

        expect(result).toEqual(['foo_module', 'bar_module']);
      });
    });
  });
});
