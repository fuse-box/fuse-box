import { join } from 'path';
import { env } from '../../env';
import { FuseBoxLogAdapter } from '../../fuseLog/FuseBoxLogAdapter';
import { createTestContext, mockWriteFile } from '../../utils/test_utils';
import { getEssentialWebIndexParams, replaceWebIndexStrings } from '../webIndex';
const fileMock = mockWriteFile();

const WEBINDEX_DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
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
      fileMock.addFile(join(env.FUSE_MODULES, 'web-index-default-template/template.html'), WEBINDEX_DEFAULT_TEMPLATE);
    });
    afterAll(() => {
      fileMock.unmock();
    });

    it('should be disabled', () => {
      const ctx = createTestContext({ webIndex: false });
      expect(ctx.webIndex.isDisabled).toBe(true);
    });

    it('should throw NO error if file not found, but use default template', async () => {
      const opts = getEssentialWebIndexParams({ template: 'foo' }, new FuseBoxLogAdapter({}));
      expect(opts.templateContent).toEqual(WEBINDEX_DEFAULT_TEMPLATE);
    });
  });
});
