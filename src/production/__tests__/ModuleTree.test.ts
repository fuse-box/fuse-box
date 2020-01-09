import { IProductionContext } from '../ProductionContext';
import { WarmupPhase } from '../phases/WarmupPhase';
import { ProdPhasesTestEnv, prodPhasesEnv } from './testUtils';

describe('ModuleTree test', () => {
  let env: ProdPhasesTestEnv;
  const test = async (files: Record<string, string>): Promise<IProductionContext> => {
    env = prodPhasesEnv(
      {
        entry: 'index.ts',
      },
      files,
    );
    return await env.run([WarmupPhase]);
  };
  afterEach(() => {
    if (env) env.destroy();
    env = undefined;
  });

  it('should have dependant', async () => {
    const context = await test({
      'index.ts': `import "./foo"`,
      'foo.ts': 'export function foo(){}',
    });
    const { modules } = context;
    expect(modules).toHaveLength(2);
    expect(modules[1].moduleTree.dependants).toHaveLength(1);
    expect(modules[1].moduleTree.dependants[0].module).toEqual(modules[0]);
  });
});
