import * as ts from 'typescript';
import { devImports } from '../../integrity/devPackage';
import { ImportType } from '../../resolver/resolver';
import { initTypescriptConfig } from '../../tsconfig/configParser';
import { tsTransform } from '../tsTransform';
describe('Ts transform test', () => {
  let compilerOptions: ts.CompilerOptions;
  beforeAll(() => {
    const anyConf: any = {};
    const config = initTypescriptConfig(anyConf);
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

  it('should replace WebWorker', () => {
    const result = tsTransform({
      compilerOptions,
      input: `new Worker("./oi")`,
      webWorkers: [{ bundlePath: '/foo.js', path: './oi', type: 'Worker' }],
    });
    expect(result.outputText).toContain('new Worker("/foo.js");');
  });

  it('should replace SharedWorker', () => {
    const result = tsTransform({
      compilerOptions,
      input: `new SharedWorker("./oi")`,
      webWorkers: [{ bundlePath: '/foo.js', path: './oi', type: 'SharedWorker' }],
    });
    expect(result.outputText).toContain('new SharedWorker("/foo.js");');
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
