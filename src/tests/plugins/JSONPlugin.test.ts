import { createEnv } from "./../stubs/TestEnvironment";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { should } from "fuse-test-runner";
import { JSONPlugin } from "../../plugins/JSONplugin";

export class JSONPluginTest {
	"Should import JSON file as object"() {
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
			should(out).deepEqual({ name: "test", tags: ["fusebox", "test"] });
		});
	}

	"Should allow extension overrides"() {
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
					should(window.FuseBox.import("./file.json")).deepEqual({ contents: "I should be included" });
				}),
			);
	}
}
