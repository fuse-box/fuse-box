import { compileModule } from "../compileModule";

describe("Interface remover", () => {
  it("should remove export interface", () => {
    const result = compileModule({
      code: `
        console.log(1);
        export interface Foo {

        }
        console.log(2);
    `
    });
    expect(result.code).toMatchInlineSnapshot(`
      "console.log(1);
      console.log(2);
      "
    `);
  });

  it("should remove interface", () => {
    const result = compileModule({
      code: `
         alert(1);
         interface Foo {}
         alert(2);
      `
    });
    expect(result.code).toMatchInlineSnapshot(`
      "alert(1);
      alert(2);
      "
    `);
  });

  // it.only("should remove interface via reference", () => {
  //   const code = `interface Foo {}
  //     const hello = {};
  //     export { Foo as Shit, hello };
  //     `;

  //   const result = compileModule({ code });
  //   console.log(result.code);
  // });
});
