import { compileModule } from '../program/compileModule';
describe('Parameter transform', () => {
  describe('Default values', () => {
    it('must transform function declaration', () => {
      const result = compileModule({
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
      const result = compileModule({
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
