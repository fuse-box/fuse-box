import * as path from 'path';
import { EnvironmentType } from '../../config/EnvironmentType';
import { ICacheStrategy } from '../../config/ICacheProps';
import { ITestBrowserResponse } from '../../testUtils/browserEnv/testBrowserEnv';
import { createIntegrationTest, createTestWorkspace, ITestWorkspace } from '../../testUtils/integrationTest';

describe('Cache intergation test', () => {
  const test = async (workspace): Promise<ITestBrowserResponse> => {
    const test = createIntegrationTest({
      config: {
        cache: { enabled: true, strategy: 'fs' as ICacheStrategy },
        entry: path.join(workspace.sourceDir, 'index.ts'),
        target: 'browser',
      },
      envType: EnvironmentType.DEVELOPMENT,
      workspace,
    });

    const response = await test.runDev();
    return await response.runBrowser();
  };

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

  /**** THOSE TEST CAN"T RUN WITHOUT EACH OTHER ****/
  /**** DO NOT TRY .only ****/
  describe('Check module files constency', () => {
    it('should give the initial data', async () => {
      await initWorkspace();
      await test(workspace);
      expect(workspace.getCacheWorkspace().getCachedFiles()).toHaveLength(2);
    });

    it('after adding a new file should remain the same', async () => {
      workspace.setFile('bar.ts', 'export const bar = "bar"');
      await test(workspace);
      expect(workspace.getCacheWorkspace().getCachedFiles()).toHaveLength(2);
    });

    it('include bar into foo', async () => {
      workspace.setFile(
        'foo.ts',
        `
        export { bar } from "./bar";
        export const foo = "foo"
    `,
      );
      await test(workspace);
      expect(workspace.getCacheWorkspace().getCachedFiles()).toHaveLength(3);
    });

    it('modyfying bar should keep the amount to 3', async () => {
      workspace.setFile('bar.ts', 'export const bar = "bar1"');
      await test(workspace);
      expect(workspace.getCacheWorkspace().getCachedFiles()).toHaveLength(3);
    });
  });

  /**** THOSE TEST CAN"T RUN WITHOUT EACH OTHER ****/
  /**** DO NOT TRY .only ****/

  describe('Verify meta consistency', () => {
    let barData;
    it('should give the initial data', async () => {
      await test(workspace);
      const meta = workspace.getCacheWorkspace().getMetaFile();
      barData = meta.findModule('bar.ts$');
      expect(barData).toBeTruthy();
    });

    it('bar data should remain unchanged', async () => {
      await test(workspace);
      const meta = workspace.getCacheWorkspace().getMetaFile();

      expect(meta.findModule('bar.ts$')).toEqual(barData);
    });

    it('bar data should change (mtime)', async () => {
      workspace.setFile('bar.ts', 'export const bar = "bar2"');
      await test(workspace);
      const meta = workspace.getCacheWorkspace().getMetaFile();

      const bar = meta.findModule('bar.ts$');
      expect(bar.id).toEqual(barData.id);
      expect(bar.mtime).toBeGreaterThan(barData.id);

      await meta.writeMeta(`@invalidjson@`);
    });

    it('should handle json corruation', async () => {
      workspace.setFile('bar.ts', 'export const bar = "bar2"');
      await test(workspace);
      const meta = workspace.getCacheWorkspace().getMetaFile();

      const bar = meta.findModule('bar.ts$');

      expect(bar.id).toEqual(barData.id);
      expect(bar.mtime).toBeGreaterThan(barData.id);
    });

    it('should give the same id for bar after removal', async () => {
      workspace.removeFile('bar.ts');
      await test(workspace);

      workspace.setFile('bar.ts', 'export const bar = "bar2"');
      await test(workspace);

      const meta = workspace.getCacheWorkspace().getMetaFile();

      const bar = meta.findModule('bar.ts$');

      expect(bar.id).toEqual(barData.id);
    });
  });
});
