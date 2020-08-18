import { ICompilerOptions } from '../../compilerOptions/interfaces';
import { ImportType } from '../interfaces/ImportType';
import { initCommonTransform } from '../testUtils';
import { ExportTransformer } from '../transformers/shared/ExportTransformer';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';
import { CommonTSfeaturesTransformer } from '../transformers/ts/CommonTSfeaturesTransformer';
import { EnumTransformer } from '../transformers/ts/EnumTransformer';

const testTranspile = (props: { code: string; compilerOptions?: ICompilerOptions; jsx?: boolean }) => {
  return initCommonTransform({
    code: props.code,
    compilerOptions: props.compilerOptions || {},
    jsx: props.jsx,
    transformers: [ImportTransformer(), EnumTransformer(), ExportTransformer(), CommonTSfeaturesTransformer()],
  });
};

describe('Es exports tests', () => {
  describe('export typescript objects', () => {
    it('should remove interface', () => {
      const result = testTranspile({
        code: `
         export interface Hey{}
         alert(1)
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should remove export default interface', () => {
      const result = testTranspile({
        code: `
         export default interface Hey{}
         alert(1)
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should remove type', () => {
      const result = testTranspile({
        code: `
         export type Some = Map<string,string>;
         alert(2)
          `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Object export / function/ class', () => {
    it('should export function', () => {
      const result = testTranspile({
        code: `
         export function hello(){}
          `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Mix import and export', () => {
    it('should export object with keys', () => {
      const result = testTranspile({
        code: `
        import stuff from "./stuff";
        export { stuff  };
            `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys (import all)', () => {
      const result = testTranspile({
        code: `
        import * as stuff from "./stuff";
        export { stuff  };
            `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys (import all) with alias', () => {
      const result = testTranspile({
        code: `
        import * as stuff from "./stuff";
        export { stuff as oi  };
            `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Export var with value', () => {
    it('should export a variable 1', () => {
      const result = testTranspile({
        code: `
        import { Observable } from '../Observable';
        import { noop } from '../util/noop';
        export var NEVER = new Observable(noop);
        console.log(NEVER);
            `,
      });
      expect(result.code).toMatchSnapshot();
    });
    it('should trace down an undefined variable', () => {
      const result = testTranspile({
        code: `
        export var FooBar;
        (function (FooBar) {
        })(FooBar || (FooBar = {}));
            `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should trace down all varaiables ignore assignements (local scope)', () => {
      const result = testTranspile({
        code: `
        export var __assign = function() {
          __assign = Object.assign || function __assign() {};
          return __assign.apply(this, arguments);
        };
            `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export a variable 1', () => {
      const result = testTranspile({
        code: `
        export const a = function() {
          console.log(Foo);
        };
        console.log(a);
        export var Foo = { foo: "bar" };
            `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should respect locals within an anon function', () => {
      const result = testTranspile({
        code: `
        import TweenLite, { _gsScope, globals } from './TweenLite.js';

        some(function() {
          var TweenMax = {};
          TweenMax.version = "2.0.2";
          TweenMax.hey = "1";
          console.log(TweenMax);
          return TweenMax;
        });
        export var Foo = globals.TweenMax;
            `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Object export', () => {
    it('should export object with keys', () => {
      const result = testTranspile({
        code: `
          const name1 = 2;
          const name2 = 3;
          export {name1, name2}
            `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export enum', () => {
      const result = testTranspile({
        code: `
        enum Foo {
          Oi,
        }
        export { Foo };
            `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys2 (late) 1', () => {
      const result = testTranspile({
        code: `
          export {name1 as fun, name2}
          const name1 = 1;
          const name2 = 2;
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export the same object with different names', () => {
      const result = testTranspile({
        code: `
          export {foo, foo as foo1}
          const foo = 1;

          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export the same object with different names (multiple refs in the code)', () => {
      const result = testTranspile({
        code: `
          var AnimationDriver = /** @class */ (function() {
            function AnimationDriver() {}
            AnimationDriver.NOOP = new NoopAnimationDriver();
            return AnimationDriver;
          })();
          export { AnimationDriver, AnimationDriver as ɵAnimationDriver };

          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys2 (late)  function', () => {
      const result = testTranspile({
        code: `
          export {name1 as fun, name2}
          function name1(){}
          const name2 = 2;
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys2 (late) function reversed order', () => {
      const result = testTranspile({
        code: `
          function name1(){}
          const name2 = 2;
          export {name1 as fun, name2}
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys2 (late) 2 ( function )', () => {
      const result = testTranspile({
        code: `
          console.log(1);
          export {name1 as fun, name2}
          function name1() {}
          console.log(2);
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys2 (late) 2 ( class )', () => {
      const result = testTranspile({
        code: `
          console.log(1);
          export {MySuperClass as fun, name2}
          class MySuperClass {}
          console.log(2);
          `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Exports const', () => {
    it('should export constants', () => {
      const result = testTranspile({
        code: `
      export const foo = 1, bar = 3
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export constants and use globally', () => {
      const result = testTranspile({
        code: `
      export const foo = 1, bar = 3;
      function test(){
        console.log(foo)
      }
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export constants and avoid collision', () => {
      const result = testTranspile({
        code: `
      export const foo = 1, bar = 3;
      function test(foo){
        console.log(foo)
      }
          `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Export default declaration', () => {
    it('should export default ', () => {
      const result = testTranspile({
        code: `
        const add = function(){}
        export default add;
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export default (should play nicely with import) ', () => {
      const result = testTranspile({
        code: `
        import add from "./some";
        export default add;
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export default (inverse order) ', () => {
      const result = testTranspile({
        code: `
        export default add;
        function add(){}
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should not replace the scope ', () => {
      const result = testTranspile({
        code: `
        function hello() {
          console.log(add);
        }
        export default add;
        function add() {}
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export expression ', () => {
      const result = testTranspile({
        code: `
        export default { add : add }
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export a shorthand expression with import reference ', () => {
      const result = testTranspile({
        code: `
        import hey from "some_package";
        export default { hey }
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export default function with a name', () => {
      const result = testTranspile({
        code: `
        console.log(foo)
        export default function foo(){}
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Should export obj', () => {
      const result = testTranspile({
        code: `
        import * as core from '@uirouter/core';
        export { core };
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export default function without a name', () => {
      const result = testTranspile({
        code: `
        export default function(){}
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export default class without a name', () => {
      const result = testTranspile({
        code: `
        export default class {}
          `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Export from source', () => {
    it('should handle shorhand', () => {
      const result = testTranspile({
        code: `
        import zipWith from './zipWith.js';
        const foo = 1;
        export default {
          zipWith, foo
        }
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export 1', () => {
      const result = testTranspile({
        code: `export { name } from "./foo" `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export 1 with alias', () => {
      const result = testTranspile({
        code: `export { name as hey } from "./foo" `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export 2 vars', () => {
      const result = testTranspile({
        code: `export { oi, name as hey } from "./foo" `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export default', () => {
      const result = testTranspile({
        code: `export { default } from "./foo" `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export all', () => {
      const result = testTranspile({
        code: `export * from "./foo" `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should emit require call', () => {
      const result = testTranspile({
        code: `export * from "./foo" `,
      });
      expect(result.requireStatementCollection).toEqual([
        {
          importType: ImportType.FROM,
          statement: {
            arguments: [{ type: 'Literal', value: './foo' }],
            callee: { name: 'require', type: 'Identifier' },
            type: 'CallExpression',
          },
        },
      ]);
    });
  });

  describe('Default interop', () => {
    it('should export with interop', () => {
      const result = testTranspile({
        code: `export {default} from "./foo"`,
        compilerOptions: { esModuleInterop: true },
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export with interop', () => {
      const result = testTranspile({
        code: `export {default as oi} from "./foo"`,
        compilerOptions: { esModuleInterop: true },
      });
      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Edge cases', () => {
    describe('Overriden compiler reserved exports', () => {
      it('User defines a compiler reserved keywors "exports"', () => {
        const result = testTranspile({
          code: `
            var exports = {};
            export { exports as default };
            exports.foo = function(){}
          `,
        });

        expect(result.code).toMatchSnapshot();
      });
    });
  });

  describe('export type', () => {
    it('should ignore export type"', () => {
      const result = testTranspile({
        code: `
          export type { foo } from "bar"
          console.log(1)
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should remove empty export declaration"', () => {
      const result = testTranspile({
        code: `
          export {}
        `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });
});
