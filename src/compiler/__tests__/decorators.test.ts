import { initCommonTransform } from '../testUtils';
import { ExportTransformer } from '../transformers/shared/ExportTransformer';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';
import { ClassConstructorPropertyTransformer } from '../transformers/ts/ClassConstructorPropertyTransformer';
import { CommonTSfeaturesTransformer } from '../transformers/ts/CommonTSfeaturesTransformer';
import { DecoratorTransformer } from '../transformers/ts/decorators/DecoratorTransformer';

describe('Decorators test', () => {
  const testTranspile = (props: { code: string; emitDecoratorMetadata?: boolean; jsx?: boolean }) => {
    return initCommonTransform({
      jsx: props.jsx,

      code: props.code,
      compilerOptions: {
        emitDecoratorMetadata: props.emitDecoratorMetadata,
        experimentalDecorators: true,
      },
      transformers: [
        DecoratorTransformer(),
        ClassConstructorPropertyTransformer(),
        CommonTSfeaturesTransformer(),
        ImportTransformer(),
        ExportTransformer(),
      ],
    });
  };

  describe('Class decorators', () => {
    it('Should inject 1 decorator ', () => {
      const res = testTranspile({
        code: `
        @hey
        class Foo {}
    `,
      });

      expect(res.code).toMatchSnapshot();
    });

    it('Should inject 2 decorators ', () => {
      const res = testTranspile({
        code: `
        @foo
        @bar()
        class Foo {}
    `,
      });
      expect(res.code).toMatchSnapshot();
    });

    it('Should inject a decorator on export class', () => {
      const res = testTranspile({
        code: `
        @bar()
        export class Foo {}
    `,
      });

      expect(res.code).toMatchSnapshot();
    });

    it('Should inject a decorator on export default class with a name', () => {
      const res = testTranspile({
        code: `
        @bar()
        export default class Foo {}
    `,
      });

      expect(res.code).toMatchSnapshot();
    });

    it('Should inject a decorator on export default class without a name', () => {
      const res = testTranspile({
        code: `
        @bar()
        export default class {}
    `,
      });

      expect(res.code).toMatchSnapshot();
    });

    it('Should inject inside a default function', () => {
      const res = testTranspile({
        code: `
       export default function(){
        @bar()
        class SomeClass {}
       }
    `,
      });
      expect(res.code).toMatchSnapshot();
    });

    it('Should consider import variables too', () => {
      const res = testTranspile({
        code: `
       import hey from "./mod";
       export default function(){
        @bar({ hey })
        class SomeClass {}
       }
    `,
      });

      expect(res.code).toMatchSnapshot();
    });

    it('Should have no problems transforming further', () => {
      const res = testTranspile({
        code: `
        @bar()
        export default class {
          public name : string = "Bob"
        }
    `,
      });

      expect(res.code).toMatchSnapshot();
    });
  });

  describe('Class Properties', () => {
    it('should decorate name 1', () => {
      const res = testTranspile({
        code: `
        class A {
          @foo
          public name : string;
        }
    `,
      });

      expect(res.code).toMatchSnapshot();
    });

    it('should decorate name 2', () => {
      const res = testTranspile({
        code: `
        class A {
          @foo
          public name : string = "hey";
        }
    `,
      });
      expect(res.code).toMatchSnapshot();
    });
  });

  describe('Method decorators', () => {
    it('should decorate class method', () => {
      const res = testTranspile({
        code: `
        class A {
          @foo
          public hey(){}
        }
    `,
      });

      expect(res.code).toMatchSnapshot();
    });

    it('should decorate class static method', () => {
      const res = testTranspile({
        code: `
        class A {
          @foo
          public static hey(){}
        }
    `,
      });

      expect(res.code).toMatchSnapshot();
    });
  });

  describe('Method param decorators', () => {
    it('should contain 1 decorator ', () => {
      const res = testTranspile({
        code: `
        class A {

          hey(@foo a : string){}
        }
    `,
      });
      expect(res.code).toMatchSnapshot();
    });

    it('should contain 2 decorators ', () => {
      const res = testTranspile({
        code: `
      class A {

        hey(@foo @bar() a : string){}
      }
  `,
      });
      expect(res.code).toMatchSnapshot();
    });

    it('should contain 3 decorators ', () => {
      const res = testTranspile({
        code: `
      class A {

        hey(@foo @bar() a : string, @oi b : string){}
      }
  `,
      });
      expect(res.code).toMatchSnapshot();
    });

    it('should contain 1 decorator with a static method ', () => {
      const res = testTranspile({
        code: `
      class A {

        static hey(@foo a : string){}
      }
  `,
      });

      expect(res.code).toMatchSnapshot();
    });
  });

  describe('Metadata', () => {
    describe('Constructor metadata', () => {
      it('should handle normal properties', () => {
        const res = testTranspile({
          code: `
          @a
          @b()
          export class HomeComponent {
            constructor(env: Env, bar: Runkari) {}
          }
    `,
          emitDecoratorMetadata: true,
        });
        expect(res.code).toMatchSnapshot();
      });

      it('should handle properties with visibility', () => {
        const res = testTranspile({
          code: `
          @a
          @b()
          export class HomeComponent {
            constructor(public env: Env, bar) {}
          }
    `,
          emitDecoratorMetadata: true,
        });

        expect(res.code).toMatchSnapshot();
      });

      it('should respect imports', () => {
        const res = testTranspile({
          code: `
          import Env from "./some-data";
          @a
          @b()
          export class HomeComponent {
            constructor(public env: Env, bar) {}
          }
    `,
          emitDecoratorMetadata: true,
        });

        expect(res.code).toMatchSnapshot();
      });

      it('should handle overload gracefully', () => {
        const res = testTranspile({
          code: `
          import Env from "./some-data";
          @a
          @b()
          export class HomeComponent {
            constructor(name : string)
            constructor(public env: Env, bar) {}
          }
    `,
          emitDecoratorMetadata: true,
        });
        expect(res.code).toMatchSnapshot();
      });

      it('should work ok without any props', () => {
        const res = testTranspile({
          code: `
          @a
          @b()
          export class HomeComponent {
            constructor() {}
          }
    `,
          emitDecoratorMetadata: true,
        });
        expect(res.code).toMatchSnapshot();
      });

      it('should work ok without constructor', () => {
        const res = testTranspile({
          code: `
          @a
          @b()
          export class HomeComponent {

          }
    `,
          emitDecoratorMetadata: true,
        });

        expect(res.code).toMatchSnapshot();
      });
    });

    describe('Paramater decorators', () => {
      it('should add 1', () => {
        const res = testTranspile({
          code: `
          export class HomeComponent {
            @hey
            public name: string;
          }

    `,
          emitDecoratorMetadata: true,
        });
        expect(res.code).toMatchSnapshot();
      });

      it('should add 2 decorators', () => {
        const res = testTranspile({
          code: `
          export class HomeComponent {
            @hey
            @oi({})
            public name: string;
          }

    `,
          emitDecoratorMetadata: true,
        });
        expect(res.code).toMatchSnapshot();
      });
    });

    describe('method params meta', () => {
      it('should handle 1', () => {
        const res = testTranspile({
          code: `
          class Application {
            @hey
            @gay
            name(@kukka @sukka kakka: string) {}
          }
    `,
          emitDecoratorMetadata: true,
        });
        expect(res.code).toMatchSnapshot();
      });

      it('should handle with return type', () => {
        const res = testTranspile({
          code: `
          class Application {
            @hey
            @gay
            name(@kukka @sukka kakka: string) : HelloSomeObject {}
          }
    `,
          emitDecoratorMetadata: true,
        });

        expect(res.code).toMatchSnapshot();
      });

      it('should handle 2', () => {
        const res = testTranspile({
          code: `
          class Application {
            @oi
            name(some: string): HelloSomeObject {}
          }
    `,
          emitDecoratorMetadata: true,
        });

        expect(res.code).toMatchSnapshot();
      });
    });
  });

  describe('Cosntructor decorators', () => {
    it('should not create decorators', () => {
      const res = testTranspile({
        code: `
        class Application {
          constructor(hey : string){}
        }
  `,
        emitDecoratorMetadata: true,
      });
      expect(res.code).toMatchSnapshot();
    });

    it('should create decorator wrapper', () => {
      const res = testTranspile({
        code: `
        class Application {
          constructor(@oi hey, name : string){}
        }
  `,
        emitDecoratorMetadata: true,
      });

      expect(res.code).toMatchSnapshot();
    });

    it('should create decorator def with 2 decorators', () => {
      const res = testTranspile({
        code: `
        class Application {
          constructor(@oi @foo hey, name : string){}
        }
  `,
        emitDecoratorMetadata: true,
      });
      expect(res.code).toMatchSnapshot();
    });

    it('should create decorators on 3 properties', () => {
      const res = testTranspile({
        code: `
        class Application {
          constructor(@oi @foo hey, @hey name : string){}
        }
  `,
        emitDecoratorMetadata: true,
      });
      expect(res.code).toMatchSnapshot();
    });

    it('should create a parent property decorator + constructor props all in one wrapper', () => {
      const res = testTranspile({
        code: `
        @Injectable({})
        class Application {
          constructor(@oi hey : number){}
        }
  `,
        emitDecoratorMetadata: true,
      });
      expect(res.code).toMatchSnapshot();
    });
  });
});
