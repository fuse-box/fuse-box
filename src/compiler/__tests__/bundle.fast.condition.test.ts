import { ITarget } from '../../config/ITarget';
import { initCommonTransform } from '../testUtils';
import { BrowserProcessTransformer } from '../transformers/bundle/BrowserProcessTransformer';
import { BundleFastConditionUnwrapper } from '../transformers/bundle/BundleFastConditionTransformer';
import { RequireStatementInterceptor } from '../transformers/bundle/RequireStatementInterceptor';

const testTranspile = (props: { NODE_ENV?: string; code: string; target?: ITarget }) => {
  return initCommonTransform({
    code: props.code,
    compilerOptions: {
      buildTarget: props.target || 'browser',
      processEnv: { NODE_ENV: props.NODE_ENV || 'development' },
    },
    transformers: [BundleFastConditionUnwrapper(), BrowserProcessTransformer(), RequireStatementInterceptor()],
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

      expect(res.requireStatementCollection).toHaveLength(1);
      expect(res.requireStatementCollection[0].statement.arguments[0].value).toEqual('./prod');
    });
  });

  describe('Fast condition', () => {
    it('should unwrap isBrowser', () => {
      const res = testTranspile({
        NODE_ENV: 'production',
        code: `
        if ( FuseBox.isBrowser){
          console.log("isBrowser")
        }
      `,
        target: 'browser',
      });
      expect(res.code).toMatchSnapshot();
    });

    it('should unwrap isServer', () => {
      const res = testTranspile({
        NODE_ENV: 'production',
        code: `
        if ( FuseBox.isServer){
          console.log("isServer")
        }
      `,
        target: 'server',
      });

      expect(res.code).toMatchSnapshot();
    });
  });
});
