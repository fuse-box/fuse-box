import { compileModule } from '../compileModule';

/**
 to test:
    import * as hey from "./oi"
    hey.something();
*/

describe('Es imports tests', () => {
  describe('Local variable replacement', () => {
    it('should not collide with local scope', () => {
      const result = compileModule({
        code: `
            import { foo, bar as stuff } from "./hello";
            function hello(foo) {
                console.log(foo, stuff);
            }
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                                                        "var hello_1 = require(\\"./hello\\");
                                                        function hello(foo) {
                                                          console.log(foo, hello_1.bar);
                                                        }
                                                        "
                                          `);
    });

    it('should not collide with local scope 2', () => {
      const result = compileModule({
        code: `
            import { foo, bar as stuff } from "./hello";
            function hello(foo) {
                console.log(foo, stuff);
            }
            console.log(foo, stuff)
        `,
      });

      expect(result.code).toMatchInlineSnapshot(`
                                                        "var hello_1 = require(\\"./hello\\");
                                                        function hello(foo) {
                                                          console.log(foo, hello_1.bar);
                                                        }
                                                        console.log(hello_1.foo, hello_1.bar);
                                                        "
                                          `);
    });

    it('Should import something a trace it down', () => {
      const result = compileModule({
        code: `
          import {foobar} from "foo"
          console.log(1);
          foobar();
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                                                        "var foo_1 = require(\\"foo\\");
                                                        console.log(1);
                                                        foo_1.foobar();
                                                        "
                                          `);
    });

    it('Should import something a trace it down 2', () => {
      const result = compileModule({
        code: `
          import {FooBar} from "foo"
          console.log(1);
          new FooBar();
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                                                        "var foo_1 = require(\\"foo\\");
                                                        console.log(1);
                                                        new foo_1.FooBar();
                                                        "
                                          `);
    });

    it('Should import something a trace it down 3', () => {
      const result = compileModule({
        code: `
          import {Foobar} from "foo"
          console.log(Foobar)
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                                                        "var foo_1 = require(\\"foo\\");
                                                        console.log(foo_1.Foobar);
                                                        "
                                          `);
    });

    it('Should import something a trace it down 4', () => {
      const result = compileModule({
        code: `
          import {Foobar} from "foo"
          console.log([Foobar])
        `,
      });

      expect(result.code).toMatchInlineSnapshot(`
                                                        "var foo_1 = require(\\"foo\\");
                                                        console.log([foo_1.Foobar]);
                                                        "
                                          `);
    });

    it('Should import something a trace it down 5', () => {
      const result = compileModule({
        code: `
          import FooBar from "foo"
          console.log(FooBar)
        `,
      });

      expect(result.code).toMatchInlineSnapshot(`
                                                        "var foo_1 = require(\\"foo\\");
                                                        console.log(foo_1.default);
                                                        "
                                          `);
    });

    it('Should import multiple and trace it down', () => {
      const result = compileModule({
        code: `
          import a, {b} from "c";
          console.log(a, b)
        `,
      });

      expect(result.code).toMatchInlineSnapshot(`
                                                        "var c_1 = require(\\"c\\");
                                                        console.log(c_1.default, c_1.b);
                                                        "
                                          `);
    });

    it('Should import multiple and trace it down 2', () => {
      const result = compileModule({
        code: `
          import {a, b} from "c";
          console.log(a, b)
        `,
      });

      expect(result.code).toMatchInlineSnapshot(`
                                                        "var c_1 = require(\\"c\\");
                                                        console.log(c_1.a, c_1.b);
                                                        "
                                          `);
    });

    it('Should import everything and replace in an object', () => {
      const result = compileModule({
        code: `
          import {oi} from "c";
          const a = {
            oi : oi(String)
          }
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                                                        "var c_1 = require(\\"c\\");
                                                        const a = {
                                                          oi: c_1.oi(String)
                                                        };
                                                        "
                                          `);
    });

    it('should import with alias', () => {
      const result = compileModule({
        code: `
          import { ng as angular } from './angular';
          angular.module()
        `,
      });

      expect(result.code).toMatchInlineSnapshot(`
                                                        "var angular_1 = require(\\"./angular\\");
                                                        angular_1.ng.module();
                                                        "
                                          `);
    });

    it('Should import everything use it', () => {
      const result = compileModule({
        code: `
          import * as tslib_1 from "tslib";
          tslib_1.something()
        `,
      });

      expect(result.code).toMatchInlineSnapshot(`
                                                        "var tslib_1 = require(\\"tslib\\");
                                                        tslib_1.something();
                                                        "
                                          `);
    });

    it('Should import everything use it 2', () => {
      const result = compileModule({
        code: `
        import MySuperClass, * as everything from "module-name";
        everything.something();
        new MySuperClass();
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                                "var module_name_1 = require(\\"module-name\\");
                                module_name_1.something();
                                new module_name_1.default();
                                "
                        `);
    });

    it('Should import everything use it 3', () => {
      const result = compileModule({
        code: `
        import  * as everything from "module-name";
        console.log(everything)

        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                        "var module_name_1 = require(\\"module-name\\");
                        console.log(module_name_1);
                        "
                  `);
    });

    it('Should import everything amd remove it (override)', () => {
      const result = compileModule({
        code: `
        import * as everything from "module-name";
        const everything = {}
        console.log(everything)

        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                "const everything = {};
                console.log(everything);
                "
            `);
    });

    it('Should trace down assignable', () => {
      const result = compileModule({
        code: `
          import { foo } from "foo";
          Oi.prototype[foo] = function(){}
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                                                        "var foo_1 = require(\\"foo\\");
                                                        Oi.prototype[foo_1.foo] = function () {};
                                                        "
                                          `);
    });

    it('Should import with sideeffects', () => {
      const result = compileModule({
        code: `
                  console.log(1);
                  import "foo"
                  console.log(2);
              `,
      });

      expect(result.code).toMatchInlineSnapshot(`
                                                        "console.log(1);
                                                        require(\\"foo\\");
                                                        console.log(2);
                                                        "
                                          `);
    });

    it('should not mess with the scope 2', () => {
      const result = compileModule({
        code: `
          import {foo, bar} from "foo"
          const foo = 1;
          console.log(foo, bar);
        `,
      });

      expect(result.code).toMatchInlineSnapshot(`
                                                        "var foo_1 = require(\\"foo\\");
                                                        const foo = 1;
                                                        console.log(foo, foo_1.bar);
                                                        "
                                          `);
    });

    it('should not mess with the scope 3', () => {
      const result = compileModule({
        code: `
        import func from './function.js';

        var mixin = (function(func) {
          console.log(func)
        });
        `,
      });

      expect(result.code).toMatchInlineSnapshot(`
        "var mixin = function (func) {
          console.log(func);
        };
        "
      `);
    });
  });

  describe('Import interfaces', () => {
    it('should ignore the import of an interface', () => {
      const result = compileModule({
        code: `
        import { Type } from './types';

        export function hey(t: Type) {
          return 1;
        }
      `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                                                "function hey(t) {
                                                  return 1;
                                                }
                                                exports.hey = hey;
                                                "
                                    `);
    });

    it('should  keey the statement if at least one of the imports are used', () => {
      const result = compileModule({
        code: `
        import { Type, oi } from './types';

        export function hey(t: Type) {
          return oi();
        }
      `,
      });
      expect(result.code).toMatchInlineSnapshot(`
                                        "var types_1 = require(\\"./types\\");
                                        function hey(t) {
                                          return types_1.oi();
                                        }
                                        exports.hey = hey;
                                        "
                              `);
    });
  });
});
