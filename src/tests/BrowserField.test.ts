import { FuseTestEnv, createRealNodeModule } from "./stubs/FuseTestEnv";
import { should } from "fuse-test-runner";

createRealNodeModule("pkg_folder_alias_without_ext", {
	"hello.js": `module.exports = "world"`,
	"foo/package.json": `{
        "main" : "../hello"
    }`,
});

createRealNodeModule("pkg_folder_alias_with_ext", {
	"hello.js": `module.exports = "world2"`,
	"foo/package.json": `{
        "main" : "../hello.js"
    }`,
});

export class PackageFolderAliasTest {
	"Should alias from a package without ext"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                            module.exports = require("pkg_folder_alias_without_ext/foo")
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser((window, env) => {
					const index = window.FuseBox.import("./index");
					should(index).equal("world");
				}),
			);
	}

	"Should alias from a package with ext"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                            module.exports = require("pkg_folder_alias_with_ext/foo")
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser((window, env) => {
					const index = window.FuseBox.import("./index");
					should(index).equal("world2");
				}),
			);
	}

	"Should alias from a package with ext locally"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"some/package.json": `{
                            "main" : "../hello/other.js"
                        }`,
					"hello/other.js": "module.exports = 'Should work'",
					"index.ts": `
                            module.exports = require("./some")
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser((window, env) => {
					const index = window.FuseBox.import("./index");
					should(index).equal("Should work");
				}),
			);
	}

	"Browser override case 1"() {
		createRealNodeModule("pkg_with_browser_overrides_1", {
			"index.js": `module.exports = require('./foo')`,
			"foo.js": `module.exports = "Should not be required"`,
			"overrides/foo_browser.js": `module.exports = "I am overrides/foo_browser"`,
			"package.json": `{
                "main" : "index.js",
                "browser": {
                    "./foo.js": "overrides/foo_browser.js"
                }
            }`,
		});
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                            module.exports = require("pkg_with_browser_overrides_1")
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser((window, env) => {
					const index = window.FuseBox.import("./index");
					should(index).equal("I am overrides/foo_browser");
				}),
			);
	}
}
