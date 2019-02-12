import * as path from "path";
import {
	ensureFuseBoxPath,
	findFileBackwards,
	replaceAliasRequireStatement,
	replaceExt,
	string2RegExp,
} from "../src/Utils";
import { getStubsFolder } from "./_helpers/stubs/TestEnvironment";

describe("UtilsTest", () => {
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

	it("Should understand **", () => {
		expect("libs/styles/hello.css").not.toMatch(string2RegExp("libs/*"));
		expect("libs/styles/hello.css").toMatch(string2RegExp("libs/**"));
	});

	it("Should understand just *", () => {
		expect("libs/styles/hello.css").toMatch(string2RegExp("*"));
	});

	it("Should replaceExt correctly with ext", () => {
		let res = replaceExt("a/hello.ts", ".js");
		expect(res).toEqual("a/hello.js");
	});

	it("Should replaceExt correctly with ext (capital case)", () => {
		let res = replaceExt("a/hello.TS", ".js");
		expect(res).toEqual("a/hello.js");
	});

	it("Should replaceExt correctly without ext", () => {
		let res = replaceExt("a/hello", ".js");
		expect(res).toEqual("a/hello.js");
	});

	it("Should find file backwards", () => {
		let rootFolder = path.join(getStubsFolder(), "foo");
		let res = findFileBackwards(path.join(rootFolder, "a/b/c/tsconfig.json"), rootFolder);
		res = ensureFuseBoxPath(res); // windows OS fix
		expect(res).toMatch(/\/a\/b\/tsconfig.json$/);
	});

	it("Should replace alias", () => {
		let res = replaceAliasRequireStatement("foo/bar", "foo", "~/hello/world/foo/");
		res = ensureFuseBoxPath(res); // windows OS fix
		expect(res).toEqual("~/hello/world/foo/bar");
	});
});
