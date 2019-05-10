import { fastAnalysis } from '../fastAnalysis';
import { ImportType } from '../../resolver/resolver';

describe('Fast analysis test', () => {
  describe('require statements', () => {
    it('normal require statement', () => {
      const result = fastAnalysis({
        input: `
				require('foo.js');`,
      });

      expect(result.imports).toEqual([{ type: ImportType.REQUIRE, statement: 'foo.js' }]);
    });

    it('two require statements on one line', () => {
      const result = fastAnalysis({
        input: `
				require('foo.js'); require('moo.js');`,
      });
      expect(result.imports).toEqual([
        { type: ImportType.REQUIRE, statement: 'foo.js' },
        { type: ImportType.REQUIRE, statement: 'moo.js' },
      ]);
    });

    it('should not match somerequire()', () => {
      const result = fastAnalysis({
        input: `
					somerequire('foo.js');
				`,
      });
      expect(result.imports).toEqual([]);
    });

    it('should match in double quotes', () => {
      const result = fastAnalysis({
        input: `
				require("foo.js")
			`,
      });
      expect(result.imports).toEqual([{ type: ImportType.REQUIRE, statement: 'foo.js' }]);
    });

    it('should not match due a single line comment', () => {
      const result = fastAnalysis({
        input: `
				 // require("foo.js")
			`,
      });
      expect(result.imports).toEqual([]);
    });

    it('should not match due to multi line comment', () => {
      const result = fastAnalysis({
        input: `
				 /* require("foo.js") */
			`,
      });
      expect(result.imports).toEqual([]);
    });

    it('should match after a multi line comment', () => {
      const result = fastAnalysis({
        input: `
				 /* require("foo.js") */
				 require("bar.js")
			`,
      });
      expect(result.imports).toEqual([{ type: ImportType.REQUIRE, statement: 'bar.js' }]);
    });

    it('Should not match a require within a multiline block comment', () => {
      const result = fastAnalysis({
        input: `
				 /*
					 require("foo.js")
				 */
			`,
      });
      expect(result.imports).toEqual([]);
    });

    describe('Comments inside require statement', () => {
      it('left comment with space', () => {
        const result = fastAnalysis({
          input: `
						 require(/* comment */ "foo.js")
				`,
        });
        expect(result.imports).toEqual([{ type: ImportType.REQUIRE, statement: 'foo.js' }]);
      });
      it('left comment without space', () => {
        const result = fastAnalysis({
          input: `
						 require(/* comment */"foo.js")
				`,
        });
        expect(result.imports).toEqual([{ type: ImportType.REQUIRE, statement: 'foo.js' }]);
      });
      it('right comment with space', () => {
        const result = fastAnalysis({
          input: `
						 require("foo.js" /* comment */)
				`,
        });
        expect(result.imports).toEqual([{ type: ImportType.REQUIRE, statement: 'foo.js' }]);
      });
      it('right comment without space', () => {
        const result = fastAnalysis({
          input: `
						 require("foo.js"/* comment */)
				`,
        });
        expect(result.imports).toEqual([{ type: ImportType.REQUIRE, statement: 'foo.js' }]);
      });
    });

    it('Should not match a require that is a part of object', () => {
      const result = fastAnalysis({
        input: `
					 bar.require("foo.js")
			`,
      });
      expect(result.imports).toEqual([]);
    });

    it('Should match in a object', () => {
      const result = fastAnalysis({
        input: `
				{some:require("foo.js")}
			`,
      });
      expect(result.imports).toEqual([{ type: ImportType.REQUIRE, statement: 'foo.js' }]);
    });

    it('should match after a variable declaration', () => {
      const result = fastAnalysis({
        input: `
				var foo=require("foo.js")
			`,
      });
      expect(result.imports).toEqual([{ type: ImportType.REQUIRE, statement: 'foo.js' }]);
    });
  });

  describe('From statements', () => {
    it('Should match import from with double quotes', () => {
      const result = fastAnalysis({
        input: `
					import * as foo from "bar/mor";
			`,
      });
      expect(result.imports).toEqual([{ type: ImportType.FROM, statement: 'bar/mor' }]);
    });

    it('Should match export from with double quotes', () => {
      const result = fastAnalysis({
        input: `
					export { Foo } from "bar/mor";
			`,
      });
      expect(result.imports).toEqual([{ type: ImportType.FROM, statement: 'bar/mor' }]);
    });

    it('Should match export from with single quotes', () => {
      const result = fastAnalysis({
        input: `
					export { Foo } from 'bar/mor';
			`,
      });
      expect(result.imports).toEqual([{ type: ImportType.FROM, statement: 'bar/mor' }]);
    });

    it('Should not match due to a single line comment', () => {
      const result = fastAnalysis({
        input: `
					// export { Foo } from 'bar/mor';
			`,
      });
      expect(result.imports).toEqual([]);
    });

    it('should not match due to a multiline comment', () => {
      const result = fastAnalysis({
        input: `
					/* export { Foo } from 'bar/mor'; */
			`,
      });
      expect(result.imports).toEqual([]);
    });

    it('should not match due to a multiline comment (within)', () => {
      const result = fastAnalysis({
        input: `
					/*
						export { Foo } from 'bar/mor';
					*/
			`,
      });
      expect(result.imports).toEqual([]);
    });
  });

  describe('Dynamic statements', () => {
    it('normal require statement', () => {
      const result = fastAnalysis({
        input: `
				import('foo.js');`,
      });
      expect(result.imports).toEqual([{ type: ImportType.DYNAMIC, statement: 'foo.js' }]);
    });

    it('two import statements on one line', () => {
      const result = fastAnalysis({
        input: `
				import('foo.js'); import('moo.js');`,
      });
      expect(result.imports).toEqual([
        { type: ImportType.DYNAMIC, statement: 'foo.js' },
        { type: ImportType.DYNAMIC, statement: 'moo.js' },
      ]);
    });

    it('should not match someimport()', () => {
      const result = fastAnalysis({
        input: `
					someimport('foo.js');
				`,
      });
      expect(result.imports).toEqual([]);
    });

    it('should match in double quotes', () => {
      const result = fastAnalysis({
        input: `
				import("foo.js")
			`,
      });
      expect(result.imports).toEqual([{ type: ImportType.DYNAMIC, statement: 'foo.js' }]);
    });

    it('should not match due a single line comment', () => {
      const result = fastAnalysis({
        input: `
				 // import("foo.js")
			`,
      });
      expect(result.imports).toEqual([]);
    });

    it('should not match due to multi line comment', () => {
      const result = fastAnalysis({
        input: `
				 /* import("foo.js") */
			`,
      });
      expect(result.imports).toEqual([]);
    });

    it('should match after a multi line comment', () => {
      const result = fastAnalysis({
        input: `
				 /* import("foo.js") */
				 import("bar.js")
			`,
      });
      expect(result.imports).toEqual([{ type: ImportType.DYNAMIC, statement: 'bar.js' }]);
    });

    it('Should not match a import within a multiline block comment', () => {
      const result = fastAnalysis({
        input: `
				 /*
					 import("foo.js")
				 */
			`,
      });
      expect(result.imports).toEqual([]);
    });

    describe('Comments inside import statement', () => {
      it('left comment with space', () => {
        const result = fastAnalysis({
          input: `
						 import(/* comment */ "foo.js")
				`,
        });
        expect(result.imports).toEqual([{ type: ImportType.DYNAMIC, statement: 'foo.js' }]);
      });
      it('left comment without space', () => {
        const result = fastAnalysis({
          input: `
						 import(/* comment */"foo.js")
				`,
        });
        expect(result.imports).toEqual([{ type: ImportType.DYNAMIC, statement: 'foo.js' }]);
      });
      it('right comment with space', () => {
        const result = fastAnalysis({
          input: `
						 import("foo.js" /* comment */)
				`,
        });
        expect(result.imports).toEqual([{ type: ImportType.DYNAMIC, statement: 'foo.js' }]);
      });
      it('right comment without space', () => {
        const result = fastAnalysis({
          input: `
						 import("foo.js"/* comment */)
				`,
        });
        expect(result.imports).toEqual([{ type: ImportType.DYNAMIC, statement: 'foo.js' }]);
      });
    });

    it('Should not match a import that is a part of object', () => {
      const result = fastAnalysis({
        input: `
					 bar.import("foo.js")
			`,
      });
      expect(result.imports).toEqual([]);
    });

    it('Should match in a object', () => {
      const result = fastAnalysis({
        input: `
				{some:import("foo.js")}
			`,
      });
      expect(result.imports).toEqual([{ type: ImportType.DYNAMIC, statement: 'foo.js' }]);
    });

    it('should match after a variable declaration', () => {
      const result = fastAnalysis({
        input: `
				var foo=import("foo.js")
			`,
      });
      expect(result.imports).toEqual([{ type: ImportType.DYNAMIC, statement: 'foo.js' }]);
    });
  });

  describe('Report', () => {
    it('should give jsx', () => {
      const result = fastAnalysis({
        input: `
				 function(){ return <div></div>}
			`,
      });
      expect(result.report.containsJSX).toEqual(true);
    });

    it('should give not jsx', () => {
      const result = fastAnalysis({
        input: `
				 function(){ return '<div></div>'}
			`,
      });
      expect(result.report.containsJSX).toBeUndefined();
    });

    it('should give es6Syntax 1', () => {
      const result = fastAnalysis({
        input: `
				 import "foo"
			`,
      });
      expect(result.report.es6Syntax).toEqual(true);
    });

    it('should give es6Syntax 1', () => {
      const result = fastAnalysis({
        input: `export default function(){}`,
      });
      expect(result.report.es6Syntax).toEqual(true);
    });

    it('should give es6Syntax 2', () => {
      const result = fastAnalysis({
        input: `
        // some
        export default initCloneArray;
  `,
      });
      expect(result.report.es6Syntax).toEqual(true);
    });

    it('should give es6Syntax 2', () => {
      const result = fastAnalysis({
        input: `
        const events = require('events');
        function log(text) {
          console.info('color: #237abe');
        }
        export class SocketClient {
  `,
      });
      expect(result.report.es6Syntax).toEqual(true);
    });
  });
  describe('System variables', () => {
    describe('consistency', () => {
      const variables = ['stream', 'process', 'buffer', 'http', 'https'];
      const declarators = ['var', 'const', 'let'];
      variables.forEach(name => {
        it(`should match ${name}`, () => {
          const result = fastAnalysis({
            input: `
             console.log(${name})
          `,
          });
          expect(result.report.browserEssentials).toEqual([name]);
        });

        it(`should not match ${name} (is in string 1) `, () => {
          const result = fastAnalysis({
            input: `
             console.log('${name}')
          `,
          });
          expect(result.report.browserEssentials).toBeUndefined();
        });

        it(`should not match ${name} (is in string ") `, () => {
          const result = fastAnalysis({
            input: `
             console.log('${name}')
          `,
          });
          expect(result.report.browserEssentials).toBeUndefined();
        });
      });

      variables.forEach(name => {
        declarators.forEach(declarator => {
          it(`should not match ${declarator} ${name}`, () => {
            const result = fastAnalysis({
              input: `
               ${declarator} ${name} = {}
            `,
            });
            expect(result.report.browserEssentials).toEqual(undefined);
          });

          it(`should not match ${declarator} ${name} with further reference`, () => {
            const result = fastAnalysis({
              input: `
               ${declarator} ${name} = {}
               console.log( ${name} )
            `,
            });
            expect(result.report.browserEssentials).toEqual(undefined);
          });
        });
      });
    });
    it('should match process 1', () => {
      const result = fastAnalysis({
        input: `
				 console.log(process.env.NODE_ENV)
			`,
      });
      expect(result.report.browserEssentials).toEqual(['process']);
    });

    it('should match process in ()', () => {
      const result = fastAnalysis({
        input: `
        if (process.env.NODE_ENV === 'production') {

        }
			`,
      });
      expect(result.report.browserEssentials).toEqual(['process']);
    });

    it('should match process 2', () => {
      const result = fastAnalysis({
        input: `
				 console.log( process.env.NODE_ENV)
			`,
      });
      expect(result.report.browserEssentials).toEqual(['process']);
    });

    it('should match process 3', () => {
      const result = fastAnalysis({
        input: `
				 const a =process.env.NODE_ENV
			`,
      });
      expect(result.report.browserEssentials).toEqual(['process']);
    });

    it('should not match process 3', () => {
      const result = fastAnalysis({
        input: `
				 foo.process;
			`,
      });
      expect(result.report.browserEssentials).toEqual(undefined);
    });

    it('should not add 2 times', () => {
      const result = fastAnalysis({
        input: `
         process.env;
         process.version;
			`,
      });
      expect(result.report.browserEssentials).toEqual(['process']);
    });

    it('should match stream', () => {
      const result = fastAnalysis({
        input: `
				 console.log(stream)
			`,
      });
      expect(result.report.browserEssentials).toEqual(['stream']);
    });

    it('should match http', () => {
      const result = fastAnalysis({
        input: `
				 console.log(http)
			`,
      });
      expect(result.report.browserEssentials).toEqual(['http']);
    });

    it('should match http', () => {
      const result = fastAnalysis({
        input: `
				 console.log(Buffer)
			`,
      });
      expect(result.report.browserEssentials).toEqual(['buffer']);
    });

    it('should match __dirname', () => {
      const result = fastAnalysis({
        input: `
				 console.log(__dirname)
			`,
      });
      expect(result.report.contains__dirname).toEqual(true);
    });
    it('should match __filename', () => {
      const result = fastAnalysis({
        input: `
				 console.log(__filename)
			`,
      });

      expect(result.report.contains__filename).toEqual(true);
    });
  });
});
