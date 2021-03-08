import { initCommonTransform } from '../testUtils';
import { ClassConstructorPropertyTransformer } from '../transformers/ts/ClassConstructorPropertyTransformer';
import { CommonTSfeaturesTransformer } from '../transformers/ts/CommonTSfeaturesTransformer';

describe('Common features test', () => {
  const testTranspile = (props: { code: string; jsx?: boolean }) => {
    return initCommonTransform({
      jsx: props.jsx,
      transformers: [ClassConstructorPropertyTransformer(), CommonTSfeaturesTransformer()],
      code: props.code,
    });
  };

  describe('Abstract methods', () => {
    it('should remove abstract methods', () => {
      const result = testTranspile({
        code: `
          abstract  class A {
            constructor(public name){}
            abstract hello()
        }

      `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Should remove declare', () => {
    it('should remove consts', () => {
      const result = testTranspile({
        code: `
        alert(1)
        declare const A: any, B: any;
        alert(2)
      `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Interface removal', () => {
    it('should remove export interface', () => {
      const result = testTranspile({
        code: `
          console.log(1);
          export interface Foo {

          }
          console.log(2);
      `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should remove interface', () => {
      const result = testTranspile({
        code: `
           alert(1);
           interface Foo {}
           alert(2);
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should ignore export declare', () => {
      const result = testTranspile({
        code: `
        alert(1)
        export declare const A: any, B: any, oi = 2;
        alert(2)
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should ignore export declare', () => {
      const result = testTranspile({
        code: `
        type plain = {
          [key: string]: plain | any;
        };
        declare module '*.graphql' {
          const value: string;
          export default value;
        }
        declare module '*.docx' {
          const value: any;
          export = value;
        }
        alert(1)

        `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Various', () => {
    it('should remove type assertion', () => {
      const result = testTranspile({
        code: `
          if( (<any>_e.target) === 1){}
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should handle NotNullExpression', () => {
      const result = testTranspile({
        code: `
        function hey(res){
          return res!;
      }
        `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('This typing', () => {
    it('should remove 1', () => {
      const result = testTranspile({
        code: `
          function hey(this : string, a){}
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should remove 2', () => {
      const result = testTranspile({
        code: `
          const hey = function(this : string, a){
            console.log(this)
          }
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should remove 3', () => {
      const result = testTranspile({
        code: `
          class A {
            foo(this : string){
            }
          }
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should and preserve other args', () => {
      const result = testTranspile({
        code: `
          class A {
            foo(this : string, some : number){}
          }
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform export expression', () => {
      const result = testTranspile({
        code: `
          export = {foo : "bar"}
        `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });
});
