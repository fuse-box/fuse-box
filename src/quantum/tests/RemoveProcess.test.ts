import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

export class RemoveProcess {
	"Should replace process with undefined"() {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeExportsInterop: false,
			},
			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `
	                 if ( process ) {
	                     console.log("hello")
					 }
					`,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			should(contents).notFindString("process");
			should(contents).findString("undefined");
		});
	}

	"Should not process with undefined"() {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeExportsInterop: false,
			},
			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `
					 var process = {};
	                 if ( process ) {
	                     console.log("hello")
					 }
					`,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			should(contents).findString("if (process) {");
		});
	}

	"Should replace process.version with a string"() {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeExportsInterop: false,
			},
			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `
					 	var version = process.version;
					`,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			should(contents).findString(`var process = { version : "" };`);
		});
	}
}
