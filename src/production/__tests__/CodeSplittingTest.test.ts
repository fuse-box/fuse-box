import { IProductionContext } from '../ProductionContext';
import { CodeSplittingPhase } from '../phases/CodeSplittingPhase';
import { WarmupPhase } from '../phases/WarmupPhase';
import { ProdPhasesTestEnv, prodPhasesEnv } from '../testUtils';

describe('Code Splitting test', () => {
  let env: ProdPhasesTestEnv;
  const test = async (files: Record<string, string>): Promise<IProductionContext> => {
    env = prodPhasesEnv(
      {
        entry: 'index.ts',
      },
      files,
    );
    return await env.run([WarmupPhase, CodeSplittingPhase]);
  };
  afterEach(() => {
    if (env) env.destroy();
    env = undefined;
  });

  // it('should do', async () => {
  //   const context = await test({
  //     'index.ts': `import "./foo"`,
  //     'foo.ts': 'export function foo(){}',
  //   });
  //   for (const m of context.modules) {
  //     console.log('Inspect', m.getShortPath());
  //     for (const d of m.moduleTree.dependants) {
  //       console.log('dependant', d.module.getShortPath());
  //     }
  //   }
  // });

  it('should have splitEntry', async () => {
    const context = await test({
      'index.ts': `
        import './foo';
        async function load() {
          const dynamicFunc = await import('./bar');
          dynamicFunc();
        }
        load();
      `,
      'foo.ts': `
        export function foo() {}
      `,
      'bar.ts': `
        export default function() {}
      `,
    });
    expect(context.modules).toHaveLength(3);
    expect(context.splitEntries.entries).toHaveLength(1);
    expect(context.splitEntries.entries[0].modules).toHaveLength(0);
    expect(context.splitEntries.entries[0].references).toHaveLength(1);
    expect(context.splitEntries.entries[0].references[0].module.getShortPath()).toEqual('default/index.js');
  });
});
