import { tsTransform } from '../tsTransform';
import { ImportType } from '../../resolver/resolver';
import { devImports } from '../../integrity/devPackage';

describe('Ts transform test', () => {
  it('should replace require', () => {
    const result = tsTransform({
      input: `require('./bar')`,
      replacements: [{ type: ImportType.REQUIRE, fromStatement: './bar', toStatement: './oi' }],
    });
    expect(result.outputText).toContain('require("./oi")');
  });

  it.only('should replace $fsmp$', () => {
    const result = tsTransform({
      input: `${devImports.variable}('./bar')`,
      replacements: [{ type: ImportType.REQUIRE, fromStatement: './bar', toStatement: './oi' }],
    });
    expect(result.outputText).toContain(`${devImports.variable}("./oi")`);
  });

  it('should replace import', () => {
    const result = tsTransform({
      input: `import './bar'`,
      replacements: [{ type: ImportType.REQUIRE, fromStatement: './bar', toStatement: './oi' }],
    });
    expect(result.outputText).toContain('require("./oi")');
  });

  it('should replace import * as ', () => {
    const result = tsTransform({
      input: `
        import * as oi from './bar'
        console.log(oi)
      `,
      replacements: [{ type: ImportType.REQUIRE, fromStatement: './bar', toStatement: './oi' }],
    });
    expect(result.outputText).toContain('const oi = require("./oi")');
  });

  it('should replace export * from ', () => {
    const result = tsTransform({
      input: `
        export { oi } from './bar'
        console.log(oi)
      `,
      replacements: [{ type: ImportType.REQUIRE, fromStatement: './bar', toStatement: './oi' }],
    });
    expect(result.outputText).toContain('var bar_1 = require("./oi")');
  });
});
