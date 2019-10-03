import { compileModule } from '../program/compileModule';
import { ImportType } from '../interfaces/ImportType';

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
      expect(result.code).toMatchSnapshot();
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

      expect(result.code).toMatchSnapshot();
    });

    it('Should import something a trace it down', () => {
      const result = compileModule({
        code: `
          import {foobar} from "foo"
          console.log(1);
          foobar();
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import something a trace it down 2', () => {
      const result = compileModule({
        code: `
          import {FooBar} from "foo"
          console.log(1);
          new FooBar();
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import something a trace it down 3', () => {
      const result = compileModule({
        code: `
          import {Foobar} from "foo"
          console.log(Foobar)
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import something a trace it down 4', () => {
      const result = compileModule({
        code: `
          import {Foobar} from "foo"
          console.log([Foobar])
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Should import something a trace it down 5', () => {
      const result = compileModule({
        code: `
          import FooBar from "foo"
          console.log(FooBar)
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Should import multiple and trace it down', () => {
      const result = compileModule({
        code: `
          import a, {b} from "c";
          console.log(a, b)
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Should import multiple and trace it down 2', () => {
      const result = compileModule({
        code: `
          import {a, b} from "c";
          console.log(a, b)
        `,
      });
      expect(result.code).toMatchSnapshot();
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
      expect(result.code).toMatchSnapshot();
    });

    it('should import with alias', () => {
      const result = compileModule({
        code: `
          import { ng as angular } from './angular';
          angular.module()
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Should import everything use it', () => {
      const result = compileModule({
        code: `
          import * as tslib_1 from "tslib";
          tslib_1.something()
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Should import everything use it 2', () => {
      const result = compileModule({
        code: `
        import MySuperClass, * as everything from "module-name";
        everything.something();
        new MySuperClass();
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import everything use it 3', () => {
      const result = compileModule({
        code: `
        import  * as everything from "module-name";
        console.log(everything)

        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import everything amd remove it (override)', () => {
      const result = compileModule({
        code: `
        import * as everything from "module-name";
        const everything = {}
        console.log(everything)

        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should trace down assignable', () => {
      const result = compileModule({
        code: `
          import { foo } from "foo";
          Oi.prototype[foo] = function(){}
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import with sideeffects', () => {
      const result = compileModule({
        code: `
                  console.log(1);
                  import "foo"
                  console.log(2);
              `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should not mess with the scope 2', () => {
      const result = compileModule({
        code: `
          import {foo, bar} from "foo"
          const foo = 1;
          console.log(foo, bar);
        `,
      });

      expect(result.code).toMatchSnapshot();
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

      expect(result.code).toMatchSnapshot();
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
      expect(result.code).toMatchSnapshot();
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
      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Test require statement collection', () => {
    it('should not emit a require statement ', () => {
      const result = compileModule({
        code: `
        import { Type, oi } from './types';

        export function hey(t: Type) {

        }
      `,
      });
      expect(result.requireStatementCollection).toEqual([]);
    });

    it('should emit require statement ', () => {
      const result = compileModule({
        code: `
        import { Type, oi } from './types';

        export function hey(t: Type) {
          console.log(oi);
        }
      `,
      });

      expect(result.requireStatementCollection).toEqual([
        {
          importType: ImportType.FROM,
          statement: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'require' },
            arguments: [{ type: 'Literal', value: './types' }],
          },
        },
      ]);
    });

    it('should emit raw import statement ', () => {
      const result = compileModule({
        code: `
          import "./foo"
      `,
      });

      expect(result.requireStatementCollection).toEqual([
        {
          importType: ImportType.RAW_IMPORT,
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
