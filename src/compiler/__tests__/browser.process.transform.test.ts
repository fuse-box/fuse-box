import { initCommonTransform } from '../testUtils';
import { BrowserProcessTransformer } from '../transformers/bundle/BrowserProcessTransformer';
import { BundleFastConditionUnwrapper } from '../transformers/bundle/BundleFastConditionTransformer';
import { RequireStatementInterceptor } from '../transformers/bundle/RequireStatementInterceptor';

describe('Browser process transformer test', () => {
  const testTranspile = (props: { code: string; NODE_ENV?: string; target?: string }) => {
    return initCommonTransform({
      props: {
        ctx: { config: { env: { NODE_ENV: props.NODE_ENV || 'development' }, target: props.target || 'browser' } },
      },
      transformers: [BrowserProcessTransformer(), BundleFastConditionUnwrapper(), RequireStatementInterceptor()],
      code: props.code,
    });
  };
  it('should unwrap dev', () => {
    const res = testTranspile({
      code: `
      if ( process.env.NODE_ENV === "development"){
        console.log("dev")
      }
    `,
    });
    expect(res.code).toMatchSnapshot();
  });

  it('should unwrap dev with alternate', () => {
    const res = testTranspile({
      NODE_ENV: 'production',
      code: `
      if ( process.env.NODE_ENV === "development"){
        console.log("dev")
      } else {
        console.log("this is dev")
      }
    `,
    });
    expect(res.code).toMatchSnapshot();
  });

  it('should not emit require statement', () => {
    const res = testTranspile({
      NODE_ENV: 'production',
      code: `
      if ( process.env.NODE_ENV === "development"){
        require("./dev")
      } else {
        console.log("this is dev")
      }
    `,
    });
    expect(res.requireStatementCollection).toEqual([]);
  });

  it('should not touch other statements', () => {
    const res = testTranspile({
      NODE_ENV: 'production',
      code: `
      if ( a.b ) {
         console.log(1)
      } else {
        console.log(2)
      }
    `,
    });
    expect(res.code).toMatchSnapshot();
  });
});
