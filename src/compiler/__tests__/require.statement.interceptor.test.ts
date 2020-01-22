import { ImportType } from '../interfaces/ImportType';
import { initCommonTransform } from '../testUtils';
import { RequireStatementInterceptor } from '../transformers/bundle/RequireStatementInterceptor';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';

const testTranspile = (props: { code: string; fileName?: string; target?: string }) => {
  return initCommonTransform({
    code: props.code,
    transformers: [RequireStatementInterceptor(), ImportTransformer()],
  });
};

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
          arguments: [{ type: 'Literal', value: './a' }],
          callee: { name: 'require', type: 'Identifier' },
          optional: false,
          type: 'CallExpression',
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
          optional: false,
          type: 'CallExpression',

          arguments: [{ type: 'Literal', value: './a' }],
          callee: { name: 'require', type: 'Identifier' },
        },
      },
      {
        importType: ImportType.FROM,
        statement: {
          arguments: [{ type: 'Literal', value: './hey' }],
          callee: { name: 'require', type: 'Identifier' },
          type: 'CallExpression',
        },
      },
    ]);
  });
});
