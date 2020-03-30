import { ITarget } from '../../config/ITarget';
import { ImportType } from '../interfaces/ImportType';
import { initCommonTransform } from '../testUtils';
import { BundlePolyfillTransformer } from '../transformers/bundle/BundlePolyfillTransformer';
import { RequireStatementInterceptor } from '../transformers/bundle/RequireStatementInterceptor';

const testTranspile = (props: { code: string; fileName?: string; target?: ITarget }) => {
  return initCommonTransform({
    props: {
      module: { publicPath: props.fileName || '/test/file.js' },
    },

    compilerOptions: {
      buildTarget: props.target || 'browser',
    },

    code: props.code,
    transformers: [BundlePolyfillTransformer(), RequireStatementInterceptor()],
  });
};

const PolyfillEssentialConfig = {
  Buffer: 'buffer',

  buffer: 'buffer',

  http: 'http',
  https: 'https',
  process: 'process',
  stream: 'stream',
};

describe('Bundle polyfill transform test', () => {
  describe('Common transform ', () => {
    it('should replace __dirname', () => {
      const result = testTranspile({
        code: `
           console.log(__dirname)
      `,
        fileName: '/some-dir/file.ts',
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should replace __filename', () => {
      const result = testTranspile({
        code: `
           console.log(__filename)
      `,
        fileName: '/some-dir/file.ts',
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should replace global with window for browser target', () => {
      const result = testTranspile({
        code: `console.log(global)`,
        target: 'browser',
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should replace global with self for web-worker target', () => {
      const result = testTranspile({
        code: `console.log(global)`,
        target: 'web-worker',
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
                arguments: [{ type: 'Literal', value: moduleName }],
                callee: { name: 'require', type: 'Identifier' },
                type: 'CallExpression',
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

      it('should add buffer only once', () => {
        const result = testTranspile({
          code: `
            console.log(Buffer)
            console.log(Buffer)
          `,
        });
        expect(result.code).toMatchSnapshot();
      });

      it('should respect import', () => {
        const result = testTranspile({
          code: `
            import global from "some"
            function main(){
              console.log(global)
            }
          `,
        });
        expect(result.code).toMatchSnapshot();
      });

      it('should respect local scope', () => {
        const result = testTranspile({
          code: `

            function main(global){
              console.log(global)
            }
          `,
        });

        expect(result.code).toMatchSnapshot();
      });
    });
  });
});
