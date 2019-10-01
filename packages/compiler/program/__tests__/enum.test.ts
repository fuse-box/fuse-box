import { compileModule } from '../compileModule';

describe('Enums test', () => {
  it('should work with a simple enum', () => {
    const result = compileModule({
      code: `
        enum Stuff {
          first,
          second,
        }
    `,
    });
    expect(result.code).toMatchInlineSnapshot(`
      "var Stuff;
      (function (Stuff) {
        Stuff[Stuff[\\"first\\"] = 0] = \\"first\\"
        Stuff[Stuff[\\"second\\"] = 0] = \\"second\\"
      })(Stuff || (Stuff = {}))
      "
    `);
  });
});
