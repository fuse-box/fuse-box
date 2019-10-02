import { compileModule } from '../program/compileModule';

describe('Namespaces', () => {
  it('should compile namespace', () => {
    const result = compileModule({
      code: `
        import oi from "./oi";
        export const b = 1;
        namespace Foo {
            export const a = 1;
            export function hello() {}
            console.log(a, oi, b);
        }
        console.log(a, foo, oi, b);
        `,
    });
    expect(result.code).toMatchInlineSnapshot(`
      "var oi_1 = require(\\"./oi\\");
      exports.b = 1;
      var Foo;
      (function (Foo) {
        Foo.a = 1;
        function hello() {}
        Foo.hello = hello;
        console.log(Foo.a, oi_1.default, exports.b);
      })(Foo || (Foo = {}));
      console.log(a, foo, oi_1.default, exports.b);
      "
    `);
  });
  // testing all of that is a waste of time, namespaces should be deprecated
});
