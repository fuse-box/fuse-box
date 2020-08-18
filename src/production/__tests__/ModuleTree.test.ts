import { IProductionContext } from '../ProductionContext';
import { WarmupPhase } from '../phases/WarmupPhase';
import { createTestEnvironment, ITestEnvironment } from './testUtils';

describe('ModuleTree test', () => {
  let environment: ITestEnvironment;

  const getProductionContext = async (files: Record<string, string>): Promise<IProductionContext> => {
    environment = await createTestEnvironment({ entry: 'index.ts' }, files);
    const context = environment.run([WarmupPhase]);
    return context;
  };

  // cleanup after each test
  afterEach(() => {
    if (environment) {
      environment.cleanup();
      environment = undefined;
    }
  });

  it('should have dependant', async () => {
    const context = await getProductionContext({
      'foo.ts': 'export function foo(){}',
      'index.ts': `import "./foo"`,
    });
    const { modules } = context;
    expect(modules).toHaveLength(2);
    expect(modules[1].moduleTree.dependants).toHaveLength(1);
    expect(modules[1].moduleTree.dependants[0].module).toEqual(modules[0]);
  });
});
