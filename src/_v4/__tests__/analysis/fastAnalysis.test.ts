import { fastAnalysis } from "../../analysis/fastAnalysis";

describe("Fast analysis test", () => {
	describe("require statements", () => {
		it("case 1", () => {
			const result = fastAnalysis({
				input: `
				require('foo.js')
			`,
			});
			//expect(result.requireStatements).toEqual(["foo.js"]);
		});

		it("case 2", () => {
			const result = fastAnalysis({
				input: `
				require("foo.js")
			`,
			});
			//expect(result.requireStatements).toEqual(["foo.js"]);
		});

		it("case 3", () => {
			const result = fastAnalysis({
				input: `
				 // require("foo.js")
			`,
			});
			//expect(result.requireStatements).toEqual([]);
		});

		it("case 4", () => {
			const result = fastAnalysis({
				input: `
				 /* require("foo.js") */
			`,
			});
			//expect(result.requireStatements).toEqual([]);
		});

		it("case 5", () => {
			const result = fastAnalysis({
				input: `
				 /*
					 require("foo.js")
				 */
			`,
			});
			//expect(result.requireStatements).toEqual([]);
		});

		it("case 6 (very rare but possible)", () => {
			const result = fastAnalysis({
				input: `
					 require(/* comment */ "foo.js" /* comment */)
			`,
			});
			//expect(result.requireStatements).toEqual(["foo.js"]);
		});

		it("case 7", () => {
			const result = fastAnalysis({
				input: `
					 bar.require("foo.js")
			`,
			});
			//expect(result.requireStatements).toEqual([]);
		});

		it("case 8", () => {
			const result = fastAnalysis({
				input: `
				{some:require("foo.js")}
			`,
			});
			//expect(result.requireStatements).toEqual(["foo.js"]);
		});

		it("case 9", () => {
			const result = fastAnalysis({
				input: `
				var foo=require("foo.js")
			`,
			});
			//expect(result.requireStatements).toEqual(["foo.js"]);
		});

		it("case 10", () => {
			const result = fastAnalysis({
				input: `
				 /*
					 wutrequire("foo.js")
				 */
			`,
			});
			//expect(result.requireStatements).toEqual([]);
		});
	});

	describe("From statements", () => {
		it("case 1", () => {
			const result = fastAnalysis({
				input: `
					import * as foo from "bar/mor";
			`,
			});
			//expect(result.fromStatements).toEqual(["bar/mor"]);
		});

		it("case 2", () => {
			const result = fastAnalysis({
				input: `
					export { Foo } from "bar/mor";
			`,
			});
			//expect(result.fromStatements).toEqual(["bar/mor"]);
		});

		it("case 3", () => {
			const result = fastAnalysis({
				input: `
					export { Foo } from 'bar/mor';
			`,
			});
			//expect(result.fromStatements).toEqual(["bar/mor"]);
		});

		it("case 3", () => {
			const result = fastAnalysis({
				input: `
					// export { Foo } from 'bar/mor';
			`,
			});
			//expect(result.fromStatements).toEqual([]);
		});

		it("case 4", () => {
			const result = fastAnalysis({
				input: `
					/* export { Foo } from 'bar/mor'; */
			`,
			});
			//expect(result.fromStatements).toEqual([]);
		});

		it("case 5", () => {
			const result = fastAnalysis({
				input: `
					/*
						export { Foo } from 'bar/mor';
					*/
			`,
			});
			//expect(result.fromStatements).toEqual([]);
		});
	});

	describe("Dynamic statements", () => {
		it("case 1", () => {
			const result = fastAnalysis({
				input: `
					import("./foo/bar.js");
			`,
			});
			//expect(result.dynamicImports).toEqual(["./foo/bar.js"]);
		});

		it("case 2", () => {
			const result = fastAnalysis({
				input: `
					import('./foo/bar.js');
			`,
			});
			//expect(result.dynamicImports).toEqual(["./foo/bar.js"]);
		});

		it("case 3", () => {
			const result = fastAnalysis({
				input: `
					// import('./foo/bar.js');
			`,
			});
			//expect(result.dynamicImports).toEqual([""]);
		});

		it("case 4", () => {
			const result = fastAnalysis({
				input: `
					/* import('./foo/bar.js'); */
			`,
			});
			//expect(result.dynamicImports).toEqual([""]);
		});

		it("case 5", () => {
			const result = fastAnalysis({
				input: `
					/*
					 import('./foo/bar.js');
					*/
			`,
			});
			//expect(result.dynamicImports).toEqual([""]);
		});

		it("case 6", () => {
			const result = fastAnalysis({
				input: `
					 import(/* comment */ './foo/bar.js');
			`,
			});
			//expect(result.dynamicImports).toEqual(["./foo/bar.js"]);
		});

		it("case 7", () => {
			const result = fastAnalysis({
				input: `
					 some.import('./foo/bar.js');
			`,
			});
			//expect(result.dynamicImports).toEqual([""]);
		});

		it("case 8", () => {
			const result = fastAnalysis({
				input: `
					 res=import('./foo/bar.js');
			`,
			});
			//expect(result.dynamicImports).toEqual(["./foo/bar.js"]);
		});

		it("case 9", () => {
			const result = fastAnalysis({
				input: `
					 {some:import('./foo/bar.js')}
			`,
			});
			//expect(result.dynamicImports).toEqual(["./foo/bar.js"]);
		});
	});
});
