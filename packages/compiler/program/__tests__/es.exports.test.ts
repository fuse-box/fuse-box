import { compileModule } from "../compileModule";

describe("Es exports tests", () => {
  describe("Object export / function/ class", () => {
    it("should export function", () => {
      const result = compileModule({
        code: `
         export function hello(){}
          `
      });

      expect(result.code).toMatchInlineSnapshot(`
              "function hello() {}
              exports.hello = hello;
              "
          `);
    });
  });

  describe("Mix import and export", () => {
    it("should export object with keys", () => {
      const result = compileModule({
        code: `
        import stuff from "./stuff";
        export { stuff  };
            `
      });

      expect(result.code).toMatchInlineSnapshot(`
        "var stuff_1 = require(\\"./stuff\\");
        exports.stuff = stuff_1.default;
        "
      `);
    });

    it("should export object with keys (import all)", () => {
      const result = compileModule({
        code: `
        import * as stuff from "./stuff";
        export { stuff  };
            `
      });

      expect(result.code).toMatchInlineSnapshot(`
        "var stuff_1 = require(\\"./stuff\\");
        exports.stuff = stuff_1;
        "
      `);
    });

    it("should export object with keys (import all) with alias", () => {
      const result = compileModule({
        code: `
        import * as stuff from "./stuff";
        export { stuff as oi  };
            `
      });

      expect(result.code).toMatchInlineSnapshot(`
        "var stuff_1 = require(\\"./stuff\\");
        exports.oi = stuff_1;
        "
      `);
    });
  });

  describe("Export var with value", () => {
    it("should export a variable 1", () => {
      const result = compileModule({
        code: `
        import { Observable } from '../Observable';
        import { noop } from '../util/noop';
        export var NEVER = new Observable(noop);
        console.log(NEVER);
            `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "var Observable_1 = require(\\"../Observable\\");
        var noop_2 = require(\\"../util/noop\\");
        exports.NEVER = new Observable_1.Observable(noop_2.noop);
        console.log(exports.NEVER);
        "
      `);
    });
    it("should trace down an undefined variable", () => {
      const result = compileModule({
        code: `
        export var FooBar;
        (function (FooBar) {
        })(FooBar || (FooBar = {}));
            `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "(function (FooBar) {})(exports.FooBar || (exports.FooBar = {}));
        "
      `);
    });

    it("should export a variable 1", () => {
      const result = compileModule({
        code: `
        export const a = function() {
          console.log(Foo);
        };
        console.log(a);
        export var Foo = { foo: "bar" };
            `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "exports.a = function () {
          console.log(exports.Foo);
        };
        console.log(exports.a);
        exports.Foo = {
          foo: \\"bar\\"
        };
        "
      `);
    });
  });

  describe("Object export", () => {
    it("should export object with keys", () => {
      const result = compileModule({
        code: `
          const name1 = 2;
          const name2 = 3;
          export {name1, name2}
            `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "const name1 = 2;
        exports.name1 = name1;
        const name2 = 3;
        exports.name2 = name2;
        "
      `);
    });

    it("should export object with keys2 (late) 1", () => {
      const result = compileModule({
        code: `
          export {name1 as fun, name2}
          const name1 = 1;
          const name2 = 2;
          `
      });

      expect(result.code).toMatchInlineSnapshot(`
        "const name1 = 1;
        exports.fun = name1;
        const name2 = 2;
        exports.name2 = name2;
        "
      `);
    });

    it("should export object with keys2 (late)  function", () => {
      const result = compileModule({
        code: `
          export {name1 as fun, name2}
          function name1(){}
          const name2 = 2;
          `
      });

      expect(result.code).toMatchInlineSnapshot(`
        "function name1() {}
        exports.fun = name1;
        const name2 = 2;
        exports.name2 = name2;
        "
      `);
    });

    it("should export object with keys2 (late) function reversed order", () => {
      const result = compileModule({
        code: `
          function name1(){}
          const name2 = 2;
          export {name1 as fun, name2}
          `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "function name1() {}
        exports.fun = name1;
        const name2 = 2;
        exports.name2 = name2;
        "
      `);
    });

    it("should export object with keys2 (late) 2 ( function )", () => {
      const result = compileModule({
        code: `
          console.log(1);
          export {name1 as fun, name2}
          function name1() {}
          console.log(2);
          `
      });

      expect(result.code).toMatchInlineSnapshot(`
        "console.log(1);
        function name1() {}
        exports.fun = name1;
        console.log(2);
        "
      `);
    });

    it("should export object with keys2 (late) 2 ( class )", () => {
      const result = compileModule({
        code: `
          console.log(1);
          export {MySuperClass as fun, name2}
          class MySuperClass {}
          console.log(2);
          `
      });

      expect(result.code).toMatchInlineSnapshot(`
        "console.log(1);
        class MySuperClass {}
        exports.fun = MySuperClass;
        console.log(2);
        "
      `);
    });
  });

  describe("Exports const", () => {
    it("should export constants", () => {
      const result = compileModule({
        code: `
      export const foo = 1, bar = 3
          `
      });

      expect(result.code).toMatchInlineSnapshot(`
              "exports.foo = 1;
              exports.bar = 3;
              "
          `);
    });

    it("should export constants and use globally", () => {
      const result = compileModule({
        code: `
      export const foo = 1, bar = 3;
      function test(){
        console.log(foo)
      }
          `
      });

      expect(result.code).toMatchInlineSnapshot(`
              "exports.foo = 1;
              exports.bar = 3;
              function test() {
                console.log(exports.foo);
              }
              "
          `);
    });

    it("should export constants and avoid collision", () => {
      const result = compileModule({
        code: `
      export const foo = 1, bar = 3;
      function test(foo){
        console.log(foo)
      }
          `
      });

      expect(result.code).toMatchInlineSnapshot(`
              "exports.foo = 1;
              exports.bar = 3;
              function test(foo) {
                console.log(foo);
              }
              "
          `);
    });
  });

  describe("Export default declaration", () => {
    it("should export default ", () => {
      const result = compileModule({
        code: `
        const add = function(){}
        export default add;
          `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "const add = function () {};
        exports.default = add;
        "
      `);
    });

    it("should export default (should play nicely with import) ", () => {
      const result = compileModule({
        code: `
        import add from "./some";
        export default add;
          `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "var some_1 = require(\\"./some\\");
        exports.default = some_1.default;
        "
      `);
    });

    it("should export default (inverse order) ", () => {
      const result = compileModule({
        code: `
        export default add;
        function add(){}
          `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "exports.default = add;
        function add() {}
        "
      `);
    });

    it("should not replace the scope ", () => {
      const result = compileModule({
        code: `
        function hello() {
          console.log(add);
        }
        export default add;
        function add() {}
          `
      });

      expect(result.code).toMatchInlineSnapshot(`
        "function hello() {
          console.log(add);
        }
        exports.default = add;
        function add() {}
        "
      `);
    });

    it("should export expression ", () => {
      const result = compileModule({
        code: `
        export default { add : add }
          `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "exports.default = {
          add: add
        };
        "
      `);
    });

    it("should export default function with a name", () => {
      const result = compileModule({
        code: `
        console.log(foo)
        export default function foo(){}
          `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "console.log(foo);
        function foo() {}
        exports.default = foo;
        "
      `);
    });

    it("should export default function without a name", () => {
      const result = compileModule({
        code: `
        export default function(){}
          `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "exports.default = function () {};
        "
      `);
    });

    it("should export default class without a name", () => {
      const result = compileModule({
        code: `
        export default class {}
          `
      });
      expect(result.code).toMatchInlineSnapshot(`
        "exports.default = class {};
        "
      `);
    });
  });

  //   it('should export default toString ( weird case) ', () => {
  //     const result = compileModule({
  //       code: `
  //       function toString(value) {}
  //       export default toString;
  //       `,
  //     });
  //     expect(result.code).toMatchInlineSnapshot(`
  //       "function toString(value) {}
  //       exports.default = toString;
  //       "
  //     `);
  //   });

  //   it('should handle object export (default)', () => {
  //     const result = compileModule({
  //       code: `
  //       import zipWith from './zipWith.js';
  //       const foo = 1;
  //       export default {
  //         zipWith, foo
  //       }
  //       `,
  //     });
  //     expect(result.code).toMatchInlineSnapshot(`
  //       "const __req1__ = require(\\"./zipWith.js\\");
  //       const foo = 1;
  //       exports.default = {
  //         zipWith: __req1__.default,
  //         foo
  //       };
  //       "
  //     `);
  //   });
});
