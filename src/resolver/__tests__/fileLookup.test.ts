import * as path from 'path';
import { fileLookup } from '../fileLookup';
const cases = path.join(__dirname, 'cases/lk');
import '../../utils/test_utils';
describe('lookup test', () => {
  it('Should resolve (with ext', () => {
    const response = fileLookup({ fileDir: cases, target: 'a/index.js' });
    expect(response.fileExists).toBe(true);
    expect(response.absPath).toContain('index.js');
  });

  it('Should resolve (with ext not found)', () => {
    const response = fileLookup({ fileDir: cases, target: 'a/index.jsx' });
    expect(response.fileExists).toBe(false);
    expect(response.absPath).toContain('index.jsx');
  });

  it('Should resolve directory index.js', () => {
    const response = fileLookup({ fileDir: cases, target: 'a/' });
    expect(response.isDirectoryIndex).toBe(true);
    expect(response.fileExists).toBe(true);
    expect(response.absPath).toMatch(/index\.js$/);
  });

  it('Should resolve directory index.jsx', () => {
    const response = fileLookup({ fileDir: cases, target: 'b/' });
    expect(response.isDirectoryIndex).toBe(true);
    expect(response.fileExists).toBe(true);
    expect(response.absPath).toMatch(/index\.jsx$/);
  });

  it('Should resolve directory index.ts', () => {
    const response = fileLookup({ fileDir: cases, target: 'c/' });

    expect(response.isDirectoryIndex).toBe(true);
    expect(response.fileExists).toBe(true);
    expect(response.absPath).toMatch(/index\.ts$/);
  });

  it('Should resolve directory index.tsx', () => {
    const response = fileLookup({ fileDir: cases, target: 'd/' });
    expect(response.isDirectoryIndex).toBe(true);
    expect(response.fileExists).toBe(true);
    expect(response.absPath).toMatch(/index\.tsx$/);
  });

  it('Should resolve directory with package.json in it', () => {
    const response = fileLookup({ fileDir: cases, target: 'e/' });
    expect(response.isDirectoryIndex).toBe(true);
    expect(response.fileExists).toBe(true);
    expect(response.customIndex).toBe(true);
    expect(response.absPath).toMatch(/foo.js$/);
  });

  it('Should resolve file .js', () => {
    const response = fileLookup({ fileDir: cases, target: 'f/foo' });
    expect(response.fileExists).toBe(true);
    expect(response.absPath).toMatch(/foo.js$/);
  });

  it('Should resolve file .jsx', () => {
    const response = fileLookup({ fileDir: cases, target: 'f/bar' });
    expect(response.fileExists).toBe(true);
    expect(response.absPath).toMatch(/bar.jsx$/);
  });

  it('Should resolve file .ts', () => {
    const response = fileLookup({ fileDir: cases, target: 'f/aha' });
    expect(response.fileExists).toBe(true);
    expect(response.absPath).toMatch(/aha.ts$/);
  });

  it('Should resolve file .tsx', () => {
    const response = fileLookup({ fileDir: cases, target: 'f/moi' });
    expect(response.fileExists).toBe(true);
    expect(response.absPath).toMatch(/moi.tsx$/);
  });

  it('Should not fail on an uknown directory', () => {
    const response = fileLookup({ fileDir: cases, target: 'g' });
    expect(response.fileExists).toEqual(false);
  });

  it('Should resolve a json file', () => {
    const response = fileLookup({ fileDir: cases, target: 'z/foo' });
    expect(response.customIndex).toEqual(true);
    expect(response.absPath).toMatchFilePath('z/foo.json$');
    expect(response.fileExists).toBe(true);
    expect(response.extension).toBe('.json');
  });

  it('Should resolve mjs file', () => {
    const response = fileLookup({ fileDir: cases, target: 'k/foo' });
    expect(response.absPath).toMatchFilePath('k/foo.mjs$');
    expect(response.fileExists).toBe(true);
    expect(response.extension).toBe('.mjs');
  });

  it('Should resolve a js file while .min is specified', () => {
    const response = fileLookup({ fileDir: cases, target: 'min_lookup/file.min' });

    expect(response.absPath).toMatchFilePath('min_lookup/file.min.js$');
    expect(response.fileExists).toBe(true);
    expect(response.extension).toBe('.js');
  });

  it('Should not ignore local:main', () => {
    const response = fileLookup({ fileDir: cases, target: 'local_main/some' });
    expect(response.absPath).toMatchFilePath('some/index3.ts$');
  });

  it('Should read local:main', () => {
    const response = fileLookup({ isDev: true, fileDir: cases, target: 'local_main/some' });
    expect(response.absPath).toMatchFilePath('some/index3.ts$');
  });

  it('Should do index search on value of package main', () => {
    // if package.json has {"main": "main"}
    // then should include main/index.js in search
    const response = fileLookup({ fileDir: cases, target: 'w' });
    expect(response.absPath).toMatchFilePath('main/index.js$');
  })

  it('Should do extensions search on value of package main', () => {
    // if package.json has {"main": "main"}
    // then should include main.js in search
    const response = fileLookup({ fileDir: cases, target: 'x' });
    expect(response.absPath).toMatchFilePath('main.js$');
  })

  it('Should fallback if package main is not a module', () => {
    // if package.json has {"main": "main"}
    // but there is no "main.js", "main/index.js", etc.
    // then it should fallback to "index.js"
    const response = fileLookup({ fileDir: cases, target: 'y' });
    expect(response.absPath).toMatchFilePath('y/index.js$');
  })
});
