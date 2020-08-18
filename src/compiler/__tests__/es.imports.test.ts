import { ImportType } from '../interfaces/ImportType';
import { initCommonTransform } from '../testUtils';
import { ExportTransformer } from '../transformers/shared/ExportTransformer';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';
import { CommonTSfeaturesTransformer } from '../transformers/ts/CommonTSfeaturesTransformer';

/**
 to test:
    import * as hey from "./oi"
    hey.something();
*/

const testTranspile = (props: { code: string; jsx?: boolean }) => {
  return initCommonTransform({
    code: props.code,
    jsx: props.jsx,
    transformers: [ImportTransformer(), ExportTransformer(), CommonTSfeaturesTransformer()],
  });
};

describe('Es imports tests', () => {
  describe('import =', () => {
    it('should handle ImportEqualStatement', () => {
      const result = testTranspile({
        code: `
          import _ = require('lodash');
          `,
      });
      expect(result.requireStatementCollection).toEqual([
        {
          importType: ImportType.RAW_IMPORT,
          statement: {
            arguments: [{ type: 'Literal', value: 'lodash' }],
            callee: { name: 'require', type: 'Identifier' },
            type: 'CallExpression',
          },
        },
      ]);
      expect(result.code).toMatchSnapshot();
    });
  });
  describe('Local variable replacement', () => {
    it('should not collide with local scope', () => {
      const result = testTranspile({
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
      const result = testTranspile({
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
      const result = testTranspile({
        code: `
            import {foobar} from "foo"
            console.log(1);
            foobar();
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import something a trace it down 2', () => {
      const result = testTranspile({
        code: `
            import {FooBar} from "foo"
            console.log(1);
            new FooBar();
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import something a trace it down 3', () => {
      const result = testTranspile({
        code: `
            import {Foobar} from "foo"
            console.log(Foobar)
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import something a trace it down 4', () => {
      const result = testTranspile({
        code: `
            import {Foobar} from "foo"
            console.log([Foobar])
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Should import something a trace it down 5', () => {
      const result = testTranspile({
        code: `
            import FooBar from "foo"
            console.log(FooBar)
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Should import multiple and trace it down', () => {
      const result = testTranspile({
        code: `
            import a, {b} from "c";
            console.log(a, b)
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Should import multiple and trace it down 2', () => {
      const result = testTranspile({
        code: `
            import {a, b} from "c";
            console.log(a, b)
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import everything and replace in an object', () => {
      const result = testTranspile({
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
      const result = testTranspile({
        code: `
            import { ng as angular } from './angular';
            angular.module()
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Should import everything use it', () => {
      const result = testTranspile({
        code: `
            import * as tslib_1 from "tslib";
            tslib_1.something()
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Should import everything use it 2', () => {
      const result = testTranspile({
        code: `
          import MySuperClass, * as everything from "module-name";
          everything.something();
          new MySuperClass();
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import everything use it 3', () => {
      const result = testTranspile({
        code: `
          import  * as everything from "module-name";
          console.log(everything)

          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import everything amd remove it (override)', () => {
      const result = testTranspile({
        code: `
          import * as everything from "module-name";
          const everything = {}
          console.log(everything)

          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should trace down assignable', () => {
      const result = testTranspile({
        code: `
            import { foo } from "foo";
            Oi.prototype[foo] = function(){}
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import and replace in extends', () => {
      const result = testTranspile({
        code: `
            import { Foo } from "foo";
            class App extends Foo {

            }
          `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Should import with sideeffects', () => {
      const result = testTranspile({
        code: `
                    console.log(1);
                    import "foo"
                    console.log(2);
                `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should not mess with the scope 2', () => {
      const result = testTranspile({
        code: `
            import {foo, bar} from "foo"
            const foo = 1;
            console.log(foo, bar);
          `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should not mess with the scope 3', () => {
      const result = testTranspile({
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
      const result = testTranspile({
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
      const result = testTranspile({
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
      const result = testTranspile({
        code: `
          import { Type, oi } from './types';

          export function hey(t: Type) {

          }
        `,
      });
      expect(result.requireStatementCollection).toEqual([]);
    });

    it('should emit require statement ', () => {
      const result = testTranspile({
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
            arguments: [{ type: 'Literal', value: './types' }],
            callee: { name: 'require', type: 'Identifier' },
            type: 'CallExpression',
          },
        },
      ]);
    });

    it('should emit raw import statement ', () => {
      const result = testTranspile({
        code: `
            import "./foo"
        `,
      });

      expect(result.requireStatementCollection).toEqual([
        {
          importType: ImportType.RAW_IMPORT,
          statement: {
            arguments: [{ type: 'Literal', value: './foo' }],
            callee: { name: 'require', type: 'Identifier' },
            type: 'CallExpression',
          },
        },
      ]);
    });
  });

  describe('Edge cases', () => {
    it('should handle lodash edge case 1', () => {
      const result = testTranspile({
        code: `
            import toString from './toString.js';
            import upperFirst from './upperFirst.js';
            function capitalize(string) {
              return upperFirst(toString(string).toLowerCase());
            }
            export default capitalize;
        `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Naming should always be correct', () => {
    it('should start every unique module with 1', () => {
      const result = testTranspile({
        code: `
          import { test } from 'react';
          import { useEffect } from 'react';
          import { someOther } from './someOther';
          useEffect(() => {
            console.log(test);
            console.log(someOther);
          });
      `,
      });
      expect(result.code).toMatch(/react_1/);
      expect(result.code).toMatch(/react_2/);
      expect(result.code).toMatch(/someOther_1/);
      expect(result.code).toMatchSnapshot();
    });
  });

  describe('import type', () => {
    it('should ignore export type"', () => {
      const result = testTranspile({
        code: `
          import type { foo } from "bar"
          console.log(foo)
        `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });
});
