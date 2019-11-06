import { testTranspile } from '../transpilers/testTranspiler';

describe('scope test', () => {
  it('option 1', () => {
    const result = testTranspile({
      withJSX: false,
      code: `
      import { hey } from 'oi';
      function hey(){}
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('option 2', () => {
    const result = testTranspile({
      withJSX: false,
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
      withJSX: false,
      code: `
      import { hey } from 'oi';
      function foo(hey){}
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('variation 4', () => {
    const result = testTranspile({
      withJSX: false,
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
});
