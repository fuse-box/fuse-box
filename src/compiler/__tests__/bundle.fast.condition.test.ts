import { initCommonTransform } from '../testUtils';
import { BundleFastConditionUnwrapper } from '../transformers/bundle/BundleFastConditionTransformer';
import { BrowserProcessTransformer } from '../transformers/bundle/BrowserProcessTransformer';
import { RequireStatementInterceptor } from '../transformers/bundle/RequireStatementInterceptor';
import { ImportType } from '../interfaces/ImportType';

const testTranspile = (props: { code: string; NODE_ENV?: string; target?: string }) => {
  return initCommonTransform({
    props: {
      ctx: { config: { env: { NODE_ENV: props.NODE_ENV || 'development' }, target: props.target || 'browser' } },
    },
    transformers: [BundleFastConditionUnwrapper(), BrowserProcessTransformer(), RequireStatementInterceptor()],
    code: props.code,
  });
};

describe('Browser fast condition', () => {
  describe('Process env', () => {
    it('should emit require statement', () => {
      const res = testTranspile({
        NODE_ENV: 'production',
        code: `
        if ( process.env.NODE_ENV === "development"){
          require("./dev")
        } else {
          require("./prod")
        }
      `,
      });

      expect(res.requireStatementCollection).toEqual([
        {
          importType: ImportType.REQUIRE,
          statement: {
            type: 'CallExpression',
            optional: false,

            callee: { type: 'Identifier', name: 'require' },
            arguments: [{ type: 'Literal', value: './prod' }],
          },
        },
      ]);
    });
  });

  describe('Fast condition', () => {
    it('should unwrap isBrowser', () => {
      const res = testTranspile({
        NODE_ENV: 'production',
        target: 'browser',
        code: `
        if ( FuseBox.isBrowser){
          console.log("isBrowser")
        }
      `,
      });
      expect(res.code).toMatchSnapshot();
    });

    it('should unwrap isServer', () => {
      const res = testTranspile({
        NODE_ENV: 'production',
        target: 'server',
        code: `
        if ( FuseBox.isServer){
          console.log("isServer")
        }
      `,
      });

      expect(res.code).toMatchSnapshot();
    });
  });
});
