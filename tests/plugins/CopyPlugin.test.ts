import { CopyPlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";

describe("CssPluginTest", () => {
	/** DEV (easy hashing) */

	it("Should copy a file (dev)", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `require("./hello.txt")`,
					"hello.txt": "ololo",
				},
				plugins: [CopyPlugin({ files: [".txt"] })],
				instructions: "> index.ts",
			},
		}).then(result => {
			result.shouldExistInDist("assets/406baab1-hello.txt");

			expect(result.projectContents.toString()).toContain(`module.exports.default = "/assets/406baab1-hello.txt";`);
		});
	});

	it("Should copy a file to some place else (dev)", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `require("./hello.txt")`,
					"hello.txt": "ololo",
				},
				plugins: [CopyPlugin({ dest: "static-files", files: [".txt"] })],
				instructions: "> index.ts",
			},
		}).then(result => {
			result.shouldExistInDist("static-files/406baab1-hello.txt");

			expect(result.projectContents.toString()).toContain(`module.exports.default = "/assets/406baab1-hello.txt";`);
		});
	});

	it("Should copy a file and ignore default (dev)", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `require("./hello.txt")`,
					"hello.txt": "ololo",
				},
				plugins: [CopyPlugin({ useDefault: false, files: [".txt"] })],
				instructions: "> index.ts",
			},
		}).then(result => {
			result.shouldExistInDist("assets/406baab1-hello.txt");
			expect(result.projectContents.toString()).toContain(`module.exports = "/assets/406baab1-hello.txt";`);
		});
	});

	it("Should copy a file with custom resolver (dev)", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `require("./hello.txt")`,
					"hello.txt": "ololo",
				},
				plugins: [CopyPlugin({ resolve: "/static/", files: [".txt"] })],
				instructions: "> index.ts",
			},
		}).then(result => {
			result.shouldExistInDist("assets/406baab1-hello.txt");
			expect(result.projectContents.toString()).toContain(`module.exports.default = "/static/406baab1-hello.txt";`);
		});
	});

	/** PRODUCTION (real hashing) */

	it("Should copy a file (hash)", () => {
		return createEnv({
			project: {
				hash: true,
				files: {
					"index.ts": `require("./hello.txt")`,
					"hello.txt": "ololo",
				},
				plugins: [CopyPlugin({ files: [".txt"] })],
				instructions: "> index.ts",
			},
		}).then(result => {
			result.shouldExistInDist("assets/92849cf0-hello.txt");
			expect(result.projectContents.toString()).toContain(`module.exports.default = "/assets/92849cf0-hello.txt";`);
		});
	});

	it("Should copy a file to some place else (hash)", () => {
		return createEnv({
			project: {
				hash: true,
				files: {
					"index.ts": `require("./hello.txt")`,
					"hello.txt": "ololo",
				},
				plugins: [CopyPlugin({ dest: "static-files", files: [".txt"] })],
				instructions: "> index.ts",
			},
		}).then(result => {
			result.shouldExistInDist("static-files/92849cf0-hello.txt");

			expect(result.projectContents.toString()).toContain(`module.exports.default = "/assets/92849cf0-hello.txt";`);
		});
	});

	it("Should copy a file and ignore default (hash)", () => {
		return createEnv({
			project: {
				hash: true,
				files: {
					"index.ts": `require("./hello.txt")`,
					"hello.txt": "ololo",
				},
				plugins: [CopyPlugin({ useDefault: false, files: [".txt"] })],
				instructions: "> index.ts",
			},
		}).then(result => {
			result.shouldExistInDist("assets/92849cf0-hello.txt");
			expect(result.projectContents.toString()).toContain(`module.exports = "/assets/92849cf0-hello.txt";`);
		});
	});

	it("Should copy a file with custom resolver (hash)", () => {
		return createEnv({
			project: {
				hash: true,
				files: {
					"index.ts": `require("./hello.txt")`,
					"hello.txt": "ololo",
				},
				plugins: [CopyPlugin({ resolve: "/static/", files: [".txt"] })],
				instructions: "> index.ts",
			},
		}).then(result => {
			result.shouldExistInDist("assets/92849cf0-hello.txt");
			expect(result.projectContents.toString()).toContain(`module.exports.default = "/static/92849cf0-hello.txt";`);
		});
	});

	it("Should copy a file with custom resolver to external domain (hash)", () => {
		return createEnv({
			project: {
				hash: true,
				files: {
					"index.ts": `require("./hello.txt")`,
					"hello.txt": "ololo",
				},
				plugins: [CopyPlugin({ resolve: "https://example.com/static/", files: [".txt"] })],
				instructions: "> index.ts",
			},
		}).then(result => {
			result.shouldExistInDist("assets/92849cf0-hello.txt");
			expect(result.projectContents.toString()).toContain(
				`module.exports.default = "https://example.com/static/92849cf0-hello.txt";`,
			);
		});
	});
});
