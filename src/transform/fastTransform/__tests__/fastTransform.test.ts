import { fastTransform } from '../fastTransform';
import { testUtils } from '../../../utils/test_utils';
testUtils();
describe('Fast transform', () => {
  describe('Export variables', () => {
    it('Should transform a constant', () => {
      const result = fastTransform({ input: `export const foo = 1` });
      expect(result.code).toContain('const foo = 1;');
      expect(result.code).toContain('module.exports.foo = foo;');
    });

    it("Should transform 'let'", () => {
      const result = fastTransform({ input: `export let foo = 1` });
      expect(result.code).toContain('let foo = 1;');
      expect(result.code).toContain('module.exports.foo = foo;');
    });

    it('Should transform 2 constants in one', () => {
      const result = fastTransform({ input: `export const foo = 1, bar = 3` });
      expect(result.code).toContain('const foo = 1, bar = 3');
      expect(result.code).toContain('module.exports.foo = foo;');
      expect(result.code).toContain('module.exports.bar = bar;');
    });

    it('Should transform 3 constants and keep the order', () => {
      const result = fastTransform({
        input: `
        export const foo = 1, bar = 3
        console.log(1);
        export const moo = 1;
      `,
      });

      expect(result.code).toMatchInlineSnapshot(`
"const foo = 1, bar = 3;
module.exports.bar = bar;
module.exports.foo = foo;
console.log(1);
const moo = 1;
module.exports.moo = moo;
"
`);
    });

    it('Should 2 variables with the same name', () => {
      const result = fastTransform({ input: `export {name1, name2}` });
      expect(result.code).toContain('module.exports.name1 = name1;');
      expect(result.code).toContain('module.exports.name2 = name2;');
    });

    it('Should 2 variables with aliases', () => {
      const result = fastTransform({ input: `export { name1 as foo, name2 as bar };` });
      expect(result).toMatchInlineSnapshot(`
Object {
  "code": "module.exports.foo = name1;
module.exports.bar = name2;
",
  "sourceMap": undefined,
}
`);
    });

    it('Should export a function', () => {
      const result = fastTransform({
        input: `
        export function bar(){}
        console.log(1);
        export function foo(){}
      `,
      });

      expect(result.code).toMatchInlineSnapshot(`
"function bar() {}
module.exports.bar = bar;
console.log(1);
function foo() {}
module.exports.foo = foo;
"
`);
      //expect(result.code).toContain('module.exports.bar = bar;');
      //expect(result.code).toContain('function bar() {}');
    });

    it('Should export a default function', () => {
      const result = fastTransform({ input: `export default function bar(){}` });

      expect(result.code).toContain('function bar() {}');
      expect(result.code).toContain('module.exports.default = bar;');
    });

    it('Should export a class', () => {
      const result = fastTransform({ input: `export class Bar{}` });
      expect(result.code).toContain('class Bar {}');
      expect(result.code).toContain('module.exports.Bar = Bar;');
    });

    it('Should export a default class', () => {
      const result = fastTransform({ input: `export default class Bar{}` });
      expect(result.code).toMatchInlineSnapshot(`
"class Bar {}
module.exports.default = Bar;
"
`);
    });

    it('Should export default expression', () => {
      const result = fastTransform({ input: `export default 1` });
      expect(result.code).toContain('module.exports.default = 1');
    });

    it('Should export default expression 2', () => {
      const result = fastTransform({ input: `export default {}` });
      expect(result.code).toMatchInlineSnapshot(`
"module.exports.default = {};
"
`);
    });

    it('Should export default expression 3', () => {
      const result = fastTransform({ input: `export default /\s+/` });
      expect(result.code).toMatchInlineSnapshot(`
"module.exports.default = /s+/;
"
`);
    });

    it('Should export value as default', () => {
      const result = fastTransform({ input: `export { name as default };` });
      expect(result.code).toMatchInlineSnapshot(`
"module.exports.default = name;
"
`);
    });
  });

  describe('Export from source', () => {
    it('Should export one variable from source', () => {
      const result = fastTransform({ input: `export { name  } from "./foo"` });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"./foo\\");
module.exports.name = __req1__.name;
"
`);
    });

    it('Should export one variable (with as) from source', () => {
      const result = fastTransform({ input: `export { name as foo  } from "./foo"` });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"./foo\\");
module.exports.foo = __req1__.name;
"
`);
    });

    it('Should export defaul variable  from source', () => {
      const result = fastTransform({ input: `export { default } from "./foo"` });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"./foo\\");
module.exports.default = __req1__.default;
"
`);
    });

    it('Should export 2 variables from source', () => {
      const result = fastTransform({ input: `export { a, b} from "./foo"` });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"./foo\\");
module.exports.a = __req1__.a;
module.exports.b = __req1__.b;
"
`);
    });

    it('Should export all from source', () => {
      const result = fastTransform({ input: `export * from "a"` });
      expect(result.code).toMatchInlineSnapshot(`
"Object.assign(module.exports, require(\\"a\\"));
"
`);
    });
  });

  describe('Imports', () => {
    it('Should import something a trace it down', () => {
      const result = fastTransform({
        input: `
        import {foobar} from "foo"
        console.log(1);
        foobar();
      `,
      });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"foo\\");
console.log(1);
__req1__.foobar();
"
`);
    });

    it('Should import something a trace it down 2', () => {
      const result = fastTransform({
        input: `
        import {Foobar} from "foo"
        console.log(1);
        new Foobar();
      `,
      });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"foo\\");
console.log(1);
new __req1__.Foobar();
"
`);
    });

    it('Should import something a trace it down 3', () => {
      const result = fastTransform({
        input: `
        import {Foobar} from "foo"
        console.log(Foobar)
      `,
      });
      expect(result.code).toContain('console.log(__req1__.Foobar)');
    });

    it('Should import something a trace it down 4', () => {
      const result = fastTransform({
        input: `
        import {Foobar} from "foo"
        console.log([Foobar])
      `,
      });

      expect(result.code).toContain('console.log([__req1__.Foobar])');
    });

    it('Should import something a trace it down 5', () => {
      const result = fastTransform({
        input: `
        import FooBar from "foo"
        console.log(FooBar)
      `,
      });
      expect(result.code).toContain('console.log(__req1__.default);');
    });

    it('Should import multiple and trace it down', () => {
      const result = fastTransform({
        input: `
        import a, {b} from "c";
        console.log(a, b)
      `,
      });
      expect(result.code).toContain('console.log(__req1__.default, __req1__.b)');
    });

    it('Should import multiple and trace it down 2', () => {
      const result = fastTransform({
        input: `
        import {a, b} from "c";
        console.log(a, b)
      `,
      });

      expect(result.code).toContain('console.log(__req1__.a, __req1__.b);');
    });

    it('Should import everything and replace in an object', () => {
      const result = fastTransform({
        input: `
        import {oi} from "c";
        const a = {
          oi : oi(String)
        }
      `,
      });
      expect(result.code).toContain('oi: __req1__.oi(String)');
    });

    it('should import with alias', () => {
      const result = fastTransform({
        input: `
        import { ng as angular } from './angular';
        angular.module()
      `,
      });

      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"./angular\\");
__req1__.ng.module();
"
`);
    });

    it('should import and export', () => {
      const result = fastTransform({
        input: `
    import * as core from '@uirouter/core';
    export { core };
      `,
      });
      expect(result.code).toContain('module.exports.core = __req1__');
    });

    it('should export all correctly', () => {
      const result = fastTransform({
        input: `
        import * as colors from './colors';
        export { colors };
      `,
      });
      expect(result.code).toContain('module.exports.colors = __req1__;');
    });
    it('should import and export 2', () => {
      const result = fastTransform({
        input: `
        import core from '@uirouter/core';
        export { core  };
      `,
      });
      expect(result.code).toContain('module.exports.core = __req1__.default');
    });

    it('should sync with exports ', () => {
      const result = fastTransform({
        input: `
        import { Observable } from '../Observable';
        import { noop } from '../util/noop';
        export var NEVER = new Observable(noop);
      `,
      });

      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"../Observable\\");
const __req2__ = require(\\"../util/noop\\");
var NEVER = new __req1__.Observable(__req2__.noop);
module.exports.NEVER = NEVER;
"
`);
    });
    it('Should import everything use it', () => {
      const result = fastTransform({
        input: `
        import * as tslib_1 from "tslib";
        tslib_1.something()
      `,
      });
      expect(result.code).toContain('__req1__.something();');
    });

    it('Should trace down assignable', () => {
      const result = fastTransform({
        input: `
        import { foo } from "foo";
        Oi.prototype[foo] = function(){}
      `,
      });

      expect(result.code).toContain('Oi.prototype[__req1__.foo] = function () {}');
    });

    it('Should import with sideeffects', () => {
      const result = fastTransform({
        input: `
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

    it('should keep import order', () => {
      const result = fastTransform({
        input: `
				console.log(1);
				import * as foo from "./foo";
				console.log(2);`,
      });

      expect(result.code).toMatchInlineSnapshot(`
"console.log(1);
const __req1__ = require(\\"./foo\\");
console.log(2);
"
`);
    });
  });

  describe('scope test', () => {
    it('Should track down an undefined exports', () => {
      const result = fastTransform({
        input: `

        export var FooBar;
        (function (LogLevel) {
        })(FooBar || (FooBar = {}));
        `,
      });
      expect(result.code).toContain('exports.FooBar || (exports.FooBar = {}');
    });

    it('Should track down an undefined exports 2', () => {
      const result = fastTransform({
        input: `

        export var FooBar;
        (function (FooBar) {
        })(FooBar || (FooBar = {}));
        `,
      });
      expect(result.code).toContain('function (FooBar)');
    });

    it('Should track down an undefined exports 3', () => {
      const result = fastTransform({
        input: `
        export var HubConnectionState;
        (function(HubConnectionState) {
        })(HubConnectionState || (HubConnectionState = {}));
        var HubConnection = function() {
          function HubConnection(connection, logger, protocol) {
            this.connectionState = HubConnectionState.Disconnected;
          }
        };
        `,
      });
      expect(result.code).toEqual(
        '(function (HubConnectionState) {})(exports.HubConnectionState || (exports.HubConnectionState = {}));\nvar HubConnection = function () {\n  function HubConnection(connection, logger, protocol) {\n    this.connectionState = exports.HubConnectionState.Disconnected;\n  }\n};\n',
      );
    });

    it('Should track down an undefined exports 4', () => {
      const result = fastTransform({
        input: `
        export var HubConnectionState;
        (function(HubConnectionState) {
        })(HubConnectionState || (HubConnectionState = {}));
        var HubConnection = function() {
          var HubConnectionState = {};
          function HubConnection(connection, logger, protocol) {
            this.connectionState = HubConnectionState.Disconnected;
          }
        };
        `,
      });
      expect(result.code).toContain('connectionState = HubConnectionState.Disconnected');
    });

    it('should not mess with the scope 1', () => {
      const result = fastTransform({
        input: `
          import {foo, bar} from "foo"
          function hello(foo, bar){
            console.log(foo,bar)
          }
          console.log(foo);
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"foo\\");
function hello(foo, bar) {
  console.log(foo, bar);
}
console.log(__req1__.foo);
"
`);
    });

    it('should not mess with the scope 2', () => {
      const result = fastTransform({
        input: `
          import {foo, bar} from "foo"
          const foo = 1;
          console.log(foo, bar);
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"foo\\");
const foo = 1;
console.log(foo, __req1__.bar);
"
`);
    });

    it('should not mess with the scope 3', () => {
      const result = fastTransform({
        input: `
        import func from './function.js';

        var mixin = (function(func) {
          console.log(func)
        });
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"./function.js\\");
var mixin = function (func) {
  console.log(func);
};
"
`);
    });

    it('should not mess with the scope 4', () => {
      const result = fastTransform({
        input: `
        import lodash from './wrapperLodash.js';
        export default lodash;
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"./wrapperLodash.js\\");
module.exports.default = __req1__.default;
"
`);
    });

    it('should not mess with the scope 5', () => {
      const result = fastTransform({
        input: `
        import func from './func.js';
        var mixin = (function(func) {
          return function(object) {
            func(object, source, options);
          };
        }(_mixin));
        console.log(func)
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"./func.js\\");
var mixin = (function (func) {
  return function (object) {
    func(object, source, options);
  };
})(_mixin);
console.log(__req1__.default);
"
`);
    });

    it('should export default var', () => {
      const result = fastTransform({
        input: `
        const add = function(){}
        export default add;
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
"const add = function () {};
module.exports.default = add;
"
`);
    });

    it('should export default toString ( weird case) ', () => {
      const result = fastTransform({
        input: `
        function toString(value) {}
        export default toString;
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
"function toString(value) {}
module.exports.default = toString;
"
`);
    });

    it('should handle object export (default)', () => {
      const result = fastTransform({
        input: `
        import zipWith from './zipWith.js';
        const foo = 1;
        export default {
          zipWith, foo
        }
        `,
      });
      expect(result.code).toMatchInlineSnapshot(`
"const __req1__ = require(\\"./zipWith.js\\");
const foo = 1;
module.exports.default = {
  zipWith: __req1__.default,
  foo
};
"
`);
    });

    it('should handle shorthand 1', () => {
      const result = fastTransform({
        input: `
        import { foo } from './foo';
        console.log({ foo});
        `,
      });
      expect(result.code).toMatchJSONSnapshot();
    });

    it('should handle shorthand 2', () => {
      const result = fastTransform({
        input: `
        import { foo } from './foo';
        console.log({ foo, bar });
        `,
      });
      expect(result.code).toMatchJSONSnapshot();
    });

    it('should handle shorthand 3', () => {
      const result = fastTransform({
        input: `
        import { foo } from './foo';
        function hello(foo, bar ){
          console.log({ foo, bar });
        }
        `,
      });
      expect(result.code).toMatchJSONSnapshot();
    });
  });

  describe('Source interceptor', () => {
    it('Should intercept 1', () => {
      const result = fastTransform({ input: `import a from "foo"`, sourceInterceptor: source => 'bar' });
      expect(result.code).toContain('require("bar")');
    });

    it('Should intercept 2', () => {
      const result = fastTransform({ input: `import * as a from "foo"`, sourceInterceptor: source => 'bar' });
      expect(result.code).toContain('require("bar")');
    });

    it('Should intercept 3', () => {
      const result = fastTransform({ input: `export {foo} from "foo"`, sourceInterceptor: source => 'bar' });
      expect(result.code).toContain(`require("bar")`);
    });

    it('Should intercept 4', () => {
      const result = fastTransform({ input: `require('foo')`, sourceInterceptor: source => 'bar' });
      expect(result.code).toContain(`require("bar")`);
    });
  });
});
