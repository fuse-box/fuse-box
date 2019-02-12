import { Arithmetic } from "../src/arithmetic/Arithmetic";

describe("ArithmeticTest", () => {
	it("Should parse a simple test", () => {
		let result = Arithmetic.parse(`src/**/*.js  -[main/app.js]`);
		expect(result.including).toEqual({ "src/**/*.js": true });

		expect(result.excluding).toEqual({ "main/app.js": false });
	});

	it("Should parse a simple test with extra space", () => {
		let result = Arithmetic.parse(`src/**/*.js  -[main/app.js] `);
		expect(result.including).toEqual({ "src/**/*.js": true });

		expect(result.excluding).toEqual({ "main/app.js": false });
	});

	it("Should parse only one condition (including deps)", () => {
		let result = Arithmetic.parse(`src/**/*.js`);
		expect(result.including).toEqual({ "src/**/*.js": true });
	});

	it("Should parse only one condition (excluding deps)", () => {
		let result = Arithmetic.parse(`[src/**/*.js]`);
		expect(result.including).toEqual({ "src/**/*.js": false });
	});

	it("Should 3 conditions", () => {
		let result = Arithmetic.parse(`src/**/*.js  -main/app.js src/lib/service.js`);
		expect(result.including).toEqual({ "src/**/*.js": true, "src/lib/service.js": true });

		expect(result.excluding).toEqual({ "main/app.js": true });
	});

	it("Should 3 conditions (one without deps)", () => {
		let result = Arithmetic.parse(`src/**/*.js  -[main/app.js] src/lib/service.js`);
		expect(result.including).toEqual({ "src/**/*.js": true, "src/lib/service.js": true });

		expect(result.excluding).toEqual({ "main/app.js": false });
	});

	it("Should understand extra spaces and pluses", () => {
		let result = Arithmetic.parse(`   + src/**/*.js  - main/app.js] + src/lib/service.js`);
		expect(result.including).toEqual({ "src/**/*.js": true, "src/lib/service.js": true });

		expect(result.excluding).toEqual({ "main/app.js": true });
	});

	it("Should understand an entry point with deps", () => {
		let result = Arithmetic.parse(` > main/app  -path`);

		expect(result.entry).toEqual({ "main/app": true });

		expect(result.excluding).toEqual({ path: true });
	});

	it("Should include an entry point", () => {
		let result = Arithmetic.parse(` > main/app.js`);

		expect(result.entry).toEqual({ "main/app.js": true });

		expect(result.including).toEqual({ "main/app.js": true });
	});

	it("Should understand an entry point without deps", () => {
		let result = Arithmetic.parse(` > [main/app.js]  -path`);

		expect(result.entry).toEqual({ "main/app.js": false });

		expect(result.excluding).toEqual({ path: true });
	});

	it("Should add explicit require", () => {
		let result = Arithmetic.parse(` > [main/app.js]  @blueprint/core`);

		expect(result.including).toEqual({ "main/app.js": false, "@blueprint/core": true });
	});

	it("Should exclude explicit require", () => {
		let result = Arithmetic.parse(` > [main/app.js]  - @blueprint/core`);

		expect(result.excluding).toEqual({ "@blueprint/core": true });
	});

	it("Should get deps only", () => {
		let result = Arithmetic.parse(`~ index.ts `);

		expect(result.including).toEqual({});
		expect(result.excluding).toEqual({});
		expect(result.depsOnly).toEqual({ "index.ts": true });
	});

	it("Should get deps only and additional dependency", () => {
		let result = Arithmetic.parse(` ~ index.ts  + path`);

		expect(result.including).toEqual({ path: true });
		expect(result.excluding).toEqual({});
		expect(result.depsOnly).toEqual({ "index.ts": true });
	});

	it("Should get deps only minus additional dependency", () => {
		let result = Arithmetic.parse(`~ index.ts - path`);

		expect(result.including).toEqual({});
		expect(result.excluding).toEqual({ path: true });
		expect(result.depsOnly).toEqual({ "index.ts": true });
	});
});
