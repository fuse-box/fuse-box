const { mockWriteFile } = require('../../utils/test_utils');
const fileMock = mockWriteFile();
import * as path from 'path';
import { readCSSImports, cssParser, CCSExtractorContext, ICSSDependencyExtractorProps } from '../cssParser';

describe('CSS dependency extractor test', () => {
  describe('readCSSImports', () => {
    it('should import 1', () => {
      const res = readCSSImports(`@import "foo"`);
      expect(res).toEqual(['foo']);
    });

    it('should import 2', () => {
      const res = readCSSImports(`@import 'foo'`);
      expect(res).toEqual(['foo']);
    });

    it('should import multiline', () => {
      const res = readCSSImports(`
      @import 'foo'
      `);
      expect(res).toEqual(['foo']);
    });

    it('should import 2 times', () => {
      const res = readCSSImports(`

        @import 'foo'
        @import 'bar'
      `);
      expect(res).toEqual(['foo', 'bar']);
    });
  });

  describe('collectDependencies', () => {
    beforeEach(async () => fileMock.flush());
    afterAll(() => {
      fileMock.unmock();
    });

    function createMock(props: ICSSDependencyExtractorProps, entryContents: string): CCSExtractorContext {
      const root = path.join(__dirname, 'cases');
      const entryAbsPath = path.join(root, 'foo.scss');
      fileMock.addFile(entryAbsPath, entryContents);
      fileMock.addFile(path.join(root, 'bar.scss'));
      fileMock.addFile(path.join(root, 'woo.scss'));
      return cssParser({ ...props, entryAbsPath, entryContents, collectDependencies: true });
    }
    it('should find without config on a specific extension', () => {
      const output = createMock({}, `@import "bar.scss"`);
      expect(output.files).toHaveLength(1);
      expect(output.files[0]).toMatchFilePath('cases/bar.scss$');
    });

    it('should find with suggested extension', () => {
      const output = createMock(
        {
          tryExtensions: ['.scss'],
        },
        `@import "bar"`,
      );
      expect(output.files).toHaveLength(1);
      expect(output.files[0]).toMatchFilePath('cases/bar.scss$');
    });

    it('should not find with suggested extension', () => {
      const output = createMock(
        {
          tryExtensions: ['.foo'],
        },
        `@import "bar"`,
      );
      expect(output.files).toHaveLength(0);
    });

    it('should multiline find with suggested extension', () => {
      const output = createMock(
        {
          tryExtensions: ['.scss'],
        },
        `
          @import "bar"
          @import "woo"
        `,
      );
      expect(output.files).toHaveLength(2);
      expect(output.files[0]).toMatchFilePath('cases/bar.scss$');
      expect(output.files[1]).toMatchFilePath('cases/woo.scss$');
    });

    it('should find recursively', () => {
      const root = path.join(__dirname, 'cases');
      const entryAbsPath = path.join(root, 'foo.scss');
      const entryContents = '@import "bar"';
      fileMock.addFile(entryAbsPath, entryContents);
      fileMock.addFile(path.join(root, 'bar.scss'), '@import "woo"');
      fileMock.addFile(path.join(root, 'woo.scss'), 'some');

      const output = cssParser({ entryAbsPath, tryExtensions: ['.scss'], entryContents, collectDependencies: true });

      expect(output.files[0]).toMatchFilePath('cases/bar.scss$');
      expect(output.files[1]).toMatchFilePath('cases/woo.scss$');
    });

    it('should find recursively (missing file)', () => {
      const root = path.join(__dirname, 'cases');
      const entryAbsPath = path.join(root, 'foo.scss');
      const entryContents = '@import "bar"';
      fileMock.addFile(entryAbsPath, entryContents);
      fileMock.addFile(path.join(root, 'bar.scss'), '@import "woo"');

      const output = cssParser({ entryAbsPath, tryExtensions: ['.scss'], entryContents, collectDependencies: true });
      expect(output.files).toHaveLength(1);
      expect(output.files[0]).toMatchFilePath('cases/bar.scss$');
    });

    it('should find recursively (self reference)', () => {
      const root = path.join(__dirname, 'cases');
      const entryAbsPath = path.join(root, 'foo.scss');
      const entryContents = '@import "bar"';
      fileMock.addFile(entryAbsPath, entryContents);
      fileMock.addFile(path.join(root, 'bar.scss'), `@import "bar"`);

      const output = cssParser({ entryAbsPath, tryExtensions: ['.scss'], entryContents, collectDependencies: true });
      expect(output.files).toHaveLength(1);
      expect(output.files[0]).toMatchFilePath('cases/bar.scss$');
    });

    it('should respect sass style 1', () => {
      const root = path.join(__dirname, 'cases');
      const entryAbsPath = path.join(root, 'foo.scss');
      const entryContents = '@import "bar"';
      fileMock.addFile(entryAbsPath, entryContents);
      fileMock.addFile(path.join(root, '_bar.scss'), ' ');

      const output = cssParser({
        entryAbsPath,
        entryContents,
        tryExtensions: ['.scss'],
        sassStyle: true,
        collectDependencies: true,
      });
      expect(output.files).toHaveLength(1);
      expect(output.files[0]).toMatchFilePath('cases/_bar.scss$');
    });

    it('should respect sass style 2', () => {
      const root = path.join(__dirname, 'cases');
      const entryAbsPath = path.join(root, 'foo.scss');
      const entryContents = '@import "_bar"';
      fileMock.addFile(entryAbsPath, entryContents);
      fileMock.addFile(path.join(root, '_bar.scss'), ' ');

      const output = cssParser({
        entryAbsPath,
        entryContents,
        tryExtensions: ['.scss'],
        sassStyle: true,
        collectDependencies: true,
      });
      expect(output.files).toHaveLength(1);
      expect(output.files[0]).toMatchFilePath('cases/_bar.scss$');
    });
  });
});
