import { fastTransform } from "../fastTransform";

describe("Fast transform", () => {
	describe("Export variables", () => {
		it("Should transform a constant", () => {
			const result = fastTransform({ input: `export const foo = 1` });
			expect(result).toEqual("const foo = 1;\nmodule.exports.foo = foo;");
		});

		it("Should transform 'let'", () => {
			const result = fastTransform({ input: `export let foo = 1` });
			expect(result).toEqual("let foo = 1;\nmodule.exports.foo = foo;");
		});

		it("Should transform 2 constants in one", () => {
			const result = fastTransform({ input: `export const foo = 1, bar = 3` });
			const expected = "const foo = 1, bar = 3;\nmodule.exports.foo = foo;\nmodule.exports.bar = bar;";
			expect(result).toEqual(expected);
		});

		it("Should 2 variables with the same name", () => {
			const result = fastTransform({ input: `export {name1, name2}` });
			expect(result).toEqual("module.exports.name1 = name1;\nmodule.exports.name2 = name2;");
		});

		it("Should 2 variables with aliases", () => {
			const result = fastTransform({ input: `export { name1 as foo, name2 as bar };` });
			expect(result).toEqual("module.exports.foo = name1;\nmodule.exports.bar = name2;");
		});

		it("Should export a function", () => {
			const result = fastTransform({ input: `export function bar(){}` });
			expect(result).toEqual("module.exports.bar = function bar() {\n};");
		});

		it("Should export a default function", () => {
			const result = fastTransform({ input: `export default function bar(){}` });
			expect(result).toEqual("module.exports.default = function bar() {\n};");
		});

		it("Should export a class", () => {
			const result = fastTransform({ input: `export class Bar{}` });
			expect(result).toEqual("module.exports.Bar = class Bar {\n};");
		});

		it("Should export a default class", () => {
			const result = fastTransform({ input: `export default class Bar{}` });
			expect(result).toEqual("module.exports.default = class Bar {\n};");
		});

		it("Should export default expression", () => {
			const result = fastTransform({ input: `export default 1` });
			expect(result).toEqual("module.exports.default = 1;");
		});

		it("Should export default expression 2", () => {
			const result = fastTransform({ input: `export default {}` });
			expect(result).toEqual("module.exports.default = {};");
		});

		it("Should export default expression 3", () => {
			const result = fastTransform({ input: `export default /\s+/` });
			expect(result).toEqual("module.exports.default = /s+/;");
		});

		it("Should export value as default", () => {
			const result = fastTransform({ input: `export { name as default };` });
			expect(result).toEqual("module.exports.default = name;");
		});
	});

	describe("Export from source", () => {
		it("Should export one variable from source", () => {
			const result = fastTransform({ input: `export { name  } from "./foo"` });
			expect(result).toEqual("const __req1__ = require('./foo');\nmodule.exports.name = __req1__.name;");
		});

		it("Should export one variable (with as) from source", () => {
			const result = fastTransform({ input: `export { name as foo  } from "./foo"` });
			expect(result).toEqual("const __req1__ = require('./foo');\nmodule.exports.foo = __req1__.name;");
		});

		it("Should export defaul variable  from source", () => {
			const result = fastTransform({ input: `export { default } from "./foo"` });
			expect(result).toEqual("const __req1__ = require('./foo');\nmodule.exports.default = __req1__.default;");
		});

		it("Should export 2 variables from source", () => {
			const result = fastTransform({ input: `export { a, b} from "./foo"` });
			expect(result).toEqual(
				"const __req1__ = require('./foo');\nmodule.exports.a = __req1__.a;\nmodule.exports.b = __req1__.b;",
			);
		});

		it("Should export all from source", () => {
			const result = fastTransform({ input: `export * from "a"` });
			expect(result).toEqual("module.exports = {\n    ...module.exports,\n    ...require('a')\n};");
		});
	});

	describe("Imports", () => {
		it("Should import a const", () => {
			const result = fastTransform({ input: `import {a} from "foo"` });
			expect(result).toEqual("const __req1__ = require('foo');\nconst a = __req1__.a;");
		});

		it("Should import a const with an alias", () => {
			const result = fastTransform({ input: `import {a as foo} from "foo"` });
			expect(result).toEqual("const __req1__ = require('foo');\nconst foo = __req1__.a;");
		});

		it("Should import 2 consts", () => {
			const result = fastTransform({ input: `import {a, b} from "foo"` });
			expect(result).toEqual("const __req1__ = require('foo');\nconst a = __req1__.a;\nconst b = __req1__.b;");
		});

		it("Should import default statement", () => {
			const result = fastTransform({ input: `import a from "foo"` });
			expect(result).toEqual("const __req1__ = require('foo');\nconst a = __req1__.default;");
		});

		it("Should import default statement and names", () => {
			const result = fastTransform({ input: `import a, { b as bar} from "foo"` });
			expect(result).toEqual("const __req1__ = require('foo');\nconst a = __req1__.default;\nconst bar = __req1__.b;");
		});

		it("Should import with *", () => {
			const result = fastTransform({ input: `import * as a from "foo"` });
			expect(result).toEqual("const __req1__ = require('foo');\nconst a = __req1__;");
		});

		it("Should import with sideeffects", () => {
			const result = fastTransform({
				input: `
				console.log(1);
				import "foo"
				console.log(2);
			`,
			});
			expect(result).toEqual("console.log(1);\nrequire('foo');\nconsole.log(2);");
		});

		it("should keep import order", () => {
			const result = fastTransform({
				input: `
				console.log(1);
				import * as foo from "./foo";
				console.log(2);`,
			});
			expect(result).toEqual(
				"console.log(1);\nconst __req1__ = require('./foo');\nconst foo = __req1__;\nconsole.log(2);",
			);
		});
	});

	describe("Source interceptor", () => {
		it("Should intercept 1", () => {
			const code = fastTransform({ input: `import a from "foo"`, sourceInterceptor: source => "bar" });
			expect(code).toContain("require('bar')");
		});

		it("Should intercept 2", () => {
			const code = fastTransform({ input: `import * as a from "foo"`, sourceInterceptor: source => "bar" });
			expect(code).toContain("require('bar')");
		});

		it("Should intercept 3", () => {
			const code = fastTransform({ input: `export {foo} from "foo"`, sourceInterceptor: source => "bar" });
			expect(code).toContain("require('bar')");
		});
	});
});
