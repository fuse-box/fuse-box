import { ImportType } from '../interfaces/ImportType';
import { initCommonTransform } from '../testUtils';
import { DynamicImportTransformer } from '../transformers/shared/DynamicImportTransformer';

describe('Dynamic import test', () => {
  const testTranspile = (props: { code: string; jsx?: boolean; emitDecoratorMetadata?: boolean }) => {
    return initCommonTransform({
      jsx: props.jsx,
      props: {
        ctx: { tsConfig: { compilerOptions: { emitDecoratorMetadata: props.emitDecoratorMetadata } } },
      },
      transformers: [DynamicImportTransformer()],
      code: props.code,
    });
  };

  it('should handle dynamic import', () => {
    const result = testTranspile({
      code: `
        async function hey() {
          console.log(1);
          await import('./hello');
          console.log(2);
        }
    `,
    });

    expect(result.code).toMatchInlineSnapshot(`
      "async function hey() {
        console.log(1);
        await Promise.resolve().then(() => require(\\"./hello\\"));
        console.log(2);
      }
      "
    `);

    const statements = [
      {
        importType: ImportType.DYNAMIC,
        statement: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'require' },
          arguments: [{ type: 'Literal', value: './hello' }],
        },
      },
    ];
    expect(result.requireStatementCollection).toEqual(statements);
  });
});
