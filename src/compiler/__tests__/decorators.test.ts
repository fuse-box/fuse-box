import { testTranspile } from '../transpilers/testTranspiler';

describe('Decorators test', () => {
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
      expect(res).toMatchSnapshot();
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

      expect(res).toMatchSnapshot();
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
});
