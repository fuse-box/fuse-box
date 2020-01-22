import { initCommonTransform } from '../testUtils';
import { ExportTransformer } from '../transformers/shared/ExportTransformer';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';

const testTranspile = (props: { code: string; fileName?: string; target?: string }) => {
  return initCommonTransform({
    code: props.code,
    transformers: [ImportTransformer(), ExportTransformer()],
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
});
