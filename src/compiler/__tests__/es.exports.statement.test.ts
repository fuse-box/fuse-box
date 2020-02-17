import { initCommonTransform } from '../testUtils';
import { ExportTransformer } from '../transformers/shared/ExportTransformer';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';

describe('Es exports statement integrity with interop', () => {
  const test = (props: { code: string }) => {
    return initCommonTransform({
      code: props.code,
      compilerOptions: {
        esModuleInterop: true,
        esModuleStatement: true,
      },
      transformers: [ImportTransformer(), ExportTransformer()],
    });
  };

  describe('__esModule', () => {
    it('Should not add (unused)', () => {
      const result = test({
        code: `
        import some from "some"
      `,
      });

      expect(result.code).not.toContain('exports.__esModule = true');
    });

    it('Should add only once', () => {
      const result = test({
        code: `
        import some from "some";
        console.log(some);
        export { some }
      `,
      });

      expect(result.code).toMatchInlineSnapshot(`
        "exports.__esModule = true;
        var some_1 = require(\\"some\\");
        var some_1d = __fuse.dt(some_1);
        console.log(some_1d.default);
        exports.some = some_1d.default;
        "
      `);
    });

    it('Should add with import (with interop)', () => {
      const result = test({
        code: `
        import some from "some"
        console.log(some);
      `,
      });
      expect(result.code).toContain('exports.__esModule = true');
    });

    it('should add exports.__esModule = true', () => {
      const result = test({
        code: `
        export default function (){}
      `,
      });
      expect(result.code).toContain('exports.__esModule = true');
    });

    it('should add with export {}', () => {
      const result = test({
        code: `
        const stuff = 1;
        export { stuff  };
      `,
      });
      expect(result.code).toContain('exports.__esModule = true');
    });

    it('should add with export var', () => {
      const result = test({
        code: `
        export var FooBar;
        (function (FooBar) {
        })(FooBar || (FooBar = {}));
      `,
      });
      expect(result.code).toContain('exports.__esModule = true');
    });

    it('should add with export star', () => {
      const result = test({
        code: `
        export * from "./foo"
      `,
      });
      expect(result.code).toContain('exports.__esModule = true');
    });
  });
});
