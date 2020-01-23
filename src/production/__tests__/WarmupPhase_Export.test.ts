import { IProductionContext } from '../ProductionContext';
import { IExportReference } from '../module/ExportReference';
import { WarmupPhase } from '../phases/WarmupPhase';
import { createTestEnvironment, ITestEnvironment } from './testUtils';

describe('Phase 1 export', () => {
  let environment: ITestEnvironment;
  function getProductionContext(code: string): IProductionContext {
    environment = createTestEnvironment({ entry: 'index.ts' }, {
      'foo.ts': `
        console.log('foo');
      `,
      'index.ts': code,
    });
    environment.run([WarmupPhase]);
    return environment.productionContext;
  };

  function getReferences(code: string): Array<IExportReference> {
    const context = getProductionContext(code);
    return context.modules[0].moduleTree.exportReferences.references;
  }

  describe('Basic structures', () => {
    // cleanup after each test
    afterEach(() => {
      if (environment) {
        environment.cleanup();
        environment = undefined;
      }
    });

    describe('Normal single object export', () => {
      it('export function foo', () => {
        const refs = getReferences(`
          export function foo(){}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('foo');
      });

      it('export class Foo', () => {
        const refs = getReferences(`
          export class Foo {}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('Foo');
      });

      it('should have both normal exports ', () => {
        const refs = getReferences(`
          export function foo(){}
          export class Foo {}
        `);
        expect(refs).toHaveLength(2);
        expect(refs[0].name).toEqual('foo');
        expect(refs[1].name).toEqual('Foo');
      });
    });

    describe('Normal default object export', () => {
      it('export default function foo', () => {
        const refs = getReferences(`
          export default function foo(){}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual('foo');
      });

      it('export default class Foo', () => {
        const refs = getReferences(`
          export default class Foo{}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual('Foo');
      });

      it('export default class (anon', () => {
        const refs = getReferences(`
          export default class {}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual(undefined);
      });

      it('export default function (anon)', () => {
        const refs = getReferences(`
          export default function(){}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual(undefined);
      });
    });
  });

  describe('Export local refs', () => {
    it('should find local ref', () => {
      const refs = getReferences(`
        function foo(){}
        export { foo }
      `);
      expect(refs).toHaveLength(1);
      expect(refs[0].targetObjectAst).toBeTruthy();
    });

    it('should not find local ref', () => {
      const refs = getReferences(`
        export { foo }
      `);
      expect(refs).toHaveLength(1);
      expect(refs[0].targetObjectAst).toBeUndefined();
    });
  });

  describe('Internal export references', () => {
    it('Function foo should have 1 internal export reference', () => {
      const refs = getReferences(`
        function bar(){}
        function foo(){
          console.log(1);
          return bar();
        }
        export { foo, bar }
      `);
      expect(refs).toHaveLength(2);
    });
  });
});
