import { JSONPlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";
describe("JSONPluginTest", () => {
	it("Should import JSON file as object", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `const json= require('./config.json');`,
					"config.json": `{
                    "name":"test",
                    "tags":["fusebox","test"]
                    }`,
				},
				plugins: [JSONPlugin()],
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./config.json");
			expect(out).toEqual({ name: "test", tags: ["fusebox", "test"] });
		});
	});

	it("Should allow extension overrides", () => {
		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.json"],
				plugins: [JSONPlugin()],
				files: {
					"file.json": `{ "contents": "I should not be included" }`,
					"file.foo.json": `{ "contents": "I should be included" }`,
				},
			},
		})
			.simple(">file.json")
			.then(env =>
				env.browser(window => {
					expect(window.FuseBox.import("./file.json")).toEqual({ contents: "I should be included" });
				}),
			);
	});
});
