import { compileModule } from '../program/compileModule';
import { ImportType } from '../interfaces/ImportType';

describe('Es exports tests', () => {
  describe('Object export / function/ class', () => {
    it('should export function', () => {
      const result = compileModule({
        code: `
         export function hello(){}
          `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Mix import and export', () => {
    it('should export object with keys', () => {
      const result = compileModule({
        code: `
        import stuff from "./stuff";
        export { stuff  };
            `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys (import all)', () => {
      const result = compileModule({
        code: `
        import * as stuff from "./stuff";
        export { stuff  };
            `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys (import all) with alias', () => {
      const result = compileModule({
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
      const result = compileModule({
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
      const result = compileModule({
        code: `
        export var FooBar;
        (function (FooBar) {
        })(FooBar || (FooBar = {}));
            `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export a variable 1', () => {
      const result = compileModule({
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
  });

  describe('Object export', () => {
    it('should export object with keys', () => {
      const result = compileModule({
        code: `
          const name1 = 2;
          const name2 = 3;
          export {name1, name2}
            `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys2 (late) 1', () => {
      const result = compileModule({
        code: `
          export {name1 as fun, name2}
          const name1 = 1;
          const name2 = 2;
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys2 (late)  function', () => {
      const result = compileModule({
        code: `
          export {name1 as fun, name2}
          function name1(){}
          const name2 = 2;
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys2 (late) function reversed order', () => {
      const result = compileModule({
        code: `
          function name1(){}
          const name2 = 2;
          export {name1 as fun, name2}
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export object with keys2 (late) 2 ( function )', () => {
      const result = compileModule({
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
      const result = compileModule({
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
      const result = compileModule({
        code: `
      export const foo = 1, bar = 3
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export constants and use globally', () => {
      const result = compileModule({
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
      const result = compileModule({
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
      const result = compileModule({
        code: `
        const add = function(){}
        export default add;
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export default (should play nicely with import) ', () => {
      const result = compileModule({
        code: `
        import add from "./some";
        export default add;
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export default (inverse order) ', () => {
      const result = compileModule({
        code: `
        export default add;
        function add(){}
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should not replace the scope ', () => {
      const result = compileModule({
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
      const result = compileModule({
        code: `
        export default { add : add }
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export a shorthand expression with import reference ', () => {
      const result = compileModule({
        code: `
        import hey from "some_package";
        export default { hey }
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should export default function with a name', () => {
      const result = compileModule({
        code: `
        console.log(foo)
        export default function foo(){}
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should export obj', () => {
      const result = compileModule({
        code: `
        import * as core from '@uirouter/core';
        export { core };
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export default function without a name', () => {
      const result = compileModule({
        code: `
        export default function(){}
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export default class without a name', () => {
      const result = compileModule({
        code: `
        export default class {}
          `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Export from source', () => {
    it('should handle shorhand', () => {
      const result = compileModule({
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
      const result = compileModule({
        code: `export { name } from "./foo" `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export 1 with alias', () => {
      const result = compileModule({
        code: `export { name as hey } from "./foo" `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export 2 vars', () => {
      const result = compileModule({
        code: `export { oi, name as hey } from "./foo" `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export default', () => {
      const result = compileModule({
        code: `export { default } from "./foo" `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should export all', () => {
      const result = compileModule({
        code: `export * from "./foo" `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should emit require call', () => {
      const result = compileModule({
        code: `export * from "./foo" `,
      });
      expect(result.requireStatementCollection).toEqual([
        {
          importType: ImportType.FROM,
          statement: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'require' },
            arguments: [{ type: 'Literal', value: './foo' }],
          },
        },
      ]);
    });
  });
});
