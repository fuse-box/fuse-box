import { testTranspile } from '../transpilers/testTranspiler';

describe('Namespaces', () => {
  it('should compile namespace', () => {
    const result = testTranspile({
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
    expect(result.code).toMatchSnapshot();
  });

  it('should export namespace', () => {
    const result = testTranspile({
      code: `
      export namespace Hey {
        export function hello() {}
      }
        `,
    });
    expect(result.code).toMatchSnapshot();
  });
  // testing all of that is a waste of time, namespaces should be deprecated
});
