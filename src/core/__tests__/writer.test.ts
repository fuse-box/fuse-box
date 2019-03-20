import * as appRoot from 'app-root-path';
import * as path from 'path';
import '../../utils/test_utils';
import { removeFolder } from '../../utils/test_utils';
import { fileExists, readFile } from '../../utils/utils';
import { writer } from '../writer';
describe('Writer test', () => {
  it('should get default root', () => {
    const res = writer({});
    expect(res.outputDirectory).toEqual(path.join(appRoot.path, 'dist'));
  });

  it('should get custom  root', () => {
    const res = writer({ root: __dirname });
    expect(res.outputDirectory).toMatchFilePath('src/core/__tests__/dist$');
  });

  describe('Correct template test', () => {
    it('should give default non production', () => {
      const res = writer({ root: __dirname });
      expect(res.template).toEqual('$name');
    });

    it('should give default production', () => {
      const res = writer({ root: __dirname, isProduction: true });
      expect(res.template).toEqual('$name-$hash');
    });

    it('should give custom non production', () => {
      const res = writer({ root: __dirname, output: '$hash.$name' });
      expect(res.template).toEqual('$name');
    });

    it('should give custom non production 2', () => {
      const res = writer({ root: __dirname, output: '$hash-$name' });
      expect(res.template).toEqual('$name');
    });

    it('should give custom non production 3', () => {
      const res = writer({ root: __dirname, output: '$hash_$name' });
      expect(res.template).toEqual('$name');
    });

    it('should give custom non production 4', () => {
      const res = writer({ root: __dirname, output: '$hash$name' });
      expect(res.template).toEqual('$name');
    });

    it('should give custom non production 5', () => {
      const res = writer({ root: __dirname, output: '$hash__$name' });
      expect(res.template).toEqual('$name');
    });

    it('should give custom non production 6', () => {
      const res = writer({ root: __dirname, output: '$hash--$name' });
      expect(res.template).toEqual('$name');
    });

    it('should give default production', () => {
      const res = writer({ root: __dirname, isProduction: true, output: '$name.$hash' });
      expect(res.template).toEqual('$name.$hash');
    });
  });

  describe('Generated path test', () => {
    it('should generate for dev', () => {
      const res = writer({ root: __dirname });
      const data = res.generate('foo.js', 'somecontents');
      expect(data.localPath).toEqual('foo.js');
    });

    it('should generate for prod', () => {
      const res = writer({ root: __dirname, isProduction: true });
      const data = res.generate('foo.js', 'somecontents');
      expect(data.localPath).toEqual('foo-646b1c0e.js');
    });

    it('should generate for prod (custom)', () => {
      const res = writer({ root: __dirname, output: '$hash.$name', isProduction: true });
      const data = res.generate('foo.js', 'somecontents');
      expect(data.localPath).toEqual('646b1c0e.foo.js');
    });

    it('should generate for prod with directory', () => {
      const res = writer({ root: __dirname, isProduction: true, output: '$name-$hash' });
      const data = res.generate('bar/foo.js', 'somecontents');
      expect(data.localPath).toEqual('bar/foo-646b1c0e.js');
    });

    it('should give correct absPath 1', () => {
      const res = writer({ root: __dirname, isProduction: true, output: '$name-$hash' });
      const data = res.generate('bar/foo.js', 'somecontents');
      expect(data.absPath).toMatchFilePath('__tests__/bar/foo-646b1c0e.js$');
    });

    it('should give correct absPath 2', () => {
      const res = writer({ root: __dirname, isProduction: true, output: 'dist/$name-$hash' });
      const data = res.generate('bar/foo.js', 'somecontents');
      expect(data.absPath).toMatchFilePath('__tests__/dist/bar/foo-646b1c0e.js$');
    });

    it('should give correct relBrowserPath 1', () => {
      const res = writer({ root: __dirname, isProduction: true, output: '$name-$hash' });
      const data = res.generate('bar/foo.js', 'somecontents');

      expect(data.relBrowserPath).toEqual('bar/foo-646b1c0e.js');
    });

    it('should give correct relBrowserPath 2', () => {
      const res = writer({ root: __dirname, isProduction: true, output: 'some-dir/$name-$hash' });
      const data = res.generate('bar/foo.js', 'somecontents');
      expect(data.relBrowserPath).toEqual('bar/foo-646b1c0e.js');
    });

    it('should give size', () => {
      const res = writer({ root: __dirname, isProduction: true, output: 'some-dir/$name-$hash' });
      const data = res.generate('bar/foo.js', 'somecontents');
      expect(data.size).toEqual(12);
    });
  });

  describe('Write test', () => {
    it('should write file', async () => {
      removeFolder(path.join(__dirname, '.temp'));
      const res = writer({ root: __dirname, isProduction: true, output: '.temp/$name-$hash' });
      const data = res.generate('bar/foo.js', 'somecontents');
      await data.write();

      const expectedPath = path.join(__dirname, '.temp/bar/foo-646b1c0e.js');
      expect(fileExists(expectedPath)).toEqual(true);
      expect(readFile(expectedPath)).toEqual('somecontents');
    });
  });
});
