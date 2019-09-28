import { compileModule } from "../compileModule";

describe("Class constructor properties", () => {
  it("should initialize constructor properties in the constructor", () => {
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
        `
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

  it("should work with super classes", () => {
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
        `
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
});
