import { testTranspile } from '../transpilers/testTranspiler';
import { ImportType } from '../interfaces/ImportType';

describe('Require statement intercepto', () => {
  it('should emit require', () => {
    const result = testTranspile({
      code: `
      console.log(require("./a"))
    `,
    });

    expect(result.requireStatementCollection).toEqual([
      {
        importType: ImportType.REQUIRE,
        statement: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'require' },
          arguments: [{ type: 'Literal', value: './a' }],
          optional: false,
          shortCircuited: false,
          typeParameters: null,
        },
      },
    ]);
  });

  it('should emit only twice', () => {
    const result = testTranspile({
      code: `
      import hey from "./hey";
      console.log(require("./a"), hey)
    `,
    });
    expect(result.requireStatementCollection).toEqual([
      {
        importType: ImportType.REQUIRE,
        statement: {
          type: 'CallExpression',
          optional: false,
          shortCircuited: false,
          callee: { type: 'Identifier', name: 'require' },
          arguments: [{ type: 'Literal', value: './a' }],
          typeParameters: null,
        },
      },
      {
        importType: ImportType.FROM,
        statement: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'require' },
          arguments: [{ type: 'Literal', value: './hey' }],
        },
      },
    ]);
  });
});
