import { initCommonTransform } from '../testUtils';
import { ExportTransformer } from '../transformers/shared/ExportTransformer';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';
import { NamespaceTransformer } from '../transformers/ts/NameSpaceTransformer';

const testTranspile = (props: { code: string; jsx?: boolean }) => {
  return initCommonTransform({
    jsx: true,
    transformers: [NamespaceTransformer(), ImportTransformer(), ExportTransformer()],
    code: props.code,
  });
};

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
