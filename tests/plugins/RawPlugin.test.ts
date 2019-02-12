import { RawPlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";
const rawFile = `
this is
	raw
		content
`;

describe("RawPluginTest", () => {
	it("Should return wrapped file content", () => {
		return createEnv({
			project: {
				log: false,
				files: {
					"index.js": `
				require('./file1.raw');
				require('./file2.onemoreraw');
			`,
					"file1.raw": rawFile,
					"file2.onemoreraw": rawFile,
				},
				plugins: [[/raw$/, RawPlugin({ extensions: [".raw", ".onemoreraw"] })]],
				instructions: ">index.js",
			},
		}).then(result => {
			const fileRaw1 = result.project.FuseBox.import("./file1.raw");
			const fileRaw2 = result.project.FuseBox.import("./file2.onemoreraw");

			expect(fileRaw1).toEqual("\nthis is\n\traw\n\t\tcontent\n");
			expect(fileRaw2).toEqual("\nthis is\n\traw\n\t\tcontent\n");
		});
	});

	it("Should allow extension overrides", () => {
		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.raw"],
				plugins: [/raw$/, RawPlugin({ extensions: [".raw"] })],
				files: {
					"file.raw": "I should not be included",
					"file.foo.raw": "I should be included",
				},
			},
		})
			.simple(">file.raw")
			.then(env =>
				env.browser(window => {
					expect(window.FuseBox.import("./file.raw")).toEqual("I should be included");
				}),
			);
	});
});
