import { ImportType } from '../interfaces/ImportType';
import { testTranspile } from '../transpilers/testTranpiler';

describe('Dynamic improt test', () => {
  it('should ', () => {
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
