import { BabelPlugin } from "../src";
import { createEnv } from "./_helpers/OldEnv";

describe("AliasTest", () => {
	it("Should replace an alias - case 1", () => {
		return createEnv({
			project: {
				alias: {
					utils: "~/utils/far/away/a/b/c",
				},
				files: {
					"index.js": `exports.something = require("utils/hello")`,
					"utils/far/away/a/b/c/hello.js": "module.exports = { result : 'I was so far away, but i am here now'}",
				},
				instructions: "> index.js",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			expect(out).toEqual({ something: { result: "I was so far away, but i am here now" } });
		});
	});

	it("Should replace an alias - case 2", () => {
		return createEnv({
			project: {
				alias: {
					utils: "~/utils/far/away/a/b/c/",
				},
				files: {
					"index.js": `exports.something = require("utils/hello")`,
					"utils/far/away/a/b/c/hello.js": "module.exports = { result : 'I was so far away, but i am here now'}",
				},
				instructions: "> index.js",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			expect(out).toEqual({ something: { result: "I was so far away, but i am here now" } });
		});
	});

	it("Should replace an alias - as a file - with babel", () => {
		return createEnv({
			project: {
				alias: {
					eh: "~/moose/eh/igloo.js",
				},
				files: {
					"index.js": `export {default as canada} from 'eh'`,
					"moose/eh/igloo.js": "export default { result: 'igloo'}",
				},
				instructions: "index.js",
				plugins: [BabelPlugin({ config: { presets: ["latest"] } })],
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			expect(out).toEqual({ canada: { result: "igloo" } });
		});
	});

	it("Should replace an alias - with babel 2", () => {
		return createEnv({
			project: {
				alias: {
					eh: "~/moose/eh",
				},
				files: {
					"index.js": `export default require('eh/igloo2.js')`,
					"moose/eh/igloo2.js": "export default { result: 'igloo'}",
				},
				instructions: "> index.js",
				plugins: [BabelPlugin({ config: { presets: ["latest"] } })],
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			expect(out).toEqual({ default: { default: { result: "igloo" } } });
		});
	});

	it("Should handle aliases with packages", () => {
		return createEnv({
			modules: {
				"preact-compat": {
					files: {
						"index.js": "module.exports = { name : 'i am preact-compat'}",
					},
					instructions: "> index.js",
				},
			},
			project: {
				alias: {
					react: "preact-compat",
					"react-dom": "preact-compat",
				},
				files: {
					"index.ts": `module.exports = [
                        require("react"),
                        require("react-dom")
                    ]`,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			expect(out).toEqual([{ name: "i am preact-compat" }, { name: "i am preact-compat" }]);
		});
	});

	it("Should handle aliases that start with the same chars", () => {
		createEnv({
			project: {
				alias: {
					utils: "~/utils/far/away/a/b/c/",
					"utils-foo": "~/utils/far/z",
				},
				files: {
					"index.js": `exports.something = [require("utils/hello"), require("utils-foo/stay")]`,
					"utils/far/away/a/b/c/hello.js": "module.exports = { result : 'I was so far away, but i am here now'}",
					"utils/far/z/stay.js": "module.exports = { result : 'I should stay here'}",
				},
				instructions: "> index.js",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");

			expect(out).toEqual({
				something: [{ result: "I was so far away, but i am here now" }, { result: "I should stay here" }],
			});
		});
	});
});
