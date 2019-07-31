import { Project } from 'ts-morph';
import { createESModuleStructure } from '../ESModuleStructure';
import { testUtils } from '../../../utils/test_utils';

testUtils();
function createStructure(contents: string) {
  const project = new Project();
  const file = project.createSourceFile('src/MyClass.tsx', contents);
  return createESModuleStructure(null, file).toJSON();
}

describe('ESModuleStructure test', () => {
  describe('imports', () => {
    it('import {foo}', () => {
      const json = createStructure('import {foo} from "hello"');
      expect(json).toMatchJSONSnapshot();
    });

    it('import {foo as oi}', () => {
      const json = createStructure('import {foo as oi} from "hello"');
      expect(json).toMatchJSONSnapshot();
    });

    it('import foo', () => {
      const json = createStructure('import foo from "hello"');
      expect(json).toMatchJSONSnapshot();
    });
  });

  describe('exports', () => {
    it('should export 1', () => {
      const json = createStructure('export {foo} from "./bar"');
      expect(json).toMatchJSONSnapshot();
    });

    it('should export 2', () => {
      const json = createStructure('export {foo as oi} from "./bar"');
      expect(json).toMatchJSONSnapshot();
    });

    it('should export function', () => {
      const json = createStructure(`
        function foo(){}
        export {foo}
      `);
      expect(json).toMatchJSONSnapshot();
    });

    it('should export class', () => {
      const json = createStructure(`
        class Foo {}
        export {Foo}
      `);
      expect(json).toMatchJSONSnapshot();
    });

    it('should export function directly 2', () => {
      const json = createStructure(`
        export function foo (){}
      `);

      expect(json).toMatchJSONSnapshot();
    });

    it('should export default function directly 1', () => {
      const json = createStructure(`
        export default function (){}
      `);

      expect(json).toMatchJSONSnapshot();
    });

    it('should export default function directly 2', () => {
      const json = createStructure(`
        export default function foo (){}
      `);

      expect(json).toMatchJSONSnapshot();
    });

    it('should export many', () => {
      const json = createStructure(`
      export { foo as some, bar as moo } from "foo"
    `);
      expect(json).toMatchJSONSnapshot();
    });

    it('should export obj literal expression', () => {
      const json = createStructure(`
      export default { foo }
    `);
      expect(json).toMatchJSONSnapshot();
    });

    it('should export obj default as object', () => {
      const json = createStructure(`
      export { default } from "./oi"
    `);
      expect(json).toMatchJSONSnapshot();
    });
  });
});
