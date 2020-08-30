import { initCommonTransform } from '../testUtils';
import { ExportTransformer } from '../transformers/shared/ExportTransformer';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';
import { ClassConstructorPropertyTransformer } from '../transformers/ts/ClassConstructorPropertyTransformer';
import { CommonTSfeaturesTransformer } from '../transformers/ts/CommonTSfeaturesTransformer';

const testTranspile = (props: { code: string; fileName?: string; target?: string }) => {
  return initCommonTransform({
    code: props.code,
    transformers: [
      ImportTransformer(),
      ExportTransformer(),
      CommonTSfeaturesTransformer(),
      ClassConstructorPropertyTransformer(),
    ],
  });
};

describe('scope test', () => {
  it('option 1', () => {
    const result = testTranspile({
      code: `
      import { hey } from 'oi';
      function hey(){}
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('option 2', () => {
    const result = testTranspile({
      code: `
      import { hey } from 'oi';
      function hey(){}
      console.log(hey);
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('variation 3', () => {
    const result = testTranspile({
      code: `
      import { hey } from 'oi';
      function foo(hey){}
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('variation 4', () => {
    const result = testTranspile({
      code: `
      import { hey } from 'oi';
      const hey = (hey) => {}
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('variation 5', () => {
    const result = testTranspile({
      code: `
      import { hey } from 'oi';
      const hey = (hey) => {
        console.log(hey)
      }
      `,
    });
    expect(result.code).toMatchSnapshot();
  });
  it('variation 6', () => {
    const result = testTranspile({
      code: `
      import { hey } from 'oi';
      console.log(hey);
      const hey = (hey) => {
        console.log(hey)
      }
      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('variation 7', () => {
    const result = testTranspile({
      code: `
      import { Hey } from 'oi';
      class Hey {
        foo(hey){ console.log(hey)}
      }
      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('variation with class After', () => {
    const result = testTranspile({
      code: `
      import { Hey } from 'oi';
      console.log(Hey);
      class Hey {
        foo(hey){ console.log(hey)}
      }
      new Hey()
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('variation with arrow expression', () => {
    const result = testTranspile({
      code: `
      export const a = () => {};
      console.log(() => a);
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('variation compute properties', () => {
    const result = testTranspile({
      code: `
      export const a = () => {};
      const b = {[a] : 1}
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('variation normal prop', () => {
    const result = testTranspile({
      code: `
      export const a = () => {};
      const b = {a : a}
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('Array pattern', () => {
    const result = testTranspile({
      code: `
      import foo from "oi";
      function one(props){
        const [foo] = props;
        console.log(foo)
      }
      console.log(foo)
      `,
    });

    expect(result.code).toMatchSnapshot();
  });
  it('Object pattern', () => {
    const result = testTranspile({
      code: `
      import foo from "oi";
      function one(props){
        const {foo} = props;
        console.log(foo)
      }
      console.log(foo)
      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('Object pattern with spread', () => {
    const result = testTranspile({
      code: `
      import foo from "oi";
      function one(props){
        const {foo, ...rest} = props;
        console.log(foo)
      }
      console.log(foo)
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('Object respect spread in Object', () => {
    const result = testTranspile({
      code: `
      import {foo, rest} from "oi";
      function one(props){
        const {foo, ...rest} = props;
        console.log(rest)

      }
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('Object respect spread in Array', () => {
    const result = testTranspile({
      code: `
      import {foo, rest} from "oi";
      function one(props){
        const [foo, ...rest] = props;
        console.log(rest)
      }
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should work with nulll', () => {
    const result = testTranspile({
      code: `
      import {foo, rest} from "oi";
      function one(props){
        const [, foo, ...rest] = props;
        console.log(rest)
      }
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should handle hoisted variable', () => {
    const result = testTranspile({
      code: `
      export var Foo = (function() {
        console.log(Foo);
        function Foo() {}
      })();
      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should handle hoisted variable deep', () => {
    const result = testTranspile({
      code: `
      export var Foo = (function() {
        function Bar(){
          console.log(Foo);
        }
        function Foo() {}
      })();
      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should handle hoisted variable 2', () => {
    const result = testTranspile({
      code: `
      function some() {}
      export var Disposable = (function() {
        function Disposable() {}
        return Disposable;
      })();
      console.log(Disposable);

      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should handle hoisted var inside', () => {
    const result = testTranspile({
      code: `
      import { execute } from 'stuff';
      function hello() {}
      function some() {
        function execute(){}
      }
      execute();

      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should handle hoisted var inside 2', () => {
    const result = testTranspile({
      code: `
      import { execute } from 'stuff';

      function some() {
        function execute(){}
      }
      execute();

      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should handle hoisted var inside 3', () => {
    const result = testTranspile({
      code: `
      import { execute } from 'stuff';
      function execute(){}
      execute();

      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should handle hoisted var inside 4', () => {
    const result = testTranspile({
      code: `
      import { isFunction, noop } from '../utils/js_utils';
      export var Disposable = (function() {
        function Disposable(action) {}

        return Disposable;
      })();
      console.log(Disposable);
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should handle hoisted var inside 5', () => {
    const result = testTranspile({
      code: `
      export var Disposable = (function() {
        function Disposable(action) {}

        return Disposable;
      })();
      console.log(Disposable);
      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should handle hoisted var inside 6', () => {
    const result = testTranspile({
      code: `
      import { isFunction, noop } from '../utils/js_utils';
      export var Disposable = (function() {
        function Disposable(action) {
          console.log(isFunction)
        }

        return Disposable;
      })();
      console.log(Disposable);
      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should handle hoisted var Buffer', () => {
    const result = testTranspile({
      code: `
      'use strict'

      var base64 = require('base64-js');
      var ieee754 = require('ieee754');

      exports.Buffer = Buffer;
      function Buffer(){}
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should handle hoisted var Buffer 2', () => {
    const result = testTranspile({
      code: `
      'use strict'
      function two(){}
      function one(){}
      console.log(Buffer)
      function Buffer(){}
      function three(){}
      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should handle import buffer', () => {
    const result = testTranspile({
      code: `
      'use strict'
      import Buffer from "other"
      function two(){}
      function one(){}
      console.log(Buffer)

      function three(){}
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should trace down an import 1', () => {
    const result = testTranspile({
      code: `
      import zenObservable from 'zen-observable';
      var Observable = zenObservable;

      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should correctly transpile export default with defined const', () => {
    const result = testTranspile({
      code: `
      import { SomeName } from './type';
      const SomeName = () => {};
      export default SomeName;
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should correctly transpile export default with defined var', () => {
    const result = testTranspile({
      code: `
      import { SomeName } from './type';
      export default SomeName;
      var SomeName = () => {};
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should correctly transpile export default with defined case : 2', () => {
    const result = testTranspile({
      code: `
      import { SomeName } from './type';
      export { SomeName }
      var SomeName = () => {};
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should correctly transpile export default with defined case : 3', () => {
    const result = testTranspile({
      code: `
      import { SomeName } from './type';
      export { SomeName }

      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should handle multiple scenarious at one', () => {
    const result = testTranspile({
      code: `
      import { execute } from 'shit';
      import foo from 'oi';
      import { Hey } from 'hey';

      function hello() {}
      function some() {
        const execute = {};
      }
      execute();

      function one(props) {
        const { foo, ...rest } = props;
        console.log(foo);
      }
      console.log(foo);

      console.log(Hey);
      class Hey {
        foo(hey) {
          console.log(hey);
        }
      }
      new Hey();

      function some() {}
      export var Disposable = (function() {
        function Disposable() {}
        return Disposable;
      })();
      console.log(Disposable);

      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  describe('Iterator scope', () => {
    it('Export spread 1', () => {
      const result = testTranspile({
        code: `
        import i from 'mod';
        for (var i = 0; i <= 0; i++) {
          console.log(i);
        }
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('for in', () => {
      const result = testTranspile({
        code: `
        import i from 'mod';
        for (var i in foo) {
          console.log(i);
        }
      `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Spread', () => {
    it('spread and defined var', () => {
      const result = testTranspile({
        code: `
        import oi from "./oi"
        function foo(){
          function boo(){
            const {foo : { bar : [ oi ] }} = {}
            function another(){
              console.log(oi);
            }
          }
          console.log(oi);
        }


      `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Export spread 1', () => {
      const result = testTranspile({
        code: `
        const [foo, bar] = []
        export {foo, bar}
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Export spread 2', () => {
      const result = testTranspile({
        code: `
        const {foo, bar} = {}
        export {foo, bar}
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Export spread 3', () => {
      const result = testTranspile({
        code: `
        const {foo : { bar }} = {}
        export { bar }
      `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('Export spread 4 (deep)', () => {
      const result = testTranspile({
        code: `
        const {foo : { bar : [ oi ] }} = {}
        export { oi }
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('Export spread 4 (deep) skip key', () => {
      const result = testTranspile({
        code: `
        const {foo : { bar : [ oi ] }} = {}
        export { oi, bar }
      `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });

  describe('classes', () => {
    it('should respect method prop', () => {
      const result = testTranspile({
        code: `
        import { bar } from "bar";
        class Foo {
          method_1(bar){
            console.log(bar)
          }
        }
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should respect constructor prop', () => {
      const result = testTranspile({
        code: `
        import { bar } from "bar";
        class Foo {
          constructor(bar){
            console.log(bar)
          }
        }
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should respect constructor prop with public accessibility', () => {
      const result = testTranspile({
        code: `
        import { bar } from "bar";
        class Foo {
          constructor(public bar){
            console.log(bar)
          }
        }
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should respect catch clause', () => {
      const result = testTranspile({
        code: `
        import someException from 'someException';
        function oi() {}
        function hey() {
          try {
            oi();
          } catch (someException) {
            console.log(someException);
          }
        }

      `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Import qualifiers', () => {
    it('should iqnore qualifer ref', () => {
      const result = testTranspile({
        code: `
        import {Foo} from 'oi';
        import Bar = Foo;
      `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should iqnore qualifer ref deep', () => {
      const result = testTranspile({
        code: `
        import {Foo} from 'oi';
        import Bar = Foo.baz;
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should replace qualifer ref', () => {
      const result = testTranspile({
        code: `
        import {Foo} from 'oi';
        import Bar = Foo.baz;

        function oi(){
          console.log(Bar)
        }
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should replace qualifer ref 2', () => {
      const result = testTranspile({
        code: `
        import {Foo} from 'oi';
        import Bar = Foo;

        function oi(){
          console.log(Bar)
        }
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should replace qualifer ref 2 times correctly', () => {
      const result = testTranspile({
        code: `
        import {Foo} from 'oi';
        import Bar = Foo.hey;

        function oi(){
          console.log(Bar)
          function other(){
            console.log(Bar)
          }
        }
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should replace qualifer ref and respect local scope', () => {
      const result = testTranspile({
        code: `
        import {Foo} from 'oi';
        import Bar = Foo.hey;

        function oi(){
          console.log(Bar)
          function other(Bar){
            console.log(Bar)
          }
        }
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should respect assignment pattern', () => {
      const result = testTranspile({
        code: `
        import foo from './foo';
        function hello(foo = 1) {
          console.log(foo);
        }

      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should respect ArrowFunction expression', () => {
      const result = testTranspile({
        code: `
        export const foo = oi(foo => some(foo));
      `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should respect assignment pattern 2', () => {
      const result = testTranspile({
        code: `
        import { getSome } from 'store/actions';
        const hey = ({ getSome }) => getSome();`,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should respect assignment pattern inside const', () => {
      const result = testTranspile({
        code: `
        import foo from 'foo';
        const { foo = false } = options;
        console.log(foo);


      `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should respect another edge case with assignment', () => {
      const result = testTranspile({
        code: `
        import bar from 'bar';
        function foo(hello = bar) {}
      `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });
});
