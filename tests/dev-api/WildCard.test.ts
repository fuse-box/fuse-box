import { JSONPlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";

describe("WildCardTest", () => {
	it("Should import 2 javascript files without ext", () => {
		return createEnv({
			project: {
				files: {
					"foo/a.ts": "module.exports = {a : 1}",
					"foo/b.ts": "module.exports = {b : 1}",
				},
				instructions: "**/**.ts",
			},
		}).then(result => {
			expect(result.project.FuseBox.import("./foo/*")).toEqual({ "foo/a.js": { a: 1 }, "foo/b.js": { b: 1 } });
		});
	});

	it("Should import 2 javascript files with ext", () => {
		return createEnv({
			project: {
				files: {
					"foo/a.ts": "module.exports = {a : 1}",
					"foo/b.ts": "module.exports = {b : 1}",
				},
				instructions: "**/**.ts",
			},
		}).then(result => {
			expect(result.project.FuseBox.import("./foo/*.js")).toEqual({ "foo/a.js": { a: 1 }, "foo/b.js": { b: 1 } });
		});
	});

	it("Should import 2 javascript files without ext and a mask", () => {
		return createEnv({
			project: {
				files: {
					"foo/a-comp.ts": "module.exports = {a : 1}",
					"foo/b-comp.ts": "module.exports = {b : 1}",
					"foo/c.ts": "module.exports = {c : 1}",
				},
				instructions: "**/**.ts",
			},
		}).then(result => {
			expect(result.project.FuseBox.import("./foo/*-comp")).toEqual({
				"foo/a-comp.js": { a: 1 },
				"foo/b-comp.js": { b: 1 },
			});
		});
	});

	it("Should import 2 javascript files with ext and a mask", () => {
		return createEnv({
			project: {
				files: {
					"foo/a-comp.ts": "module.exports = {a : 1}",
					"foo/b-comp.ts": "module.exports = {b : 1}",
					"foo/c.ts": "module.exports = {c : 1}",
				},
				instructions: "**/**.ts",
			},
		}).then(result => {
			expect(result.project.FuseBox.import("./foo/*-comp.js")).toEqual({
				"foo/a-comp.js": { a: 1 },
				"foo/b-comp.js": { b: 1 },
			});
		});
	});

	it("Should import 2 json files with wild card", () => {
		return createEnv({
			project: {
				files: {
					"foo/a.json": "module.exports = {a : 1}",
					"foo/b.json": "module.exports = {b : 1}",
				},
				plugins: [JSONPlugin()],
				instructions: "**/**.json",
			},
		}).then(result => {
			expect(result.project.FuseBox.import("./foo/*")).toEqual({ "foo/a.json": { a: 1 }, "foo/b.json": { b: 1 } });
		});
	});

	it("Should import 2 json files with wild card and a mask", () => {
		return createEnv({
			project: {
				files: {
					"foo/a.json": "module.exports = {a : 1}",
					"foo/b.json": "module.exports = {b : 1}",
				},
				plugins: [JSONPlugin()],
				instructions: "**/**.json",
			},
		}).then(result => {
			expect(result.project.FuseBox.import("./foo/*.json")).toEqual({
				"foo/a.json": { a: 1 },
				"foo/b.json": { b: 1 },
			});
		});
	});

	it("Should import 2 javascript capital case", () => {
		return createEnv({
			project: {
				files: {
					"foo/A.js": "module.exports = {a : 1}",
					"foo/B.js": "module.exports = {b : 1}",
				},
				instructions: "**/**.js",
			},
		}).then(result => {
			expect(result.project.FuseBox.import("./foo/*")).toEqual({ "foo/A.js": { a: 1 }, "foo/B.js": { b: 1 } });
		});
	});

	it("Should not intersect with the prev one", () => {
		return createEnv({
			project: {
				files: {
					"foo/D.js": "module.exports = {d : 1}",
				},
				instructions: "**/**.js",
			},
		}).then(result => {
			expect(result.project.FuseBox.import("./foo/*")).toEqual({ "foo/D.js": { d: 1 } });
		});
	});

	it("Should import sub folders as well", () => {
		return createEnv({
			project: {
				files: {
					"foo/a/b/c/foo.js": "module.exports = {foo : 1}",
					"foo/a/b/c/bar.js": "module.exports = {bar : 1}",
				},
				instructions: "**/**.js",
			},
		}).then(result => {
			expect(result.project.FuseBox.import("./foo/**")).toEqual({
				"foo/a/b/c/bar.js": { bar: 1 },
				"foo/a/b/c/foo.js": { foo: 1 },
			});
		});
	});
});
