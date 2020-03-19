import { initCommonTransform } from '../testUtils';
import { ExportTransformer } from '../transformers/shared/ExportTransformer';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';
import { ClassConstructorPropertyTransformer } from '../transformers/ts/ClassConstructorPropertyTransformer';
import { CommonTSfeaturesTransformer } from '../transformers/ts/CommonTSfeaturesTransformer';
import { DecoratorTransformer } from '../transformers/ts/decorators/DecoratorTransformer';

describe('Class constructor properties', () => {
  const testTranspile = (props: { code: string; jsx?: boolean }) => {
    return initCommonTransform({
      code: props.code,
      compilerOptions: { experimentalDecorators: true },
      jsx: props.jsx,
      transformers: [
        DecoratorTransformer(),
        ClassConstructorPropertyTransformer(),
        CommonTSfeaturesTransformer(),
        ImportTransformer(),
        ExportTransformer(),
      ],
    });
  };

  it('should initialize constructor properties in the constructor', () => {
    const result = testTranspile({
      code: `

            class HelloWorld {

                constructor(public welcome: string,
                            private to: string,
                            protected awesomeness: string,
                            of: number,
                            fuse?: boolean) {

                    this.fuse = fuse;
                }
            }
        `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should handle class expression', () => {
    const result = testTranspile({
      code: `
      export const exception = <Ex extends new (...args: any[]) => any>(constructor: Ex) => {
        return class extends constructor {
          public name = constructor.name;
        };
      };

        `,
      jsx: false,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should work with super classes', () => {
    const result = testTranspile({
      code: `
            class Amazing {}

            class HelloWorld extends Amazing {

                constructor(public welcome: string,
                            private to: string,
                            protected awesomeness: string,
                            of: number,
                            fuse?: boolean) {

                    super();

                    this.fuse = fuse;
                }
            }
        `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should not add initializer calls in standard block statements', () => {
    const result = testTranspile({
      code: `
            class Amazing {}

            class HelloWorld extends Amazing {

                constructor(public welcome: string,
                            private to: string,
                            protected awesomeness: string,
                            of: number,
                            fuse?: boolean) {

                    super();

                    (() => {console.log('Freaky block statement here.');})();

                    this.fuse = fuse;
                }

                welcomeToTheBlock() {

                }
            }
        `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should leave classes without constructor props alone', () => {
    const result = testTranspile({
      code: `

            class HelloWorld {

                constructor(welcome: string,
                            to: string,
                            awesomeness: string,
                            of: number,
                            fuse?: boolean) {

                    this.fuse = fuse;
                }
            }
        `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should deal with inner classes', () => {
    const result = testTranspile({
      code: `
            class Amazing {}

            class HelloWorld extends Amazing {

                constructor(@foo public welcome: string,
                            @foo() private to: string,
                            @foo(123, "ab") protected awesomeness: string,
                            of: number,
                            fuse?: boolean) {

                    super();
                    class Hey extends Amazing {
                      constructor(@foo public welcome: string,
                        @foo() private to: string,
                        fuse?: boolean) {
                          super();
                        }
                      static someM = () => {}
                    }
                    this.fuse = fuse;
                }

                welcomeToTheBlock() {

                }
            }
        `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should deal with immediate function calls on initialized properties', () => {
    const result = testTranspile({
      code: `

            class HelloWorld {

                constructor(public welcome : string) {
                  console.log(this.welcome);
                }
            }
        `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should deal with multiple class definitions following each other', () => {
    const result = testTranspile({
      code: `

            class HelloWorld {

                constructor(public welcome : string) {
                  console.log(this.welcome);
                }
            }
            class HelloWorld2 {

              constructor(public welcome2 : string) {
                console.log(this.welcome2);
              }
          }
          class HelloWorld3 {

            constructor(public welcome3 : string) {
              console.log(this.welcome3);
            }
        }
        `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should work with class as a default value', () => {
    const result = testTranspile({
      code: `
      class A {
        constructor(
          public name = class {
            constructor(public hey = 2) {}
          },
        ) {}
      }
      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  describe('Class props', () => {
    it("should remove property that's not inited", () => {
      const result = testTranspile({
        code: `
        class A {
          public name : string;
        }
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should remove add a property without constructor', () => {
      const result = testTranspile({
        code: `
        class A {
          public name : string = "hey"
        }
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should create constructor with extends', () => {
      const result = testTranspile({
        code: `
        class A extends B {
          public name : string = "hey"
        }
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should create constructor with extends being in export default', () => {
      const result = testTranspile({
        code: `
        export default class extends B {
          public name : string = "hey"
        }
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should respect existing constructor with extends being in export default', () => {
      const result = testTranspile({
        code: `
        export default class extends B {
          public name : string = "hey"
          constructor(private oi : number){
            super(oi)
          }
        }
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should remove add a property to the existing constructor', () => {
      const result = testTranspile({
        code: `
        class A {
          public name : string = "hey";
          constructor(){}
        }
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should remove add a property to the existing constructor respecting other public methods', () => {
      const result = testTranspile({
        code: `
        class A {
          public name : string = "hey";
          constructor(private hey : string = "key"){
            console.log( this.name )
          }
        }
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should handle constructor overrides', () => {
      const result = testTranspile({
        code: `
        class A {
          public name : string = "hey";
          constructor(number)
          constructor(private hey : string = "key"){

          }
        }
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should create a computed prop', () => {
      const result = testTranspile({
        code: `
        const foo = "prop"
        class A  {
          public [foo] : string = "hey"
        }
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should create a computed prop respecting imports', () => {
      const result = testTranspile({
        code: `
        import foo from "mod";
        class A  {
          public [foo] : string = "hey"
        }
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should create a computed prop respecting export', () => {
      const result = testTranspile({
        code: `
        export const IsException = Symbol();
        export default class {
          public [IsException] = true;
        }

        `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Static properties', () => {
    it('should handle a static default property', () => {
      const result = testTranspile({
        code: `
        class A {
          public static hey : string = "some"
        }
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should not add an empty static property', () => {
      const result = testTranspile({
        code: `
        class A {
          public static hey : string;
        }
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should add a computed property', () => {
      const result = testTranspile({
        code: `
        const hey = "oi"
        class A {
          public static [hey] : string = "some value"
        }
        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should add a computed property respecting imports', () => {
      const result = testTranspile({
        code: `
        import hey from "mod";
        class A {
          public static [hey] : string = "some value"
        }
        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should add a computed property respecting existing export', () => {
      const result = testTranspile({
        code: `
        export const IsException = Symbol();
        export default class {
          public static [IsException] = true;
        }

        `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should static prop with class assigned to a const', () => {
      const result = testTranspile({
        code: `

        const foo = class A {
          public static oi = true;
        }

        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should static prop with class assigned to a const 2', () => {
      const result = testTranspile({
        code: `

        const foo = class A {
          public static oi = true;
        }, b = class {
          public static oops = 1;
        }

        `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should static prop with class assigned to a const 2 (with return)', () => {
      const result = testTranspile({
        code: `

        export const exception = <Ex extends new (...args: any[]) => any>(constructor: Ex) => {
          return class extends constructor {
            public static hey = 1;
          };
        };


        `,
        jsx: false,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should static prop with class assigned to a const 2 (with return combo)', () => {
      const result = testTranspile({
        code: `

        export const exception = <Ex extends new (...args: any[]) => any>(constructor: Ex) => {
          return class extends constructor {
            public static hey = 1;
            public oi = 1;
          };
        };


        `,
        jsx: false,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('static props in export default class with decorators', () => {
      const result = testTranspile({
        code: `
        @Injectable()
        export default class ApiService {
          static foo = () => {}
          static bar = () => {}
        }
        `,
        jsx: false,
      });

      expect(result.code).toMatchSnapshot();
    });
  });
});
