import { createContext } from '../../core/Context';
import { IConfig } from '../../core/interfaces';
import * as path from 'path';
import { assemble } from '../../main/assemble';
import { createDevBundles, inflateBundles } from '../createDevBundles';
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

function mockBundles(folder: string, entry: string, opts?: IConfig) {
  const ctx = createProjectContext(folder, opts);
  const packages = assemble(ctx, entry);
  const data = createDevBundles(ctx, packages);
  return {
    ctx,
    packages,
    bundles: data.bundles,
  };
}

describe('Create dev bundles', () => {
  describe('Bundles and order', () => {
    it('should create dev, vendor', () => {
      const data = mockBundles('src1', 'index.ts', { target: 'browser' });
      expect(Object.keys(data.bundles)).toHaveLength(3);

      expect(data.bundles.dev).toBeTruthy();
      expect(data.bundles.app).toBeTruthy();
      expect(data.bundles.vendor).toBeTruthy();

      expect(data.bundles.app.packages).toHaveLength(1);
      expect(data.bundles.vendor.packages).toHaveLength(1);
    });

    it('should create dev, default', () => {
      const data = mockBundles('src1', 'foo.ts', { target: 'browser' });
      expect(Object.keys(data.bundles)).toHaveLength(2);
      expect(data.bundles.dev).toBeTruthy();
      expect(data.bundles.app).toBeTruthy();

      expect(data.bundles.app.packages).toHaveLength(1);
    });

    it('should contain dev package', () => {
      const data = mockBundles('src3', 'index.ts', { target: 'browser' });
      expect(Object.keys(data.bundles)).toHaveLength(3);
      expect(data.bundles.dev).toBeTruthy();
      expect(data.bundles.app).toBeTruthy();

      const vendorPackages = data.bundles.vendor.packages.map(item => item.props.meta.name);
      expect(vendorPackages).toEqual(['events', 'http']);

      const devPackages = data.bundles.dev.packages.map(item => item.props.meta.name);
      expect(devPackages).toEqual(['fuse-box-hot-reload', 'fuse-box-websocket']);
    });
  });

  describe('inflateBundles with conflicting packages', () => {
    createRealNodeModule(
      'fuse-box-inflate-test-parent',
      {
        name: 'fuse-box-inflate-test-parent',
        main: 'index.js',
        version: '1.0.1',
      },
      {
        'index.js': 'import "fuse-box-inflate-test-conflict"',
      },
    );

    createRealNodeModule(
      'fuse-box-inflate-test-parent/node_modules/fuse-box-inflate-test-conflict',
      {
        name: 'fuse-box-inflate-test-conflict',
        main: 'index.js',
        version: '4.0.0',
      },
      {
        'index.js': 'module.exports = {}',
      },
    );

    createRealNodeModule(
      'fuse-box-inflate-test-conflict',
      {
        name: 'fuse-box-inflate-test-conflict',
        main: 'index.js',
        version: '5.0.0',
      },
      {
        'index.js': 'module.exports = {}',
      },
    );
    it('should respect conflicting bundles', () => {
      const data = mockBundles('src2', 'index.ts', { target: 'browser' });
      inflateBundles(data.ctx, data.bundles);
      const vendorBundle = data.bundles.vendor;
      const vendorRes = vendorBundle.generate();
      expect(vendorRes.contents).toContain(
        `FuseBox.pkg("fuse-box-inflate-test-parent", {"fuse-box-inflate-test-conflict":"4.0.0"}`,
      );
      expect(vendorRes.contents).toContain(`FuseBox.pkg("fuse-box-inflate-test-conflict", {}, function(___scope___){`);

      expect(vendorRes.contents).toContain(
        `FuseBox.pkg("fuse-box-inflate-test-conflict@4.0.0", {}, function(___scope___){`,
      );

      const defaultBundle = data.bundles.app;
      const defaultRes = defaultBundle.generate();
      expect(defaultRes.contents).toContain(`FuseBox.pkg("default", {}, function(___scope___){`);
    });
  });

  describe('inflateBundles', () => {
    it('should generate code', () => {
      const data = mockBundles('src1', 'index.ts', { target: 'browser' });
      inflateBundles(data.ctx, data.bundles);

      const appBundle = data.bundles.app;
      const output = appBundle.generate();

      expect(output.contents).toContain('FuseBox.pkg("default"');
      expect(output.contents).toContain('___scope___.file("index.js"');
      expect(output.contents).toContain('const process = require("process");');
    });

    it('should have an according target in settings (browser)', () => {
      const data = mockBundles('src1', 'index.ts', { target: 'browser' });
      inflateBundles(data.ctx, data.bundles);

      const devBundle = data.bundles.dev;
      const output = devBundle.generate();
      expect(output.contents).toContain('FuseBox.target = "browser";');
    });

    it('should have an according target in settings (target uknown)', () => {
      const data = mockBundles('src1', 'index.ts', {});
      inflateBundles(data.ctx, data.bundles);

      const devBundle = data.bundles.dev;
      const output = devBundle.generate();
      expect(output.contents).toContain('FuseBox.target = "server";');
    });

    it('should have allowSyntheticDefaultImports', () => {
      const data = mockBundles('src1', 'index.ts', { allowSyntheticDefaultImports: true });
      inflateBundles(data.ctx, data.bundles);

      const devBundle = data.bundles.dev;
      const output = devBundle.generate();
      expect(output.contents).toContain('FuseBox.sdep = true;');
    });

    it('should contain import of the main file', () => {
      const data = mockBundles('src1', 'index.ts', { allowSyntheticDefaultImports: true });
      inflateBundles(data.ctx, data.bundles);

      const devBundle = data.bundles.app;
      const output = devBundle.generate();
      expect(output.contents).toContain(`FuseBox.main("index.js");`);
    });
  });
});
