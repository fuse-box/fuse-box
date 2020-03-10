import { IProductionContext } from '../ProductionContext';
import { ImportType, IImport } from '../module/ImportReference';
import { WarmupPhase } from '../phases/WarmupPhase';
import { createTestEnvironment, ITestEnvironment } from './testUtils';

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

async function getReferences(code: string): Promise<Array<IImport>> {
  const context = await getProductionContext(code);
  return context.modules[0].moduleTree.importReferences.references;
}

describe('Phase 1 - Imports test', () => {
  // cleanup after each test
  afterEach(() => {
    if (environment) {
      environment.cleanup();
      environment = undefined;
    }
  });

  it(`sideEffectImport import './foo'`, async () => {
    const refs = await getReferences(`
      import './foo';
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source).toEqual('./foo');
    expect(refs[0].type).toEqual(ImportType.SIDE_EFFECT_IMPORT);
  });

  it(`sideEffectImport import './foo' should be removed`, async () => {
    const refs = await getReferences(`
      import './foo';
    `);
    expect(refs).toHaveLength(1);
    refs[0].remove();
    expect(refs[0].removed).toBe(true);
    refs.splice(0, 1);
    expect(refs).toHaveLength(0);
  });

  it(`regularImport import foo from './foo'`, async () => {
    const refs = await getReferences(`
      import foo from './foo';
      console.log(foo);
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(1);
    expect(refs[0].specifiers[0].local === 'foo');
    expect(refs[0].specifiers[0].name === 'default');
  });

  it(`regularImport import { foo, bar as baz } from './foo'`, async () => {
    const refs = await getReferences(`
      import { foo, bar as baz } from './foo';
      console.log(foo, baz);
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(2);
    expect(refs[0].specifiers[0].local === 'foo');
    expect(refs[0].specifiers[0].name === 'foo');
    expect(refs[0].specifiers[1].local === 'baz');
    expect(refs[0].specifiers[1].name === 'bar');
  });

  it(`regularImport import foo, { bar } from './foo'`, async () => {
    const refs = await getReferences(`
      import foo, { bar } from './foo';
      console.log(foo, bar);
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(2);
    expect(refs[0].specifiers[0].local === 'foo');
    expect(refs[0].specifiers[0].name === 'default');
    expect(refs[0].specifiers[1].local === 'bar');
    expect(refs[0].specifiers[1].name === 'bar');
  });

  it(`regularImport import * as bar from './foo'`, async () => {
    const refs = await getReferences(`
      import * as bar from './foo';
      console.log(bar);
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(1);
    expect(refs[0].specifiers[0].local === 'bar');
    expect(refs[0].specifiers[0].name === undefined);
  });

  it(`regularImport import { bar } from './bar' should be ignored`, async () => {
    const refs = await getReferences(`
      import { bar } from './bar';
    `);
    expect(refs).toHaveLength(0);
  });

  it(`regularRequire const foo = require('./foo')`, async () => {
    const refs = await getReferences(`
      const foo = require('./foo');
      console.log(foo);
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`sideEffectImportRequire import bar = require('./foo')`, async () => {
    const refs = await getReferences(`
      import bar = require('./foo');
      console.log(bar);
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`exportAllImport export * from './foo'`, async () => {
    const refs = await getReferences(`
      export * from './foo';
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`exportSpecifierImport export { default } from './foo'`, async () => {
    const refs = await getReferences(`
      export { default } from './foo';
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(1);
    expect(refs[0].specifiers[0].local === 'default');
    expect(refs[0].specifiers[0].name === 'default');
  });

  it(`exportSpecifierImport export { foo, bar as baz } from './foo'`, async () => {
    const refs = await getReferences(`
      export { foo, bar as baz } from './foo';
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(2);
    expect(refs[0].specifiers[0].local === 'foo');
    expect(refs[0].specifiers[0].name === 'foo');
    expect(refs[0].specifiers[0].local === 'baz');
    expect(refs[0].specifiers[0].name === 'bar');
  });

  it(`regularRequire require('./foo')`, async () => {
    const refs = await getReferences(`
      require('./foo');
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`regularRequire require() should be ignored`, async () => {
    const refs = await getReferences(`
      require();
    `);
    expect(refs).toHaveLength(0);
  });

  it(`regularRequire require(1) should be ignored`, async () => {
    const refs = await getReferences(`
      require(1);
    `);
    expect(refs).toHaveLength(0);
  });

  it(`regularRequire in scope async () => { require('./foo') }`, async () => {
    const refs = await getReferences(`
      function a() {
        require('./foo');
      }
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`dynamicImport with async await`, async () => {
    const refs = await getReferences(`
      async function foo(){
        await import('./foo');
      }
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`dynamicImport import(1) should be ignored`, async () => {
    const refs = await getReferences(`
      async function foo(){
        await import(1);
      }
    `);
    expect(refs).toHaveLength(0);
  });

  it(`dynamicImport () => import('./foo')`, async () => {
    const refs = await getReferences(`
      const foo = () => import('./foo');
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`dynamicImport const foo = import('./foo')`, async () => {
    const refs = await getReferences(`
      const foo = import('./foo');
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`dynamicImport const { foo } = import('./foo')`, async () => {
    const refs = await getReferences(`
      const { foo } = import('./foo');
    `);
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`dynamicImport const bar = import('./bar') should be ignored`, async () => {
    const refs = await getReferences(`
      const bar = import('./bar');
    `);
    expect(refs).toHaveLength(0);
  });
});

/**
 * @todo:
 *
 * These test should work in the future when we support computed import statements
 * So make sure to refactor these tests accordingly!
 */
describe('Phase 1 - Imports test - computed statements', () => {
  // cleanup after each test
  afterEach(async () => {
    if (environment) {
      environment.cleanup();
      environment = undefined;
    }
  });
  it(`regularRequire require('./foo' + b) should be ignored`, async () => {
    const refs = await getReferences(`
      const b = '/some-file.ts';
      require('./foo' + b);
    `);
    expect(refs).toHaveLength(0);
  });

  it(`regularRequire in scope async () => { require('./foo' + b) } should be ingored`, async () => {
    const refs = await getReferences(`
      const b = '/some-file.ts';
      function a() {
        require('./foo' + b);
      }
    `);
    expect(refs).toHaveLength(0);
  });

  it(`dynamicImport import('./foo' + b) should be ignored`, async () => {
    const refs = await getReferences(`
      async function foo(){
        const b = '/some-file.ts';
        await import('./foo' + b);
      }
    `);
    expect(refs).toHaveLength(0);
  });
});
