import { testInitialProduction } from '../transpilers/testTranspiler';

describe('Initial module reference transformer', () => {
  const cases = [];
  function addCase(amount, code) {
    cases.push({ code, amount });
  }
  addCase(1, `import "./hello"`);
  // addCase(0, `import { foo } from "./foo"`);
  // addCase(
  //   1,
  //   `
  //     import { foo } from "./foo"
  //     console.log(foo)
  // `,
  // );

  // addCase(
  //   0,
  //   `
  //   import { Foo } from "./foo"
  //   function hello() : Foo {}
  // `,
  // );

  // addCase(
  //   0,
  //   `
  //   import Foo from "./foo"
  //   function hello() : Foo {}
  // `,
  // );

  // addCase(
  //   1,
  //   `
  //   export { foo } from "./foo";
  // `,
  // );

  // addCase(
  //   1,
  //   `
  //   import { oi } from "oi"
  //   export { foo } from "./foo";
  // `,
  // );
  // addCase(
  //   2,
  //   `
  //   import { oi } from "oi"
  //   log(oi)
  //   export { foo } from "./foo";
  // `,
  // );

  // addCase(
  //   1,
  //   `
  //   require("./hello")
  // `,
  // );

  cases.forEach((item, i) => {
    it(`should handle case ${i}`, () => {
      const res = testInitialProduction({ code: item.code });
      expect(res.requireStatementCollection).toHaveLength(item.amount);
    });
  });
});
