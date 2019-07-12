import { sourceMapsURL, devStrings } from '../bundleStrings';

describe('bundle strings', () => {
  describe('sourceMapsURL', () => {
    it('should be ok', () => {
      expect(sourceMapsURL('file')).toEqual(`//# sourceMappingURL=file`);
    });
  });

  describe('devString', () => {
    it('should import file', () => {
      expect(devStrings.importFile('foo')).toEqual(`FuseBox.import("foo");`);
    });
  });
});
