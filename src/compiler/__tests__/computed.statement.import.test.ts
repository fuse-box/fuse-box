import { computedStatementToPath, expressionValueTypes } from '../helpers/importHelpers';
import { ASTNode } from '../interfaces/AST';
import { parseTypeScript } from '../parser';

function getAst(expression: string): ASTNode {
  const ast = parseTypeScript(expression);
  return ast.body[0]['expression'];
}

describe('Computed statements in imports', () => {
  it(`import('./atoms/' + a) should return a valid pattern`, () => {
    // Tests the case:
    // import('./atoms/' + b);
    const { paths } = computedStatementToPath(getAst(`'./atoms/' + a`));
    expect(paths).toEqual(['./atoms/', expressionValueTypes.SINGLE_ASTERISK]);
  });

  it(`import('./atoms/' + b + '/' + c) should return a valid pattern`, () => {
    // Tests the case:
    // import('./atoms/' + b + '/' + c);
    const { paths } = computedStatementToPath(getAst(`'./atoms/' + b + '/' + c`));
    expect(paths).toEqual([
      './atoms/',
      expressionValueTypes.DOUBLE_ASTERISK,
      '/',
      expressionValueTypes.SINGLE_ASTERISK,
    ]);
  });

  it(`import(b + '/' + c) should fail and return an error object`, () => {
    // Tests the case:
    // import(b + '/' + c);
    const { error } = computedStatementToPath(getAst(`b + '/' + c`));
    expect(error).toEqual(`You're computed import needs to start with a string! i.e. './'`);
  });

  it('import(`./atoms/${a}`) should return a valid pattern', () => {
    // Tests the case:
    // import(`./atoms/${a}`);
    const { paths } = computedStatementToPath(getAst('`./atoms/${a}`'));
    expect(paths).toEqual(['./atoms/', expressionValueTypes.SINGLE_ASTERISK]);
  });

  it('import(`./atoms/${b}/${c}`) should return a valid pattern', () => {
    // Tests the case:
    // import(`./atoms/${b}/${c}`);
    const { paths } = computedStatementToPath(getAst('`./atoms/${b}/${c}`'));
    expect(paths).toEqual([
      './atoms/',
      expressionValueTypes.DOUBLE_ASTERISK,
      '/',
      expressionValueTypes.SINGLE_ASTERISK,
    ]);
  });

  it('import(`./atoms/${b}${c}`) should return a valid pattern', () => {
    // Tests the case:
    // import(`./atoms/${b}${c}`);
    const { paths } = computedStatementToPath(getAst('`./atoms/${b}${c}`'));
    expect(paths).toEqual(['./atoms/', expressionValueTypes.SINGLE_ASTERISK]);
  });

  it('import(`./atoms/${b}${c}/${d}`) should return a valid pattern', () => {
    // Tests the case:
    // import(`./atoms/${b}${c}`);
    const { paths } = computedStatementToPath(getAst('`./atoms/${b}${c}/${d}`'));
    expect(paths).toEqual([
      './atoms/',
      expressionValueTypes.DOUBLE_ASTERISK,
      '/',
      expressionValueTypes.SINGLE_ASTERISK,
    ]);
  });

  it("import(`./atoms/${b + '/' + c}`) should return a valid pattern", () => {
    // Tests the case:
    // import(`./atoms/${b + '/' + c}`);
    const { paths } = computedStatementToPath(getAst("`./atoms/${b + '/' + c}`"));
    expect(paths).toEqual([
      './atoms/',
      expressionValueTypes.DOUBLE_ASTERISK,
      '/',
      expressionValueTypes.SINGLE_ASTERISK,
    ]);
  });

  it("import(`./atoms/${b + '/' + c}`) should return a valid pattern", () => {
    // Tests the case:
    // import(`./atoms/${b + '/' + c}`);
    const { paths } = computedStatementToPath(getAst("`./atoms/${b + '/' + c}`"));
    expect(paths).toEqual([
      './atoms/',
      expressionValueTypes.DOUBLE_ASTERISK,
      '/',
      expressionValueTypes.SINGLE_ASTERISK,
    ]);
  });

  it(`import('./assets/' + var + '.svg');  should return a valid pattern`, () => {
    // Tests the case:
    // import('./assets/' + var + '.svg');
    const { paths } = computedStatementToPath(getAst(`'./assets/' + a + '.svg'`));
    expect(paths).toEqual(['./assets/', expressionValueTypes.DOUBLE_ASTERISK, '.svg']);
  });

  it(`import('./' + path + (() => 'test')); should return an error object`, () => {
    // Tests the case:
    // import('./' + path + (() => 'test'));
    const { error } = computedStatementToPath(getAst(`'./' + path + (() => 'test')`));
    expect(error).toEqual(`Unsupported type provided to computed statement import`);
  });

  it(`import('./a' + func()); should return an error object`, () => {
    // Tests the case:
    // import('./' + path + (() => 'test'));
    const { error } = computedStatementToPath(getAst(`'./a' + func()`));
    expect(error).toEqual(`Unsupported type provided to computed statement import`);
  });

  it('import(`./a/${func()}`); should return an error object', () => {
    // Tests the case:
    // import('./' + path + (() => 'test'));
    const { error } = computedStatementToPath(getAst('`./a/${func()}`'));
    expect(error).toEqual(`Unsupported type provided to computed statement import`);
  });

  it('const b = `b`; should return an error object', () => {
    // Tests the case:
    // Complete different AST
    const { error } = computedStatementToPath({
      kind: 'const',
      type: 'VariableDeclaration',
    });
    expect(error).toEqual(`Unsupported root node provided`);
  });
});
