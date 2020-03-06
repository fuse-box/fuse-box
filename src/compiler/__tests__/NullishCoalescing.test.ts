import { initCommonTransform } from '../testUtils';
import { NullishCoalescingTransformer } from '../transformers/nullishCoalescing/NullishCoalescingTransformer';
import { OptionalChaningTransformer } from '../transformers/optionalChaining/OptionalChainingTransformer';

const testTranspile = (props: { code: string; jsx?: boolean }) => {
  return initCommonTransform({
    code: props.code,
    jsx: true,
    transformers: [NullishCoalescingTransformer(), OptionalChaningTransformer()],
  });
};

describe('NullishCoalescing', () => {
  it('case 1', () => {
    const result = testTranspile({
      code: `
         a ?? b
        `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('case 1 with obj', () => {
    const result = testTranspile({
      code: `
         a.c ?? d
        `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('case 1 with option call', () => {
    const result = testTranspile({
      code: `
         a.c() ?? d
        `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('long 1', () => {
    const result = testTranspile({
      code: `
         foo.bar ?? oi ?? soi ?? doi.o
        `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('long with optional chaning', () => {
    const result = testTranspile({
      code: `
         foo?.bar ?? oi ?? soi ?? doi?.o
        `,
    });
    expect(result.code).toMatchSnapshot();
  });
});
