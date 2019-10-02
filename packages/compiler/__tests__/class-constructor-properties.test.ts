import { compileModule } from '../program/compileModule';

describe('Class constructor properties', () => {
  it('should initialize constructor properties in the constructor', () => {
    const result = compileModule({
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

    expect(result.code).toEqual(`class HelloWorld {
  constructor(welcome, to, awesomeness, of, fuse) {
    this.welcome = welcome;
    this.to = to;
    this.awesomeness = awesomeness;
    this.fuse = fuse;
  }
}
`);
  });

  it('should work with super classes', () => {
    const result = compileModule({
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

    expect(result.code).toEqual(`class Amazing {}
class HelloWorld extends Amazing {
  constructor(welcome, to, awesomeness, of, fuse) {
    super();
    this.welcome = welcome;
    this.to = to;
    this.awesomeness = awesomeness;
    this.fuse = fuse;
  }
}
`);
  });

  it('should not add initializer calls in standard block statements', () => {
    const result = compileModule({
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

    expect(result.code).toEqual(`class Amazing {}
class HelloWorld extends Amazing {
  constructor(welcome, to, awesomeness, of, fuse) {
    super();
    this.welcome = welcome;
    this.to = to;
    this.awesomeness = awesomeness;
    (() => {
      console.log("Freaky block statement here.");
    })();
    this.fuse = fuse;
  }
  welcomeToTheBlock() {}
}
`);
  });

  it('should ignore decorators for now', () => {
    const result = compileModule({
      code: `
            class Amazing {}

            class HelloWorld extends Amazing {

                constructor(@foo public welcome: string,
                            @foo() private to: string,
                            @foo(123, 'ab') protected awesomeness: string,
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

    expect(result.code).toEqual(`class Amazing {}
class HelloWorld extends Amazing {
  constructor(welcome, to, awesomeness, of, fuse) {
    super();
    this.welcome = welcome;
    this.to = to;
    this.awesomeness = awesomeness;
    (() => {
      console.log("Freaky block statement here.");
    })();
    this.fuse = fuse;
  }
  welcomeToTheBlock() {}
}
`);
  });

  it('should leave classes without constructor props alone', () => {
    const result = compileModule({
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

    expect(result.code).toEqual(`class HelloWorld {
  constructor(welcome, to, awesomeness, of, fuse) {
    this.fuse = fuse;
  }
}
`);
  });

  it('should deal with inner classes', () => {
    const result = compileModule({
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

    expect(result.code).toEqual(`class Amazing {}
class HelloWorld extends Amazing {
  constructor(welcome, to, awesomeness, of, fuse) {
    super();
    this.welcome = welcome;
    this.to = to;
    this.awesomeness = awesomeness;
    const innerClass = class extends Amazing {
      constructor(welcome, to, awesomeness, of, fuse) {
        super();
        this.welcome = welcome;
        this.to = to;
        this.awesomeness = awesomeness;
      }
    };
    this.fuse = fuse;
  }
  welcomeToTheBlock() {}
}
`);
  });

  it('should deal with immediate function calls on initialized properties', () => {
    const result = compileModule({
      code: `

            class HelloWorld {

                constructor(public welcome : string) {
                  console.log(this.welcome);
                }
            }
        `,
    });

    expect(result.code).toEqual(`class HelloWorld {
  constructor(welcome) {
    this.welcome = welcome;
    console.log(this.welcome);
  }
}
`);
  });

  it('should deal with multiple class definitions following each other', () => {
    const result = compileModule({
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

    expect(result.code).toEqual(`class HelloWorld {
  constructor(welcome) {
    this.welcome = welcome;
    console.log(this.welcome);
  }
}
class HelloWorld2 {
  constructor(welcome2) {
    this.welcome2 = welcome2;
    console.log(this.welcome2);
  }
}
class HelloWorld3 {
  constructor(welcome3) {
    this.welcome3 = welcome3;
    console.log(this.welcome3);
  }
}
`);
  });

  it('should work with class as a default value', () => {
    const result = compileModule({
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
    expect(result.code).toMatchInlineSnapshot(`
      "class A {
        constructor(name = class {
          constructor(hey = 2) {
            this.hey = hey;
          }
        }) {
          this.name = name;
        }
      }
      "
    `);
  });
});
