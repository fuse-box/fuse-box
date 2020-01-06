import { ImportReferenceType } from '../../module/ImportReference';
import { Phase_1_ImportLink } from '../Phase_1_ImportLink';
import { testProductionWarmup } from '../testUtils';

function test(code: string) {
  return testProductionWarmup({
    code,
    transformers: [Phase_1_ImportLink()],
    moduleProps: {
      moduleSourceRefs: {
        './foo': {
          some: 'value'
        }
      }
    }
  });
}

describe('Phase 1 - Imports test', () => {
  it(`sideEffectImport import './foo'`, () => {
    const { tree } = test(`
      import './foo';
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(1);
    expect(refs[0].source).toEqual('./foo');
    expect(refs[0].type).toEqual(ImportReferenceType.SIDE_EFFECT_IMPORT);
  });

  it(`sideEffectImport import './foo' should be removed`, () => {
    const { tree } = test(`
      import './foo';
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(1);
    refs[0].remove();
    expect(refs[0].removed).toBe(true);
    refs.splice(0, 1);
    expect(refs).toHaveLength(0);
  });

  it(`regularImport import foo from './foo'`, () => {
    const { tree } = test(`
      import foo from './foo';
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(1);
    expect(refs[0].specifiers[0].local === 'foo');
    expect(refs[0].specifiers[0].name === 'default');
  });


  it(`regularImport import { foo, bar as baz } from './foo'`, () => {
    const { tree } = test(`
      import { foo, bar as baz } from './foo';
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(2);
    expect(refs[0].specifiers[0].local === 'foo');
    expect(refs[0].specifiers[0].name === 'foo');
    expect(refs[0].specifiers[1].local === 'baz');
    expect(refs[0].specifiers[1].name === 'bar');
  });

  it(`regularImport import foo, { bar } from './foo'`, () => {
    const { tree } = test(`
      import foo, { bar } from './foo';
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(2);
    expect(refs[0].specifiers[0].local === 'foo');
    expect(refs[0].specifiers[0].name === 'default');
    expect(refs[0].specifiers[1].local === 'bar');
    expect(refs[0].specifiers[1].name === 'bar');
  });

  it(`regularImport import * as bar from './foo'`, () => {
    const { tree } = test(`
      import * as bar from './foo';
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(1);
    expect(refs[0].specifiers[0].local === 'bar');
    expect(refs[0].specifiers[0].name === 'default');
  });

  it(`regularImport import { bar } from './bar' should be ignored`, () => {
    const { tree } = test(`
      import { bar } from './bar';
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(0);
  });

  it(`regularRequire const foo = require('./foo')`, () => {
    const { tree } = test(`
      const foo = require('./foo');
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`sideEffectImportRequire import bar = require('./foo')`, () => {
    const { tree } = test(`
      import bar = require('./foo');
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`exportAllImport export * from './foo'`, () => {
    const { tree } = test(`
      export * from './foo';
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`exportSpecifierImport export { default } from './foo'`, () => {
    const { tree } = test(`
      export { default } from './foo';
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(1);
    expect(refs[0].specifiers[0].local === 'default');
    expect(refs[0].specifiers[0].name === 'default');
  });

  it(`exportSpecifierImport export { foo, bar as baz } from './foo'`, () => {
    const { tree } = test(`
      export { foo, bar as baz } from './foo';
    `);
    const refs = tree.importReferences.references;

    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
    expect(refs[0].specifiers).toHaveLength(2);
    expect(refs[0].specifiers[0].local === 'foo');
    expect(refs[0].specifiers[0].name === 'foo');
    expect(refs[0].specifiers[0].local === 'baz');
    expect(refs[0].specifiers[0].name === 'bar');
  });

  it(`regularRequire require('./foo')`, () => {
    const { tree } = test(`
      require('./foo');
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`regularRequire require() should be ignored`, () => {
    const { tree } = test(`
      require();
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(0);
  });

  it(`regularRequire require(1) should be ignored`, () => {
    const { tree } = test(`
      require(1);
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(0);
  });

  it(`regularRequire in scope () => { require('./foo') }`, () => {
    const { tree } = test(`
      function a() {
        require('./foo');
      }
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`dynamicImport with async await`, () => {
    const { tree } = test(`
      async function foo(){
        await import('./foo');
      }
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`dynamicImport import(1) should be ignored`, () => {
    const { tree } = test(`
      async function foo(){
        await import(1);
      }
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(0);
  });

  it(`dynamicImport () => import('./foo')`, () => {
    const { tree } = test(`
      const foo = () => import('./foo');
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`dynamicImport const foo = import('./foo')`, () => {
    const { tree } = test(`
      const foo = import('./foo');
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`dynamicImport const { foo } = import('./foo')`, () => {
    const { tree } = test(`
      const { foo } = import('./foo');
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(1);
    expect(refs[0].source === './foo');
  });

  it(`dynamicImport const bar = import('./bar') should be ignored`, () => {
    const { tree } = test(`
      const bar = import('./bar');
    `);
    const refs = tree.importReferences.references;
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
  it(`regularRequire require('./foo' + b) should be ignored`, () => {
    const { tree } = test(`
      const b = '/some-file.ts';
      require('./foo' + b);
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(0);
  });

  it(`regularRequire in scope () => { require('./foo' + b) } should be ingored`, () => {
    const { tree } = test(`
      const b = '/some-file.ts';
      function a() {
        require('./foo' + b);
      }
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(0);
  });

  it(`dynamicImport import('./foo' + b) should be ignored`, () => {
    const { tree } = test(`
      async function foo(){
        const b = '/some-file.ts';
        await import('./foo' + b);
      }
    `);
    const refs = tree.importReferences.references;
    expect(refs).toHaveLength(0);
  });
});
