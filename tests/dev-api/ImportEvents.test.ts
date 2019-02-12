import { createEnv } from "../_helpers/OldEnv";

describe("ImportEventTest", () => {
	it("RegisterEventAfterImport", done => {
		createEnv({
			project: {
				files: {
					"index.js": "exports.bar = 1; require('./foo/bar')",
					"foo/bar.js": "module.exports = {bar : 1}",
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			let results = [];

			result.project.FuseBox.on("after-import", (exports, require, module, __filename, __dirname, pkg) => {
				results.push([exports, __filename, __dirname, pkg]);
			});
			result.project.FuseBox.import("./index");
			setTimeout(() => {
				expect(results).toEqual([[{}, "foo/bar.js", "foo", "default"], [{ bar: 1 }, "index.js", "./", "default"]]);
				done();
			}, 10);
		});
	});
	it("registerBeforeImport", done => {
		createEnv({
			project: {
				files: {
					"index.js": "exports.bar = 1; require('./foo/bar')",
					"foo/bar.js": "module.exports = {bar : 1}",
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			let results = [];
			result.project.FuseBox.on("before-import", (exports, require, module, __filename, __dirname, pkg) => {
				results.push([exports, __filename, __dirname, pkg]);
			});
			result.project.FuseBox.import("./index");
			setTimeout(() => {
				expect(results).toEqual([[{ bar: 1 }, "index.js", "./", "default"], [{}, "foo/bar.js", "foo", "default"]]);
				done();
			}, 10);
		});
	});
});
