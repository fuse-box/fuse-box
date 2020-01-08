import { prodPhasesEnv, ProdPhasesTestEnv } from '../testUtils';
import { WarmupPhase } from '../phases/WarmupPhase';
import { CodeSplittingPhase } from '../phases/CodeSplittingPhase';
import { IProductionContext } from '../ProductionContext';

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

  it('should do', async () => {
    const context = await test({
      'index.ts': `import "./foo"`,
      'foo.ts': 'export function foo(){}',
    });
    for (const m of context.modules) {
      console.log('Inspect', m.getShortPath());
      for (const d of m.moduleTree.dependants) {
        console.log('dependant', d.module.getShortPath());
      }
    }
  });
});
