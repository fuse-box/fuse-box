import { fastAnalysis } from "../fastAnalysis";

describe("Fast analysis test", () => {
	describe("require statements", () => {
		it("normal require statement", () => {
			const result = fastAnalysis({
				input: `
				require('foo.js');`,
			});
			expect(result.imports.requireStatements).toEqual(["foo.js"]);
		});

		it("two require statements on one line", () => {
			const result = fastAnalysis({
				input: `
				require('foo.js'); require('moo.js');`,
			});
			expect(result.imports.requireStatements).toEqual(["foo.js", "moo.js"]);
		});

		it("should not match somerequire()", () => {
			const result = fastAnalysis({
				input: `
					somerequire('foo.js');
				`,
			});
			expect(result.imports.requireStatements).toEqual([]);
		});

		it("should match in double quotes", () => {
			const result = fastAnalysis({
				input: `
				require("foo.js")
			`,
			});
			expect(result.imports.requireStatements).toEqual(["foo.js"]);
		});

		it("should not match due a single line comment", () => {
			const result = fastAnalysis({
				input: `
				 // require("foo.js")
			`,
			});
			expect(result.imports.requireStatements).toEqual([]);
		});

		it("should not match due to multi line comment", () => {
			const result = fastAnalysis({
				input: `
				 /* require("foo.js") */
			`,
			});
			expect(result.imports.requireStatements).toEqual([]);
		});

		it("should match after a multi line comment", () => {
			const result = fastAnalysis({
				input: `
				 /* require("foo.js") */
				 require("bar.js")
			`,
			});
			expect(result.imports.requireStatements).toEqual(["bar.js"]);
		});

		it("Should not match a require within a multiline block comment", () => {
			const result = fastAnalysis({
				input: `
				 /*
					 require("foo.js")
				 */
			`,
			});
			expect(result.imports.requireStatements).toEqual([]);
		});

		describe("Comments inside require statement", () => {
			it("left comment with space", () => {
				const result = fastAnalysis({
					input: `
						 require(/* comment */ "foo.js")
				`,
				});
				expect(result.imports.requireStatements).toEqual(["foo.js"]);
			});
			it("left comment without space", () => {
				const result = fastAnalysis({
					input: `
						 require(/* comment */"foo.js")
				`,
				});
				expect(result.imports.requireStatements).toEqual(["foo.js"]);
			});
			it("right comment with space", () => {
				const result = fastAnalysis({
					input: `
						 require("foo.js" /* comment */)
				`,
				});
				expect(result.imports.requireStatements).toEqual(["foo.js"]);
			});
			it("right comment without space", () => {
				const result = fastAnalysis({
					input: `
						 require("foo.js"/* comment */)
				`,
				});
				expect(result.imports.requireStatements).toEqual(["foo.js"]);
			});
		});

		it("Should not match a require that is a part of object", () => {
			const result = fastAnalysis({
				input: `
					 bar.require("foo.js")
			`,
			});
			expect(result.imports.requireStatements).toEqual([]);
		});

		it("Should match in a object", () => {
			const result = fastAnalysis({
				input: `
				{some:require("foo.js")}
			`,
			});
			expect(result.imports.requireStatements).toEqual(["foo.js"]);
		});

		it("should match after a variable declaration", () => {
			const result = fastAnalysis({
				input: `
				var foo=require("foo.js")
			`,
			});
			expect(result.imports.requireStatements).toEqual(["foo.js"]);
		});
	});

	describe("From statements", () => {
		it("Should match import from with double quotes", () => {
			const result = fastAnalysis({
				input: `
					import * as foo from "bar/mor";
			`,
			});
			expect(result.imports.fromStatements).toEqual(["bar/mor"]);
		});

		it("Should match export from with double quotes", () => {
			const result = fastAnalysis({
				input: `
					export { Foo } from "bar/mor";
			`,
			});
			expect(result.imports.fromStatements).toEqual(["bar/mor"]);
		});

		it("Should match export from with single quotes", () => {
			const result = fastAnalysis({
				input: `
					export { Foo } from 'bar/mor';
			`,
			});
			expect(result.imports.fromStatements).toEqual(["bar/mor"]);
		});

		it("Should not match due to a single line comment", () => {
			const result = fastAnalysis({
				input: `
					// export { Foo } from 'bar/mor';
			`,
			});
			expect(result.imports.fromStatements).toEqual([]);
		});

		it("should not match due to a multiline comment", () => {
			const result = fastAnalysis({
				input: `
					/* export { Foo } from 'bar/mor'; */
			`,
			});
			expect(result.imports.fromStatements).toEqual([]);
		});

		it("should not match due to a multiline comment (within)", () => {
			const result = fastAnalysis({
				input: `
					/*
						export { Foo } from 'bar/mor';
					*/
			`,
			});
			expect(result.imports.fromStatements).toEqual([]);
		});
	});

	describe("Dynamic statements", () => {
		it("normal require statement", () => {
			const result = fastAnalysis({
				input: `
				import('foo.js');`,
			});
			expect(result.imports.dynamicImports).toEqual(["foo.js"]);
		});

		it("two import statements on one line", () => {
			const result = fastAnalysis({
				input: `
				import('foo.js'); import('moo.js');`,
			});
			expect(result.imports.dynamicImports).toEqual(["foo.js", "moo.js"]);
		});

		it("should not match someimport()", () => {
			const result = fastAnalysis({
				input: `
					someimport('foo.js');
				`,
			});
			expect(result.imports.dynamicImports).toEqual([]);
		});

		it("should match in double quotes", () => {
			const result = fastAnalysis({
				input: `
				import("foo.js")
			`,
			});
			expect(result.imports.dynamicImports).toEqual(["foo.js"]);
		});

		it("should not match due a single line comment", () => {
			const result = fastAnalysis({
				input: `
				 // import("foo.js")
			`,
			});
			expect(result.imports.dynamicImports).toEqual([]);
		});

		it("should not match due to multi line comment", () => {
			const result = fastAnalysis({
				input: `
				 /* import("foo.js") */
			`,
			});
			expect(result.imports.dynamicImports).toEqual([]);
		});

		it("should match after a multi line comment", () => {
			const result = fastAnalysis({
				input: `
				 /* import("foo.js") */
				 import("bar.js")
			`,
			});
			expect(result.imports.dynamicImports).toEqual(["bar.js"]);
		});

		it("Should not match a import within a multiline block comment", () => {
			const result = fastAnalysis({
				input: `
				 /*
					 import("foo.js")
				 */
			`,
			});
			expect(result.imports.dynamicImports).toEqual([]);
		});

		describe("Comments inside import statement", () => {
			it("left comment with space", () => {
				const result = fastAnalysis({
					input: `
						 import(/* comment */ "foo.js")
				`,
				});
				expect(result.imports.dynamicImports).toEqual(["foo.js"]);
			});
			it("left comment without space", () => {
				const result = fastAnalysis({
					input: `
						 import(/* comment */"foo.js")
				`,
				});
				expect(result.imports.dynamicImports).toEqual(["foo.js"]);
			});
			it("right comment with space", () => {
				const result = fastAnalysis({
					input: `
						 import("foo.js" /* comment */)
				`,
				});
				expect(result.imports.dynamicImports).toEqual(["foo.js"]);
			});
			it("right comment without space", () => {
				const result = fastAnalysis({
					input: `
						 import("foo.js"/* comment */)
				`,
				});
				expect(result.imports.dynamicImports).toEqual(["foo.js"]);
			});
		});

		it("Should not match a import that is a part of object", () => {
			const result = fastAnalysis({
				input: `
					 bar.import("foo.js")
			`,
			});
			expect(result.imports.dynamicImports).toEqual([]);
		});

		it("Should match in a object", () => {
			const result = fastAnalysis({
				input: `
				{some:import("foo.js")}
			`,
			});
			expect(result.imports.dynamicImports).toEqual(["foo.js"]);
		});

		it("should match after a variable declaration", () => {
			const result = fastAnalysis({
				input: `
				var foo=import("foo.js")
			`,
			});
			expect(result.imports.dynamicImports).toEqual(["foo.js"]);
		});
	});
});
