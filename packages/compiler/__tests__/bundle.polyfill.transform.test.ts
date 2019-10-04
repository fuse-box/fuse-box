import { ImportType } from '../interfaces/ImportType';
import { PolyfillEssentialConfig } from '../transformers/bundle/BundlePolyfillTransformer';
import { testTranspile } from '../transpilers/testTranpiler';

describe('Bundle polyfill transform test', () => {
  describe('Common transform ', () => {
    it('should replace __dirname', () => {
      const result = testTranspile({
        code: `
           console.log(__dirname)
      `,
        bundleProps: {
          moduleFileName: '/some-dir/file.ts',
        },
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should replace __filename', () => {
      const result = testTranspile({
        code: `
           console.log(__filename)
      `,
        bundleProps: {
          moduleFileName: '/some-dir/file.ts',
        },
      });
      expect(result.code).toMatchSnapshot();
    });
  });

  describe('polyfills', () => {
    describe('Single reference', () => {
      for (const name in PolyfillEssentialConfig) {
        const moduleName = PolyfillEssentialConfig[name];
        it(`shuold insert ${moduleName}`, () => {
          const result = testTranspile({
            code: `console.log(${moduleName})`,
          });
          expect(result.requireStatementCollection).toEqual([
            {
              importType: ImportType.REQUIRE,
              statement: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'require' },
                arguments: [{ type: 'Literal', value: moduleName }],
              },
            },
          ]);
          expect(result.code).toMatchSnapshot();
        });
      }
    });

    describe('Member reference reference', () => {
      for (const name in PolyfillEssentialConfig) {
        const moduleName = PolyfillEssentialConfig[name];
        it(`shuold insert ${moduleName} with method reference`, () => {
          const result = testTranspile({
            code: `console.log(${moduleName}.method)`,
          });

          expect(result.code).toMatchSnapshot();
        });
      }
    });
    describe('Member reference with a call', () => {
      for (const name in PolyfillEssentialConfig) {
        const moduleName = PolyfillEssentialConfig[name];
        it(`shuold insert ${moduleName} with method reference with a call`, () => {
          const result = testTranspile({
            code: `console.log(${moduleName}.method() )`,
          });

          expect(result.code).toMatchSnapshot();
        });
      }
    });

    describe('Should not add anything', () => {
      it('should not add Buffer because its been hoisted', () => {
        const result = testTranspile({
          code: `
            exports.Buffer = Buffer;
            function Buffer(){}
          `,
        });

        expect(result.code).toMatchSnapshot();
      });

      it('should not add Buffer because its has been defined', () => {
        const result = testTranspile({
          code: `
            function some(){
              const buffer = {};
              console.log(buffer)
            }
          `,
        });
        expect(result.code).toMatchSnapshot();
      });

      it('should not add Buffer because it has NOT been defined', () => {
        const result = testTranspile({
          code: `
            function some(){
              console.log(buffer)
            }
          `,
        });

        expect(result.code).toMatchSnapshot();
      });
    });
  });
});
