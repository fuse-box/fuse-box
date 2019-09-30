import { compileModule } from '../compileModule';

describe('Common features test', () => {
  describe('Abstract methods', () => {
    it('should remove abstract methods', () => {
      const result = compileModule({
        code: `
          abstract  class A {
            constructor(public name){}
            abstract hello()
        }

      `,
      });
      expect(result.code).toMatchInlineSnapshot(`
        "class A {
          constructor(name) {
            this.name = name;
          }
        }
        "
      `);
    });
  });
});
