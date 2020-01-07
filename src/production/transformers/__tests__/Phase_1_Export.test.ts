import { Phase_1_ExportLink } from '../Phase_1_ExportLink';
import { testProductionWarmup } from '../testUtils';

describe('Phase 1 export', () => {
  function test(code: string) {
    return testProductionWarmup({ code, transformers: [Phase_1_ExportLink()] });
  }

  describe('Basic structurs', () => {
    describe('Normal single object export', () => {
      it('export function foo', () => {
        const { tree } = test(`
          export function foo(){}
        `);

        const refs = tree.exportReferences.references;
        expect(refs).toHaveLength(1);

        expect(refs[0].name).toEqual('foo');
      });

      it('export class Foo', () => {
        const { tree } = test(`
          export class Foo {}
        `);

        const refs = tree.exportReferences.references;
        expect(refs).toHaveLength(1);

        expect(refs[0].name).toEqual('Foo');
      });

      it('should have both normal exports ', () => {
        const { tree } = test(`
          export function foo(){}
          export class Foo {}
        `);

        const refs = tree.exportReferences.references;
        expect(refs).toHaveLength(2);
        expect(refs[0].name).toEqual('foo');
        expect(refs[1].name).toEqual('Foo');
      });
    });

    describe('Normal default object export', () => {
      it('export default function foo', () => {
        const { tree } = test(`
          export default function foo(){}
        `);

        const refs = tree.exportReferences.references;
        expect(refs).toHaveLength(1);

        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual('foo');
      });

      it('export default class Foo', () => {
        const { tree } = test(`
          export default class Foo{}
        `);

        const refs = tree.exportReferences.references;
        expect(refs).toHaveLength(1);

        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual('Foo');
      });

      it('export default class (anon', () => {
        const { tree } = test(`
          export default class {}
        `);

        const refs = tree.exportReferences.references;
        expect(refs).toHaveLength(1);

        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual(undefined);
      });

      it('export default function (anon)', () => {
        const { tree } = test(`
          export default function(){}
        `);

        const refs = tree.exportReferences.references;
        expect(refs).toHaveLength(1);

        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual(undefined);
      });
    });
  });

  describe('Export local refs', () => {
    it('should find local ref', () => {
      const { tree } = test(`
          function foo(){}
          export { foo }
        `);

      const refs = tree.exportReferences.references;
      expect(refs).toHaveLength(1);
      expect(refs[0].targetObjectAst).toBeTruthy();
    });

    it('should not find local ref', () => {
      const { tree } = test(`
          export { foo }
        `);

      const refs = tree.exportReferences.references;
      expect(refs).toHaveLength(1);
      expect(refs[0].targetObjectAst).toBeUndefined();
    });
  });

  describe('Internal export references', () => {
    it('Function foo should have 1 internal export reference', () => {
      const { tree } = test(`
          function bar(){}

          function foo(){
            console.log(1);
            return bar();
          }
          export { foo, bar }
        `);

      const refs = tree.exportReferences.references;
    });
  });
});
