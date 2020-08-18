/**
 * This file tests the codesplitting phase
 * - It checks the creation of split modules
 * - It checks on circular dependencies within splits
 * - It flags commonly used modules within splits
 * - It checks differently import methods
 */
import * as path from 'path';
import { IProductionContext } from '../ProductionContext';
import { ISplitEntry } from '../module/SplitEntries';
import { CodeSplittingPhase } from '../phases/CodeSplittingPhase';
import { WarmupPhase } from '../phases/WarmupPhase';
import { createTestEnvironment, ITestEnvironment } from './testUtils';

describe('Code Splitting test', () => {
  let environment: ITestEnvironment;
  let cachedModule: ISplitEntry;

  const getProductionContext = async (files: Record<string, string>): Promise<IProductionContext> => {
    environment = await createTestEnvironment({ entry: 'index.ts' }, files);
    const context = await environment.run([WarmupPhase, CodeSplittingPhase]);
    return context;
  };

  /**
   * Helper function to get the SplitEntry based on the original filename
   * This is convenient cause orders of modules might change in the future.
   * @param fileName
   * @param entries
   */
  const getSplitEntry = (fileName: string, entries: Array<ISplitEntry>): ISplitEntry => {
    if (!!cachedModule && cachedModule.entry.absPath === path.join(environment.sourceDir + fileName)) {
      return cachedModule;
    }
    cachedModule = undefined;
    for (const entry of entries) {
      const moduleFileName = entry.entry.absPath.replace(environment.sourceDir + path.sep, '');
      if (fileName === moduleFileName) {
        cachedModule = entry;
        break;
      }
    }
    return cachedModule;
  };

  // cleanup after each test
  afterEach(() => {
    if (environment) {
      environment.cleanup();
      environment = undefined;
    }
    cachedModule = undefined;
  });

  /**
   * This test is to ensure we have a splitted module
   * 'bar' is dynamically required, so we would have 1 splitEntry
   */
  it('should have splitEntry', async () => {
    const context = await getProductionContext({
      'bar.ts': `
        export default function() {}
      `,
      'foo.ts': `
        export default function() {}
      `,
      'index.ts': `
        import './foo';
        async function load() {
          const dynamicFunc = await import('./bar');
        }
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(3);
    expect(entries).toHaveLength(1);

    const barModule = getSplitEntry('bar.ts', entries);
    expect(barModule.modules).toHaveLength(1);
    expect(barModule.modules[0].publicPath).toContain('src/bar.ts');
    expect(barModule.references).toHaveLength(1);
    expect(barModule.references[0].module.publicPath).toContain('src/index.ts');
  });

  /**
   * This test ensures we have a split entry
   * and modules required by that entry should end up in the
   * subModules of the splitted module
   */
  it('should have splitEntry with submodules', async () => {
    const context = await getProductionContext({
      'bar.ts': `
        import './foo';
        export default function() {}
      `,
      'foo.ts': `
        export default function() {}
      `,
      'index.ts': `
        async function load() {
          const dynamicFunc = await import('./bar');
        }
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(3);
    expect(entries).toHaveLength(1);

    const barModule = getSplitEntry('bar.ts', entries);
    expect(barModule.modules).toHaveLength(2);
    expect(barModule.modules[0].publicPath).toContain('src/bar.ts');
    expect(barModule.modules[1].publicPath).toContain('src/foo.ts');
    expect(barModule.references).toHaveLength(1);
    expect(barModule.references[0].module.publicPath).toContain('src/index.ts');
  });

  /**
   * In this test case, we have one dynamic import 'bar.ts'
   *
   * 1.
   * index.ts AND bar.ts import the module './test'
   * - 'test' should not be in bar.subModules
   * 2.
   * bar requires 'ignored.ts' but doesn't use it
   * - 'ignored' should not be in bar.subModules
   */
  it('should drop imported module thats required directly somewhere else', async () => {
    const context = await getProductionContext({
      'bar.ts': `
        import { test } from './test';
        import { ignored } from './ignored';
        export default function() {};

        console.log(test);
      `,
      'foo.ts': `
        export function foo() {}
      `,
      'ignored.ts': `
        export const ignored = 'this module is being ignored';
      `,
      'index.ts': `
        import './foo';
        import { test } from './test';

        async function load() {
          const dynamicFunc = await import('./bar');
        }

        console.log(test);
      `,
      'test.ts': `
        export const test = 'test';
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(4);
    expect(entries).toHaveLength(1);

    const barModule = getSplitEntry('bar.ts', entries);
    expect(barModule.modules).toHaveLength(1);
    expect(barModule.modules[0].publicPath).toContain('src/bar.ts');
  });

  /**
   * In this test case we make sure we can have multiple
   * splitEntries and each entry has it's own isolated submodules
   */
  it('should have multiple splitEntries with submodules', async () => {
    const context = await getProductionContext({
      'bar.ts': `
        import './foo';
        export default function() {}
      `,
      'foo.ts': `
        export default function() {}
      `,
      'index.ts': `
        async function load() {
          const bar = await import('./bar');
          const oi = await import('./oi');
        }
      `,
      'oi.ts': `
        import './utils';
        export default function() {}
      `,
      'utils.ts': `
        export default function() {}
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(5);
    expect(entries).toHaveLength(2);

    const barModule = getSplitEntry('bar.ts', entries);
    expect(barModule.modules).toHaveLength(2);
    expect(barModule.modules[0].publicPath).toContain('src/bar.ts');
    expect(barModule.modules[1].publicPath).toContain('src/foo.ts');
    expect(barModule.references).toHaveLength(1);
    expect(barModule.references[0].module.publicPath).toContain('src/index.ts');

    const oiModule = getSplitEntry('oi.ts', entries);
    expect(oiModule.modules).toHaveLength(2);
    expect(oiModule.modules[0].publicPath).toContain('src/oi.ts');
    expect(oiModule.modules[1].publicPath).toContain('src/utils.ts');
    expect(oiModule.references).toHaveLength(1);
    expect(oiModule.references[0].module.publicPath).toContain('src/index.ts');
  });

  /**
   * This test case will test that a module required by a splitted module
   * but also required by a module outside of the split is being dropped
   * from the subModules of the splitEntry
   */
  it('should drop imported module thats required directly somewhere else', async () => {
    const context = await getProductionContext({
      'ai.ts': `
        export const ai = 'ai';
      `,
      'bar.ts': `
        import { oi } from './oi';
        console.log(oi);
        export default function() {};
      `,
      'foo.ts': `
        export default function() {};
      `,
      'index.ts': `
        import './foo';
        import { oi } from './oi';
        import { ai } from './ai';

        async function load() {
          const dynamicFunc = await import('./bar');
        }
        console.log(oi);
        console.log(ai);
      `,
      'oi.ts': `
        export const oi = 'oi!';
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(5);
    expect(entries).toHaveLength(1);

    const barModule = getSplitEntry('bar.ts', entries);
    expect(barModule.modules).toHaveLength(1);
    expect(barModule.modules[0].publicPath).toContain('src/bar.ts');
  });

  /**
   * Another test to test multiple split entries.
   */
  it('should have multiple splitEntries with submodules', async () => {
    const context = await getProductionContext({
      'bar.ts': `
        import './foo';
        export default function() {}
      `,
      'foo.ts': `
        async function load() {
          const oi = await import('./oi');
        }
        export default function() {}
      `,
      'index.ts': `
        async function load() {
          const bar = await import('./bar');
        }
      `,
      'oi.ts': `
        import './utils';
        export default function() {}
      `,
      'utils.ts': `
        export default function() {}
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(5);
    expect(entries).toHaveLength(2);

    const barModule = getSplitEntry('bar.ts', entries);
    expect(barModule.modules).toHaveLength(2);
    expect(barModule.modules[0].publicPath).toContain('src/bar.ts');
    expect(barModule.modules[1].publicPath).toContain('src/foo.ts');
    expect(barModule.references).toHaveLength(1);
    expect(barModule.references[0].module.publicPath).toContain('src/index.ts');

    const oiModule = getSplitEntry('oi.ts', entries);
    expect(oiModule.modules).toHaveLength(2);
    expect(oiModule.modules[0].publicPath).toContain('src/oi.ts');
    expect(oiModule.modules[1].publicPath).toContain('src/utils.ts');
    expect(oiModule.references).toHaveLength(1);
    expect(oiModule.references[0].module.publicPath).toContain('src/foo.ts');
  });

  /**
   * This is a test where we test that a dynamic imported module can ALSO
   * dynamically import modules and those will have their own splitEntry
   */
  it('should work with dynamic in dynamic in dynamic', async () => {
    const context = await getProductionContext({
      'bar.ts': `
        console.log('empty');
      `,
      'entry1.ts': `
        import('./one');
      `,
      'foo.ts': `
        import './bar';
      `,
      'index.ts': `
        import './entry1';
      `,
      'one.ts': `
        import './foo';
        import('./two');
      `,
      'three.ts': `
        import './utils';
      `,
      'two.ts': `
        import('./three');
        import './bar';
      `,
      'utils.ts': `
        console.log('empty');
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(8);
    expect(entries).toHaveLength(3);

    // we're not splitting commons atm
    const oneModule = getSplitEntry('one.ts', entries);
    expect(oneModule.entry.publicPath).toContain('src/one.ts');
    // expect(oneModule.modules).toHaveLength(3);
    expect(oneModule.modules).toHaveLength(2);

    const twoModule = getSplitEntry('two.ts', entries);
    expect(twoModule.entry.publicPath).toContain('src/two.ts');
    // expect(twoModule.modules).toHaveLength(2);
    expect(twoModule.modules).toHaveLength(1);

    const threeModule = getSplitEntry('three.ts', entries);
    expect(threeModule.entry.publicPath).toContain('src/three.ts');
    expect(threeModule.modules).toHaveLength(2);

    expect(modules[7].isCommonsEligible).toBe(false);
    // expect(modules[7].isCommonsEligible).toBe(true);
  });

  /**
   * If a module is required from within different splitEntries and not outside
   * of splittedModules it should be flagged as commons, so we can create
   * another isolated splitted module
   *
   * This feature is disabled until further notice
   */
  it('should NOT flag commons', async () => {
    const context = await getProductionContext({
      'bar.ts': `
        import './utils';
        import './foo';
        export default function() {}
      `,
      'foo.ts': `
        export default function() {}
      `,
      'index.ts': `
        import './foo';
        async function load() {
          await import('./bar');
          await import('./one');
        }
      `,
      'one.ts': `
        import './utils';
      `,
      'utils.ts': `
        console.log('empty');
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(5);
    expect(entries).toHaveLength(2);
    // utils.ts
    expect(modules[2].isCommonsEligible).toBe(false);
    // expect(modules[2].isCommonsEligible).toBe(true);
    // foo.ts
    expect(modules[4].isCommonsEligible).toBe(false);
  });

  /**
   * If there's an circular dependency, we prevent entering
   * a loop of death and prevent duplicate subModules
   */
  it('should detect circular dependency', async () => {
    const context = await getProductionContext({
      'a.ts': `
        import './b';
        export default function() {};
      `,
      'b.ts': `
        import './c';
      `,
      'c.ts': `
        import './b';
      `,
      'index.ts': `
        async function load() {
          const dynamicFunc = await import('./a');
        }
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(4);
    // we only have 1 split
    expect(entries).toHaveLength(1);
    // the split we have has 3 modules: a, b, c
    expect(getSplitEntry('a.ts', entries).modules).toHaveLength(3);
  });

  /**
   * This test is to ensure that a 'deep' circular dependency
   * is resolved too.
   */
  it('should detect deep circular dependency', async () => {
    const context = await getProductionContext({
      'a.ts': `
        import './b';
        export default function() {};
      `,
      'b.ts': `
        import './c';
      `,
      'c.ts': `
        import './d';
      `,
      'd.ts': `
        import './e';
      `,
      'e.ts': `
        import './f';
      `,
      'f.ts': `
        import './g';
      `,
      'g.ts': `
        import './b';
      `,
      'index.ts': `
        async function load() {
          const dynamicFunc = await import('./a');
        }
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(8);
    // we only have 1 split
    expect(entries).toHaveLength(1);
    // the split we have has 7 modules: a, b, c, d, e, f, g
    expect(getSplitEntry('a.ts', entries).modules).toHaveLength(7);
  });

  /**
   * Another dynamic in dynamic test
   */
  it('should detect dynamic in dynamic', async () => {
    const context = await getProductionContext({
      'entry1.ts': `
        import('./one');
      `,
      'index.ts': `
        import './entry1';
      `,
      'one.ts': `
        import('./two');
      `,
      'three.ts': `
        import './utils';
      `,
      'two.ts': `
        import('./three');
      `,
      'utils.ts': `
        console.log('emtpy');
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(6);
    expect(entries).toHaveLength(3);

    expect(getSplitEntry('one.ts', entries).modules).toHaveLength(1);
    expect(getSplitEntry('two.ts', entries).modules).toHaveLength(1);
    expect(getSplitEntry('three.ts', entries).modules).toHaveLength(2);
  });

  /**
   * A weird badly written code base shouldn't fail
   */
  it('should handle funky setups', async () => {
    const context = await getProductionContext({
      'entry1.ts': `
        import('./one');
        import('./two');
      `,
      'foo.ts': `
        import './utils';
      `,
      'index.ts': `
        import './entry1';
      `,
      'one.ts': `
        import './two';
        import './utils';
      `,
      'three.ts': `
        import './utils';
      `,
      'two.ts': `
        import './foo';
      `,
      'utils.ts': `
        console.log('emtpy');
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    // three.ts isn't required, so being dropped
    expect(modules).toHaveLength(6);
    // two is required normally, so shouldn't be a dynamic!
    expect(entries).toHaveLength(1);

    expect(getSplitEntry('one.ts', entries).modules).toHaveLength(1);
    expect(getSplitEntry('two.ts', entries)).toBe(undefined);
  });

  /**
   * We support all types of imports for modules in the splitEntry
   * With this test we ensure that that works ;)
   */
  it('should handle all type import types; require, import and export from', async () => {
    const context = await getProductionContext({
      'a.ts': `
        console.log('emtpy');
      `,
      'b.ts': `
        import './utils';
        export const b = 'b';
      `,
      'c.ts': `
        console.log('emtpy');
      `,
      'd.ts': `
        import './two';
        import './utils';
      `,
      'entry1.ts': `
        import { c } from './c';
        import('./d');
        const a = require('./a');
        export { b } from './b';

        console.log(c);
        console.log(a);

        export default function() {};
      `,
      'index.ts': `
        import a, { b } from './entry1';
        console.log(a, b);
      `,
      'two.ts': `
        console.log('emtpy');
      `,
      'utils.ts': `
        console.log('emtpy');
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    // three.ts isn't required, so being dropped
    expect(modules).toHaveLength(8);
    expect(entries).toHaveLength(1);

    expect(getSplitEntry('d.ts', entries).modules).toHaveLength(2);
  });

  /**
   * We support circular dependencies without erroring
   * We should also be able to support multiple circular dependencies
   */
  it('should handle multiple circular dependencies', async () => {
    const context = await getProductionContext({
      'a.ts': `
        import './b';
      `,
      'b.ts': `
        import './c';
      `,
      'c.ts': `
        import './b';
        import './d';
      `,
      'd.ts': `
        import './b';
      `,
      'index.ts': `
        import('./a');
      `,
    });
    const {
      modules,
      splitEntries: { entries },
    } = context;
    expect(modules).toHaveLength(5);
    expect(entries).toHaveLength(1);
    expect(getSplitEntry('a.ts', entries).modules).toHaveLength(4);
  });
});
