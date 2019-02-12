import { string2RegExp } from "../src/Utils";

describe("String2Regexp", () => {
	it("Should convert string to regex (1)", () => {
		expect("/etc/lib/styles/hello/hello/match.css").toMatch(string2RegExp("lib/styles/*/hello/*.css"));
		expect("/etc/lib/styles/match.css").not.toMatch(string2RegExp("lib/styles/*/hello/*.css"));

		expect("/etc/lib/styles/hello.css").not.toMatch(string2RegExp("lib/styles/*/hello/*.css"));

		expect("libs/styles/hello.css").not.toMatch(string2RegExp("lib/styles/*/hello/*.css"));
	});

	it("Should pass ^ $", () => {
		expect("lib/styles/hello/hello/match.css").toMatch(string2RegExp("^lib/styles/*/hello/*.css"));

		expect("/sdfsd/lib/styles/hello/hello/match.css").not.toMatch(string2RegExp("^lib/styles/*/hello/*.css"));

		expect("lib/styles/hello/hello/match.css").toMatch(string2RegExp("^lib/styles/*/hello/*.css$"));

		expect("lib/styles/hell111o/aasdfsd.css").not.toMatch(string2RegExp("^lib/styles/*/hello/*.css$"));
	});

	it("Should convert string to regex (extensions)", () => {
		expect("libs/styles/hello.css").toMatch(string2RegExp("*.css"));

		expect("libs/styles/hello.css").not.toMatch(string2RegExp("^*.css"));
	});

	it("Should assume $", () => {
		expect("libs/styles/hello.css").toMatch(string2RegExp("*.css"));
		expect("libs/styles/hello.css.js").not.toMatch(string2RegExp("*.css"));
	});

	it("Should match conditions", () => {
		console.log(string2RegExp("components/*.css"));
		expect("libs/styles/hello.css").toMatch(string2RegExp("*.css$|*.js$"));
	});
});
