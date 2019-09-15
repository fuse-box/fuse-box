import { createTestBundle, createFileSet } from '../../../integration/__tests__/intergrationUtils';

export async function createSimpleCase(extension) {
  const test = createTestBundle(
    { entry: 'index.ts', homeDir: __dirname },
    createFileSet(__dirname, {
      'index.ts': `import "./index.${extension}"`,
      [`index.${extension}`]: 'h1 { color : red }',
    }),
  );

  await test.fuse.runDev();
  const app = test.helper.findFile('app.js$');
  expect(app.contents).toContain('h1 {');
}
