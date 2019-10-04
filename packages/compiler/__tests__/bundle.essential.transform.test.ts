import { compileModule } from '../program/compileModule';
import { PolyfillEssentialConfig } from '../transformers/bundle/BundleEssentialTransformer';
describe('Bundle essential transform test', () => {
  describe('Common transform ', () => {
    it('should replace __dirname', () => {
      const result = compileModule({
        code: `
           console.log(__dirname)
      `,
        bundleProps: {
          moduleFileName: '/some-dir/file.ts',
        },
      });
      expect(result.code).toMatchInlineSnapshot(`
                "console.log(\\"/some-dir/file.ts\\");
                "
            `);
    });

    it('should replace __filename', () => {
      const result = compileModule({
        code: `
           console.log(__filename)
      `,
        bundleProps: {
          moduleFileName: '/some-dir/file.ts',
        },
      });
      expect(result.code).toMatchInlineSnapshot(`
        "console.log(\\"/some-dir\\");
        "
      `);
    });
  });

  describe('polyfills', () => {
    describe('Single reference', () => {
      for (const name in PolyfillEssentialConfig) {
        const moduleName = PolyfillEssentialConfig[name];
        it(`shuold insert ${moduleName}`, () => {
          const result = compileModule({
            code: `console.log(${moduleName})`,
          });
          expect(result.code).toMatchSnapshot();
        });
      }
    });

    describe('Member reference reference', () => {
      for (const name in PolyfillEssentialConfig) {
        const moduleName = PolyfillEssentialConfig[name];
        it(`shuold insert ${moduleName} with method reference`, () => {
          const result = compileModule({
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
          const result = compileModule({
            code: `console.log(${moduleName}.method() )`,
          });

          expect(result.code).toMatchSnapshot();
        });
      }
    });

    describe('Should not add anything', () => {
      it('should not add Buffer because its been hoisted', () => {
        const result = compileModule({
          code: `
            exports.Buffer = Buffer;
            function Buffer(){}
          `,
        });

        expect(result.code).toMatchSnapshot();
      });

      it('should not add Buffer because its has been defined', () => {
        const result = compileModule({
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
        const result = compileModule({
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
