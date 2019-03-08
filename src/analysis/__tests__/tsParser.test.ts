import { createSourceFile, getImports } from '../tsParser';

describe('Fast analysis test', () => {
  describe('require statements', () => {
    it('normal require statement', () => {
      const result = getImports(createSourceFile('module.ts', `require('foo.js');`));
      expect(result.importDeclarations).toEqual(['foo.js']);
    });

    it('two require statements on one line', () => {
      const result = getImports(createSourceFile('module.ts', `require('foo.js'); require('moo.js');`));
      expect(result.importDeclarations).toEqual(['foo.js', 'moo.js']);
    });

    it('should not match somerequire()', () => {
      const result = getImports(createSourceFile('module.ts', `somerequire('foo.js');`));
      expect(result.importDeclarations).toEqual([]);
    });

    it('should match in double quotes', () => {
      const result = getImports(createSourceFile('module.ts', `require("foo.js")`));
      expect(result.importDeclarations).toEqual(['foo.js']);
    });

    it('should not match due a single line comment', () => {
      const result = getImports(createSourceFile('module.ts', `// require("foo.js")`));
      expect(result.importDeclarations).toEqual([]);
    });

    it('should not match due to multi line comment', () => {
      const result = getImports(createSourceFile('module.ts', `/* require("foo.js") */`));
      expect(result.importDeclarations).toEqual([]);
    });

    it('should match after a multi line comment', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `/* require("foo.js") */
				 		require("bar.js")`,
        ),
      );
      expect(result.importDeclarations).toEqual(['bar.js']);
    });

    it('Should not match a require within a multiline block comment', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `/*
						require("foo.js")
					 */`,
        ),
      );
      expect(result.importDeclarations).toEqual([]);
    });

    describe('Comments inside require statement', () => {
      it('left comment with space', () => {
        const result = getImports(createSourceFile('module.ts', `require(/* comment */ "foo.js")`));
        expect(result.importDeclarations).toEqual(['foo.js']);
      });
      it('left comment without space', () => {
        const result = getImports(createSourceFile('module.ts', `require(/* comment */"foo.js")`));
        expect(result.importDeclarations).toEqual(['foo.js']);
      });
      it('right comment with space', () => {
        const result = getImports(
          createSourceFile(
            'module.ts',
            `
						 require("foo.js" /* comment */)
				`,
          ),
        );
        expect(result.importDeclarations).toEqual(['foo.js']);
      });
      it('right comment without space', () => {
        const result = getImports(
          createSourceFile(
            'module.ts',
            `
						 require("foo.js"/* comment */)
				`,
          ),
        );
        expect(result.importDeclarations).toEqual(['foo.js']);
      });
    });

    it('Should not match a require that is a part of object', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
					 bar.require("foo.js")
			`,
        ),
      );
      expect(result.importDeclarations).toEqual([]);
    });

    it('Should match in a object', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
				{some:require("foo.js")}
			`,
        ),
      );
      expect(result.importDeclarations).toEqual(['foo.js']);
    });

    it('should match after a variable declaration', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
				var foo=require("foo.js")
			`,
        ),
      );
      expect(result.importDeclarations).toEqual(['foo.js']);
    });
  });

  describe('From statements', () => {
    it('Should match import from with double quotes', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
					import * as foo from "bar/mor";
			`,
        ),
      );
      expect(result.importDeclarations).toEqual(['bar/mor']);
    });

    it('Should match export from with double quotes', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
					export { Foo } from "bar/mor";
			`,
        ),
      );
      expect(result.reExportDeclarations).toEqual(['bar/mor']);
    });

    it('Should match export from with single quotes', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
					export { Foo } from 'bar/mor';
			`,
        ),
      );
      expect(result.reExportDeclarations).toEqual(['bar/mor']);
    });

    it('Should not match due to a single line comment', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
					// export { Foo } from 'bar/mor';
			`,
        ),
      );
      expect(result.reExportDeclarations).toEqual([]);
    });

    it('should not match due to a multiline comment', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
					/* export { Foo } from 'bar/mor'; */
			`,
        ),
      );
      expect(result.reExportDeclarations).toEqual([]);
    });

    it('should not match due to a multiline comment (within)', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
					/*
						export { Foo } from 'bar/mor';
					*/
			`,
        ),
      );
      expect(result.reExportDeclarations).toEqual([]);
    });
  });

  describe('Dynamic statements', () => {
    it('normal require statement', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
				import('foo.js');`,
        ),
      );
      expect(result.dynamicImports).toEqual(['foo.js']);
    });

    it('two import statements on one line', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
				import('foo.js'); import('moo.js');`,
        ),
      );
      expect(result.dynamicImports).toEqual(['foo.js', 'moo.js']);
    });

    it('should not match someimport()', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
					someimport('foo.js');
				`,
        ),
      );
      expect(result.dynamicImports).toEqual([]);
    });

    it('should match in double quotes', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
				import("foo.js")
			`,
        ),
      );
      expect(result.dynamicImports).toEqual(['foo.js']);
    });

    it('should not match due a single line comment', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
				 // import("foo.js")
			`,
        ),
      );
      expect(result.dynamicImports).toEqual([]);
    });

    it('should not match due to multi line comment', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
				 /* import("foo.js") */
			`,
        ),
      );
      expect(result.dynamicImports).toEqual([]);
    });

    it('should match after a multi line comment', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
				 /* import("foo.js") */
				 import("bar.js")
			`,
        ),
      );
      expect(result.dynamicImports).toEqual(['bar.js']);
    });

    it('Should not match a import within a multiline block comment', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
				 /*
					 import("foo.js")
				 */
			`,
        ),
      );
      expect(result.dynamicImports).toEqual([]);
    });

    describe('Comments inside import statement', () => {
      it('left comment with space', () => {
        const result = getImports(
          createSourceFile(
            'module.ts',
            `
						 import(/* comment */ "foo.js")
				`,
          ),
        );
        expect(result.dynamicImports).toEqual(['foo.js']);
      });
      it('left comment without space', () => {
        const result = getImports(
          createSourceFile(
            'module.ts',
            `
						 import(/* comment */"foo.js")
				`,
          ),
        );
        expect(result.dynamicImports).toEqual(['foo.js']);
      });
      it('right comment with space', () => {
        const result = getImports(
          createSourceFile(
            'module.ts',
            `
						 import("foo.js" /* comment */)
				`,
          ),
        );
        expect(result.dynamicImports).toEqual(['foo.js']);
      });
      it('right comment without space', () => {
        const result = getImports(
          createSourceFile(
            'module.ts',
            `
						 import("foo.js"/* comment */)
				`,
          ),
        );
        expect(result.dynamicImports).toEqual(['foo.js']);
      });
    });

    it('Should not match a import that is a part of object', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
					 bar.import("foo.js")
			`,
        ),
      );
      expect(result.dynamicImports).toEqual([]);
    });

    it('Should match in a object', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
				{some:import("foo.js")}
			`,
        ),
      );
      expect(result.dynamicImports).toEqual(['foo.js']);
    });

    it('should match after a variable declaration', () => {
      const result = getImports(
        createSourceFile(
          'module.ts',
          `
				var foo=import("foo.js")
			`,
        ),
      );
      expect(result.dynamicImports).toEqual(['foo.js']);
    });
  });
});
