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
});
