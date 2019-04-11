import { readCSSImports } from '../cssDependencyExtractor';

describe('CSS dependency extractor test', () => {
  describe('readCSSImports', () => {
    it('should import 1', () => {
      readCSSImports(`@import "foo"`, value => {
        expect(value).toEqual('foo');
      });
    });

    it('should import 2', () => {
      readCSSImports(`@import 'foo'`, value => {
        expect(value).toEqual('foo');
      });
    });

    it('should import multiline', () => {
      readCSSImports(
        `
        @import 'foo'
      `,
        value => {
          expect(value).toEqual('foo');
        },
      );
    });

    it('should import 2 times', () => {
      const values = [];
      readCSSImports(
        `
        @import 'foo'
        @import 'bar'
      `,
        value => {
          values.push(value);
        },
      );
      expect(values).toEqual(['foo', 'bar']);
    });
  });
});
