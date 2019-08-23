import { createFileSet, createTestBundle } from './intergrationUtils';
import * as path from 'path';
describe('Output Integration test', () => {
  it('should write to a default dist ', async () => {
    const test = createTestBundle(
      { entry: 'index.js', homeDir: __dirname },
      createFileSet(__dirname, { 'index.js': 'console.log(1)' }),
    );
    await test.fuse.runDev();
    expect(test.helper.getOutputDirectory()).toMatchFilePath(path.join(__dirname, 'dist'));
    test.mock.flush();
  });

  it('should give a custom dir 1', async () => {
    const test = createTestBundle(
      { entry: 'index.js', homeDir: __dirname, output: 'custom' },
      createFileSet(__dirname, { 'index.js': 'console.log(1)' }),
    );
    await test.fuse.runDev();
    expect(test.helper.getOutputDirectory()).toMatchFilePath(path.join(__dirname, 'custom'));
    test.mock.flush();
  });

  it('should give a custom dir 2', async () => {
    const test = createTestBundle(
      { entry: 'index.js', homeDir: __dirname, output: 'custom/' },
      createFileSet(__dirname, { 'index.js': 'console.log(1)' }),
    );
    await test.fuse.runDev();
    expect(test.helper.getOutputDirectory()).toMatchFilePath(path.join(__dirname, 'custom'));
    test.mock.flush();
  });

  it('should give a custom dir 3', async () => {
    const test = createTestBundle(
      { entry: 'index.js', homeDir: __dirname, output: 'custom/$name' },
      createFileSet(__dirname, { 'index.js': 'console.log(1)' }),
    );
    await test.fuse.runDev();
    expect(test.helper.getOutputDirectory()).toMatchFilePath(path.join(__dirname, 'custom'));
    test.mock.flush();
  });

  it('should give a custom dir 3', async () => {
    const test = createTestBundle(
      { entry: 'index.js', homeDir: __dirname, output: path.join(__dirname, 'custom') },
      createFileSet(__dirname, { 'index.js': 'console.log(1)' }),
    );
    await test.fuse.runDev();
    expect(test.helper.getOutputDirectory()).toMatchFilePath(path.join(__dirname, 'custom'));
    test.mock.flush();
  });
});
