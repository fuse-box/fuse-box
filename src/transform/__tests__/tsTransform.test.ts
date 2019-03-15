import { devImports } from '../../integrity/devPackage';
import { ImportType } from '../../resolver/resolver';
import { initTypescriptConfig } from '../../tsconfig/configParser';
import { tsTransform } from '../tsTransform';
import * as ts from 'typescript';
describe('Ts transform test', () => {
  let compilerOptions: ts.CompilerOptions;
  beforeAll(() => {
    const config = initTypescriptConfig({});
    compilerOptions = config.compilerOptions;
  });
  it('should not replace', () => {
    const result = tsTransform({
      compilerOptions,
      input: `
        require('./bar' + 'foo')
      `,
      replacements: [{ type: ImportType.REQUIRE, fromStatement: './bar', toStatement: './oi' }],
    });
    expect(result.outputText).toContain(`require('./bar' + 'foo')`);
  });

  it('should replace require', () => {
    const result = tsTransform({
      compilerOptions,
      input: `require('./bar')`,
      replacements: [{ type: ImportType.REQUIRE, fromStatement: './bar', toStatement: './oi' }],
    });
    expect(result.outputText).toContain('require("./oi")');
  });

  it('should replace import', () => {
    const result = tsTransform({
      compilerOptions,
      input: `import('./bar')`,
      replacements: [{ type: ImportType.REQUIRE, fromStatement: './bar', toStatement: './oi' }],
    });
    expect(result.outputText).toContain(`require("./oi")`);
  });

  it('should replace $fsmp$', () => {
    const result = tsTransform({
      compilerOptions,
      input: `${devImports.variable}('./bar')`,
      replacements: [{ type: ImportType.REQUIRE, fromStatement: './bar', toStatement: './oi' }],
    });
    expect(result.outputText).toContain(`${devImports.variable}("./oi")`);
  });

  it('should replace import', () => {
    const result = tsTransform({
      compilerOptions,
      input: `import './bar'`,
      replacements: [{ type: ImportType.REQUIRE, fromStatement: './bar', toStatement: './oi' }],
    });
    expect(result.outputText).toContain('require("./oi")');
  });

  it('should replace import * as ', () => {
    const result = tsTransform({
      compilerOptions,
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
      compilerOptions,
      input: `
        export { oi } from './bar'
        console.log(oi)
      `,
      replacements: [{ type: ImportType.REQUIRE, fromStatement: './bar', toStatement: './oi' }],
    });
    expect(result.outputText).toContain('var bar_1 = require("./oi")');
  });
});
