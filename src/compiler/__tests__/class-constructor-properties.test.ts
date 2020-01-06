import { testTranspile } from '../transpilers/testTranspiler';

describe('Class constructor properties', () => {
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
                            @foo(123, 'ab') protected awesomeness: string,
                            of: number,
                            fuse?: boolean) {

                    super();

                    const innerClass = class extends Amazing {

                      constructor(@foo public welcome: string,
                        @foo() private to: string,
                        @foo(123, 'ab') protected awesomeness: string,
                        of: number,
                        fuse?: boolean) {
                          super();
                        }
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
  });
});
