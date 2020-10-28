import { createIntegrationTest, createTestWorkspace } from '../../testUtils/integrationTest';
import { ITestBrowserResponse } from '../../testUtils/browserEnv/testBrowserEnv';
import * as path from 'path';
import { EnvironmentType } from '../../config/EnvironmentType';

describe('Bundle router test', () => {
  describe('When no bundle configuration is provided', () => {
    let test;
    beforeAll(() => {
      test = async (workspace): Promise<ITestBrowserResponse> => {
        const test = createIntegrationTest({
          config: {
            cache: { enabled: true, strategy: 'fs' },
            entry: path.join(workspace.sourceDir, 'index.ts'),
            target: 'browser',
          },
          envType: EnvironmentType.PRODUCTION,
          workspace,
        });

        const response = await test.runProd();
        return await response.runBrowser();
      };
    });
    afterAll(() => {
      test = null;
    });
    describe('And does not include mappings', () => {
      it('should create a single app bundle', async done => {
        const workspace = createTestWorkspace({
          files: {
            'foo.ts': 'export const foo = "foo"',
            'index.ts': `
              import * as foo from "./foo"
              (() => import("@scope/package"))();
              import 'package';
              const data = { foo }
              export { data }`,
          },
          modules: {
            '@scope/package': {
              'component.ts': 'export const packageName = "@scoped/package"',
              'index.ts': 'export * from "./component"',
              'package.json': JSON.stringify({
                main: 'index.ts',
                name: '@scope/package',
                version: '1.0.0',
              }),
            },
            package: {
              'component.ts': 'export const packageName = "package"',
              'index.ts': 'export * from "./component"',
              'package.json': JSON.stringify({
                main: 'index.ts',
                name: 'package',
                version: '1.0.0',
              }),
            },
          },
        });
        const result = await test(workspace);
        expect(result.runResponse.bundles.length).toEqual(1);
        const appBundle = result.runResponse.bundles.find(b => b.relativePath == 'app.js');
        expect(appBundle).toBeDefined();
        expect(appBundle.bundle.contents.indexOf('packageName = "@scoped/package";')).toBeGreaterThan(-1);
        expect(appBundle.bundle.contents.indexOf('packageName = "package";')).toBeGreaterThan(-1);

        done();
      });
    });
  });
  describe('When bundle configuration is provided', () => {
    let test;
    beforeAll(() => {
      test = async (workspace, runProps): Promise<ITestBrowserResponse> => {
        const test = createIntegrationTest({
          config: {
            cache: { enabled: true, strategy: 'fs' },
            entry: path.join(workspace.sourceDir, 'index.ts'),
            target: 'browser',
          },
          envType: EnvironmentType.PRODUCTION,
          workspace,
          runProps,
        });

        const response = await test.runProd();
        return await response.runBrowser();
      };
    });
    afterAll(() => {
      test = null;
    });
    describe('And does not include mappings', () => {
      it('should create an app and vendor bundle', async done => {
        const workspace = createTestWorkspace({
          files: {
            'foo.ts': 'export const foo = "foo"',
            'index.ts': `
              import * as foo from "./foo"
              (() => import("@scope/package"))();
              import 'package';
              const data = { foo }
              export { data }`,
          },
          modules: {
            '@scope/package': {
              'component.ts': 'export const packageName = "@scoped/package"',
              'index.ts': 'export * from "./component"',
              'package.json': JSON.stringify({
                main: 'index.ts',
                name: '@scope/package',
                version: '1.0.0',
              }),
            },
            package: {
              'component.ts': 'export const packageName = "package"',
              'index.ts': 'export * from "./component"',
              'package.json': JSON.stringify({
                main: 'index.ts',
                name: 'package',
                version: '1.0.0',
              }),
            },
          },
        });
        const result = await test(workspace, {
          bundles: {
            app: './app.js',
            vendor: './vendor.js',
          },
        });
        expect(result.runResponse.bundles.length).toEqual(2);
        expect(result.runResponse.bundles.find(b => b.relativePath == 'app.js')).toBeDefined();
        const vendorBundle = result.runResponse.bundles.find(b => b.relativePath == 'vendor.js');
        expect(vendorBundle).toBeDefined();
        expect(vendorBundle.bundle.contents.indexOf('packageName = "@scoped/package";')).toBeGreaterThan(-1);
        expect(vendorBundle.bundle.contents.indexOf('packageName = "package";')).toBeGreaterThan(-1);
        done();
      });
    });
    describe('And includes mappings', () => {
      it('should create an app and vendor bundle and as many vendor bundles as mappings are defined', async done => {
        const workspace = createTestWorkspace({
          files: {
            'foo.ts': 'export const foo = "foo"',
            'index.ts': `
              import * as foo from "./foo"
              (() => import("@scope/package"))();
              import 'package';
              import 'vendor';
              const data = { foo }
              export { data }`,
          },
          modules: {
            '@scope/package': {
              'component.ts': 'export const packageName = "@scoped/package"',
              'index.ts': 'export * from "./component"',
              'package.json': JSON.stringify({
                main: 'index.ts',
                name: '@scope/package',
                version: '1.0.0',
              }),
            },
            package: {
              'component.ts': 'export const packageName = "package"',
              'index.ts': 'export * from "./component"',
              'package.json': JSON.stringify({
                main: 'index.ts',
                name: 'package',
                version: '1.0.0',
              }),
            },
            vendor: {
              'component.ts': 'export const packageName = "vendor"',
              'index.ts': 'export * from "./component"',
              'package.json': JSON.stringify({
                main: 'index.ts',
                name: 'vendor',
                version: '1.0.0',
              }),
            },
          },
        });
        const result = await test(workspace, {
          bundles: {
            app: './app.js',
            mapping: [
              { matching: '@scope*', target: './vendor.scoped.js' },
              { matching: 'package', target: './vendor.module.js' },
            ],
            vendor: './vendor.js',
          },
        });
        expect(result.runResponse.bundles.length).toEqual(4);
        expect(result.runResponse.bundles.find(b => b.relativePath == 'app.js')).toBeDefined();
        const scopedBundle = result.runResponse.bundles.find(b => b.relativePath == 'vendor.scoped.js');
        expect(scopedBundle).toBeDefined();
        expect(scopedBundle.bundle.contents.indexOf('packageName = "@scoped/package";')).toBeGreaterThan(-1);
        expect(result.runResponse.bundles.find(b => b.relativePath == 'vendor.module.js')).toBeDefined();
        expect(result.runResponse.bundles.find(b => b.relativePath == 'vendor.js')).toBeDefined();

        done();
      });
    });
  });
});
