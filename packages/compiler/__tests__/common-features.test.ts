import { compileModule } from '../program/compileModule';

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

  describe('Should remove declare', () => {
    it('should remove consts', () => {
      const result = compileModule({
        code: `
        alert(1)
        declare const A: any, B: any;
        alert(2)
      `,
      });
      expect(result).toMatchInlineSnapshot(`
                Object {
                  "code": "alert(1);
                alert(2);
                ",
                }
            `);
    });
  });

  describe('Interface removal', () => {
    it('should remove export interface', () => {
      const result = compileModule({
        code: `
          console.log(1);
          export interface Foo {

          }
          console.log(2);
      `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                                "console.log(1);
                                console.log(2);
                                "
                        `);
    });

    it('should remove interface', () => {
      const result = compileModule({
        code: `
           alert(1);
           interface Foo {}
           alert(2);
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                                "alert(1);
                                alert(2);
                                "
                        `);
    });

    it('should ignore export declare', () => {
      const result = compileModule({
        code: `
        alert(1)
        export declare const A: any, B: any, oi = 2;
        alert(2)
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
        "alert(1);
        alert(2);
        "
      `);
    });
  });
});
