import { testTranspile } from '../transpilers/testTranspiler';
import { ImportType } from '../interfaces/ImportType';

describe('Browser fast condition', () => {
  describe('Process env', () => {
    it('should unwrap dev', () => {
      const res = testTranspile({
        bundleProps: { env: { NODE_ENV: 'development' } },
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
        bundleProps: { env: { NODE_ENV: 'production' } },
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
        bundleProps: { env: { NODE_ENV: 'production' } },
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
        bundleProps: { env: { NODE_ENV: 'production' } },
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

    it('should emit require statement', () => {
      const res = testTranspile({
        bundleProps: { env: { NODE_ENV: 'production' } },
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
            shortCircuited: false,
            callee: { type: 'Identifier', name: 'require' },
            arguments: [{ type: 'Literal', value: './prod' }],
            typeParameters: null,
          },
        },
      ]);
    });
  });

  describe('FuseBox.*', () => {
    it('should unwrap isBrowser', () => {
      const res = testTranspile({
        bundleProps: { isBrowser: true, env: { NODE_ENV: 'production' } },
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
        bundleProps: { isServer: true, env: { NODE_ENV: 'production' } },
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
