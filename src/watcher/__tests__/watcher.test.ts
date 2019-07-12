import { ignoredPath2Regex } from '../watcher';

describe('watcher test', () => {
  describe('ignoredPath2Regex', () => {
    it('should convert normal paths', () => {
      const exp = ignoredPath2Regex('node_modules/');
      expect(exp.test('node_modules/')).toBe(true);
    });

    it('should not match (missing slash)', () => {
      const exp = ignoredPath2Regex('node_modules/');
      expect(exp.test('node_modules')).toBe(false);
    });

    it('should match for windows', () => {
      const exp = ignoredPath2Regex('node_modules/');
      expect(exp.test('node_modules\\')).toBe(true);
    });
  });
});
