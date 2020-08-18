import { IProductionContext } from '../ProductionContext';
import { IExportReference } from '../module/ExportReference';
import { WarmupPhase } from '../phases/WarmupPhase';
import { createTestEnvironment, ITestEnvironment } from './testUtils';

describe('Phase 1 export', () => {
  let environment: ITestEnvironment;
  async function getProductionContext(code: string): Promise<IProductionContext> {
    environment = await createTestEnvironment(
      { entry: 'index.ts' },
      {
        'foo.ts': `
        console.log('foo');
      `,
        'index.ts': code,
      },
    );
    environment.run([WarmupPhase]);
    return environment.productionContext;
  }

  async function getReferences(code: string): Promise<Array<IExportReference>> {
    const context = await getProductionContext(code);
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
      it('export function foo', async () => {
        const refs = await getReferences(`
          export function foo(){}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('foo');
      });

      it('export class Foo', async () => {
        const refs = await getReferences(`
          export class Foo {}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('Foo');
      });

      it('should have both normal exports ', async () => {
        const refs = await getReferences(`
          export function foo(){}
          export class Foo {}
        `);
        expect(refs).toHaveLength(2);
        expect(refs[0].name).toEqual('foo');
        expect(refs[1].name).toEqual('Foo');
      });
    });

    describe('Normal default object export', () => {
      it('export default function foo', async () => {
        const refs = await getReferences(`
          export default function foo(){}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual('foo');
      });

      it('export default class Foo', async () => {
        const refs = await getReferences(`
          export default class Foo{}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual('Foo');
      });

      it('export default class (anon', async () => {
        const refs = await getReferences(`
          export default class {}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual(undefined);
      });

      it('export default function (anon)', async () => {
        const refs = await getReferences(`
          export default function(){}
        `);
        expect(refs).toHaveLength(1);
        expect(refs[0].name).toEqual('default');
        expect(refs[0].local).toEqual(undefined);
      });
    });
  });

  describe('Export local refs', () => {
    it('should find local ref', async () => {
      const refs = await getReferences(`
        function foo(){}
        export { foo }
      `);
      expect(refs).toHaveLength(1);
      expect(refs[0].targetObjectAst).toBeTruthy();
    });

    it('should not find local ref', async () => {
      const refs = await getReferences(`
        export { foo }
      `);
      expect(refs).toHaveLength(1);
      expect(refs[0].targetObjectAst).toBeUndefined();
    });
  });

  describe('Internal export references', () => {
    it('Function foo should have 1 internal export reference', async () => {
      const refs = await getReferences(`
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
