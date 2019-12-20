import { testProductionWarmup } from '../testUtils';
import { Phase_1_ImportLink } from '../Phase_1_ImportLink';

describe('Phase 1 Import link test', () => {
  function test(code: string) {
    return testProductionWarmup({ code, transformers: [Phase_1_ImportLink()] });
  }
  it('should work', () => {
    const { tree } = test(`import "./foo"`);

    // @todo: type? SIDE_EFFECT_IMPORT
  });

  it('Import Equals declaration', () => {
    const { tree } = test(`import _ = require('foo');`);

    // @todo: type? SIDE_EFFECT_IMPORT
  });

  it('Require statement', () => {
    const { tree } = test(`const a = require("foo")`);

    // @todo: type? SIDE_EFFECT_IMPORT
  });

  it('Dynamic statement', () => {
    const { tree } = test(`
      async function foo(){
        await import("./bar_1")
        await import("./bar_2")
      }
    `);

    // @todo: type? DYNAMIC_IMPORT
  });

  it('import all as', () => {
    const { tree } = test(`
        import * as foo from "foo"
        console.log(foo.hello, foo.oi)
    `);

    // @todo: type? IMPORT, importAllName : 'foo', refs : [{ name : 'hello' }, { name : 'oi' }],
    // could it be unsafe: true ?
  });

  it('import default', () => {
    const { tree } = test(`import foo from "foo"`);

    // @todo: type? IMPORT, refs : [{ name : 'default' }],
  });

  it('import {} without alias', () => {
    const { tree } = test(`import { foo, bar } from "foo"`);

    // @todo: type? IMPORT, refs : [{ name :'foo' }, { name : 'bar' }],
  });

  it('import {} with alias', () => {
    const { tree } = test(`import { foo, bar as stuff } from "./foo";`);

    // @todo: type? IMPORT, refs : [{name : 'foo}, {name : 'bar', local : 'stuff'}],
  });

  it('import default, {} with alias', () => {
    const { tree } = test(`import a, { b as c } from "foo";`);

    // @todo: type? IMPORT, refs : [{ name : 'default', local : 'a' }, {name : 'foo}, {name : 'bar', local : 'stuff'}],
  });

  it('should export {} from', () => {
    const { tree } = test(`export { foo } from "./foo"`);
    // here the tree should contain import and export. But we'are to test "from" only
    // @todo: type? RE_EXPORT, refs : [{ name : 'foo' }],
  });

  it('should export {} with alias', () => {
    const { tree } = test(`export { oi, name as hey } from "./foo" `);

    // @todo: type? RE_EXPORT, refs : [{ name : 'oi', {name : "name", local : "hey"} }],
  });

  it('should export default', () => {
    const { tree } = test(`export { default } from "./foo" `);

    // @todo: type? RE_EXPORT, refs : [{ name : 'default' } }],
  });

  it('should export all', () => {
    const { tree } = test(`export * from "./foo"`);

    // @todo: type? RE_EXPORT_ALL }],
  });
});
