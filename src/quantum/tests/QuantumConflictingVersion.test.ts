import { should } from "fuse-test-runner";
import { QuantumPlugin } from "../../index";
import { FuseTestEnv, createRealNodeModule } from "../../tests/stubs/FuseTestEnv";

export class QuantumConflictingVersionTest {
	"Should work with 2 version of the same library"() {
		createRealNodeModule("aafoo", {
			"package.json": `{ "name" : "aafoo", "version" : "1"}`,
			"index.js": `module.exports = require("aaboo")`,
		});

		createRealNodeModule("aafoo/node_modules/aaboo", {
			"package.json": `{ "name" : "aafoo", "version" : "1.0.9"}`,
			"index.js": `module.exports = {version : "1.0.9"}`,
		});
		createRealNodeModule("aaboo", {
			"package.json": `{ "name" : "aafoo", "version" : "1.1.0"}`,
			"index.js": `module.exports = {version : "1.1.0"}`,
		});

		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
							import * as aafoo from "aafoo";
							import * as aaboo from "aaboo";
							module.exports = [aafoo, aaboo]
           `,
				},
				plugins: [
					QuantumPlugin({
						target: "browser",
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const res = window.$fsx.r(0);
					should(res).deepEqual([{ version: "1.0.9" }, { version: "1.1.0" }]);
				}),
			);
	}
}
