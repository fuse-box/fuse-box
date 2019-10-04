import { testTranspile } from '../transpilers/testTranpiler';

describe('Parameter transform', () => {
  describe('Default values', () => {
    it('must transform function declaration', () => {
      const result = testTranspile({
        code: `function oi(b = {}){
        }
      `,
      });
      expect(result.code).toMatchInlineSnapshot(`
        "function oi(b = {}) {}
        "
      `);
    });

    it('must transform constructor declaration', () => {
      const result = testTranspile({
        code: `function oi(b = {}){
        }
      `,
      });
      expect(result.code).toMatchInlineSnapshot(`
        "function oi(b = {}) {}
        "
      `);
    });
  });
});
