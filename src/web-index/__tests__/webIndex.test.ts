import { join } from 'path';
import { BundleType, createBundleSet } from '../../bundle/Bundle';
import { createContext } from '../../core/Context';
import { env } from '../../env';
import { mockWriteFile } from '../../utils/test_utils';
import {
  getEssentialWebIndexParams,
  IWebIndexConfig,
  replaceWebIndexStrings,
  WEBINDEX_DEFAULT_TEMPLATE,
} from '../webIndex';
import { FuseBoxLogAdapter } from '../../fuse-log/FuseBoxLogAdapter';
const fileMock = mockWriteFile();

const defaultTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    $css
  </head>
  <body>
    $bundles
  </body>
</html>

`;
describe('WebIndex test', () => {
  describe('replaceWebIndexStrings', () => {
    it('should replace in one line', () => {
      const result = replaceWebIndexStrings(`$name`, { name: 'foo' });
      expect(result).toEqual('foo');
    });

    it('should replace in 2 lines', () => {
      const result = replaceWebIndexStrings(
        `
        $name
        $bar
      `,
        { bar: 'bar', name: 'foo' },
      );
      expect(result).toEqual('\n        foo\n        bar\n      ');
    });

    it('should replace the same items', () => {
      const result = replaceWebIndexStrings(`$name $name`, { name: 'foo' });
      expect(result).toEqual('foo foo');
    });

    it('should replace not found keys with empty string', () => {
      const result = replaceWebIndexStrings(`$name $bar`, { name: 'foo' });
      expect(result).toEqual('foo ');
    });

    it('should treat an object', () => {
      const result = replaceWebIndexStrings(`$name`, { name: { foo: 'bar' } });
      expect(result).toEqual(`{"foo":"bar"}`);
    });
  });

  describe('webindex', () => {
    beforeEach(() => {
      fileMock.flush();
      fileMock.addFile(join(env.FUSE_MODULES, 'web-index-default-template/template.html'), defaultTemplate);
    });
    afterAll(() => {
      fileMock.unmock();
    });

    function findIndexInMock(filename: string = 'index.html') {
      return fileMock.findFile(filename);
    }

    async function generateCSSBundle(config?: IWebIndexConfig | boolean) {
      const ctx = createContext({ webIndex: config });
      const bundles = createBundleSet(ctx);
      const cssBundle = bundles.getBundle(BundleType.CSS);
      cssBundle.addContent('foo');
      const response = [await cssBundle.generate().write()];
      await ctx.webIndex.generate(response);
    }

    async function generateJSBundle(config?: IWebIndexConfig | boolean) {
      const ctx = createContext({ webIndex: config });
      const bundles = createBundleSet(ctx);
      const cssBundle = bundles.getBundle(BundleType.PROJECT_JS);
      cssBundle.addContent('foo');
      const response = [await cssBundle.generate().write()];
      await ctx.webIndex.generate(response);
    }

    it('should be disabled', () => {
      const ctx = createContext({ webIndex: false });
      expect(ctx.webIndex.isDisabled).toBe(true);
    });

    it('should write index to a custom file', async () => {
      await generateCSSBundle({ distFileName: 'foo.html' });
      const data = findIndexInMock('foo.html');

      expect(data.name).toMatchFilePath('__tests__/dist/foo.html');
    });

    it('should write index with css link', async () => {
      await generateCSSBundle(true);
      const data = findIndexInMock();
      expect(data.name).toMatchFilePath('__tests__/dist/index.html$');

      expect(data.contents).toContain(`href="/styles.css"`);
    });

    it('should write index with different publicPath', async () => {
      await generateCSSBundle({ publicPath: '/foo' });
      const data = findIndexInMock();
      expect(data.contents).toContain(`href="/foo/styles.css"`);
    });

    it('should write a js file', async () => {
      await generateJSBundle(true);
      const data = findIndexInMock();
      expect(data.contents).toContain(`src="/app.js"></script>`);
    });

    it('should throw NO error if file not found, but use default template', async () => {
      const opts = getEssentialWebIndexParams({ template: 'foo' }, new FuseBoxLogAdapter({}));
      expect(opts.templateContent).toEqual(WEBINDEX_DEFAULT_TEMPLATE);
    });
  });
});
